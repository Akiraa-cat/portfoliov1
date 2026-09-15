import React, { useState, useEffect } from 'react';
import { TopHudHeader } from './components/TopHudHeader';
import { HazardBanner } from './components/HazardBanner';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { UnreachableNodes } from './components/UnreachableNodes';
import { BottomHudFooter } from './components/BottomHudFooter';

export default function App() {
  const [isMuted, setIsMuted] = useState(true);
  const [isFlashing, setIsFlashing] = useState(false);

  // Trigger white/color screen glitch flash on reboot
  const triggerScreenFlash = () => {
    setIsFlashing(true);
    setTimeout(() => {
      setIsFlashing(false);
    }, 450);
  };

  const toggleAudio = () => {
    setIsMuted((prev) => !prev);
  };

  // Keyboard shortcut listener: 'M' for audio mute toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'm' || e.key === 'M') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          setIsMuted((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-300 font-mono antialiased overflow-x-hidden selection:bg-[#ff2a6d] selection:text-black relative flex flex-col justify-between">
      {/* Ambient CRT Scanline Overlay */}
      <div className="fixed inset-0 crt-overlay opacity-40 z-50 pointer-events-none"></div>

      {/* Screen Glitch Flash Overlay for Interactive Reboot */}
      <div
        id="reboot-flash-overlay"
        className={`fixed inset-0 z-[60] pointer-events-none transition-none ${
          isFlashing ? 'reboot-flash' : 'opacity-0'
        }`}
      ></div>

      {/* Ambient Radial Glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(255, 42, 109, 0.05) 0%, rgba(26, 71, 68, 0.06) 50%, rgba(10, 10, 12, 0.95) 85%)',
        }}
      ></div>

      {/* Top Persistent HUD Header */}
      <TopHudHeader isMuted={isMuted} onToggleAudio={toggleAudio} />

      {/* Main Diagnostic Workspace */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-4xl flex flex-col gap-6 items-center">
          {/* Top Hazard Caution Banner */}
          <HazardBanner />

          {/* Primary Diagnostic HUD Panel */}
          <DiagnosticPanel
            isMuted={isMuted}
            onTriggerScreenFlash={triggerScreenFlash}
          />

          {/* Quick Nav Backlink Matrix */}
          <UnreachableNodes isMuted={isMuted} />
        </div>
      </main>

      {/* Bottom Persistent HUD Footer */}
      <BottomHudFooter />
    </div>
  );
}
