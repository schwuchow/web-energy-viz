<template>
<div class="voice col-7">
  <div class="voice__bar">
    <span>
      <img :src="voiceWaveImg" id="voice__icon-wave" class="icon" />
      Ask me something about your devices energy consumption
     <SpeechInput />
    </span>
  </div>
</div>
</template>

<script lang="ts">
import voiceWaveImg from '../assets/voice_wave.svg';
import SpeechInput from './SpeechInput.vue';

export default {
  components: {
    SpeechInput
  },
  setup() {
    return { voiceWaveImg };
  }
}
</script>

<style lang="scss" scoped>
.voice {
  grid-row: span 1;
  background-color: var(--color-light);
  border-radius: 10px;

  .voice__bar {
    height: 50px;
    margin: auto;
    color: var(--color-secondary);
    display: flex;
    align-items: center;
    font-size: 20px;
    padding-left: 50px;
    background-color: var(--color-tertiary);
    margin: 30px 0;

    #voice__icon-wave {
      width: 25px;
      height: 100%;
      vertical-align: middle;
      padding-right: 10px;
    }
  }
}
</style>