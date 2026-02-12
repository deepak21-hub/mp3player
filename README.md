# 🎵 CyberPlay - Y2K Spotify Player

A retro-futuristic Spotify music player with a Cybercore/Y2K aesthetic, featuring Windows 95/Winamp-inspired design elements.

## ✨ Features

- 🎨 Authentic Y2K/Cybercore aesthetic with vibrant gradients and retro UI
- 🎵 Spotify Web Playback SDK integration
- 🤖 AI-powered music recommendations using Google Gemini
- 💿 Classic Winamp-style player controls
- 🌈 Dynamic visualizations and effects

## 🚀 Deployment on Netlify

### Quick Deploy

1. **Push to GitHub** (already done!)
   ```bash
   git push origin main
   ```

2. **Deploy to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select the `cyberplay` repository
   - Netlify will auto-detect the build settings from `netlify.toml`
   - Add environment variable:
     - Key: `GEMINI_API_KEY`
     - Value: Your Gemini API key
   - Click "Deploy site"

3. **Configure Spotify**:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Add your Netlify URL to the Redirect URIs in your app settings

### Environment Variables

You need to set the following in Netlify:
- `GEMINI_API_KEY` - Your Google Gemini API key

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Configuration

The project uses:
- **Vite** for build tooling
- **React** for UI
- **TypeScript** for type safety
- **Spotify Web Playback SDK** for music playback
- **Google Gemini AI** for recommendations

## 🎨 Tech Stack

- React 19
- TypeScript
- Vite
- Spotify Web API
- Google Gemini AI
- CSS3 (with Y2K aesthetic)

---

Made with 💜 by deepak21-hub
