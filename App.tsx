import React, { useState, useEffect } from 'react';
import { getLoginUrl, getTokenFromUrl, clearUrlHash } from './services/spotifyService';
import PlayerWindow from './components/PlayerWindow';
import SyncModal from './components/SyncModal';
import SpotifyConnect from './components/SpotifyConnect';

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'player' | 'connect'>('player');
  
  // Random decorations state
  const [sparkles, setSparkles] = useState<{id: number, top: string, left: string, size: number}[]>([]);

  useEffect(() => {
    // Generate sparkles
    const newSparkles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 10 + 5
    }));
    setSparkles(newSparkles);

    // Auth Token Check
    const hashToken = getTokenFromUrl();
    if (hashToken) {
      setToken(hashToken);
      setViewMode('player');
      clearUrlHash();
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    // Load Spotify SDK
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const newPlayer = new window.Spotify.Player({
        name: 'Cyber Y2K Web Player',
        getOAuthToken: (cb) => { cb(token); },
        volume: 0.5
      });

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setDeviceId(device_id);
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setDeviceId(null);
      });
      
      newPlayer.addListener('initialization_error', ({ message }) => {
        console.error(message);
        setToken(null);
      });

      newPlayer.addListener('authentication_error', ({ message }) => {
        console.error(message);
        setToken(null);
      });

      newPlayer.addListener('account_error', ({ message }) => {
        console.error(message);
        alert("Spotify Premium is required for Web Playback.");
      });

      newPlayer.connect();
      setPlayer(newPlayer);
    };

    return () => {
        if (player) player.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleConnect = () => {
    window.location.href = getLoginUrl();
  };

  const handleLogout = () => {
    setToken(null);
    if (player) player.disconnect();
    setPlayer(null);
    setDeviceId(null);
    setViewMode('connect');
  };

  const handleBackToConnect = () => {
    // If we have a token, this acts as logout
    if (token) {
      handleLogout();
    } else {
      setViewMode('connect');
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-black overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* Background Layer: Stars / Void */}
      <div 
         className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?grayscale&blur=2')] bg-cover opacity-30"
         style={{ filter: 'contrast(1.5) brightness(0.5)' }}
      ></div>
      
      {/* Cyber Grid Floor (CSS perspective) */}
      <div 
        className="absolute bottom-0 w-full h-1/2 opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 0%, #00f0ff 2%, transparent 3%)',
          backgroundSize: '100% 40px',
          transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
        }}
      ></div>

      {/* Decorative Sparkles */}
      {sparkles.map(s => (
        <div 
          key={s.id}
          className="absolute text-[#00f0ff] animate-pulse pointer-events-none"
          style={{ top: s.top, left: s.left, fontSize: s.size }}
        >
          ✦
        </div>
      ))}

      {/* Main UI */}
      {viewMode === 'connect' && !token ? (
        <SpotifyConnect 
          onLogin={handleConnect} 
          onDemoMode={() => setViewMode('player')} 
          error={null} 
        />
      ) : (
        <>
          <PlayerWindow 
            player={player} 
            deviceId={deviceId} 
            onLogout={handleLogout} 
            onSyncClick={() => setIsModalOpen(true)}
            onBack={handleBackToConnect}
          />

          <SyncModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onConnect={handleConnect} 
          />
        </>
      )}

      {/* Connected Notification Overlay */}
      {deviceId && (
        <div className="absolute top-4 right-4 bg-black/80 border border-green-500 p-2 text-green-500 font-mono text-xs max-w-xs pointer-events-none z-0 animate-pulse">
           <p>{'>'} CONNECTION_ESTABLISHED</p>
           <p>{'>'} DEVICE_ID: {deviceId}</p>
        </div>
      )}

      {/* CRT Overlay */}
      <div className="scanlines"></div>
      <div className="crt-flicker"></div>
    </div>
  );
};

export default App;