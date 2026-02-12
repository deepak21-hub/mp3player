import React, { useState, useEffect } from 'react';
import { REDIRECT_URI } from '../services/spotifyService';

interface SpotifyConnectProps {
  onLogin: () => void;
  onDemoMode: () => void;
  error: string | null;
}

const SpotifyConnect: React.FC<SpotifyConnectProps> = ({ onLogin, onDemoMode, error }) => {
  const [btnText, setBtnText] = useState('<CONNECT_SYSTEM />');
  const [logs, setLogs] = useState<string[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  // Terminal log typing effect
  useEffect(() => {
    const sequence = [
      { text: '> SYSTEM_BOOT_SEQUENCE_INITIATED...', delay: 500 },
      { text: `> DETECTED_URI: ${REDIRECT_URI}`, delay: 800 },
      { text: '> SEARCHING_FOR_HOST...', delay: 1500 },
      { text: '> PROTOCOL: OAUTH_2.0 [IMPLICIT_GRANT]', delay: 2500 },
      { text: '> WAITING_FOR_USER_INPUT_', delay: 3500 },
    ];

    let timeouts: ReturnType<typeof setTimeout>[] = [];

    sequence.forEach(({ text, delay }) => {
      const timeout = setTimeout(() => {
        setLogs(prev => {
          // Keep only last 3 logs if it gets too long
          const newLogs = [...prev, text];
          return newLogs.slice(-4);
        });
      }, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  // Text Scramble Effect
  const originalText = '<CONNECT_SYSTEM />';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isHovering) {
      let iteration = 0;
      interval = setInterval(() => {
        setBtnText(prev => 
          originalText
            .split("")
            .map((letter, index) => {
              if(index < iteration) return originalText[index];
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join("")
        );
        
        if(iteration >= originalText.length) { 
          clearInterval(interval);
        }
        
        iteration += 1 / 2; 
      }, 30);
    } else {
      setBtnText(originalText);
    }

    return () => clearInterval(interval);
  }, [isHovering]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative z-20 font-mono">
      
      {/* Main Login Frame */}
      <div className="bg-black/90 border-2 border-blue-600 p-8 max-w-lg w-full shadow-[0_0_40px_rgba(0,240,255,0.2)] relative backdrop-blur-md">
        
        {/* Decorative corner brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00f0ff]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00f0ff]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]"></div>
        
        {/* Header */}
        <div className="text-center mb-10 relative">
          <h1 className="text-3xl font-bold text-white tracking-widest mb-2" style={{ textShadow: '2px 2px 0px #0000ff' }}>
            NET_<span className="text-[#00f0ff]">LINK</span>
          </h1>
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50"></div>
        </div>

        {/* Visual Connection Diagram */}
        <div className="flex items-center justify-between gap-4 mb-10 px-4">
            
            {/* User Node */}
            <div className="flex flex-col items-center gap-2 relative group">
               <div className="w-16 h-16 bg-gray-900 border border-gray-500 flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.1)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/5 grid grid-cols-4 grid-rows-4 gap-px opacity-20">
                     {[...Array(16)].map((_, i) => <div key={i} className="bg-transparent border border-gray-600/50"></div>)}
                  </div>
                  <i className="fas fa-user text-2xl text-gray-400 z-10"></i>
               </div>
               <span className="text-[10px] text-gray-500 tracking-wider">CLIENT_LOCAL</span>
            </div>

            {/* Connecting Cable */}
            <div className="flex-1 h-8 flex items-center justify-center relative overflow-hidden">
               {/* Static Line */}
               <div className="w-full h-[2px] bg-gray-800"></div>
               {/* Data Packets */}
               <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                   <div className="w-1/2 h-[4px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent animate-transmit opacity-80 blur-[1px]"></div>
               </div>
               <div className="absolute top-0 text-[8px] text-[#00f0ff] animate-pulse">SYNCING...</div>
            </div>

            {/* Spotify Node */}
            <div className="flex flex-col items-center gap-2">
               <div className="w-16 h-16 bg-gray-900 border border-[#1DB954] flex items-center justify-center shadow-[0_0_20px_rgba(29,185,84,0.3)] relative">
                  <i className="fab fa-spotify text-3xl text-[#1DB954] animate-pulse z-10"></i>
                  {/* Rotating Ring */}
                  <div className="absolute inset-0 border border-[#1DB954]/30 rounded-full scale-125 animate-spin-slow"></div>
               </div>
               <span className="text-[10px] text-[#1DB954] tracking-wider">SERVER_REMOTE</span>
            </div>
        </div>

        {/* Action Button */}
        <button
           onClick={onLogin}
           onMouseEnter={() => setIsHovering(true)}
           onMouseLeave={() => setIsHovering(false)}
           className="w-full bg-[#001020] border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black py-4 font-bold text-xl tracking-[0.2em] transition-all duration-100 mb-6 group relative overflow-hidden"
        >
           <span className="relative z-10">{btnText}</span>
           {/* Scanline overlay on button */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.1)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none"></div>
        </button>

        {/* Demo Mode Button */}
        <div className="flex justify-center mb-6">
            <button 
                onClick={onDemoMode}
                className="text-[10px] text-gray-500 hover:text-[#00f0ff] hover:border-[#00f0ff] border border-transparent px-3 py-1 transition-all duration-300 tracking-[0.2em] font-bold uppercase opacity-70 hover:opacity-100"
            >
                [ ACCESS_OFFLINE_MODE ]
            </button>
        </div>

        {/* Terminal Logs */}
        <div className="bg-black border border-gray-800 p-3 h-24 overflow-hidden relative">
           <div className="absolute top-0 right-0 p-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           </div>
           <div className="flex flex-col justify-end h-full">
              {logs.map((log, i) => (
                <div key={i} className="text-xs text-green-500/80 mb-1 leading-tight font-mono break-all">
                  {log}
                </div>
              ))}
              {error && <div className="text-xs text-red-500 font-bold bg-red-900/20 p-1 mt-1">{`> ERROR: ${error}`}</div>}
           </div>
        </div>
        
        <div className="mt-4 flex justify-between text-[8px] text-gray-600">
           <span>BUILD: v2.0.45</span>
           <span>SECURE_SOCKET_LAYER</span>
        </div>

      </div>
    </div>
  );
};

export default SpotifyConnect;