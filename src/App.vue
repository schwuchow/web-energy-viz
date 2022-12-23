<template>
<div class="grid">
  <div class="video-feed col-3">
    Video Feed
  </div>
  <div class="voice col-7">
    <div class="voice__bar">
      <span>
        <speech-input></speech-input>
      </span>
    </div>
  </div>
  <div class="instructions col-2">
    <h2>Instructions</h2>
    <div class="instructions__text">Say "Hi, my home" to evoke speech</div>
  </div>
  <div class="appliances col-2">
    <h2>Appliances</h2>
    <div class="appliances__all-devices">
      <div>
        <img :src="houseImg" id="appliances__house-icon" class="icon" />
        <p class="appliances__house-text">All Devices</p>
      </div>
      <div class="appliances__house-toggle">
        <p>Un<wbr>selected</p>
        <div class="appliances__house-toggle-nr">10</div>
      </div>
    </div>
    <div class="appliances__all-devices selected">
      <div>
        <img :src="houseImg" id="appliances__house-icon" class="icon" />
        <p class="appliances__house-text">All Devices</p>
      </div>
      <div class="appliances__house-toggle">
        <p>Un<wbr>selected</p>
        <div class="appliances__house-toggle-nr">10</div>
      </div>
    </div>
  </div>
  <div class="apartment col-7">
    <div class="apartment__img-container">
      <object :data="apartmentImg" type="image/svg+xml" id="apartment__img" width="100%" height="100%" ref="apartment"></object>
      <div id="tooltip-lamp1" :class="{ tooltip: true, show: livingRoomLamp1Focused }">Tooltip for Lamp</div>
      <div id="tooltip-sofa" :class="{ tooltip: true, show: sofaFocused }">Tooltip for Sofa</div>
      <div id="tooltip-table" :class="{ tooltip: true, show: tableFocused }">Tooltip for Table</div>
    </div>
  </div>
  <div class="sidebar col-3">
    <h3>Data Visualization</h3>
    <div class="sidebar__energy-viz">
      <svg class="sidebar__energy-viz-svg" width="370" height="400"></svg>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { onMounted, ref, VNodeRef, Ref } from 'vue';
import * as d3 from "d3";
import apartmentImg from './assets/apartment.svg';
import houseImg from './assets/house.svg';
import refrigeratorData from './datasets/data.tsv';
import SpeechInput from './components/speechInput.vue';

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

        showVisualization();
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

      const showVisualization = () => {
        console.log(refrigeratorData);
        refrigeratorData.forEach((d: any) => {
          d.timestamp = new Date(d.timestamp).getSeconds();
        });

        var svg = d3.select(".sidebar__energy-viz-svg"),
        margin = 100,
        width = parseInt(svg.attr("width")) - margin,
        height = parseInt(svg.attr("height")) - margin;


        var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
            yScale = d3.scaleLinear().range ([height, 0]);

        var g = svg.append("g")
                  .attr("transform", "translate(" + 50 + "," + 50 + ")");

        xScale.domain(refrigeratorData.map(function(d: any) { return d.timestamp; }));
        yScale.domain([60, d3.max(refrigeratorData as Iterable<any>, function(d: any) { return d.energy; })]);

        g.append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(d3.axisBottom(xScale));

         g.selectAll(".bar")
         .data(refrigeratorData)
         .enter().append("rect")
         .attr("class", "bar")
         .attr("x", function(d: any) { return xScale(d.timestamp); })
         .attr("y", function(d: any) { return yScale(d.energy); })
         .attr("width", xScale.bandwidth())
         .attr("height", function(d: any) { return height - yScale(d.energy); })
         .attr("fill", "#A5A9FF");

        g.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(xScale))
          .append("text")
          .attr("y", height - 260)
          .attr("x", width - 100)
          .attr("text-anchor", "end")
          .attr("stroke", "#2E0B49")
          .text("Timestamp");

        g.append("g")
          .call(d3.axisLeft(yScale)
          .tickFormat(function(d: any) {
              return d;
          }).ticks(10))
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "-4.1em")
          .attr("text-anchor", "end")
          .attr("stroke", "#2E0B49")
          .text("Energy");
      };

      return { voiceWaveImg, livingRoomLamp1Focused, apartmentImg, houseImg, apartment, tableFocused, sofaFocused };
    },
    components: {
    SpeechInput,
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
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
        border-radius: 10px;
        padding: 10px;
        height: 75%;
      }
    }

    .appliances {
      grid-row: span 5;
      order: 1;
      border-color: transparent;

      .appliances__all-devices {
        background-color: var(--color-secondary);
        border-radius: 10px;
        height: 130px;
        display: flex;
        padding: 20px;
        width: calc(100% - 60px);
        margin: auto;

        .appliances__house-text {
          color: var(--color-light);
          text-transform: uppercase;
          font-weight: bold;
        }

        .appliances__house-toggle {
          height: 100%;
          width: 50%;
          border-radius: 10px;
          background: rgba(250,250,250,0.3);
          display: flex;
          flex-direction: column;
          margin-left: 10px;

          p {
            text-transform: uppercase;
            margin-bottom: 5px;
            font-size: 15px;
          }

          .appliances__house-toggle-nr {
            width: calc(100% - 20px);
            height: 50px;
            background-color: var(--color-light);
            font-weight: bold;
            color: #A5A9FF;
            margin: 0 auto;
            margin-bottom: 10px;
            line-height: 50px;
            border-radius: 10px;
          }
        }
      }

      .selected {
        &.appliances__all-devices {
          background-color: #F7B634;

          .appliances__house-text {
            color: var(--color-secondary);
          }

          .appliances__house-icon {
            fill: var(--color-secondary);
          }

          .appliances__house-toggle {
            flex-direction: column-reverse;
            .appliances__house-toggle-nr {
              margin: 0 auto;
              margin-bottom: 0;
              margin-top: 10px;
            }
          }
        }
      }
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
      margin-top: 40px;

      .sidebar__energy-viz {
        background-color: var(--color-light);
        border: 1px solid transparent;
        border-radius: 10px;
        height: 100%;
        margin: 20px;
        position: relative;
      }
      
      .sidebar__energy-viz-svg {
        z-index: 5;
      }
    }
}
</style>
