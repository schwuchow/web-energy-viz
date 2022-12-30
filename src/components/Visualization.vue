<template>
<div class="visualization col-3">
  <h3>Data Visualization</h3>
  <div class="visualization__container">
    <svg class="visualization__container-svg" width="370" height="400"></svg>
    {{ visualization }}
  </div>
</div>
</template>
  
<script lang="ts">
import { onMounted, watch } from 'vue';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';
import { showHierarchicalBarChart, showRadialBarChart, showScatterPlotChart  } from '../visualizations';
import { Visualization } from '../types/interfaces';
import { TimePeriod } from '../types/enums';
// @ts-ignore
import dataset from '../datasets/data.csv';

export default {
  setup() {
    const store = useDevicesStore();
		const { visualization } = storeToRefs(store);

    onMounted(() => {
      getCurrentDay();
    });

    const getCurrentDay = (): number => {
      const today = new Date(Date.now());
      const dayOfToday = today.getDate();
      console.log("Today's day: ", dayOfToday);
      return dayOfToday;
    };

    watch(visualization, (value) => {
      if (value !== null) setVisualization(value);
    })

    const setVisualization = (visualization: Visualization) => {
      if (!visualization.ranking && visualization.deviceIds.length === 1 && visualization.timePeriod === TimePeriod.LAST_MONTH) {
        const deviceId = visualization.deviceIds[0];
        var data = dataset.map((d: any) => ({ Day: d.Day, Value: d[deviceId] }));
        showRadialBarChart(data, deviceId);
      }

      if (!visualization.ranking && visualization.timePeriod !== TimePeriod.LAST_MONTH) {
        const deviceId = visualization.deviceIds[0];
        // const data = newData.map((d: any) => ({ Day: d.Day, Value: d[deviceId1] }));
        var data = dataset.filter((d: any, index: number) => {
          if (index < 7) return d;
        }).map((d: any) => {
          return ({ Day: d.Day, Value: d[deviceId] });
        });
        showScatterPlotChart(data);
      }

      if (visualization.ranking && visualization.deviceIds.length > 1) {
        var data = [];

        visualization.deviceIds.forEach(id => {
          const sum = calcSumOfConsumption(id);
          data.push({id: id, sum: sum});
        })

        showHierarchicalBarChart(data);
      }
    };

    const calcSumOfConsumption = (id: string) => {
      const deviceData = dataset.map((d: any) => d[id]);
      const initialValue = 0;
      const sum = deviceData.reduce(
        (accumulator: number, currentValue: string) => accumulator + parseInt(currentValue),
        initialValue
      );

      return sum;
    };

    return { visualization };
  }
}
</script>

<style lang="scss" scoped>
.visualization {
  grid-row: span 5;
  margin-top: 40px;

  .visualization__container {
    background-color: var(--color-light);
    border: 1px solid transparent;
    border-radius: 10px;
    height: 100%;
    margin: 20px;
    position: relative;
  }
  
  .visualization__container-svg {
    z-index: 5;
  }
}
</style>