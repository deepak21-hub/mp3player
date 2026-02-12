import React from 'react';

interface MarqueeProps {
  text: string;
}

const Marquee: React.FC<MarqueeProps> = ({ text }) => {
  return (
    <div className="w-full bg-black border border-gray-600 h-8 overflow-hidden relative flex items-center">
      <div className="whitespace-nowrap animate-marquee absolute text-green-400 font-mono text-lg uppercase tracking-widest px-4">
        {text}
      </div>
    </div>
  );
};

export default Marquee;
