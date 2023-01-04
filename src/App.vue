<template>
<template v-if="calibration">
 <Calibration />
</template>
<template v-else>
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
</template>

<script lang="ts">
import Instructions from './components/Instructions.vue';
import VideoFeed from './components/VideoFeed.vue';
import Rooms from './components/Rooms.vue';
import Visualization from './components/Visualization.vue';
import Apartment from './components/Apartment.vue';
import MouseInput from './components/MouseInput.vue';
import SpeechInput from './components/SpeechInput.vue';
import Calibration from './components/Calibration.vue';
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
    Calibration,
  },
  setup() {
    const store = useDevicesStore();
		const { multimodal, calibration } = storeToRefs(store);

    return { multimodal, calibration };
  }
};
</script>

<style lang="scss" scoped>
</style>
