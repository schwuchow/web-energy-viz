<template>
<div class="visualization col-3">
  <h2>Data Visualization</h2>
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
		const { devices, visualization } = storeToRefs(store);

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
    });

    const setVisualization = (visualization: Visualization) => {
      const rules = {
        hasRankingOfMultipleDevices: visualization.ranking && visualization.deviceIds.length > 1,
        hasOneDeviceAndOneMonthPeriod: !visualization.ranking && visualization.deviceIds.length === 1 && 
          visualization.timePeriod === TimePeriod.LAST_MONTH,
        hasShortTimePeriod: !visualization.ranking && visualization.timePeriod !== TimePeriod.LAST_MONTH,
      };

      if (rules.hasRankingOfMultipleDevices) {
        var data: any = [];

        visualization.deviceIds.forEach(id => {
          const name = devices.value.get(id)?.name;
          const sum = calcSumOfConsumption(id);
          data.push({ sum, name });
        })

        showHierarchicalBarChart(data);

      } else if (rules.hasOneDeviceAndOneMonthPeriod) {
        const deviceId = visualization.deviceIds[0];
        var data = dataset.map((d: any) => ({ Day: d.Day, Value: d[deviceId] }));

        showRadialBarChart(data, deviceId);

      } else if (rules.hasShortTimePeriod) {
        const deviceIds = visualization.deviceIds;
        const time = timeFrame(visualization.timePeriod);

        var data: any = deviceIds.map((id: any) => {
            const name = devices.value.get(id)?.name;

            return {
              name: name,
              values: dataset.filter((d: any, index: number) => {
                if (index < time) return d;
              }).map((d: any) => ({ Day: d.Day, Value: d[id] }))
            };
        });

        showScatterPlotChart(data, deviceIds);
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

    const timeFrame = (timePeriod: TimePeriod) => {
      const today = getCurrentDay();

      switch(timePeriod) {
        case TimePeriod.TODAY:
          return today;
        case TimePeriod.YESTERDAY:
          if (today === 1) return 31;
          else return today - 1;
        case TimePeriod.LAST_WEEK:
          if (today > 7) return today - 7;
          else {
            let daysLeft = 7;
            let dayOfToday = today;
            while (dayOfToday > 0 ) {
              dayOfToday -= 1;
              daysLeft -= 1;
            }
            console.log(daysLeft);
            return 31 - daysLeft;
          }
        case TimePeriod.LAST_MONTH:
          return 31;
        case TimePeriod.ALL_TIME:
          return today;
        default: return today;
      };
    };

    return { visualization };
  }
}
</script>

<style lang="scss" scoped>
.visualization {
  grid-row: span 6;
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