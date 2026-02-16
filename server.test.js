import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { app } from './server.js';

describe('POST /api/generate-community-image', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return 500 if GEMINI_API_KEY is missing', async () => {
    // specific test for missing API key
    vi.stubEnv('GEMINI_API_KEY', '');

    const res = await request(app)
      .post('/api/generate-community-image')
      .send({ title: 'Test Community' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Server configuration error: API Key missing' });
  });

  it('should return default image if no category is provided', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-api-key');

    const res = await request(app)
      .post('/api/generate-community-image')
      .send({ title: 'Test Community' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('image');
    // Check for default image URL
    expect(res.body.image).toBe('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80');
  });

  it('should return specific image for "Adventure" category', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-api-key');

    const res = await request(app)
      .post('/api/generate-community-image')
      .send({ title: 'Adventure Trip', category: 'Adventure Travel' });

    expect(res.status).toBe(200);
    expect(res.body.image).toBe('https://images.unsplash.com/photo-1533632359083-018577794406?auto=format&fit=crop&w=800&q=80');
  });

  it('should return specific image for "Eco" category', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-api-key');

    const res = await request(app)
      .post('/api/generate-community-image')
      .send({ title: 'Eco Village', category: 'Eco Tourism' });

    expect(res.status).toBe(200);
    expect(res.body.image).toBe('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80');
  });

  it('should return specific image for "Wellness" category', async () => {
    vi.stubEnv('GEMINI_API_KEY', 'test-api-key');

    const res = await request(app)
      .post('/api/generate-community-image')
      .send({ title: 'Yoga Retreat', category: 'Wellness & Health' });

    expect(res.status).toBe(200);
    expect(res.body.image).toBe('https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80');
  });
});
