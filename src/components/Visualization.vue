<template>
<div class="visualization col-3">
  <h3>Data Visualization</h3>
  <div class="visualization__container">
    <svg class="visualization__container-svg" width="370" height="400"></svg>
  </div>
</div>
</template>
  
<script lang="ts">
import * as d3 from "d3";
// @ts-ignore
import refrigeratorData from '../datasets/data.tsv';
import { onMounted } from 'vue';

export default {
  setup() {
    onMounted(() => {
      showBarVisualization();
    })

    const showBarVisualization = () => {
      console.log(refrigeratorData);
      refrigeratorData.forEach((d: any) => {
        d.timestamp = new Date(d.timestamp).getSeconds();
      });

      var svg = d3.select(".visualization__container-svg"),
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
        // @ts-ignore
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

    return { };
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