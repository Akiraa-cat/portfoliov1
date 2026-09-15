<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { Loader2 } from 'lucide-vue-next';
import { playTone, playGlitchBuzzer, playRebootSweep, playHoverPip, playPingTone } from '~/src/utils/audio';

const props = defineProps({
  isMuted: Boolean,
  onTriggerScreenFlash: Function,
});

const rebootAttempts = ref(0);
const isRebooting = ref(false);
const isPinging = ref(false);
const progressPercentage = ref(99.04);
const phaseText = ref('SYNCHRONIZING POD VOLUMES...');
const logs = ref([
  { id: '1', text: '> SYSTEM POWER_ON... INITIALIZING CORE REPOSITORY', type: 'normal' },
  { id: '2', text: '> INITIATING SERVER WAKE... NODE_ADDR: 0x8F41', type: 'normal' },
  { id: '3', text: '> COMPILING LOADOUT DATA... [DOCKER, K8S, EBPF]', type: 'normal' },
  { id: '4', text: '> ENCRYPTING MISSIONS & CREDENTIAL ARCHIVES... [DONE]', type: 'normal' },
  { id: '5', text: '> WARNING: RAILWAY INGRESS TIMEOUT (504 GATEWAY DEADLINE)', type: 'warning' },
  { id: '6', text: '> ERROR: SECTOR OFFLINE. REBUILD IN PROGRESS.', type: 'error' },
]);

const terminalEndRef = ref(null);

watch(
  () => logs.value,
  () => {
    nextTick(() => {
      if (terminalEndRef.value) {
        terminalEndRef.value.scrollIntoView({ behavior: 'smooth' });
      }
    });
  },
  { deep: true },
);

const handleForceReboot = () => {
  if (isRebooting.value) return;

  if (!props.isMuted) playRebootSweep();
  props.onTriggerScreenFlash();
  isRebooting.value = true;
  rebootAttempts.value += 1;

  progressPercentage.value = 14.2;
  phaseText.value = 'EMERGENCY THREAD TEARDOWN // COLD BOOT...';

  const rebootSequence = [
    { text: '> HARD RESET INTERRUPT TRIGGERED [SIGNAL_KILL_9]', type: 'normal', pct: 28.5, phase: 'PURGING VOLATILE RAM BUFFERS...' },
    { text: '> RE-PROBING HYPERVISOR VIRTUAL BRIDGES...', type: 'normal', pct: 45.0, phase: 'RE-PROBING VIRTUAL BRIDGES...' },
    { text: '> RESTORING CONTAINER BASELAYERS FROM SECURE VAULT...', type: 'normal', pct: 64.8, phase: 'MOUNTING ENCRYPTED PARTITIONS...' },
    { text: '> CONNECTING ZERO-TRUST SEC_PROXY TUNNEL... [OK]', type: 'normal', pct: 81.3, phase: 'ESTABLISHING INGRESS HANDSHAKE...' },
    { text: '> PINGING RAILWAY MULTI-CLUSTER BACKBONE...', type: 'normal', pct: 92.0, phase: 'VERIFYING UPSTREAM HEALTHCHECK...' },
    { text: '> WARNING: HEALTHCHECK UNRESPONSIVE ON PORT 8080', type: 'warning', pct: 97.4, phase: 'STALLING RECOVERY PIPELINE...' },
    { text: '> ERROR: 0x8F_CONTAINER_FATAL - SECTOR OFFLINE. REBUILD IN PROGRESS.', type: 'error', pct: 99.04, phase: 'SYNCHRONIZING POD VOLUMES...' },
  ];

  logs.value = [{ id: `reboot-${Date.now()}-0`, text: '> HARD POWER_CYCLE INITIATED...', type: 'warning' }];

  let step = 0;
  const interval = setInterval(() => {
    if (step < rebootSequence.length) {
      const item = rebootSequence[step];
      logs.value = [
        ...logs.value,
        { id: `reboot-${Date.now()}-${step}`, text: item.text, type: item.type },
      ];
      progressPercentage.value = item.pct;
      phaseText.value = item.phase;

      if (!props.isMuted) playTone(650 + step * 70, 'sine', 0.04, 0.04);
      step += 1;
    } else {
      clearInterval(interval);
      isRebooting.value = false;
      progressPercentage.value = 99.04;
      phaseText.value = 'SYNCHRONIZING POD VOLUMES...';
      if (!props.isMuted) playGlitchBuzzer();
    }
  }, 280);
};

const handleBypassPing = () => {
  if (isPinging.value || isRebooting.value) return;
  isPinging.value = true;
  if (!props.isMuted) playPingTone();

  const timestamp = new Date().toISOString().substring(11, 19);
  logs.value = [
    ...logs.value,
    {
      id: `ping-${Date.now()}-1`,
      text: `> [${timestamp}] ICMP ECHO REQUEST SENT TO GATEWAY 0x8F41...`,
      type: 'normal',
    },
  ];

  setTimeout(() => {
    logs.value = [
      ...logs.value,
      {
        id: `ping-${Date.now()}-2`,
        text: `> [${timestamp}] PING RESPONSE: PACKET REJECTED (FIREWALL RE-ROUTED TO /dev/null)`,
        type: 'warning',
      },
    ];
    isPinging.value = false;
    if (!props.isMuted) playTone(440, 'triangle', 0.06, 0.05);
  }, 450);
};

onMounted(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        handleForceReboot();
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});

const progressText = computed(() => `${progressPercentage.value.toFixed(2)}%`);
</script>

<template>
  <div
    id="primary-diagnostic-hud"
    class="w-full chamfer-hud bg-[#121316]/95 border-2 border-[#1a4744] shadow-[0_0_40px_rgba(26,71,68,0.4)] relative overflow-hidden backdrop-blur-md select-none font-mono"
  >
    <div class="absolute top-2 left-2 text-[#1a4744]/70 text-[9px] pointer-events-none select-none">
      ┌── [DIAG_V4.2] ───────────────────────
    </div>
    <div class="absolute top-2 right-2 text-[#1a4744]/70 text-[9px] pointer-events-none select-none">
      ───────────────────── [SYS_STABLE: NO] ┐
    </div>
    <div class="absolute bottom-2 right-2 text-[#1a4744]/70 text-[9px] pointer-events-none select-none">
      [CONTAINER: AWS_EKS_FAILOVER] ┘
    </div>

    <div class="px-5 pt-7 pb-4 md:px-8 border-b border-[#1a4744]/50 flex flex-wrap items-center justify-between gap-4">
      <div class="space-y-1.5 max-w-2xl">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 bg-[#ff2a6d] shadow-[0_0_8px_#ff2a6d]"></span>
          <h1 class="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase font-sans">
            SECTOR OFFLINE // KERNEL RECONSTRUCTION
          </h1>
        </div>
        <p class="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
          Automated zero-trust infrastructure re-indexing in progress. The requested netrunner
          portfolio partition is currently undergoing cold storage migration.
        </p>
      </div>

      <div class="chamfer-btn bg-[#0a0a0c] border border-[#e5c158] px-3.5 py-1.5 flex flex-col items-end shadow-[0_0_12px_rgba(229,193,88,0.2)]">
        <span class="text-[9px] text-gray-400 uppercase tracking-widest">
          CURRENT STATE
        </span>
        <span class="text-[#e5c158] font-bold text-xs uppercase flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-[#e5c158] animate-ping"></span>
          STALLED_AT_REBUILD
        </span>
      </div>
    </div>

    <div class="p-5 md:p-8 space-y-6">
      <div class="space-y-2 bg-[#0a0a0c]/80 p-4 border border-[#2c3539] chamfer-card">
        <div class="flex flex-wrap items-center justify-between text-xs gap-2">
          <div class="flex items-center gap-2">
            <span class="text-gray-400 uppercase tracking-wider text-[11px]">
              RECONSTRUCTION LIFEBAR:
            </span>
            <span class="text-[#ff2a6d] font-bold text-xs">
              {{ phaseText }}
            </span>
          </div>

          <div class="text-xs flex items-center gap-2">
            <span class="text-gray-400">SYNCHRONIZED:</span>
            <span class="text-[#ff2a6d] font-bold text-sm glitch-active">
              {{ progressText }}
            </span>
            <span class="text-[10px] text-[#e5c158] bg-[#e5c158]/10 border border-[#e5c158]/50 px-1.5 py-0.5 font-bold">
              [HANG_DETECTED]
            </span>
          </div>
        </div>

        <div class="w-full h-5 bg-[#0a0a0c] border border-[#1a4744]/80 p-0.5 relative overflow-hidden flex items-center shadow-inner">
          <div
            class="h-full bg-gradient-to-r from-[#1a4744] via-[#ff2a6d] to-[#ff2a6d] transition-all duration-300 relative shadow-[0_0_12px_rgba(255,42,109,0.7)]"
            :style="{ width: `${progressPercentage}%` }"
          >
            <div class="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)] w-24 animate-[marquee_2.2s_linear_infinite]"></div>
          </div>
          <div class="absolute right-1 top-0 bottom-0 w-1 bg-[#e5c158] animate-pulse"></div>
        </div>

        <div class="flex justify-between items-center text-[10px] text-gray-500 pt-0.5">
          <span>0% [SECTOR_FLUSH]</span>
          <span class="text-gray-400">
            ESTIMATED RECOVERY TIME:
            <span class="text-gray-300 font-semibold">UNDEFINED (LOOP: 99%)</span>
          </span>
          <span>100% [MOUNTED]</span>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between text-xs text-gray-400 px-1">
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-[#ff2a6d]"></span>
            <span class="uppercase tracking-widest text-[11px] text-gray-300 font-bold">
              VIRTUAL TTY /dev/pts/corrupted_daemon
            </span>
          </div>
          <div class="text-[10px] text-[#1a4744] font-bold">
            BUFFER: AUTO_STREAMING
          </div>
        </div>

        <div
          id="terminal-log-window"
          class="bg-[#0a0a0c]/95 border border-[#1a4744]/80 p-4 text-xs sm:text-sm h-48 sm:h-52 overflow-y-auto space-y-1.5 shadow-inner chamfer-card focus:outline-none"
          tabindex="0"
        >
          <template v-for="log in logs" :key="log.id">
            <div v-if="log.type === 'error'" class="text-[#ff2a6d] font-bold flex items-center">
              <span>{{ log.text }}</span>
              <span class="animate-blink font-bold text-[#ff2a6d] ml-0.5">_</span>
            </div>
            <div v-else-if="log.type === 'warning'" class="text-[#e5c158]">
              {{ log.text }}
            </div>
            <div v-else class="text-gray-300">
              {{ log.text }}
            </div>
          </template>
          <div ref="terminalEndRef" />
        </div>
      </div>

      <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#2c3539]">
        <div class="text-[11px] text-gray-400 text-center sm:text-left">
          <div class="text-gray-300 font-bold">RESCUE INTERACTION:</div>
          <span>
            Attempts logged:
            <span class="text-[#ff2a6d] font-bold">{{ rebootAttempts }}</span>. Hard fails
            reset to safe sandbox.
          </span>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto">
          <button
            id="bypassPingBtn"
            type="button"
            @click="handleBypassPing"
            @mouseenter="playHoverPip"
            :disabled="isPinging || isRebooting"
            class="flex-1 sm:flex-none text-center px-4 py-2.5 border border-[#2c3539] hover:border-gray-400 text-gray-400 hover:text-white bg-[#121316] text-xs font-bold uppercase chamfer-btn transition-colors cursor-pointer disabled:opacity-50"
          >
            {{ isPinging ? '[PINGING...]' : '[BYPASS_PING]' }}
          </button>

          <button
            id="rebootBtn"
            type="button"
            @click="handleForceReboot"
            @mouseenter="playHoverPip"
            :disabled="isRebooting"
            class="flex-1 sm:flex-none px-6 py-2.5 bg-[#ff2a6d] hover:bg-[#ff2a6d]/90 text-black text-xs sm:text-sm font-bold tracking-wider uppercase chamfer-btn shadow-[0_0_25px_rgba(255,42,109,0.5)] transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            <Loader2 v-if="isRebooting" class="w-4 h-4 animate-spin text-black" />
            <span>
              {{ isRebooting ? 'EXECUTING REBOOT CYCLE...' : 'FORCE KERNEL REBOOT [ENTER]' }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="bg-[#121316] px-5 py-3 border-t border-[#1a4744]/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-gray-400">
      <div>
        <span class="text-gray-500">DAEMON:</span>
        <span class="text-gray-300">k8s-pod-recovery</span>
      </div>
      <div>
        <span class="text-gray-500">PACKET LOSS:</span>
        <span class="text-[#ff2a6d] font-bold">14.8%</span>
      </div>
      <div>
        <span class="text-gray-500">MEM CONSUMPTION:</span>
        <span class="text-gray-300">14,308 / 16,384 MB</span>
      </div>
      <div class="text-right sm:text-left">
        <span class="text-gray-500">ENCLAVE:</span>
        <span class="text-[#e5c158] font-bold">RESTRICTED</span>
      </div>
    </div>
  </div>
</template>
