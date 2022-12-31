<template>
  <div class="mouse-input col-7">
    <div class="mouse-input-row">
      <label class="mouse-input__row-label">Select device: </label>
      <Multiselect
      v-model="deviceValue"
      :options="deviceOptions"
      placeholder="Freezer, Coffee Machine, ..."
      mode="tags"
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
import { ref, onMounted, Ref, watch } from 'vue';
import Multiselect from '@vueform/multiselect';
import { TimePeriod } from '../types/enums';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';
import { Device } from '../types/interfaces';

export default {
  components: { Multiselect },
  setup() {
    const store = useDevicesStore();
		const { visualization, devices, svgContent, deviceValue } = storeToRefs(store);
    const timeValue = ref(0);
    const checked = ref(false);
    let timeOptions: TimePeriod[] = [];
    let deviceOptions: Ref<Object[]> = ref([]);

    onMounted(() => {
      console.log("MOUNTED MOUSE");

      setTimeout(() => setEventListener(), 2000);
    });

    const setSelectOptions = () => {
      for (const value in TimePeriod) {
        timeOptions.push(TimePeriod[value as keyof typeof TimePeriod]);
      }
    };

    setSelectOptions();

    watch(devices.value, (value) => {
      value.forEach((device: Device, id: string) => {
        deviceOptions.value.push({ value: id, label: device.name });
      });
    })

    const setEventListener = () => {
      if (devices.value && svgContent.value) {
        devices.value.forEach((device: Device, id: string) => {
          const deviceEl = (svgContent.value! as HTMLElement).querySelector(`g[id='${id}']`);

          if (deviceEl) deviceEl.addEventListener("mouseover", setFocus);
          if (deviceEl) deviceEl.addEventListener("mouseout", setFocus);
        });
      };
    }

    const setFocus = (ev: Event) => {
      let brightness;

      if (ev.type === 'mouseover') {
        brightness = "brightness(65%)";
      } else {
        brightness = "brightness(100%)";
      }

      (ev.target! as HTMLElement).style.filter = brightness;
    };

    const setVisualization = () => {
      const newVisualization = {
					timePeriod: timeValue.value,
					deviceIds: deviceValue.value,
          ranking: checked,
      };

      visualization.value = newVisualization as any;
    };

    return { checked, deviceValue, devices, timeValue, deviceOptions, timeOptions, setVisualization };
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
      user-select: none;

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
        user-select: none;
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
    height: 45px;
    align-self: top;
    margin-top: 23px;
  }
}
</style>