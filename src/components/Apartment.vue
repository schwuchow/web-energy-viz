<template>
<div class="apartment col-7">
  <div class="apartment__focused-devices">
    <span class="apartment__focused-devices-label">Selected Devices:</span>
    <div v-for="focusedDeviceName in focusedDevicesNames"
         :key="focusedDeviceName"
         class="apartment__focused-device-tag"
         ref="focusedDevicesRef"
         :id="focusedDeviceName">
      {{ focusedDeviceName }}
    </div>
  </div>
  <div class="apartment__img-container">
    <object :data="apartmentImg" type="image/svg+xml" id="apartment__img" width="100%" height="100%" ref="apartment"></object>
  </div>
</div>
</template>
  
<script lang="ts">
import { onMounted, ref, VNodeRef, Ref, watch, computed } from 'vue';
import apartmentImg from '../assets/apartment.svg';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';

export default {
  setup() {
    const store = useDevicesStore();
    const { devices, svgContent, deviceValue, multimodal, focusedDevices, rooms } = storeToRefs(store);
    const { deviceIds, deviceNames } = store;
    const apartment: VNodeRef | null = ref(null);
    const focusedDevicesRef = ref([]);
    const focusedDevicesNames = computed(() => {
      return focusedDevices.value;
    });
    let timer = 0;

    onMounted(() => {
      console.log("MOUNTED");

      if (multimodal) {
        addWebGazeListener();
        setTimeout(() => buildDevicesMap(), 1000);
        buildRoomsMap();
      } else {
        buildDevicesMap();
      }
    })

    const buildDevicesMap = (): void => {
      const svg = apartment.value;
      const svgPos = (svg as HTMLElement).getBoundingClientRect();
      svgContent.value = svg.contentDocument;

      Object.entries(deviceIds).forEach(([key, id]) => {
        let el = (svgContent.value! as HTMLElement).querySelector(`g[id='${id}']`);

        const elPos = (el as HTMLElement).getBoundingClientRect();
        elPos.x += svgPos.x;
        elPos.y += svgPos.y;

        const newDevice = {
          position: elPos,
          name: deviceNames[key],
        }

        devices.value.set((el as HTMLElement).id.replace("#", ""), newDevice);
      });

      console.log(devices);
    };

    const buildRoomsMap = (): void => {
      Object.entries(["all-rooms", "kitchen", "bathroom"]).forEach(([key, id]) => {
        let el = document.querySelector(`#${id}`);

        const elPos = (el as HTMLElement).getBoundingClientRect();

        let newRoom = {
          position: elPos,
        }

        rooms.value.set((el as HTMLElement).id.replace("#", ""), newRoom);
      });

      console.log(devices);
    };

    watch(deviceValue, (value) => {
      if (value !== null && value.length > 0) setSelectedDevices(value);
      else {
        resetUnSelectedDevices(value);
      }
    });

    const setSelectedDevices = (value: string[]) => {
      value.forEach((id: string) => {
        const deviceEl: HTMLElement | null = (svgContent.value! as HTMLElement).querySelector(`g[id='${id}']`);
        deviceEl!.style.filter = "brightness(65%)";
      });
    };

    const resetUnSelectedDevices = (value: string[]) => {
      const notFocusedDevices =  Object.values(deviceIds).filter((id) => !value.includes(id));
      notFocusedDevices.forEach((id: string) => {
        const deviceEl: HTMLElement | null = (svgContent.value! as HTMLElement).querySelector(`g[id='${id}']`);
        deviceEl!.style.filter = "brightness(100%)";
      });
    };

    const addWebGazeListener = (): void => {
      // @ts-ignore
      let configuredWebGazer = webgazer.applyKalmanFilter(true);
      // trackers: 'clmtrackr', 'js_objectdetect', 'trackingjs' -> but according to website & JS console only Mediapipe TFFacemesh valid tracker
      // @ts-ignore
      configuredWebGazer = webgazer.setTracker('TFFacemesh');
      // regression models: ‘ridge’, ‘weightedRidge', 'threadedRidge' -> threadedRidge not working
      // @ts-ignore
      configuredWebGazer = webgazer.setRegression('weightedRidge');
      // @ts-ignore
      console.log(configuredWebGazer.getTracker());
      console.log(configuredWebGazer.getRegression());

      configuredWebGazer.setGazeListener(function(data: { x: any; y: any; }|null, elapsedTime: any) {
        if (data == null) {
            return;
        }
        let xprediction = data.x; //these x coordinates are relative to the viewport
        let yprediction = data.y; //these y coordinates are relative to the viewport
        // console.log(elapsedTime); //elapsed time is based on time since begin was called
        // console.log(xprediction, yprediction); //elapsed time is based on time since begin was called
        hasEyeFocusOnDevice(xprediction, yprediction);
        hasEyeFocusOnRoom(xprediction, yprediction);

        hasEyeFocusOnSelectedDevice(xprediction, yprediction);

        timer += 1;

        // if (timer === 200) {
        //   console.log("TIMER RESET");
        //   timer = 0;
        //   focusedDevices.value = [];
        // }
      })
      .saveDataAcrossSessions(true)
      .begin();
    };

    const hasEyeFocusOnDevice = (xPred: number, yPred: number) => {
      devices.value.forEach((device, id) => {
        const focused: Ref<boolean> = ref(false);
        const deviceEl: HTMLElement | null = (svgContent.value! as HTMLElement).querySelector(`g[id='${id}']`);

        focused.value = calcFocus(xPred, yPred, device, 20);

        if (focused.value) {
          deviceEl!.style.filter = "brightness(65%)";

          if (focusedDevices.value.length > 1) {
            focusedDevices.value = [];
          } else {
            focusedDevices.value.shift();
          }

          focusedDevices.value.push(id);

          console.log(focusedDevices.value);
        } else {
          deviceEl!.style.filter = "brightness(100%)";
        }
      });
    };

    const hasEyeFocusOnRoom = (xPred: number, yPred: number) => {
      rooms.value.forEach((room, id) => {
        const focused: Ref<boolean> = ref(false);
        const roomEl: HTMLElement | null = document.querySelector(`#${id}`);

        focused.value = calcFocus(xPred, yPred, room);

        if (focused.value) {
          roomEl!.style.background = "#8c8fd8";

          if (id === "bathroom") {
            focusedDevices.value = [];
            focusedDevices.value = Object.values(deviceIds).filter((id: string) => id.includes("bathroom"));
          } else if (id === "kitchen") {
            focusedDevices.value = [];
            focusedDevices.value = Object.values(deviceIds).filter((id: string) => id.includes("kitchen"));
          } else {
            focusedDevices.value = [];
            focusedDevices.value = Object.values(deviceIds);
          }

          console.log(focusedDevices.value);
        } else {
          roomEl!.style.background = "#A5A9FF";
        }
      })
    };

    const hasEyeFocusOnSelectedDevice = (xPred: number, yPred: number) => {
      focusedDevicesRef.value.forEach((focusedDevice) => {
        const focused: Ref<boolean> = ref(false);
        const tagDOMRect: DOMRect | undefined = (focusedDevice as HTMLElement).getBoundingClientRect();

        focused.value = tagDOMRect !== undefined && xPred >= tagDOMRect.left && xPred <= tagDOMRect.right &&
        yPred >= tagDOMRect.top  && yPred <= tagDOMRect.bottom;

        if (focused.value) {
          console.log("FOCUSED TAG");
          focusedDevices.value = focusedDevices.value.filter((id) => id !== (focusedDevice as HTMLElement).id);
        }
      });
    };

    const calcFocus = (xPred: number, yPred: number, el: any, range: number = 0) => {
      return xPred >= el.position.left - range && xPred <= el.position.right + range &&
        yPred >= el.position.top - range  && yPred <= el.position.bottom + range;
    };

    return { apartmentImg, apartment, focusedDevicesNames, focusedDevicesRef };
  }
}
</script>

<style lang="scss" scoped>
.apartment {
  grid-row: span 7;
  position: relative;
  background-color: var(--color-light);
  border-radius: 0 0 10px 10px;
  padding-top: 15px;

  .apartment__img-container {
    position: absolute;
    width: 95%;
    height: 95%;
  }

  .apartment__img {
    width: 100%;
    height: 100%;
  }

  .device-icon {
    width: 50px;
    height: 50px;
    margin: 100px;
  }

  .apartment__focused-devices {
    color: var(--color-primary);
    text-align: left;
    padding: 0 0 40px 10px;
    margin-top: -40px;

    .apartment__focused-devices-label {
      font-weight: bold;
      padding-right: 10px;
    }

    .apartment__focused-device-tag {
      display: inline-block;
      background-color: var(--color-primary);
      width: fit-content;
      border-radius: 5px;
      color: var(--color-light);
      padding: 5px 10px;
      margin-top: 10px;
      font-weight: bold;

      &:after {
        content: 'X';
        padding-left: 5px;
        color: var(--color-light);
      }

      & + .apartment__focused-device-tag {
        margin-left: 5px;
      }
    }
  }

  .tooltip {
    width: 100px;
    height: 50px;
    display: none;
    position: absolute;

    &#tooltip-sofa {
      top: 190px;
      left: 430px;
      background-color: violet;
    }

    &#tooltip-table {
      top: 130px;
      left: 430px;
      background-color: green;
    }

    &.show {
      display: block;
      background-color: grey;
    }
  }
}
</style>