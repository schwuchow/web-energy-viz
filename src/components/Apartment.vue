<template>
<div class="apartment col-7">
  <div class="apartment__focused-devices">
    <span class="apartment__focused-devices-label">Selected Devices:</span>
    <div v-for="focusedDevice in focusedDevicesObj"
         :key="focusedDevice"
         class="apartment__focused-device-tag"
         ref="focusedDevicesRef"
         :id="focusedDevice.id">
      {{ focusedDevice.name }}
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
import { FocusSelectedRooms } from '../types/interfaces';

export default {
  setup() {
    const store = useDevicesStore();
    const { devices, svgContent, deviceValue, multimodal, focusedDevices, rooms, isSelectedThroughFocus } = storeToRefs(store);
    const { deviceIds, deviceNames } = store;
    const apartment: VNodeRef | null = ref(null);
    const focusedDevicesRef = ref([]);
    const focusedDevicesObj = computed(() => {
      let list: any = [];
      focusedDevices.value.forEach(deviceId => {
        let newObj = {
          id: deviceId + "-ref",
          name: devices.value.get(deviceId)!.name,
        };

        list.push(newObj);
      });

      return list;
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

    if (multimodal) {
      watch(focusedDevices, (value) => {
        if (value !== null && value.length > 0) setSelectedDevices(value);
        else {
          resetUnSelectedDevices(value);
        }
      });
    } else {
      watch(deviceValue, (value) => {
        if (value !== null && value.length > 0) setSelectedDevices(value);
        else {
          resetUnSelectedDevices(value);
        }
      });
    }

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
      // regression models: ‘ridge’, ‘weightedRidge', 'threadedRidge' -> threadedRidge not working
      // @ts-ignore
      configuredWebGazer = webgazer.setRegression('weightedRidge');

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

          const isFocusedDevice = focusedDevices.value.find(deviceId => deviceId === id);
          if (!isFocusedDevice) focusedDevices.value.push(id);
        } else {
          const isFocusedDevice = focusedDevices.value.find(deviceId => deviceId === id);

          if (!isFocusedDevice) deviceEl!.style.filter = "brightness(100%)";
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
          focusedDevices.value = [];

          Object.keys(isSelectedThroughFocus.value).forEach(key => {
              isSelectedThroughFocus.value[key as keyof FocusSelectedRooms] = false ;
          });

          if (id === "bathroom") {
            isSelectedThroughFocus.value.bathroom = !isSelectedThroughFocus.value.bathroom;
            focusedDevices.value = Object.values(deviceIds).filter((id: string) => id.includes("bathroom"));
          } else if (id === "kitchen") {
            isSelectedThroughFocus.value.kitchen = !isSelectedThroughFocus.value.kitchen;
            focusedDevices.value = Object.values(deviceIds).filter((id: string) => id.includes("kitchen"));
          } else {
            isSelectedThroughFocus.value.allRooms = !isSelectedThroughFocus.value.allRooms;
            focusedDevices.value = Object.values(deviceIds);
          }
        } else {
          roomEl!.style.background = "#A5A9FF";
        }

        if (isSelectedThroughFocus.value.bathroom && id === "bathroom") roomEl!.style.background = "#F7B634";
        if (isSelectedThroughFocus.value.kitchen && id === "kitchen") roomEl!.style.background = "#F7B634";
        if (isSelectedThroughFocus.value.allRooms && id === "all-rooms") roomEl!.style.background = "#F7B634";
      })
    };

    const hasEyeFocusOnSelectedDevice = (xPred: number, yPred: number) => {
      focusedDevicesRef.value.forEach((focusedDevice: HTMLElement) => {
        const focused: Ref<boolean> = ref(false);
        const tagDOMRect: DOMRect | undefined = focusedDevice.getBoundingClientRect();

        focused.value = tagDOMRect !== undefined && xPred >= tagDOMRect.left && xPred <= tagDOMRect.right &&
        yPred >= tagDOMRect.top  && yPred <= tagDOMRect.bottom;

        if (focused.value) {
          console.log("FOCUSED TAG");
          focusedDevices.value = focusedDevices.value.filter((id) => id !== focusedDevice.id.replace("-ref", ""));
        }
      });
    };

    const calcFocus = (xPred: number, yPred: number, el: any, range: number = 0) => {
      return xPred >= el.position.left - range && xPred <= el.position.right + range &&
        yPred >= el.position.top - range  && yPred <= el.position.bottom + range;
    };

    return { apartmentImg, apartment, focusedDevicesObj, focusedDevicesRef };
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