<template>
<div class="grid">
  <VideoFeed />
  <template v-if="multimodal">
    <SpeechInput />
  </template>
  <template v-else>
    <MouseInput />
  </template>
  <Instructions />
  <Apartment />
  <Visualization />
  <Appliances />
</div>
</template>

<script lang="ts">
import Instructions from './components/Instructions.vue';
import VideoFeed from './components/VideoFeed.vue';
import Appliances from './components/Appliances.vue';
import Visualization from './components/Visualization.vue';
import Apartment from './components/Apartment.vue';
import MouseInput from './components/MouseInput.vue';
import SpeechInput from './components/SpeechInput.vue';
import { ref } from 'vue'

export default {
  components: {
    VideoFeed,
    Appliances,
    Instructions,
    Visualization,
    Apartment,
    MouseInput,
    SpeechInput,
  },
  setup() {
    const multimodal = ref(false);

    return { multimodal };
  }
};
</script>

<style lang="scss" scoped>
</style>
