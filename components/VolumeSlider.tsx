import React from 'react';

interface VolumeSliderProps {
  volume: number;
  onChange: (val: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ volume, onChange }) => {
  return (
    <div className="flex items-center gap-2 mt-2 w-full px-2">
      <i className="fas fa-volume-down text-gray-400 text-xs"></i>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-700 appearance-none border border-gray-500 cursor-pointer"
        style={{
             backgroundImage: `linear-gradient(to right, #00f0ff ${volume * 100}%, #333 ${volume * 100}%)`
        }}
      />
      <i className="fas fa-volume-up text-gray-400 text-xs"></i>
    </div>
  );
};

export default VolumeSlider;
