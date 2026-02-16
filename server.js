import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

// Log API Key status (not the key itself)
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not set in environment variables.');
}

// Helper to get fallback image based on category
const getFallbackImage = (category) => {
  let imageUrl = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80'; // Default
  if (category) {
    const lowerCat = category.toLowerCase();
    if (lowerCat.includes('adventure')) imageUrl = 'https://images.unsplash.com/photo-1533632359083-018577794406?auto=format&fit=crop&w=800&q=80';
    else if (lowerCat.includes('eco')) imageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80';
    else if (lowerCat.includes('wellness')) imageUrl = 'https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80';
    else if (lowerCat.includes('photography')) imageUrl = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
    else if (lowerCat.includes('cultural')) imageUrl = 'https://images.unsplash.com/photo-1532105118774-63304c274332?auto=format&fit=crop&w=800&q=80';
    else if (lowerCat.includes('trip')) imageUrl = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80';
    else if (lowerCat.includes('digital nomad')) imageUrl = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80';
  }
  return imageUrl;
};

app.post('/api/generate-community-image', async (req, res) => {
  const { title, category } = req.body;

  let imageUrl = getFallbackImage(category);

  // If no API key, return fallback immediately (or could just fall through)
  if (!apiKey) {
    console.warn('Skipping Gemini generation: No API Key');
    return res.json({ image: imageUrl });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Construct a descriptive prompt
    const prompt = `A high quality, photorealistic cover image for a community named "${title}" focused on ${category}. The image should be inspiring, professional, and suitable for a travel community. 4k resolution.`;

    // Use Imagen 3 (or 4 if available/aliased) via the SDK.
    // Using 'imagen-3.0-generate-001' as it is generally available, or 'imagen-4.0-generate-001' based on recent docs.
    // We'll try the one from the documentation: 'imagen-4.0-generate-001'.
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9', // Wide aspect ratio for cover images
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];
      if (generatedImage.image && generatedImage.image.imageBytes) {
        // Construct Data URI
        imageUrl = `data:image/png;base64,${generatedImage.image.imageBytes}`;
      }
    }

    res.json({ image: imageUrl });

  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    // Fallback to Unsplash image is already set in imageUrl
    res.json({ image: imageUrl });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
