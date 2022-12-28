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
import { onMounted } from 'vue';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';
import { showHierarchicalBarChart, showRadialBarChart, showScatterPlotChart  } from '../visualizations';

export default {
  setup() {
    const store = useDevicesStore();
		const { visualization } = storeToRefs(store);

    onMounted(() => {
      getCurrentDay();
      showHierarchicalBarChart();
      // showRadialBarChart();
      // showScatterPlotChart();
    });

    const getCurrentDay = (): number => {
      const today = new Date(Date.now());
      const dayOfToday = today.getDate();
      console.log("Today's day: ", dayOfToday);
      return dayOfToday;
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