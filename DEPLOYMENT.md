# Deployment Guide for Vercel

## Black Screen Fix

If you're seeing a black screen after deployment, follow these steps:

### 1. Add Environment Variables in Vercel

Go to your Vercel project dashboard:
1. Navigate to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_SPOTIFY_CLIENT_ID` | `3d5ac55165a94b689e015b50e3648ea9` | Your Spotify Client ID |
| `GEMINI_API_KEY` | `your-actual-api-key` | Your Google Gemini API Key |

3. **Important:** After adding environment variables, you MUST **redeploy** the project for changes to take effect.

### 2. Update Spotify Redirect URI

In your [Spotify Developer Dashboard](https://developer.spotify.com/dashboard):
1. Go to your app settings
2. Click **Edit Settings**
3. Add your Vercel deployment URL to **Redirect URIs**:
   - Format: `https://your-project-name.vercel.app/`
   - Example: `https://cybery2k-player.vercel.app/`
4. Click **Save**

### 3. Check Browser Console

Open your deployed site and check the browser console (F12):
- Look for any errors related to environment variables
- Check for CORS or network errors
- Verify that the Spotify SDK is loading

### 4. Redeploy

After adding environment variables:
1. Go to **Deployments** tab in Vercel
2. Click the **three dots** on the latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger automatic deployment

## Quick Checklist

- [ ] Environment variables added in Vercel
- [ ] Spotify Redirect URI includes Vercel URL
- [ ] Project redeployed after adding env vars
- [ ] Browser console checked for errors
- [ ] Spotify Client ID is correct

## Testing Locally

To test the production build locally:
```bash
npm run build
npm run preview
```

This will serve the production build at `http://localhost:4173/`
