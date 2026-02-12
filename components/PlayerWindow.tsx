import React, { useState, useEffect, useRef } from 'react';
import RetroButton from './RetroButton';
import CDPlayer from './CDPlayer';
import Marquee from './Marquee';
import VolumeSlider from './VolumeSlider';
import { SpotifyPlayerState } from '../types';
import { GoogleGenAI } from "@google/genai";

interface PlayerWindowProps {
  player: Spotify.Player | null;
  deviceId: string | null;
  onLogout: () => void;
  onSyncClick: () => void;
  onBack: () => void;
}

const PlayerWindow: React.FC<PlayerWindowProps> = ({ player, deviceId, onLogout, onSyncClick, onBack }) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Player State
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Gemini State
  const [aiLog, setAiLog] = useState<string>('WAITING_FOR_QUERY...');
  const [isScanning, setIsScanning] = useState(false);

  const windowRef = useRef<HTMLDivElement>(null);
  const isOffline = !player;

  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking the title bar
    if ((e.target as HTMLElement).closest('.title-bar-draggable')) {
      setIsDragging(true);
      if (windowRef.current) {
        setDragOffset({
          x: e.clientX - windowRef.current.offsetLeft,
          y: e.clientY - windowRef.current.offsetTop
        });
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Connect Player Listeners
  useEffect(() => {
    if (!player) return;

    player.addListener('player_state_changed', (state: SpotifyPlayerState) => {
      if (!state) return;
      
      // Reset AI log if track changes
      if (currentTrack && state.track_window.current_track.id !== currentTrack.id) {
         setAiLog('WAITING_FOR_QUERY...');
      }

      setCurrentTrack(state.track_window.current_track);
      setIsPaused(state.paused);
      setProgress(state.position / state.track_window.current_track.duration_ms);
    });

    player.getVolume().then((vol) => setVolume(vol));

  }, [player, currentTrack]);

  // Handle Controls
  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    } else {
      onSyncClick();
    }
  };

  const nextTrack = () => {
    if (player) player.nextTrack();
  };

  const prevTrack = () => {
    if (player) player.previousTrack();
  };

  const handleVolume = (val: number) => {
    setVolume(val);
    if (player) player.setVolume(val);
  };

  // Gemini Scan Function
  const handleScan = async () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setAiLog('ESTABLISHING_UPLINK...');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const artist = isOffline ? "SYSTEM_ADMIN" : currentTrack?.artists[0]?.name;
      const track = isOffline ? "CYBER_SIMULATION_V1" : currentTrack?.name;

      if (!artist || !track) {
         setAiLog('ERR: NO_MEDIA_LOADED');
         setIsScanning(false);
         return;
      }

      const prompt = `Role: Cyberpunk 2077 OS Interface. 
      Task: Analyze this music track: "${track}" by "${artist}". 
      Output: A short, cryptic, cool system log (max 25 words). Use technical jargon like 'WAVEFORM_DETECTED', 'VIBE_ANALYSIS'. 
      Style: Uppercase, hacking terminal.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      setAiLog(response.text || 'DATA_NULL');
    } catch (err) {
      console.error(err);
      setAiLog('CONNECTION_FAILED_TO_NEURAL_NET');
    } finally {
      setIsScanning(false);
    }
  };

  // Determine Display Text and Art
  let trackName = "WAITING FOR INPUT...";
  let albumArt = "https://picsum.photos/300/300?grayscale"; // Default placeholder
  
  if (isOffline) {
    trackName = "OFFLINE MODE // INSERT DISC // CLICK [SYNC] TO CONNECT";
  } else if (currentTrack) {
    trackName = `${currentTrack.name} - ${currentTrack.artists[0].name}`;
    albumArt = currentTrack.album.images[0].url;
  } else {
    trackName = "CONNECTED // WAITING FOR PLAYBACK";
  }

  return (
    <div 
      ref={windowRef}
      className="absolute flex flex-col w-[360px] bg-[#c0c0c0] shadow-[4px_4px_0_0_rgba(0,0,0,0.5)] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 z-40"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Title Bar */}
      <div className="title-bar-draggable flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-600 px-1 py-1 cursor-move select-none">
        <div className="flex items-center gap-2">
           <div className="w-3 h-3 bg-blue-300 rounded-sm"></div>
           <span className="text-white font-bold text-sm tracking-wide">CyberPlayer.exe</span>
        </div>
        <div className="flex gap-1">
          <RetroButton className="w-5 h-5 !min-w-0 !p-0 leading-none" label="_" />
          <RetroButton className="w-5 h-5 !min-w-0 !p-0 leading-none" label="X" onClick={onLogout} title="Close" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3 bg-[#c0c0c0] flex flex-col items-center">
        
        {/* Status Line & Back Button */}
        <div className="w-full flex justify-between items-center text-[10px] text-gray-600 font-mono mb-2">
           <button 
             onClick={onBack} 
             className="border border-gray-500 px-1 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-black transition-colors"
           >
             &lt; BACK
           </button>
           
           <div className="flex gap-2">
              <span className={deviceId ? 'text-green-700 font-bold' : ''}>{isOffline ? 'OFFLINE' : (deviceId ? 'ONLINE' : 'LINKING...')}</span>
              <button onClick={onSyncClick} className="hover:text-blue-800 hover:underline cursor-pointer">
                 [ {isOffline ? 'SYNC' : 'RE-SYNC'} ]
              </button>
           </div>
        </div>

        {/* CD Mechanism */}
        <div className="bg-black border-2 border-gray-600 p-2 w-full flex justify-center shadow-inner mb-4 relative overflow-hidden group">
           {/* Cyber grid background */}
           <div className="absolute inset-0 opacity-20" 
                style={{ 
                  backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', 
                  backgroundSize: '20px 20px' 
                }}>
           </div>
           
           <CDPlayer imageUrl={albumArt} isPlaying={!isOffline && !isPaused && !!currentTrack} />
           
           {/* Offline Overlay on CD */}
           {isOffline && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/50 text-[#00f0ff] font-mono text-xs border border-[#00f0ff] px-2 py-1 animate-pulse">
                  NO DISC
                </div>
             </div>
           )}
        </div>

        {/* Marquee Display */}
        <Marquee text={trackName} />

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-800 mt-2 border border-gray-500 relative">
          <div 
            className="h-full bg-gradient-to-r from-green-600 to-green-400"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Scanline over progress bar */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.2)_50%,transparent_50%)] bg-[length:100%_4px]"></div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-2 w-full mt-3 justify-between">
           {/* Playback Controls */}
           <div className="flex gap-1">
              <RetroButton onClick={prevTrack} icon="fas fa-step-backward" />
              <RetroButton 
                  onClick={togglePlay} 
                  icon={isPaused || isOffline ? "fas fa-play" : "fas fa-pause"} 
                  className={`w-12 ${isOffline ? 'text-gray-500' : ''}`} 
              />
              <RetroButton onClick={nextTrack} icon="fas fa-step-forward" />
           </div>

           {/* Analysis Button */}
           <RetroButton 
             onClick={handleScan} 
             label={isScanning ? "..." : "SCAN"} 
             disabled={isScanning}
             className="flex-1 bg-black text-[#00f0ff] border-gray-600 hover:bg-[#002030] text-[10px]"
           />
        </div>

        <VolumeSlider volume={volume} onChange={handleVolume} />
      
        {/* Gemini Data Terminal */}
        <div className="w-full mt-3 bg-black border-2 border-gray-600 p-2 font-mono text-[10px] leading-tight min-h-[50px] relative overflow-hidden">
            {/* Terminal Glow */}
            <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)] pointer-events-none"></div>
            
            <div className="flex justify-between text-gray-500 border-b border-gray-800 mb-1 pb-1">
               <span>> SYSTEM_ANALYSIS_LOG</span>
               <span>{isScanning ? 'PROCESSING...' : 'IDLE'}</span>
            </div>
            
            <p className="text-[#00f0ff] uppercase typing-effect break-words">
              {aiLog}
              <span className="animate-pulse">_</span>
            </p>
        </div>

        <div className="mt-2 text-[8px] text-gray-500 font-mono w-full text-center">
          BITRATE: {isOffline ? '0kbps' : '320kbps'} // MEM: 64MB // AI_CORE: ACTIVE
        </div>
      </div>
    </div>
  );
};

export default PlayerWindow;