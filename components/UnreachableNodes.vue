<script setup>
import { ref } from 'vue';
import { playGlitchBuzzer, playHoverPip } from '~/src/utils/audio';

const props = defineProps({
  isMuted: Boolean,
});

const NODES = ['/overview', '/stack', '/showcase', '/timeline', '/notes'];
const deniedNode = ref(null);

const handleClickNode = (node) => {
  if (!props.isMuted) playGlitchBuzzer();
  deniedNode.value = node;
  setTimeout(() => {
    deniedNode.value = null;
  }, 1800);
};
</script>

<template>
  <div class="w-full flex flex-col items-center gap-2 select-none font-mono">
    <div class="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
      <span class="text-gray-500 uppercase tracking-wider mr-1 text-[10px]">
        ARCHIVE PATHS:
      </span>
      <button
        v-for="node in NODES"
        :key="node"
        type="button"
        @click="handleClickNode(node)"
        @mouseenter="playHoverPip"
        class="px-2.5 py-1 bg-[#121316] border border-[#2c3539]/80 text-gray-500 line-through hover:border-[#ff2a6d]/60 hover:text-[#ff2a6d] transition-colors cursor-pointer text-[11px]"
        :title="`Section ${node} remains in active development review`"
      >
        [{{ node }}]
      </button>
    </div>

    <div
      v-if="deniedNode"
      class="text-[10px] text-[#ff2a6d] bg-[#ff2a6d]/10 border border-[#ff2a6d]/40 px-3 py-1 chamfer-card animate-pulse tracking-wide"
    >
      ACCESS DENIED: {{ deniedNode }} REMAINS IN ACTIVE DEVELOPMENT. REVIEW MODE ENFORCED.
    </div>
  </div>
</template>
