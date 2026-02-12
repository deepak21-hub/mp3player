import React from 'react';
import RetroButton from './RetroButton';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onConnect }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#c0c0c0] w-full max-w-[320px] shadow-[8px_8px_0_0_rgba(0,0,0,0.8)] border-t-2 border-l-2 border-white border-b-2 border-r-2 border-gray-800 animate-[popIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 px-2 py-1 flex justify-between items-center cursor-default select-none border-b-2 border-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-white font-bold text-sm tracking-wider font-mono">SYSTEM_ALERT</span>
          </div>
          <button onClick={onClose} className="bg-[#c0c0c0] w-5 h-5 flex items-center justify-center border-t border-l border-white border-b border-r border-gray-800 active:border-t-gray-800 active:border-l-gray-800 active:border-b-white active:border-r-white text-[12px] leading-none font-bold">
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="flex items-start gap-4 w-full">
            <div className="text-4xl text-yellow-500 drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
               <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="text-left font-mono">
              <p className="font-bold text-sm mb-2 text-black">NEW HARDWARE DETECTED</p>
              <p className="text-xs text-gray-800 leading-snug">
                Audio subsystem is currently offline. 
                <br/><br/>
                Initialize secure uplink to <span className="text-green-700 font-bold">SPOTIFY_MAIN_NET</span>?
              </p>
            </div>
          </div>

          <div className="w-full h-[2px] bg-gray-400 my-2 shadow-[inset_1px_1px_0_white,inset_-1px_-1px_0_gray]"></div>

          <div className="flex gap-4 w-full justify-end">
            <RetroButton onClick={onClose} label="IGNORE" />
            <RetroButton onClick={onConnect} label="CONNECT" variant="primary" className="bg-[#00f0ff] !text-black border-blue-900 hover:brightness-110" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SyncModal;