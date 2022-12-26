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
import * as d3 from "d3";
// @ts-ignore
// import refrigeratorData from '../datasets/data.tsv';
import washingMashineData from '../datasets/data.csv';
import { onMounted } from 'vue';
import { useDevicesStore } from '../store';
import { storeToRefs } from 'pinia';

// TODO Build Visualization for whole month
// TODO Build Visualization for last week
// TODO Build Visualization for yesterday

export default {
  setup() {
    const store = useDevicesStore();
		const { visualization } = storeToRefs(store);

    onMounted(() => {
      getCurrentDay();
      showRadialStackedBarChart();
      // showBarVisualization();
    });

    const getCurrentDay = (): number => {
      const today = new Date(Date.now());
      const dayOfToday = today.getDate();
      console.log("Today's day: ", dayOfToday);
      return dayOfToday;
    };

    const showRadialStackedBarChart = () => {
      // set the dimensions and margins of the graph
      const margin = {top: 10, right: 10, bottom: 10, left: 10},
          width = 370 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom,
          innerRadius = 40,
          outerRadius = Math.min(width, height) / 4;

      // append the svg object to the body of the page
      const svg = d3.select(".visualization__container-svg")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + ( height / 2 ) + ")");

      console.log(washingMashineData);

      // X scale
      const x = d3.scaleBand()
          .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
          .domain( washingMashineData.map(function(d: any) { return d.Day; }) ); // The domain of the X axis is the list of days.

      // Y scale
      const y = d3.scaleRadial()
          .range([innerRadius, outerRadius])
          .domain([0, 1500000]); // Domain of Y is from 0 to the max seen in the data

      const arc = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(function(d: any) { return y(d.Value); })
                    .startAngle(function(d: any) { return x(d.Day)!; })
                    .endAngle(function(d: any) { return x(d.Day)! + x.bandwidth(); })
                    .padAngle(0.01)
                    .padRadius(innerRadius);

      // Add bars
      svg.append("g")
        .selectAll("path")
        .data(washingMashineData)
        .enter()
        .append("path")
          .attr("fill", "#A5A9FF")
          .attr("d", arc as any);
    };

    // const showBarVisualization = () => {
    //   console.log(refrigeratorData);
    //   refrigeratorData.forEach((d: any) => {
    //     d.timestamp = new Date(d.timestamp).getSeconds();
    //   });

    //   var svg = d3.select(".visualization__container-svg"),
    //   margin = 100,
    //   width = parseInt(svg.attr("width")) - margin,
    //   height = parseInt(svg.attr("height")) - margin;


    //   var xScale = d3.scaleBand().range ([0, width]).padding(0.4),
    //       yScale = d3.scaleLinear().range ([height, 0]);

    //   var g = svg.append("g")
    //             .attr("transform", "translate(" + 50 + "," + 50 + ")");

    //   xScale.domain(refrigeratorData.map(function(d: any) { return d.timestamp; }));
    //   yScale.domain([60, d3.max(refrigeratorData as Iterable<any>, function(d: any) { return d.energy; })]);

    //   g.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale));

    //     g.selectAll(".bar")
    //     .data(refrigeratorData)
    //     .enter().append("rect")
    //     .attr("class", "bar")
    //     // @ts-ignore
    //     .attr("x", function(d: any) { return xScale(d.timestamp); })
    //     .attr("y", function(d: any) { return yScale(d.energy); })
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", function(d: any) { return height - yScale(d.energy); })
    //     .attr("fill", "#A5A9FF");

    //   g.append("g")
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale))
    //     .append("text")
    //     .attr("y", height - 260)
    //     .attr("x", width - 100)
    //     .attr("text-anchor", "end")
    //     .attr("stroke", "#2E0B49")
    //     .text("Timestamp");

    //   g.append("g")
    //     .call(d3.axisLeft(yScale)
    //     .tickFormat(function(d: any) {
    //         return d;
    //     }).ticks(10))
    //     .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", "-4.1em")
    //     .attr("text-anchor", "end")
    //     .attr("stroke", "#2E0B49")
    //     .text("Energy");
    // };

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