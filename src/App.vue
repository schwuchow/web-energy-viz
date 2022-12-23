<template>
<div class="grid">
  <VideoFeed />
  <VoiceBar />
  <Instructions />
  <Apartment />
  <Sidebar />
  <Appliances />
</div>
</template>

<script lang="ts">
import Instructions from './components/Instructions.vue';
import VoiceBar from './components/VoiceBar.vue';
import VideoFeed from './components/VideoFeed.vue';
import Appliances from './components/Appliances.vue';
import Sidebar from './components/Sidebar.vue';
import Apartment from './components/Apartment.vue';

export default {
  components: {
    VideoFeed,
    VoiceBar,
    Appliances,
    Instructions,
    Sidebar,
    Apartment
  },
  setup() {
  }
};
</script>

<style lang="scss" scoped>
</style>
