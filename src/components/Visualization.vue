<template>
<div class="visualization col-3">
  <h2>Data Visualization</h2>
  <div class="visualization__container">
    <svg class="visualization__container-svg" width="370" height="400"></svg>
    <!-- {{ visualization }} -->
  </div>
</div>
</template>
  
<script lang="ts">
import { watch } from 'vue';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';
import { showHierarchicalBarChart, showRadialBarChart, showScatterPlotChart, showSinglePointData  } from '../visualizations';
import { Visualization, TimeFrame } from '../types/interfaces';
import { TimePeriod } from '../types/enums';
// @ts-ignore
import dataset from '../datasets/data.csv';

export default {
  setup() {
    const store = useDevicesStore();
		const { devices, visualization, date } = storeToRefs(store);

    watch(visualization, (value) => {
      if (value !== null) setVisualization(value);
    });

    const setVisualization = (visualization: Visualization) => {
      const rules = {
        hasRankingOfMultipleDevices: visualization.ranking && visualization.deviceIds.length > 1,
        hasOneDeviceAndOneMonthPeriod: !visualization.ranking && visualization.deviceIds.length === 1 && 
          visualization.timePeriod === TimePeriod.LAST_MONTH,
        hasShortTimePeriod: !visualization.ranking && visualization.timePeriod === TimePeriod.LAST_WEEK,
        isSinglePointData: !visualization.ranking && visualization.timePeriod === TimePeriod.TODAY || visualization.timePeriod === TimePeriod.YESTERDAY
      };

      if (rules.hasRankingOfMultipleDevices) {
        var data: any = [];

        visualization.deviceIds.forEach(id => {
          const name = devices.value.get(id)?.name;

          if (visualization.timePeriod === TimePeriod.LAST_MONTH || visualization.timePeriod === TimePeriod.LAST_WEEK) {
            const sum = calcSumOfConsumption(id);
            data.push({ sum, name });
          } else if (visualization.timePeriod === TimePeriod.TODAY || visualization.timePeriod === TimePeriod.YESTERDAY) {
            const time = timeFrame(visualization.timePeriod);
            const day = dataset.find((d: any) => {
              return parseInt(d.Day) === time
            });
            const sum = kiloWatt(day[id]);
            data.push({ sum, name });
          }
        })

        showHierarchicalBarChart(data, visualization.timePeriod);

      } else if (rules.isSinglePointData) {
        const time = timeFrame(visualization.timePeriod);
        const deviceIds = visualization.deviceIds;

        var dayData = dataset.filter((d: any) => {
          if (parseInt(d.Day) === time) return d;
        });

        var data: any = [];

        deviceIds.forEach((id: string) => {
          const name = devices.value.get(id)?.name;

          data.push({ id, name, Value:  kiloWatt(dayData[0][id]) });
        });

        showSinglePointData(data, visualization.timePeriod);

      } else if (rules.hasOneDeviceAndOneMonthPeriod) {
        const deviceId = visualization.deviceIds[0];
        const name = devices.value.get(deviceId)?.name;
        var data = dataset.map((d: any) => ({ Day: d.Day, Value: kiloWatt(d[deviceId]) }));

        showRadialBarChart(data, name!);

      } else if (rules.hasShortTimePeriod) {
        const deviceIds = visualization.deviceIds;
        const time = timeFrame(visualization.timePeriod) as TimeFrame;

        var data: any = deviceIds.map((id: string) => {
            const name = devices.value.get(id)?.name;

            return {
              name: name,
              values: dataset.filter((d: any, index: number) => {
                if (inTimeFrame(time, index)) return d;
              }).map((d: any) => ({ Day: d.Day, Value: kiloWatt(d[id]), Date: createDate(time, parseInt(d.Day)) }))
            };
        });

        showScatterPlotChart(data, deviceIds, visualization.timePeriod);
      }
    };

    const calcSumOfConsumption = (id: string) => {
      const deviceData = dataset.map((d: any) => d[id]);
      const initialValue = 0;
      const sum = deviceData.reduce(
        (accumulator: number, currentValue: string) => accumulator + kiloWatt(currentValue),
        initialValue
      );

      return sum;
    };

    const timeFrame = (timePeriod: TimePeriod): number | TimeFrame => {
      const today = date.value.day;

      switch(timePeriod) {
        case TimePeriod.TODAY:
          return today;
        case TimePeriod.YESTERDAY:
          if (today === 1) return 31;
          else return today - 1;
        case TimePeriod.LAST_WEEK:
          let startDate;
          let endDate;

          if (today > 7) {
            startDate = today - 7;
            endDate = today;
            return { startDate, endDate };
          }
          else {
            let daysLeft = 7;
            let dayOfToday = today;
            while (dayOfToday > 0 ) {
              dayOfToday -= 1;
              daysLeft -= 1;
            }
            startDate = 31 - daysLeft;
            endDate = today;
            console.log(startDate, endDate);
            return { startDate, endDate };
          }
        case TimePeriod.LAST_MONTH:
          return 31;
        default: return today;
      };
    };

    const createDate = (timObj: TimeFrame, day: number): Date => {
      let newDate;

      if (timObj.endDate < timObj.startDate) {
        if (timObj.startDate < day) {
          newDate = new Date(date.value.year, date.value.month -1, day);
        } else {
          newDate = new Date(date.value.year, date.value.month, day);
        }
      } else {
        newDate = new Date(date.value.year, date.value.month, day);
      }

      console.log(newDate);

      return newDate;
    };

    const inTimeFrame = (timeObj: TimeFrame, index: number): boolean => {
        const { startDate, endDate } = timeObj;
        return index >= startDate || index < endDate;
    };

    const kiloWatt = (value: string) => {
      return  Math.round(+value / 1000);
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