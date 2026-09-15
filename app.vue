<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import BottomHudFooter from '~/components/BottomHudFooter.vue';
import DiagnosticPanel from '~/components/DiagnosticPanel.vue';
import HazardBanner from '~/components/HazardBanner.vue';
import TopHudHeader from '~/components/TopHudHeader.vue';
import UnreachableNodes from '~/components/UnreachableNodes.vue';

const isMuted = ref(true);
const isFlashing = ref(false);

const triggerScreenFlash = () => {
  isFlashing.value = true;
  setTimeout(() => {
    isFlashing.value = false;
  }, 450);
};

const toggleAudio = () => {
  isMuted.value = !isMuted.value;
};

onMounted(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'm' || e.key === 'M') {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        isMuted.value = !isMuted.value;
      }
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});
</script>

<template>
  <div class="min-h-screen bg-void text-gray-300 font-mono antialiased overflow-x-hidden selection:bg-cyberPink selection:text-black relative flex flex-col justify-between">
    <div class="fixed inset-0 crt-overlay opacity-40 z-50 pointer-events-none"></div>

    <div
      id="reboot-flash-overlay"
      class="fixed inset-0 z-60 pointer-events-none transition-none"
      :class="isFlashing ? 'reboot-flash' : 'opacity-0'"
    ></div>

    <div
      class="fixed inset-0 pointer-events-none z-0"
      style="background: radial-gradient(circle at 50% 45%, rgba(255, 42, 109, 0.05) 0%, rgba(26, 71, 68, 0.06) 50%, rgba(10, 10, 12, 0.95) 85%);"
    ></div>

    <TopHudHeader :is-muted="isMuted" @toggle-audio="toggleAudio" />

    <main class="relative z-10 flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 lg:p-12">
      <div class="w-full max-w-4xl flex flex-col gap-6 items-center">
        <HazardBanner />
        <DiagnosticPanel :is-muted="isMuted" :on-trigger-screen-flash="triggerScreenFlash" />
        <UnreachableNodes :is-muted="isMuted" />
      </div>
    </main>

    <BottomHudFooter />
  </div>
</template>
