// Replace with your actual Client ID from the Spotify Developer Dashboard
export const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID_HERE'; // User needs to edit this manually
export const REDIRECT_URI = window.location.origin + window.location.pathname;

// Scopes required for playback
export const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
];

export const getLoginUrl = (): string => {
  if (CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID_HERE') {
    console.warn('Please update the CLIENT_ID in services/spotifyService.ts');
  }
  
  const scopesEncoded = SCOPES.join('%20');
  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scopesEncoded}&response_type=token&show_dialog=true`;
};

export const getTokenFromUrl = (): string | null => {
  const hash = window.location.hash;
  if (!hash) return null;

  const params = new URLSearchParams(hash.substring(1)); // remove #
  return params.get('access_token');
};

export const clearUrlHash = () => {
  window.location.hash = '';
};
