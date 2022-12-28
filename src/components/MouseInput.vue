<template>
  <div class="mouse-input col-7">
    <div class="mouse-input__bar">
      <label class="mouse-input__bar-label">Select device: </label>
      <Multiselect
      v-model="deviceValue"
      :options="deviceOptions"
      placeholder="Freezer, Coffee Machine, ..."
      />
      <label class="mouse-input__bar-label">Select time frame: </label>
      <Multiselect
      v-model="timeValue"
      :options="timeOptions"
      placeholder="Today, Last week, ..."
      />
      <button class="btn" @click="setVisualization">Show</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import Multiselect from '@vueform/multiselect';
import { TimePeriod } from '../types/enums';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';

export default {
  components: { Multiselect },
  setup() {
    const store = useDevicesStore();
		const { visualization } = storeToRefs(store);
    const deviceValue = ref("All devices");
    const deviceOptions = ["All devices", "Refrigerator", "Dryer", "Coffee Machine", "Washing Machine", "Freezer"];
    const timeValue = ref(0);
    let timeOptions = [];

    for (const value in TimePeriod) {
      timeOptions.push(TimePeriod[value as keyof typeof TimePeriod]);
    }

    const setVisualization = () => {

      const newVisualization = {
					timePeriod: timeValue.value,
					deviceId: deviceValue.value,
      };

      visualization.value = newVisualization as any;
    };

    return { deviceValue, timeValue, deviceOptions, timeOptions, setVisualization };
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss" scoped>
.mouse-input {
  grid-row: span 1;
  background-color: var(--color-light);
  border-radius: 10px;

  .mouse-input__bar {
    height: 70px;
    margin: auto;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    padding-left: 50px;
    background-color: var(--color-tertiary);
    font-size: 20px;
    margin: 30px 0;
    .mouse-input__bar-label {
      font-weight: bold;
      padding: 0 10px;
    }

    .multiselect {
      border-color: var(--color-primary);
      border-radius: 10px;
      border-width: 2px;
      color: var(--color-primary);
      max-width: 30%;
      margin: 0;

      &:focus-visible {
        outline: var(--color-primary) auto 1px;
      }

      .is-selected {
        background: var(--color-primary);
      }
    }
  }
}
</style>