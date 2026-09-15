import React from 'react';

export const BottomHudFooter = () => {
  return (
    <footer
      id="bottom-hud-footer"
      className="relative z-20 w-full border-t border-terminal/80 bg-charcoal/95 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-400 font-mono select-none"
    >
      <div className="flex items-center gap-3">
        <span className="text-cyberPink font-bold">PROTOCOL: OFFLINE_DIAGNOSTIC</span>
        <span className="hidden sm:inline-block text-terminal">|</span>
        <span className="hidden sm:inline-block text-gray-400">
          DIRECTIVE: CLOUD_CONTAINER_RECOVERY
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span>DATA_ENC: AES-256-GCM</span>
        <span className="text-cyberYellow font-bold">SEC_STATUS: HAZARD_LOCKOUT</span>
      </div>
    </footer>
  );
};
