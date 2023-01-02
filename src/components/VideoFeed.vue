<template>
<div class="video-feed col-3">
  <h1>Home</h1>
  <div class="video-feed__status">
    <div class="video-feed__status-date">{{  date }}</div>
    <img :src="weatherImg" id="appliances__house-icon" class="icon" />
  </div>
</div>
</template>

<script lang="ts">
import weatherImg from '../assets/weather.svg';
import { useDevicesStore } from '../store';

export default {
  setup() {
    const store = useDevicesStore();
    const { monthNames } = store;

    const getCurrentDayAndTime = (): string => {
      const today = new Date(Date.now());
      const dayOfToday = today.getDate();
      const monthOfToday = monthNames[today.getMonth()];
      const hoursOfToday = today.getHours();
      const minutesOfToday = today.getMinutes();

      return `${dayOfToday} ${monthOfToday} • ${hoursOfToday}:${minutesOfToday}`;
    };

    const date = getCurrentDayAndTime();

    return { date, weatherImg };
  }
}
</script>

<style lang="scss" scoped>
.video-feed {
  grid-row: span 1;

  h1 {
    color: var(--color-primary);
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .video-feed__status {
    display: flex;
    align-items: flex-end;
    justify-content: center;

    .video-feed__status-date {
      color: var(--color-primary);
      font-size: 24px;
      padding-right: 20px;
      margin-bottom: 5px;
      font-weight: medium;
    }
  }
}
</style>