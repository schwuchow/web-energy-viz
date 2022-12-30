<template>
<div class="apartment col-7">
  <div class="apartment__img-container">
    <object :data="apartmentImg" type="image/svg+xml" id="apartment__img" width="100%" height="100%" ref="apartment"></object>
  </div>
</div>
</template>
  
<script lang="ts">
import { onMounted, ref, VNodeRef, Ref } from 'vue';
import apartmentImg from '../assets/apartment.svg';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';
  
export default {
  setup() {
    const store = useDevicesStore();
    const { devices, svgContent } = storeToRefs(store);
    const { deviceIds, deviceNames } = store;
    const apartment: VNodeRef | null = ref(null);

    onMounted(() => {
      console.log("MOUNTED");

      // addWebGazeListener();
      setTimeout(() => buildDevicesMap(), 1000);
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

    const addWebGazeListener = (): void => {
      // @ts-ignore
      webgazer.setGazeListener(function(data: { x: any; y: any; }|null, elapsedTime: any) {
        if (data == null) {
            return;
        }
        let xprediction = data.x; //these x coordinates are relative to the viewport
        let yprediction = data.y; //these y coordinates are relative to the viewport
        // console.log(elapsedTime); //elapsed time is based on time since begin was called
        // console.log(xprediction, yprediction); //elapsed time is based on time since begin was called
        hasEyeFocus(xprediction, yprediction);
      }).begin();
    };

    const hasEyeFocus = (xPred: number, yPred: number) => {
      devices.value.forEach((device, id) => {
        const focused: Ref<boolean> = ref(false);
        const deviceEl: HTMLElement | null = (svgContent.value! as HTMLElement).querySelector(`g[id='${id}']`);

        focused.value = calcFocus(xPred, yPred, device);

        if (focused.value) {
          console.log(`${id} FOCUS`);
          console.log(deviceEl);
          deviceEl!.style.filter = "brightness(65%)";
        } else {
          deviceEl!.style.filter = "brightness(100%)";
      }
      });
    };

    const calcFocus = (xPred: number, yPred: number, device: any) => {
      return xPred >= device.x && xPred <= (device.x + device.width) &&
        yPred >= device.y && yPred <= (device.y + device.height);
    };

    return { apartmentImg, apartment };
  }
}
</script>

<style lang="scss" scoped>
.apartment {
  grid-row: span 7;
  position: relative;
  background-color: var(--color-light);
  border-radius: 10px;
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