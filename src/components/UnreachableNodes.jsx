import React, { useState } from 'react';
import { playHoverPip, playGlitchBuzzer } from '../utils/audio';

const NODES = ['/profile', '/missions', '/loadout', '/achievements', '/journey'];

export const UnreachableNodes = ({ isMuted }) => {
  const [deniedNode, setDeniedNode] = useState(null);

  const handleClickNode = (node) => {
    if (!isMuted) playGlitchBuzzer();
    setDeniedNode(node);
    setTimeout(() => {
      setDeniedNode(null);
    }, 1800);
  };

  return (
    <div className="w-full flex flex-col items-center gap-2 select-none font-mono">
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
        <span className="text-gray-500 uppercase tracking-wider mr-1 text-[10px]">
          UNREACHABLE NODES:
        </span>
        {NODES.map((node) => (
          <button
            key={node}
            onClick={() => handleClickNode(node)}
            onMouseEnter={playHoverPip}
            className="px-2.5 py-1 bg-[#121316] border border-[#2c3539]/80 text-gray-500 line-through hover:border-[#ff2a6d]/60 hover:text-[#ff2a6d] transition-colors cursor-pointer text-[11px]"
            title={`Node ${node} currently locked in cold storage migration`}
          >
            [{node}]
          </button>
        ))}
      </div>

      {deniedNode && (
        <div className="text-[10px] text-[#ff2a6d] bg-[#ff2a6d]/10 border border-[#ff2a6d]/40 px-3 py-1 chamfer-card animate-pulse tracking-wide">
          SECURITY_ALERT: ROUTE {deniedNode} ACCESS DENIED. HAZARD LOCKOUT ENFORCED.
        </div>
      )}
    </div>
  );
};
