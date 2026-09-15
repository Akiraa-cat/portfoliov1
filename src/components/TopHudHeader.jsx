import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { playHoverPip, playTone } from '../utils/audio';

export const TopHudHeader = ({ isMuted, onToggleAudio }) => {
  return (
    <header
      id="top-hud-header"
      className="relative z-20 w-full border-b border-[#2c3539]/80 bg-[#121316]/95 backdrop-blur px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono select-none"
    >
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff2a6d] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff2a6d]"></span>
          </span>
          <span className="font-bold text-white tracking-widest uppercase text-xs md:text-sm">
            RIG // NETRUNNER.SYS
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 border border-[#ff2a6d]/60 text-[#ff2a6d] text-[10px] font-bold bg-[#ff2a6d]/10 tracking-wider">
            EMERGENCY_OVERRIDE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2.5 border-l border-[#2c3539] pl-4">
          <span className="text-[10px] text-gray-400 uppercase tracking-tight">
            INTEGRITY GAUGE:
          </span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-4 bg-[#ff2a6d] chamfer-pill shadow-[0_0_8px_rgba(255,42,109,0.5)]"></div>
            <div className="w-2.5 h-4 bg-[#ff2a6d] chamfer-pill shadow-[0_0_8px_rgba(255,42,109,0.5)]"></div>
            <div className="w-2.5 h-4 bg-[#ff2a6d]/30 chamfer-pill"></div>
            <div className="w-2.5 h-4 bg-[#ff2a6d]/20 chamfer-pill"></div>
            <div className="w-2.5 h-4 bg-[#ff2a6d]/10 chamfer-pill"></div>
          </div>
          <span className="text-[#ff2a6d] font-bold text-[11px] tracking-tight">
            [41.2% CRITICAL]
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 text-[11px]">
        <div className="hidden lg:flex items-center gap-2 text-gray-400">
          <span>LOC:</span>
          <span className="text-gray-200">SECTOR_07 // KERNEL_CORE</span>
        </div>

        <div className="flex items-center gap-1.5 text-[#e5c158]">
          <span className="inline-block w-1.5 h-1.5 bg-[#e5c158] rounded-full animate-pulse shadow-[0_0_6px_rgba(229,193,88,0.8)]"></span>
          <span className="font-medium">AUDIT_DAEMON: ACTIVE</span>
        </div>

        <button
          id="audioToggleBtn"
          onClick={() => {
            onToggleAudio();
            if (isMuted) playTone(880, 'triangle', 0.08, 0.08);
          }}
          onMouseEnter={playHoverPip}
          className="px-2.5 py-1 border border-[#2c3539] hover:border-[#ff2a6d] hover:text-[#ff2a6d] bg-[#0a0a0c]/80 text-gray-300 transition-colors uppercase text-[10px] flex items-center gap-1.5 cursor-pointer chamfer-btn"
          title="Toggle UI Web Audio Synthesizer (Key: M)"
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-[#ff2a6d] animate-pulse" />
          )}
          <span>{isMuted ? 'AUDIO: MUTED' : 'AUDIO: ACTIVE'}</span>
        </button>
      </div>
    </header>
  );
};
