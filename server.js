import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const weTravelApiKey = process.env.WETRAVEL_API_KEY;

// Log API Key status (not the key itself)
if (!apiKey) {
  console.warn('Warning: GEMINI_API_KEY is not set in environment variables.');
}
if (!weTravelApiKey) {
  console.warn('Warning: WETRAVEL_API_KEY is not set in environment variables.');
}

app.post('/api/generate-community-image', async (req, res) => {
  const { title, category } = req.body;

  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: API Key missing' });
  }

  try {
    // Note: In a real implementation with Gemini, you would use the model to generate content.
    // For this security fix, we ensure the API key is handled server-side.
    // We are mocking the image response to ensure the frontend receives a valid URL.

    // Example usage if we were generating text:
    // const ai = new GoogleGenAI({ apiKey });
    // const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    // ...

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

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    res.json({ image: imageUrl });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// WeTravel Proxy Routes
const WETRAVEL_API_BASE = 'https://app.wetravel.com/api/v1';

app.get('/api/wetravel/trips/:tripId', async (req, res) => {
    if (!weTravelApiKey) {
        return res.status(500).json({ error: 'Server configuration error: WeTravel API Key missing' });
    }

    try {
        const { tripId } = req.params;
        const response = await fetch(`${WETRAVEL_API_BASE}/trips/${tripId}`, {
            headers: {
                'Authorization': `Bearer ${weTravelApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).send(errorText);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('WeTravel Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch trip from WeTravel' });
    }
});

app.get('/api/wetravel/trips', async (req, res) => {
    if (!weTravelApiKey) {
        return res.status(500).json({ error: 'Server configuration error: WeTravel API Key missing' });
    }

    try {
        const response = await fetch(`${WETRAVEL_API_BASE}/trips`, {
            headers: {
                'Authorization': `Bearer ${weTravelApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).send(errorText);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('WeTravel Proxy Error:', error);
        res.status(500).json({ error: 'Failed to fetch trips from WeTravel' });
    }
});

app.post('/api/wetravel/bookings', async (req, res) => {
    if (!weTravelApiKey) {
        return res.status(500).json({ error: 'Server configuration error: WeTravel API Key missing' });
    }

    try {
        const response = await fetch(`${WETRAVEL_API_BASE}/bookings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${weTravelApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        if (!response.ok) {
            const data = await response.json();
            return res.status(response.status).json(data);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('WeTravel Proxy Error:', error);
        res.status(500).json({ error: 'Failed to create booking on WeTravel' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
