<template>
<div class="instructions col-2">
  <h2>Instructions</h2>
  <div class="instructions__text">
    <template v-if="multimodal">
      <div class="instructions__text-headline">To view the <b>energy consumption</b> of this apartment:</div>
      <div>1. Focus on <img :src="voiceWaveImg" id="instructions__icon-wave" class="icon" /> to activate the speech recognition.</div>
      <div>2. Look on a device for <b>400ms</b>.</div>
      <div>3. Say "Show me" with the <b>device</b> and <b>time frame</b> you want.</div>
      <div class="instructions___speech-options">
        D: <b>all devices | washing machine 1 | ...</b>
        <br>
        T: <b>today | last week | last month | ...</b>
      </div>
    </template>
    <template v-else>
      <div class="instructions__text-headline">To view the <b>energy consumption</b> of this apartment:</div>
      <div>1. Select the <b>device</b> or <b>devices</b>.</div>
      <div>2. Select the <b>time frame</b>.</div>
      <div>3. Decide if a <b>ranking</b> should be shown. (If yes, the energy consumption is summed up for the selected time frame.)</div>
      <div class="instructions__text-headline-2"><b>Rooms:</b></div>
      <div>1. Click on a <b>room</b> to select the devices of a room</div>
    </template>
  </div>
</div>
</template>

<script lang="ts">
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';
import voiceWaveImg from '../assets/voice_wave.svg';

export default {
  setup() {
    const store = useDevicesStore();
		const { multimodal } = storeToRefs(store);

    return { multimodal, voiceWaveImg };
  }
};
</script>

<style lang="scss" scoped>
.instructions {
  grid-row: span 3;
  padding: 0 20px 20px;

  .instructions__text-headline {
    margin-bottom: 5px;
    font-size: 13px;
    text-decoration: underline;
  }

  .instructions__text-headline-2 {
    margin-top: 5px;
    font-size: 13px;
    text-decoration: underline;
  }

  #instructions__icon-wave {
    width: 16px;
    height: 16px;
    margin-bottom: -5px;
  }


  .instructions__text {
    background-color: var(--color-light);
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    border-radius: 10px;
    padding: 10px;
    height: 80%;
    text-align: left;
    font-size: 12px;
  }
}
</style>