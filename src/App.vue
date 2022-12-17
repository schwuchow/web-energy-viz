<template>
<div class="grid">
  <div class="col-2">
    Video Feed
  </div>
  <div class="voice col-6">
    Voice control
    <div class="voice-bar"></div>
  </div>
  <div class="instructions col-4">
    Instructions
  </div>
  <div class="sidebar col-3">
    Sidebar
    <div class="energy-overview"></div>
    <div class="energy-viz-1"></div>
    <div class="energy-viz-2"></div>
  </div>
  <div class="apartment col-6">
    Apartment
    <div>
      <img :src="laptopImg" id="#laptop" class="icon" ref="laptop" />
      <div id="tooltip-laptop" :class="{ tooltip: true, show: focusOnLaptop }">Tooltip for Laptop</div>
      <img :src="lampImage" id="#lamp" class="icon" ref="lamp" />
      <div id="tooltip-lamp" :class="{ tooltip: true, show: focusOnLamp }">Tooltip for Lamp</div>
    </div>
  </div>
  <div class="legend col-3">
    Legend
  </div>
</div>
</template>

<script lang="ts">
import { onMounted, ref, VNodeRef, Ref } from 'vue';
import laptopImg from './assets/laptop.svg';
import lampImage from './assets/lamp.svg';

export default {
    setup() {
      const laptop: VNodeRef | null = ref(null);
      const lamp: VNodeRef | null = ref(null);
      const devices = new Map();
      const focusOnLaptop: Ref<boolean> = ref(false);
      const focusOnLamp: Ref<boolean> = ref(false);

      onMounted(() => {
        console.log("MOUNTED");

        const laptopPos = laptop.value.getBoundingClientRect();
        const lampPos = lamp.value.getBoundingClientRect();

        devices.set(laptop.value.id.replace("#", ""), laptopPos);
        devices.set(lamp.value.id.replace("#", ""), lampPos);

        addWebGazeListener();
      })

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
        const deviceLaptop = devices.get("laptop");
        const deviceLamp = devices.get("lamp");

        focusOnLaptop.value = calcFocus(xPred, yPred, deviceLaptop);
        focusOnLamp.value = calcFocus(xPred, yPred, deviceLamp);

        if (focusOnLaptop.value) {
          console.log("LAPTOP FOCUS");
        }

        if (focusOnLamp.value) {
          console.log("LAMP FOCUS");
        }
      };

      const calcFocus = (xPred: number, yPred: number, device: any) => {
        return xPred >= device.x && xPred <= (device.x + device.width) &&
          yPred >= device.y && yPred <= (device.y + device.height);
      };

      return { laptop, lamp, laptopImg, lampImage, focusOnLaptop, focusOnLamp };
    },
};
</script>

<style lang="scss" scoped>
.grid {
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 1fr 1fr 1fr;

    > * {
      border: 1px solid gray;
    }

    .col-1 {
      grid-column: span 1 / span 1;
    }

    .col-2 {
      grid-column: span 2 / span 2;
    }
    .col-3 {
      grid-column: span 3 / span 3;
    }

    .col-4 {
      grid-column: span 4 / span 4;
    }

    .col-5 {
      grid-column: span 5 / span 5;
    }

    .col-6 {
      grid-column: span 6 / span 6;
    }

    .col-10 {
      grid-column: span 10 / span 10;
    }

    .col-11 {
      grid-column: span 11 / span 11;
    }

    .col-12 {
      grid-column: span 12 / span 12;
    }

    .voice-bar {
      height: 35px;
      width: 500px;
      border: 1px solid grey;
      margin: auto;
    }

    .sidebar {
      grid-row: span 2;
    }

    .apartment {
      grid-row: span 2;
      position: relative;
    }

    .legend {
      grid-row: span 2;
    }

    .icon {
      width: 50px;
      height: 50px;
      margin: 100px;
    }

    .tooltip {
      width: 100px;
      height: 50px;
      display: none;
      position: absolute;

      &.show {
        display: block;
        background-color: grey;
      }

      &#tooltip-laptop {
        top: 190px;
        left: 230px;
      }

      &#tooltip-lamp {
        top: 190px;
        left: 490px;
      }
    }
}
</style>
