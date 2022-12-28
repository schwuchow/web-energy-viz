<template>
  <div class="mouse-input col-7">
    <div class="mouse-input-row">
      <label class="mouse-input__row-label">Select device: </label>
      <Multiselect
      v-model="deviceValue"
      :options="deviceOptions"
      placeholder="Freezer, Coffee Machine, ..."
      />
    </div>
    <div class="mouse-input-row">
      <label class="mouse-input__row-label">Select time frame: </label>
      <Multiselect
      v-model="timeValue"
      :options="timeOptions"
      placeholder="Today, Last week, ..."
      />
      <div class="checkbox-container">
        <input type="checkbox" id="checkbox" v-model="checked" />
        <label for="checkbox" class="mouse-input__row-label" >Show Ranking of Devices</label>
      </div>
    </div>
    <button class="btn mouse-input-btn" @click="setVisualization">Show</button>
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
		const { visualization, devices, svgContent } = storeToRefs(store);
    const deviceValue = ref("All devices");
    const deviceOptions = ["All devices", "Refrigerator", "Dryer", "Coffee Machine", "Washing Machine", "Freezer"];
    const timeValue = ref(0);
    const checked = ref(false);
    let timeOptions: TimePeriod[] = [];

    for (const value in TimePeriod) {
        timeOptions.push(TimePeriod[value as keyof typeof TimePeriod]);
    }

    // TODO
    const setFocusIn = (ev: Event) => {
      console.log(ev);
      (ev.target! as HTMLElement).style.filter = "brightness(65%)";
    };

    const setFocusOut = (ev: Event) => {
      console.log(ev);
      (ev.target! as HTMLElement).style.filter = "brightness(100%)";
    };

    if (devices.value && svgContent.value) {
      devices.value.forEach((device: DOMRect, id: string) => {
        console.log("Focus");
        const deviceEl = (svgContent.value as HTMLElement).querySelector(`g[id='${id}']`);

        console.log(deviceEl);
        if (deviceEl) deviceEl.addEventListener("mouseover", setFocusIn);
        if (deviceEl) deviceEl.addEventListener("mouseout", setFocusOut);
      });
    }

    const setVisualization = () => {
      const newVisualization = {
					timePeriod: timeValue.value,
					deviceId: deviceValue.value,
      };

      visualization.value = newVisualization as any;
    };

    return { checked, deviceValue, timeValue, deviceOptions, timeOptions, setVisualization };
  }
}
</script>

<style src="@vueform/multiselect/themes/default.css"></style>

<style lang="scss" scoped>
.mouse-input {
  grid-row: span 1;
  background-color: var(--color-light);
  border-radius: 10px;
  color: var(--color-primary);
  background-color: var(--color-tertiary);
  margin: 30px auto;
  font-size: 20px;
  display: flex;
  width: 100%;

  > * {
    padding: 0 10px;
  }

  .mouse-input-row {
    width: 30%;

    .mouse-input__row-label {
      font-weight: bold;
      padding: 0 10px;
    }

    .multiselect {
      border-color: var(--color-primary);
      border-radius: 10px;
      border-width: 2px;
      color: var(--color-primary);
      margin: 0;

      &:focus-visible {
        outline: var(--color-primary) auto 1px;
      }

      .is-selected {
        background: var(--color-primary);
      }
    }

    .checkbox-container {
      display: flex;
      margin-top: 15px;
    }

    #checkbox {
      appearance: none;
      border: 2px solid var(--color-primary) !important;
      border-radius: 5px;
      width: 20px;
      height: 20px;
      cursor: pointer;
      position: relative;

      & + label {
        cursor: pointer;
      }
    }

    #checkbox::after {
      content: "";
      width: 12px;
      height: 12px;
      background-color: var(--color-primary);
      position: absolute;
      top: 2px;
      left: 2px;
      visibility: hidden;
    }

    #checkbox:checked::after {
      visibility: visible;
    }
  }

  .mouse-input-btn {
    width: 20%;
    height: 40%;
    align-self: top;
    margin-top: 23px;
  }
}
</style>