<template>
<div class="grid">
  <div class="video-feed col-2">
    Video Feed
  </div>
  <div class="voice col-8">
    <div class="voice__bar">
      <span>
        <img :src="voiceWaveImg" id="voice__icon-wave" class="icon" />
        Ask me something about your devices energy consumption
      </span>
    </div>
  </div>
  <div class="instructions col-2">
    <h2>Instructions</h2>
    <div class="instructions__text">Say "Hi, my home" to evoke speech</div>
  </div>
  <div class="legend col-2">
    <h2>Appliances</h2>
  </div>
  <div class="apartment col-8">
    <div class="apartment__img-container">
      <object :data="apartmentImg" type="image/svg+xml" id="apartment__img" width="100%" height="100%" ref="apartment"></object>
      <div id="tooltip-lamp1" :class="{ tooltip: true, show: livingRoomLamp1Focused }">Tooltip for Lamp</div>
      <div id="tooltip-sofa" :class="{ tooltip: true, show: sofaFocused }">Tooltip for Sofa</div>
      <div id="tooltip-table" :class="{ tooltip: true, show: tableFocused }">Tooltip for Table</div>
    </div>
  </div>
  <div class="sidebar col-2">
    <h3>Data Visualization</h3>
    <div class="sidebar__energy-overview"></div>
    <div class="sidebar__energy-viz-1"></div>
    <div class="sidebar__energy-viz-2"></div>
  </div>
</div>
</template>

<script lang="ts">
import { onMounted, ref, VNodeRef, Ref } from 'vue';
import voiceWaveImg from './assets/voice_wave.svg';
import apartmentImg from './assets/apartment.svg';

export default {
    setup() {
      const apartment: VNodeRef | null = ref(null);
      const devices = new Map();
      const livingRoomLamp1Focused: Ref<boolean> = ref(false);
      const tableFocused: Ref<boolean> = ref(false);
      const sofaFocused: Ref<boolean> = ref(false);
      let lamps: NodeList | [] = [];
      let table: Node | null = null;
      let sofa: Node | null = null;

      onMounted(() => {
        console.log("MOUNTED");

        addWebGazeListener();
        setTimeout(() => getDevices(), 5000);
      })

      const getDevices = (): void => {
        const svg = apartment.value;
        const svgContent = svg.contentDocument;

        lamps = svgContent.querySelectorAll("g[id*='lamp']")
        console.log(lamps);

        lamps.forEach(lamp => {
          const lampPos = (lamp as HTMLElement).getBoundingClientRect();
          devices.set((lamp as HTMLElement).id.replace("#", ""), lampPos);
        });

        table = svgContent.querySelector("g[id='table']");
        sofa = svgContent.querySelector("g[id='sofa']");

        console.log(table);
        console.log(sofa);

        const tablePos = (table as HTMLElement).getBoundingClientRect();
        devices.set((table as HTMLElement).id.replace("#", ""), tablePos);

        const sofaPos = (sofa as HTMLElement).getBoundingClientRect();
        devices.set((sofa as HTMLElement).id.replace("#", ""), sofaPos);
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
        const livingRoomLamp1 = devices.get("living-room-lamp1");
        const sofa = devices.get("sofa");
        const table = devices.get("table");

        livingRoomLamp1Focused.value = calcFocus(xPred, yPred, livingRoomLamp1);
        tableFocused.value = calcFocus(xPred, yPred, table);
        sofaFocused.value = calcFocus(xPred, yPred, sofa);

        if (livingRoomLamp1Focused.value) {
          console.log("LIVINGROOM LAMP1 FOCUS");
        }

        if (tableFocused.value) {
          console.log("TABLE FOCUS");
        }

        if (sofaFocused.value) {
          console.log("SOFA FOCUS");
        }
      };

      const calcFocus = (xPred: number, yPred: number, device: any) => {
        return xPred >= device.x && xPred <= (device.x + device.width) &&
          yPred >= device.y && yPred <= (device.y + device.height);
      };

      return { voiceWaveImg, livingRoomLamp1Focused, apartmentImg, apartment, tableFocused, sofaFocused };
    },
};
</script>

<style lang="scss" scoped>
.grid {
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(8, 1fr);

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

    .col-7 {
      grid-column: span 7 / span 7;
    }

    .col-8 {
      grid-column: span 8 / span 8;
    }

    .col-9 {
      grid-column: span 9 / span 9;
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

    .video-feed {
      grid-row: span 2;
      border-color: transparent;
    }

    .voice {
      grid-row: span 1;
      background-color: var(--color-light);
      border-radius: 10px;
      border-color: transparent;

      .voice__bar {
        height: 50px;
        width: 100%;
        margin: auto;
        color: var(--color-secondary);
        display: flex;
        align-items: center;
        font-size: 20px;
        padding-left: 50px;
        background-color: var(--color-tertiary);
        margin-top: 30px;

        #voice__icon-wave {
          width: 25px;
          height: 100%;
          vertical-align: middle;
          padding-right: 10px;
        }
      }
    }

    .instructions {
      grid-row: span 3;
      border-color: transparent;
      padding: 20px;
      padding-top: 0;

      .instructions__text {
        background-color: var(--color-light);
        border: 2px solid var(--color-primary);
        border-radius: 10px;
        padding: 10px;
        height: 75%;
      }
    }

    .legend {
      grid-row: span 5;
      order: 1;
      border-color: transparent;
    }

    .apartment {
      grid-row: span 7;
      position: relative;
      border-color: transparent;
      background-color: var(--color-light);
      border-radius: 10px;

      .apartment__img-container {
        position: absolute;
        width: 100%;
        height: 100%;
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

        &#tooltip-lamp1 {
          top: 190px;
          left: 230px;
        }

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

    .sidebar {
      grid-row: span 5;
      border-color: transparent;

      &__energy-viz-1,
      &__energy-viz-2 {
        background-color: var(--color-light);
        border: 1px solid transparent;
        border-radius: 10px;
        height: 230px;
        margin: 20px;
      }
    }
}
</style>
