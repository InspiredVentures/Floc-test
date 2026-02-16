# Deployment Guide

## Prerequisites
- Node.js 18+
- Supabase Project (with URL and Anon Key)
- WeTravel API Key (Optional, for live booking)

## Environment Variables

### Client-Side Variables (Public)
These variables are safe to expose to the browser.
Create a `.env.production` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Server-Side Variables (Secret)
**IMPORTANT:** These variables must NOT be exposed to the client. Configure them in your backend server environment or local `.env` file.
```env
WETRAVEL_API_KEY=your_wetravel_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## Build Instructions
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Type Check**:
    ```bash
    npx tsc --noEmit
    ```
3.  **Build**:
    ```bash
    npm run build
    ```
    This will generate a `dist` folder containing the production assets.

## Deployment Options

### Vercel (Recommended)
1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Vercel will detect Vite and set build command to `npm run build` and output directory to `dist`.
4.  Add Environment Variables in Vercel Project Settings.

### Netlify
1.  Push code to GitHub.
2.  New Site from Git.
3.  Build command: `npm run build`.
4.  Publish directory: `dist`.
5.  Add Environment Variables in Site Settings.

## Post-Deployment
- **Database Seeding**: If this is a fresh instance, log in as an admin, go to `/settings`, and click "Seed Database" to populate initial data.
- **RLS Policies**: Ensure Supabase policies are active.
