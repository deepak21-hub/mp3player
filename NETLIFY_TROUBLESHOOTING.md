# Netlify Deployment Troubleshooting Guide

## Issue: CyberPlay not working on https://cyberplayer.netlify.app/

### Step 1: Set Environment Variables in Netlify

1. Go to https://app.netlify.com/
2. Select your **cyberplay** site
3. Go to **Site settings** → **Environment variables**
4. Click **"Add a variable"** and add:
   - Variable: `VITE_SPOTIFY_CLIENT_ID`
   - Value: `3d5ac55165a94b689e015b50e3648ea9`
   - Click **"Create variable"**
5. Add another variable:
   - Variable: `GEMINI_API_KEY`
   - Value: (your Gemini API key from https://aistudio.google.com/app/apikey)
   - Click **"Create variable"**

### Step 2: Update Spotify Redirect URIs

1. Go to https://developer.spotify.com/dashboard
2. Click on your **CyberPlay** app
3. Click **"Settings"**
4. Click **"Edit Settings"**
5. Scroll to **Redirect URIs**
6. Add this URL: `https://cyberplayer.netlify.app/`
7. Click **"Add"**
8. Click **"Save"** at the bottom

### Step 3: Redeploy Your Site

**CRITICAL:** Environment variables only take effect after redeployment!

1. Go back to Netlify
2. Click **"Deploys"** tab
3. Click **"Trigger deploy"** → **"Clear cache and deploy site"**
4. Wait for deployment to complete (usually 1-2 minutes)

### Step 4: Test Your Site

1. Go to https://cyberplayer.netlify.app/
2. Click **"<CONNECT_SYSTEM />"** button
3. You should be redirected to Spotify login
4. After logging in, you'll be redirected back to your app
5. The player should now work!

## Common Errors and Solutions

### Error: "INVALID_CLIENT: Invalid client"
- **Cause:** Spotify Client ID not set or incorrect
- **Solution:** Check Step 1 and Step 3 above

### Error: "INVALID_CLIENT: Invalid redirect URI"
- **Cause:** Netlify URL not added to Spotify app settings
- **Solution:** Follow Step 2 exactly

### Error: "Spotify Client ID is not configured"
- **Cause:** Environment variables not set or site not redeployed
- **Solution:** Complete Step 1, then MUST do Step 3

### Button doesn't do anything
- **Cause:** JavaScript error, check browser console (F12)
- **Solution:** Make sure you redeployed after setting env variables

## Verification Checklist

- [ ] Environment variable `VITE_SPOTIFY_CLIENT_ID` is set in Netlify
- [ ] Environment variable `GEMINI_API_KEY` is set in Netlify (optional but recommended)
- [ ] `https://cyberplayer.netlify.app/` is added to Spotify Redirect URIs
- [ ] Site has been redeployed after setting environment variables
- [ ] Spotify app is not in Development Mode (or your account is added to allowed users)

## Still Not Working?

Check the browser console (Press F12 → Console tab) and look for error messages. Common issues:
- Red error about "CLIENT_ID" → Environment variables not loaded (redeploy!)
- Red error about "redirect_uri" → Update Spotify settings (Step 2)
- No errors but nothing happens → Check if you have Spotify Premium (required for Web Playback SDK)
