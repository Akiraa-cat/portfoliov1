import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import {
  playTone,
  playGlitchBuzzer,
  playRebootSweep,
  playHoverPip,
  playPingTone,
} from '../utils/audio';

const INITIAL_LOGS = [
  { id: '1', text: '> SYSTEM POWER_ON... INITIALIZING CORE REPOSITORY', type: 'normal' },
  { id: '2', text: '> INITIATING SERVER WAKE... NODE_ADDR: 0x8F41', type: 'normal' },
  { id: '3', text: '> COMPILING LOADOUT DATA... [DOCKER, K8S, EBPF]', type: 'normal' },
  { id: '4', text: '> ENCRYPTING MISSIONS & CREDENTIAL ARCHIVES... [DONE]', type: 'normal' },
  { id: '5', text: '> WARNING: RAILWAY INGRESS TIMEOUT (504 GATEWAY DEADLINE)', type: 'warning' },
  { id: '6', text: '> ERROR: SECTOR OFFLINE. REBUILD IN PROGRESS.', type: 'error' },
];

export const DiagnosticPanel = ({
  isMuted,
  onTriggerScreenFlash,
}) => {
  const [rebootAttempts, setRebootAttempts] = useState(0);
  const [isRebooting, setIsRebooting] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(99.04);
  const [phaseText, setPhaseText] = useState('SYNCHRONIZING POD VOLUMES...');
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const terminalEndRef = useRef(null);

  // Auto-scroll terminal to bottom when new logs arrive
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Execute Reboot sequence
  const handleForceReboot = () => {
    if (isRebooting) return;

    if (!isMuted) playRebootSweep();
    onTriggerScreenFlash();
    setIsRebooting(true);
    setRebootAttempts((prev) => prev + 1);

    // Reset progress to show fresh cycle
    setProgressPercentage(14.2);
    setPhaseText('EMERGENCY THREAD TEARDOWN // COLD BOOT...');

    const rebootSequence = [
      { text: '> HARD RESET INTERRUPT TRIGGERED [SIGNAL_KILL_9]', type: 'normal', pct: 28.5, phase: 'PURGING VOLATILE RAM BUFFERS...' },
      { text: '> RE-PROBING HYPERVISOR VIRTUAL BRIDGES...', type: 'normal', pct: 45.0, phase: 'RE-PROBING VIRTUAL BRIDGES...' },
      { text: '> RESTORING CONTAINER BASELAYERS FROM SECURE VAULT...', type: 'normal', pct: 64.8, phase: 'MOUNTING ENCRYPTED PARTITIONS...' },
      { text: '> CONNECTING ZERO-TRUST SEC_PROXY TUNNEL... [OK]', type: 'normal', pct: 81.3, phase: 'ESTABLISHING INGRESS HANDSHAKE...' },
      { text: '> PINGING RAILWAY MULTI-CLUSTER BACKBONE...', type: 'normal', pct: 92.0, phase: 'VERIFYING UPSTREAM HEALTHCHECK...' },
      { text: '> WARNING: HEALTHCHECK UNRESPONSIVE ON PORT 8080', type: 'warning', pct: 97.4, phase: 'STALLING RECOVERY PIPELINE...' },
      { text: '> ERROR: 0x8F_CONTAINER_FATAL - SECTOR OFFLINE. REBUILD IN PROGRESS.', type: 'error', pct: 99.04, phase: 'SYNCHRONIZING POD VOLUMES...' },
    ];

    setLogs([{ id: `reboot-${Date.now()}-0`, text: '> HARD POWER_CYCLE INITIATED...', type: 'warning' }]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < rebootSequence.length) {
        const item = rebootSequence[step];
        setLogs((prev) => [
          ...prev,
          { id: `reboot-${Date.now()}-${step}`, text: item.text, type: item.type },
        ]);
        setProgressPercentage(item.pct);
        setPhaseText(item.phase);

        if (!isMuted) {
          playTone(650 + step * 70, 'sine', 0.04, 0.04);
        }
        step++;
      } else {
        clearInterval(interval);
        setIsRebooting(false);
        setProgressPercentage(99.04);
        setPhaseText('SYNCHRONIZING POD VOLUMES...');
        if (!isMuted) playGlitchBuzzer();
      }
    }, 280);
  };

  // Execute Bypass Ping simulation
  const handleBypassPing = () => {
    if (isPinging || isRebooting) return;
    setIsPinging(true);
    if (!isMuted) playPingTone();

    const timestamp = new Date().toISOString().substring(11, 19);
    setLogs((prev) => [
      ...prev,
      {
        id: `ping-${Date.now()}-1`,
        text: `> [${timestamp}] ICMP ECHO REQUEST SENT TO GATEWAY 0x8F41...`,
        type: 'normal',
      },
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        {
          id: `ping-${Date.now()}-2`,
          text: `> [${timestamp}] PING RESPONSE: PACKET REJECTED (FIREWALL RE-ROUTED TO /dev/null)`,
          type: 'warning',
        },
      ]);
      setIsPinging(false);
      if (!isMuted) playTone(440, 'triangle', 0.06, 0.05);
    }, 450);
  };

  // Keyboard shortcut listener for Enter
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea') {
          handleForceReboot();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRebooting, isMuted]);

  return (
    <div
      id="primary-diagnostic-hud"
      className="w-full chamfer-hud bg-charcoal/95 border-2 border-mutedTeal shadow-[0_0_40px_rgba(26,71,68,0.4)] relative overflow-hidden backdrop-blur-md select-none font-mono"
    >
      {/* Decorative Corner Reticles */}
      <div className="absolute top-2 left-2 text-mutedTeal/70 text-[9px] pointer-events-none select-none">
        ┌── [DIAG_V4.2] ───────────────────────
      </div>
      <div className="absolute top-2 right-2 text-mutedTeal/70 text-[9px] pointer-events-none select-none">
        ───────────────────── [SYS_STABLE: NO] ┐
      </div>
      <div className="absolute bottom-2 right-2 text-mutedTeal/70 text-[9px] pointer-events-none select-none">
        [CONTAINER: AWS_EKS_FAILOVER] ┘
      </div>

      {/* Panel Top Header */}
      <div className="px-5 pt-7 pb-4 md:px-8 border-b border-mutedTeal/50 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 bg-cyberPink shadow-[0_0_8px_#ff2a6d]"></span>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase font-sans">
              SECTOR OFFLINE // KERNEL RECONSTRUCTION
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
            Automated zero-trust infrastructure re-indexing in progress. The requested netrunner
            portfolio partition is currently undergoing cold storage migration.
          </p>
        </div>

        {/* Current State Indicator Box */}
        <div className="chamfer-btn bg-void border border-cyberYellow px-3.5 py-1.5 flex flex-col items-end shadow-[0_0_12px_rgba(229,193,88,0.2)]">
          <span className="text-[9px] text-gray-400 uppercase tracking-widest">
            CURRENT STATE
          </span>
          <span className="text-cyberYellow font-bold text-xs uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyberYellow animate-ping"></span>
            STALLED_AT_REBUILD
          </span>
        </div>
      </div>

      {/* Main Panel Content: Lifebar + Virtual TTY */}
      <div className="p-5 md:p-8 space-y-6">
        {/* RECONSTRUCTION LIFEBAR MODULE */}
        <div className="space-y-2 bg-void/80 p-4 border border-terminal chamfer-card">
          <div className="flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2">
              <span className="text-gray-400 uppercase tracking-wider text-[11px]">
                RECONSTRUCTION LIFEBAR:
              </span>
              <span className="text-cyberPink font-bold text-xs">
                {phaseText}
              </span>
            </div>

            <div className="text-xs flex items-center gap-2">
              <span className="text-gray-400">SYNCHRONIZED:</span>
              <span className="text-cyberPink font-bold text-sm glitch-active">
                {progressPercentage.toFixed(2)}%
              </span>
              <span className="text-[10px] text-cyberYellow bg-cyberYellow/10 border border-cyberYellow/50 px-1.5 py-0.5 font-bold">
                [HANG_DETECTED]
              </span>
            </div>
          </div>

          {/* Segmented Fighter HUD Gauge Bar */}
          <div className="w-full h-5 bg-void border border-mutedTeal/80 p-0.5 relative overflow-hidden flex items-center shadow-inner">
            {/* Progress Fill Bar */}
            <div
              className="h-full bg-linear-to-r from-mutedTeal via-cyberPink to-cyberPink transition-all duration-300 relative shadow-[0_0_12px_rgba(255,42,109,0.7)]"
              style={{ width: `${progressPercentage}%` }}
            >
              {/* Scanline shimmer across bar */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)] w-24 animate-[marquee_2.2s_linear_infinite]"></div>
            </div>
            {/* Glitch jitter tick marker */}
            <div className="absolute right-1 top-0 bottom-0 w-1 bg-cyberYellow animate-pulse"></div>
          </div>

          {/* Subtext info */}
          <div className="flex justify-between items-center text-[10px] text-gray-500 pt-0.5">
            <span>0% [SECTOR_FLUSH]</span>
            <span className="text-gray-400">
              ESTIMATED RECOVERY TIME:{' '}
              <span className="text-gray-300 font-semibold">UNDEFINED (LOOP: 99%)</span>
            </span>
            <span>100% [MOUNTED]</span>
          </div>
        </div>

        {/* VIRTUAL TTY LOG STREAM */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyberPink"></span>
              <span className="uppercase tracking-widest text-[11px] text-gray-300 font-bold">
                VIRTUAL TTY /dev/pts/corrupted_daemon
              </span>
            </div>
            <div className="text-[10px] text-mutedTeal font-bold">
              BUFFER: AUTO_STREAMING
            </div>
          </div>

          <div
            id="terminal-log-window"
            className="bg-void/95 border border-mutedTeal/80 p-4 text-xs sm:text-sm h-48 sm:h-52 overflow-y-auto space-y-1.5 shadow-inner chamfer-card focus:outline-none"
            tabIndex={0}
          >
            {logs.map((log) => {
              if (log.type === 'error') {
                return (
                  <div key={log.id} className="text-cyberPink font-bold flex items-center">
                    <span>{log.text}</span>
                    <span className="animate-blink font-bold text-cyberPink ml-0.5">_</span>
                  </div>
                );
              }
              if (log.type === 'warning') {
                return (
                  <div key={log.id} className="text-cyberYellow">
                    {log.text}
                  </div>
                );
              }
              return (
                <div key={log.id} className="text-gray-300">
                  {log.text}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* RESCUE INTERACTION & REBOOT CTAs */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-terminal">
          <div className="text-[11px] text-gray-400 text-center sm:text-left">
            <div className="text-gray-300 font-bold">RESCUE INTERACTION:</div>
            <span>
              Attempts logged:{' '}
              <span className="text-cyberPink font-bold">{rebootAttempts}</span>. Hard fails
              reset to safe sandbox.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Secondary Ping Button */}
            <button
              id="bypassPingBtn"
              onClick={handleBypassPing}
              onMouseEnter={playHoverPip}
              disabled={isPinging || isRebooting}
              className="flex-1 sm:flex-none text-center px-4 py-2.5 border border-terminal hover:border-gray-400 text-gray-400 hover:text-white bg-charcoal text-xs font-bold uppercase chamfer-btn transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPinging ? '[PINGING...]' : '[BYPASS_PING]'}
            </button>

            {/* Main Interactive Reboot Button */}
            <button
              id="rebootBtn"
              onClick={handleForceReboot}
              onMouseEnter={playHoverPip}
              disabled={isRebooting}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-cyberPink hover:bg-cyberPink/90 text-black text-xs sm:text-sm font-bold tracking-wider uppercase chamfer-btn shadow-[0_0_25px_rgba(255,42,109,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
            >
              {isRebooting && <Loader2 className="w-4 h-4 animate-spin text-black" />}
              <span>
                {isRebooting
                  ? 'EXECUTING REBOOT CYCLE...'
                  : 'FORCE KERNEL REBOOT [ENTER]'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Telemetry Stats Strip */}
      <div className="bg-charcoal px-5 py-3 border-t border-mutedTeal/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-gray-400">
        <div>
          <span className="text-gray-500">DAEMON:</span>{' '}
          <span className="text-gray-300">k8s-pod-recovery</span>
        </div>
        <div>
          <span className="text-gray-500">PACKET LOSS:</span>{' '}
          <span className="text-cyberPink font-bold">14.8%</span>
        </div>
        <div>
          <span className="text-gray-500">MEM CONSUMPTION:</span>{' '}
          <span className="text-gray-300">14,308 / 16,384 MB</span>
        </div>
        <div className="text-right sm:text-left">
          <span className="text-gray-500">ENCLAVE:</span>{' '}
          <span className="text-cyberYellow font-bold">RESTRICTED</span>
        </div>
      </div>
    </div>
  );
};
