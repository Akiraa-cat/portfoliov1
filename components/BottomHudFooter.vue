<template>
  <footer
    id="bottom-hud-footer"
    class="relative z-20 w-full border-t border-[#2c3539]/80 bg-[#121316]/95 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-400 font-mono select-none"
  >
    <div class="flex items-center gap-3">
      <span class="text-[#ff2a6d] font-bold">PROTOCOL: OFFLINE_DIAGNOSTIC</span>
      <span class="hidden sm:inline-block text-[#2c3539]">|</span>
      <span class="hidden sm:inline-block text-gray-400">
        DIRECTIVE: CLOUD_CONTAINER_RECOVERY
      </span>
    </div>

    <div class="flex items-center gap-4">
      <span>DATA_ENC: AES-256-GCM</span>
      <span class="text-[#e5c158] font-bold">SEC_STATUS: HAZARD_LOCKOUT</span>
    </div>
  </footer>
</template>
