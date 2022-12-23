<template>
<div class="grid">
  <VideoFeed />
  <SpeechInput />
  <Instructions />
  <Apartment />
  <Sidebar />
  <Appliances />
</div>
</template>

<script lang="ts">
import Instructions from './components/Instructions.vue';
import VideoFeed from './components/VideoFeed.vue';
import Appliances from './components/Appliances.vue';
import Sidebar from './components/Sidebar.vue';
import Apartment from './components/Apartment.vue';
import SpeechInput from './components/SpeechInput.vue';

export default {
  components: {
    VideoFeed,
    Appliances,
    Instructions,
    Sidebar,
    Apartment,
    SpeechInput
  },
  setup() {
  }
};
</script>

<style lang="scss" scoped>
</style>
