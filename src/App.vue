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
  <Visualization />
  <Apartment />
  <Rooms />
</div>
</template>

<script lang="ts">
import Instructions from './components/Instructions.vue';
import VideoFeed from './components/VideoFeed.vue';
import Rooms from './components/Rooms.vue';
import Visualization from './components/Visualization.vue';
import Apartment from './components/Apartment.vue';
import MouseInput from './components/MouseInput.vue';
import SpeechInput from './components/SpeechInput.vue';
import { useDevicesStore } from './store';
import { storeToRefs } from 'pinia';

export default {
  components: {
    VideoFeed,
    Rooms,
    Instructions,
    Visualization,
    Apartment,
    MouseInput,
    SpeechInput,
  },
  setup() {
    const store = useDevicesStore();
		const { multimodal } = storeToRefs(store);

    return { multimodal };
  }
};
</script>

<style lang="scss" scoped>
</style>
