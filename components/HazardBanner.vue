<script setup>
import { AlertTriangle } from 'lucide-vue-next';
</script>

<template>
  <div
    id="hazard-warning-strip"
    class="w-full chamfer-card overflow-hidden border border-[#ff2a6d]/80 shadow-[0_0_30px_rgba(255,42,109,0.22)] select-none"
  >
    <div class="hazard-stripes h-3 w-full opacity-90"></div>

    <div class="bg-[#0a0a0c]/95 px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-3 border-y border-[#ff2a6d]/40">
      <div class="flex items-center gap-2.5 text-[#ff2a6d]">
        <AlertTriangle class="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 animate-pulse" />
        <span class="font-bold text-xs md:text-sm tracking-wider uppercase font-mono">
          PORTFOLIO ARCHIVES // OPERATIVE CREDENTIALS VERIFIED
        </span>
      </div>

      <div class="flex items-center gap-2 text-[11px] font-mono">
        <span class="text-gray-400">CLEARANCE REQUIRED:</span>
        <span class="bg-[#ff2a6d]/20 text-[#ff2a6d] px-2.5 py-0.5 border border-[#ff2a6d]/60 font-bold uppercase tracking-widest text-[10px] chamfer-pill">
          ACCESS: VERIFIED
        </span>
      </div>
    </div>

    <div class="hazard-stripes h-2.5 w-full opacity-80"></div>
  </div>
</template>
