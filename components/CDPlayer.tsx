import React from 'react';

interface CDPlayerProps {
  imageUrl?: string;
  isPlaying: boolean;
}

const CDPlayer: React.FC<CDPlayerProps> = ({ imageUrl, isPlaying }) => {
  // Fallback image if no track is playing
  const artUrl = imageUrl || 'https://picsum.photos/300/300';

  return (
    <div className="relative w-64 h-64 flex-shrink-0 mx-auto my-4 perspective-[1000px]">
      {/* Outer Case / Drive Tray aesthetics could go here, but we focus on the disc */}
      
      {/* The Disc Container */}
      <div 
        className={`
          relative w-full h-full rounded-full 
          shadow-[0_0_15px_rgba(0,240,255,0.5)] 
          border-4 border-gray-600/50
          overflow-hidden
          ${isPlaying ? 'animate-spin-slow' : 'animate-spin-slow paused-anim'}
        `}
      >
        {/* Album Art */}
        <img 
          src={artUrl} 
          alt="Album Art" 
          className="w-full h-full object-cover"
        />

        {/* Center Hole */}
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-gray-400 flex items-center justify-center z-10">
           <div className="w-14 h-14 bg-black rounded-full border border-gray-600"></div>
        </div>

        {/* Glossy Overlay (Plastic Shine) */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none z-20"
          style={{
            background: `
              conic-gradient(
                from 180deg at 50% 50%,
                rgba(255,255,255,0) 0deg,
                rgba(255,255,255,0.1) 60deg,
                rgba(255,255,255,0.4) 90deg,
                rgba(255,255,255,0.1) 120deg,
                rgba(255,255,255,0) 180deg,
                rgba(255,255,255,0) 360deg
              ),
              radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)
            `
          }}
        />

        {/* Holographic Refraction (Rainbow ring) */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none z-10 opacity-30 mix-blend-color-dodge"
          style={{
            background: 'conic-gradient(transparent, #ff00ff, #00ffff, #00ff00, transparent)'
          }}
        />
      </div>
      
      {/* Mechanical Decor around the disc */}
      <div className="absolute -inset-2 rounded-full border border-dashed border-gray-500 opacity-50 pointer-events-none animate-spin-slow [animation-duration:10s]"></div>
    </div>
  );
};

export default CDPlayer;
