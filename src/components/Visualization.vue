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
      // showHierarchicalBarChart();
      showRadialStackedBarChart();
    });

    const getCurrentDay = (): number => {
      const today = new Date(Date.now());
      const dayOfToday = today.getDate();
      console.log("Today's day: ", dayOfToday);
      return dayOfToday;
    };

    const showHierarchicalBarChart = () => {
      // set the dimensions and margins of the graph
      var margin = {top: 10, right: 10, bottom: 110, left: 30},
          width = 370 - margin.left - margin.right,
          height = 450 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg = d3.select(".visualization__container-svg")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

      const data = washingMashineData.slice(0, 32);
      const values = data.map((d: any) => d.Value);
      const maxDomain = Math.max(...values);

      const rankedData = data.sort(function(obj1: any, obj2: any) {
        if (obj1.Value < obj2.Value) return 1;
        if (obj1.Value > obj2.Value) return -1;
        return 0;
      });

      console.log(rankedData);

      // Add X axis
      var x = d3.scaleLinear()
        .domain([0, maxDomain])
        .range([ 0, width]);

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");

      // Y axis
      var y = d3.scaleBand()
        .range([ 0, height ])
        .domain(rankedData.map(function(d: any) { return d.Day; }))
        .padding(.1);

      svg.append("g")
        .call(d3.axisLeft(y));

      //Bars
      svg.selectAll("rect")
        .data(rankedData)
        .enter()
        .append("rect")
        .attr("x", x(0) )
        .attr("y", function(d:any) { return y(d.Day)!; })
        .attr("width", function(d: any) { return x(d.Value); })
        .attr("height", y.bandwidth() )
        .attr("fill", "#A5A9FF")
    };

    const showRadialStackedBarChart = () => {
      // set the dimensions and margins of the graph
      const margin = {top: 10, right: 10, bottom: 10, left: 10},
          width = 370 - margin.left - margin.right,
          height = 450 - margin.top - margin.bottom,
          innerRadius = 80,
          outerRadius = Math.min(width, height) / 2;

      // append the svg object to the body of the page
      const svg = d3.select(".visualization__container-svg")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + ( height / 2) + ")");

      const data = washingMashineData.slice(0, 32);

      console.log(data);

      // X scale
      const x = d3.scaleBand()
          .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
          .domain( data.map(function(d: any) { return d.Day; }) ); // The domain of the X axis is the list of days.

      // Y scale
      const values = data.map((d: any) => d.Value);
      const maxDomain = Math.max(...values);
      const y = d3.scaleRadial()
          .range([innerRadius, outerRadius])
          .domain([0, maxDomain]); // Domain of Y is from 0 to the max seen in the data

      // arc
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
        .data(data)
        .enter()
        .append("path")
          .attr("fill", "#A5A9FF")

      // Animation
      svg.selectAll("path")
        .transition()
        .duration(300)
        .attr("y", function(d: any) { return y(d.Value)!; })
        .attr("d", arc as any)
        .delay(function(d: any,i){ return(i * 50) })


      // Add circles with labels and title
      var yAxis = svg.append("g")
      .attr("text-anchor", "middle");

      var yTick = yAxis
        .selectAll("g")
        .data(y.ticks(5).slice(1))
        .enter().append("g");

      yTick.append("circle")
          .attr("fill", "none")
          .attr("stroke", "#A5A9FF")
          .attr("r", y);

      yTick.append("text")
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .attr("fill", "none")
          .attr("stroke", "#fff")
          .attr("stroke-width", 5)
          .text(y.tickFormat(5, "s"));

      yTick.append("text")
          .attr("y", function(d) { return -y(d); })
          .attr("dy", "0.35em")
          .style("font", "9px times")
          .style("fill", "#2E0B49")
          .text(y.tickFormat(5, "s"));

      yAxis.append("text")
          .attr("y", function(d) { return -y(y.ticks(5).pop()!); })
          .attr("dy", "-1em")
          .style("fill", "#2E0B49")
          .text("Energy Consumption (month)");

      // Add day labels
      const label = svg.append("g")
                        .selectAll("g")
                        .data(data)
                        .enter().append("g")
                          .attr("text-anchor", "middle")
                          .attr("transform", function(d: any) { return "rotate(" + ((x(d.Day)! + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")translate(" + innerRadius + ",0)"; });

      label.append("line")
          .attr("x2", -5)
          .attr("stroke", "#2E0B49");

      label.append("text")
          .style("font", "9px times")
          .style("fill", "#2E0B49")
          .attr("transform", function(d: any) { return (x(d.Day)! + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI ? "rotate(90)translate(0,16)" : "rotate(-90)translate(0,-9)"; })
          .text(function(d: any) { return d.Day; });


      let total = 0;
      data.map((d: any) => {
        total += parseInt(d.Value);
      });

      svg.append("text")
          .style("font", "16px times")
          .style("fill", "#2E0B49")
          .attr("transform", "translate(-50, 0)")
          .text(function(d: any) { return "Total: " + total });


      // Add the labels
      // svg.append("g")
      //     .selectAll("g")
      //     .data(data)
      //     .enter()
      //     .append("g")
      //       .attr("text-anchor", function(d: any) { return (x(d.Day)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      //       .attr("transform", function(d: any) { return "rotate(" + ((x(d.Day)! + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d.Value)!+10) + ",0)"; })
      //     .append("text")
      //       .text(function(d: any){return(d.Day)})
      //       .attr("transform", function(d: any) { return (x(d.Day)! + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      //       .style("font-size", "11px")
      //       .attr("alignment-baseline", "middle");
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