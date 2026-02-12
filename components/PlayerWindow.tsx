import React, { useState, useEffect } from 'react';
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
  // Player State
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);

  // Gemini State
  const [terminalData, setTerminalData] = useState<string[]>(['> SYSTEM_READY', '> WAITING_FOR_MEDIA...']);
  const [isScanning, setIsScanning] = useState(false);

  const isOffline = !player;

  // Connect Player Listeners
  useEffect(() => {
    if (!player) return;

    player.addListener('player_state_changed', (state: SpotifyPlayerState) => {
      if (!state) return;
      
      // Reset AI log if track changes
      if (currentTrack && state.track_window.current_track.id !== currentTrack.id) {
         setTerminalData(['> NEW_MEDIA_DETECTED', '> PRESS [SCAN] FOR ANALYSIS']);
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
    setTerminalData(['> ESTABLISHING_NEURAL_UPLINK...', '> ACCESSING_GLOBAL_DATABASE...']);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const artist = isOffline ? "SYSTEM_ADMIN" : currentTrack?.artists[0]?.name;
      const track = isOffline ? "CYBER_SIMULATION_V1" : currentTrack?.name;

      if (!artist || !track) {
         setTerminalData(['> ERR: NO_MEDIA_LOADED']);
         setIsScanning(false);
         return;
      }

      const prompt = `Role: Cyberpunk music database terminal. 
      Task: Analyze the song "${track}" by "${artist}".
      Output: Provide exactly 3 short sections separated by newlines.
      1. GENRE: A cool subgenre name (e.g. Neon-Synth, Dark-Techno).
      2. MOOD: 3 words describing the vibe.
      3. LYRIC_FRAGMENT: A famous or meaningful line from the song (max 10 words).
      Style: Raw terminal output, uppercase, technical. Do not use markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      const text = response.text || '> NO_DATA_FOUND';
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      setTerminalData(['> SCAN_COMPLETE', ...lines]);

    } catch (err) {
      console.error(err);
      setTerminalData(['> ERR: CONNECTION_REFUSED', '> RETRY_LATER']);
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
    <div className="fixed inset-0 w-full h-full bg-[#c0c0c0] flex flex-col z-40 border-4 border-gray-600 box-border">
      
      {/* Title Bar - Fixed Height */}
      <div className="flex-none flex items-center justify-between bg-gradient-to-r from-blue-900 to-blue-600 px-3 py-2 select-none border-b-4 border-gray-800 shadow-md z-10">
        <div className="flex items-center gap-2 overflow-hidden">
           <div className="w-4 h-4 bg-blue-300 rounded-sm flex-shrink-0"></div>
           <span className="text-white font-bold text-sm sm:text-lg tracking-wide font-mono drop-shadow-[1px_1px_0_#000] truncate">CyberPlayer_Pro_v99.exe</span>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <RetroButton className="w-8 h-8 !text-lg !p-0 flex items-center justify-center" label="_" />
          <RetroButton className="w-8 h-8 !text-lg !p-0 flex items-center justify-center" label="X" onClick={onLogout} title="Close" />
        </div>
      </div>

      {/* Main Content Area - Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 lg:p-8 bg-[#c0c0c0]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-8 h-full min-h-[min-content]">
          
          {/* --- LEFT COLUMN: VISUALS --- */}
          {/* Order: 1 on Mobile, 1 on Desktop */}
          <div className="w-full lg:w-[400px] flex-none flex flex-col gap-4">
              
              {/* CD Enclosure */}
              <div className="bg-black border-4 border-gray-600 p-4 flex flex-col items-center justify-center shadow-inner relative overflow-hidden group aspect-square lg:aspect-auto lg:h-[400px]">
                 {/* Cyber grid background */}
                 <div className="absolute inset-0 opacity-20" 
                      style={{ 
                        backgroundImage: 'linear-gradient(#00f0ff 1px, transparent 1px), linear-gradient(90deg, #00f0ff 1px, transparent 1px)', 
                        backgroundSize: '30px 30px' 
                      }}>
                 </div>
                 
                 {/* The actual CD player component with responsive sizing */}
                 <CDPlayer 
                    className="w-[70%] max-w-[250px] lg:w-[300px] lg:max-w-none" 
                    imageUrl={albumArt} 
                    isPlaying={!isOffline && !isPaused && !!currentTrack} 
                 />
                 
                 {/* Offline Overlay */}
                 {isOffline && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black/70 text-[#00f0ff] font-mono text-sm sm:text-xl border-2 border-[#00f0ff] px-4 py-2 animate-pulse backdrop-blur-sm">
                        NO DISC
                      </div>
                   </div>
                 )}

                 {/* Decorative Mechanical Stats - Absolute for Cyber feel, but careful on small screens */}
                 <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-[10px] sm:text-xs text-gray-500 font-mono">
                    RPM: {(!isOffline && !isPaused) ? '4800' : '0000'}<br/>
                    LASER: {(!isOffline && !isPaused) ? 'ON' : 'OFF'}
                 </div>
              </div>

              {/* Back Button Area */}
              <div className="flex justify-between items-center bg-gray-300 border-2 border-gray-500 p-2 shadow-sm">
                   <button 
                       onClick={onBack} 
                       className="text-xs sm:text-sm font-bold font-mono hover:text-blue-800 flex items-center gap-2 px-2"
                     >
                       <i className="fas fa-arrow-left"></i> LOGOUT
                   </button>
                   <div className="flex gap-1 pr-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full animate-pulse delay-75 border border-gray-600"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full animate-pulse delay-150 border border-gray-600"></div>
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse border border-gray-600"></div>
                   </div>
              </div>
          </div>


          {/* --- RIGHT COLUMN: CONTROLS & INFO --- */}
          {/* Order: 2 on Mobile, 2 on Desktop */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-w-0">
              
              {/* 1. Track Info Header */}
              <div className="flex flex-col gap-2 bg-gray-300 border-2 border-gray-500 p-2 shadow-sm">
                  <div className="flex justify-between text-[10px] sm:text-xs text-gray-600 font-mono uppercase">
                      <span className="truncate mr-2">ID: {currentTrack?.id?.substring(0,8) || 'NULL'}...</span>
                      <span className={deviceId ? 'text-green-700 font-bold whitespace-nowrap' : ''}>{isOffline ? 'OFFLINE' : 'ONLINE'}</span>
                  </div>
                  <div className="border-4 border-gray-700">
                      <Marquee text={trackName} />
                  </div>
              </div>

              {/* 2. Progress Bar */}
              <div className="w-full h-6 sm:h-8 bg-gray-800 border-2 border-gray-600 relative shadow-inner flex-shrink-0">
                <div 
                  className="h-full bg-gradient-to-r from-green-600 via-green-400 to-green-600 transition-all duration-300 ease-linear"
                  style={{ width: `${progress * 100}%` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.3)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none"></div>
              </div>

              {/* 3. Control Deck */}
              <div className="bg-gray-300 border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-600 p-2 sm:p-4 flex flex-col gap-3 sm:gap-4 shadow-lg">
                  <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
                     {/* Playback Buttons */}
                     <div className="flex gap-2 flex-grow sm:flex-grow-0 justify-center">
                        <RetroButton onClick={prevTrack} icon="fas fa-step-backward" className="w-10 h-8 sm:w-12 sm:h-10 text-base sm:text-lg" />
                        <RetroButton 
                            onClick={togglePlay} 
                            icon={isPaused || isOffline ? "fas fa-play" : "fas fa-pause"} 
                            className={`w-16 h-8 sm:w-20 sm:h-10 text-lg sm:text-xl ${isOffline ? 'text-gray-500' : ''}`} 
                        />
                        <RetroButton onClick={nextTrack} icon="fas fa-step-forward" className="w-10 h-8 sm:w-12 sm:h-10 text-base sm:text-lg" />
                     </div>
                     
                     {/* Scan Button */}
                     <RetroButton 
                       onClick={handleScan} 
                       label={isScanning ? "SCANNING..." : "ANALYZE"} 
                       disabled={isScanning}
                       className="flex-grow sm:flex-grow-1 h-8 sm:h-10 bg-black text-[#00f0ff] border-gray-600 hover:bg-[#002030] text-xs sm:text-sm px-4 whitespace-nowrap"
                     />
                  </div>
                  <VolumeSlider volume={volume} onChange={handleVolume} />
              </div>

              {/* 4. Terminal Info Display */}
              {/* Flex-grow to fill space on desktop, minimum height on mobile */}
              <div className="flex-1 bg-black border-4 border-gray-600 p-3 sm:p-4 font-mono text-xs sm:text-sm relative overflow-hidden flex flex-col shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] min-h-[200px]">
                  {/* Header */}
                  <div className="flex justify-between text-gray-500 border-b border-gray-800 mb-2 pb-2 text-[10px] sm:text-xs tracking-wider">
                     <span>> GEMINI_CORE</span>
                     <span>READ_ONLY</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                      {terminalData.map((line, idx) => (
                          <p key={idx} className="text-[#00f0ff] mb-2 font-mono leading-relaxed drop-shadow-[0_0_4px_rgba(0,240,255,0.4)] break-words">
                             {line}
                          </p>
                      ))}
                      <div className="flex items-center gap-1 text-[#00f0ff]">
                          <span>></span>
                          <span className="w-2 h-4 bg-[#00f0ff] animate-pulse"></span>
                      </div>
                  </div>

                  {/* Background Grid Effect */}
                  <div className="absolute inset-0 pointer-events-none opacity-10"
                       style={{
                          backgroundImage: 'linear-gradient(0deg, transparent 24%, #00f0ff 25%, #00f0ff 26%, transparent 27%, transparent 74%, #00f0ff 75%, #00f0ff 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, #00f0ff 25%, #00f0ff 26%, transparent 27%, transparent 74%, #00f0ff 75%, #00f0ff 76%, transparent 77%, transparent)',
                          backgroundSize: '40px 40px'
                       }}
                  ></div>
              </div>

              <div className="text-[10px] text-gray-500 font-mono text-right flex justify-between">
                  <span>SYS: STABLE</span>
                  <span>v2.0.77</span>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlayerWindow;