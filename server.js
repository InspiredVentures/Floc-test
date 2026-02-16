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

app.post('/api/generate-community-image', async (req, res) => {
  const { title, category } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: API Key missing' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Construct a descriptive prompt for the image generation
    const prompt = `A high quality, photorealistic cover image for a travel community named "${title}" in the category "${category}". The image should be inspiring, adventurous, and suitable for a travel community app.`;

    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: "16:9",
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const generatedImage = response.generatedImages[0];
      const base64Image = generatedImage.image.imageBytes;
      const imageUrl = `data:image/png;base64,${base64Image}`;
      return res.json({ image: imageUrl });
    } else {
      throw new Error("No image generated.");
    }
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    console.log('Falling back to mock implementation...');

    // Fallback logic in case of API error
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

    // Simulate delay for fallback to feel "real"
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({ image: imageUrl });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
