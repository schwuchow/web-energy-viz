import * as d3 from "d3";
import { timeFormat } from "d3-time-format";

export const showHierarchicalBarChart = (data: any, date: string) => {
  console.log(data);

  resetVisualization();

  // set the dimensions and margins of the graph
  var margin = {top: 50, right: 10, bottom: 150, left: 130},
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

  const values = data.map((d: any) => d.sum);
  const maxDomain = Math.max(...values);

  const rankedData = data.sort(function(obj1: any, obj2: any) {
    if (obj1.sum < obj2.sum) return 1;
    if (obj1.sum > obj2.sum) return -1;
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

  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + margin.top + 20)
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .text("Power (kW)");


  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(rankedData.map(function(d: any) { return d.name; }))
    .padding(.1);

  svg.append("g")
    .call(d3.axisLeft(y));

  // Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -margin.top + 70)
    .attr("y", -margin.left + 90)
    .style("font-size", "11px")
    .style("font-weight", "bold")
    .text("Device");

  //Bars
  svg.selectAll("rect")
    .data(rankedData)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d:any) { return y(d.name)!; })
    .attr("height", y.bandwidth() )
    .attr("fill", "#A5A9FF");


  // Animation
  svg.selectAll("rect")
    .transition()
    .duration(800)
    .attr("y", function(d: any) { return y(d.name)!; })
    .attr("width", function(d: any) { return x(d.sum); })
    .attr("height", y.bandwidth() )
    .delay(function(d: any,i){ return(i * 100) });


  // Date Label
  svg.append("text")
    .style("fill", "#2E0B49")
    .style("font-size", 20)
    .attr("x", margin.left)
    .attr("y", -margin.top + 30)
    .text(date);
};

export const showRadialBarChart = (data: any, name: string) => {
  console.log(data);

  resetVisualization();

  // set the dimensions and margins of the graph
  const margin = {top: -20, right: 10, bottom: 10, left: 10},
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
      .attr("dy", "-2.5em")
      .style("fill", "#2E0B49")
      .text("Energy Consumption in kW (month)");

  yAxis.append("text")
    .attr("y", function(d) { return -y(y.ticks(5).pop()!); })
    .attr("dy", "-1em")
    .style("fill", "#2E0B49")
    .style("font-weight", "bold")
    .text(name);

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
      .text(function(d: any) { 
        if (total > 10000000) {
          return "T: " + Math.round(total / (1000*1000*1000*1000))  + " Tr kW"
        } else {
          return "Total: " + Math.round(total / 1000)  + " kW"
        }
      });

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

export const showScatterPlotChart = (data: any, deviceIds: string[], date: string) => {
  console.log(data);

  resetVisualization();

  const margin = {top: 60, right: 110, bottom: 60, left: 80},
  width = 380 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select(".visualization__container-svg")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const values = data.map((d: any) => d.values.map(({Day, Value}: any) => +Value));
  const flattenValues = values.flat();
  const maxDomain = Math.max(...flattenValues);
  const minDomain = Math.min(...flattenValues);

  const colors: any = d3.scaleOrdinal()
      .domain(deviceIds)
      .range(d3.schemeSet2);

  let sortedDateByDate: any[] = [];

  data.forEach((deviceData: any) => {
    const sortedValues = deviceData.values.sort(function(obj1: any, obj2: any) {
      return obj1.Date - obj2.Date;
    });

    sortedDateByDate.push({ name: deviceData.name, values: sortedValues });
  });

  const formatDate: any = d3.timeFormat("%d.%m");
  const minDateDomain = sortedDateByDate[0].values[0].Date;
  const maxDateDomain = sortedDateByDate[0].values[sortedDateByDate[0].values.length-1].Date;

  const x = d3.scaleUtc()
    .domain([minDateDomain, maxDateDomain])
    .range([ 0, width ]);

  const xAxis = d3.axisBottom(x)
    .tickValues(sortedDateByDate[0].values.map((d: any) => d.Date))
    .tickFormat(formatDate);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width + 40)
    .attr("y", height + 5)
    .style("font-size", "9px")
    .style("font-weight", "bold")
    .text("Date");

  // Add Y axis
  const y = d3.scaleLinear()
    .domain( [minDomain, maxDomain])
    .range([ height, 0 ]);

  svg.append("g")
  .call(d3.axisLeft(y)
  .tickFormat(function (d: any) {
    if (d > 1000000) {
      return d / (1000 * 1000) + "M";
    } else {
      return d;
    }
  }));
  
  // Add Y axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -margin.top + 70)
    .attr("y", -margin.left + 70)
    .style("font-size", "9px")
    .style("font-weight", "bold")
    .text("Power (kW)");

  // Add the lines
  const line: any = d3.line()
      .x((d: any) => x(d.Date))
      .y((d: any) => y(d.Value))

  svg.selectAll("myLines")
    .data(sortedDateByDate)
    .enter()
    .append("path")
      .attr("d", function(d: any){ return line(d.values) } )
      .attr("stroke", function(d: any){ return colors(d.name) })
      .style("stroke-width", 2)
      .style("fill", "none")

  // Add the points
  svg.selectAll("myDots")
  .data(sortedDateByDate)
  .enter()
    .append('g')
    .style("fill", function(d: any){ return colors(d.name) })
  // Second we need to enter in the 'values' part of this group
  .selectAll("myPoints")
  .data(function(d: any){ return d.values })
  .enter()
  .append("circle")
    .transition()
    .duration(300)
    .attr("cx", function(d: any) { return x(d.Date) } )
    .attr("cy", function(d: any) { return y(d.Value) } )
    .attr("r", 4)
    .attr("stroke", "white")
    .attr("stroke-width", 1.5)
    .delay(function(d: any, i){ return (i * 50) });

  // Add a legend at the end of each line
  let shiftTop = 0;

  svg
    .selectAll("myLabels")
    .data(sortedDateByDate)
    .enter()
      .append('g')
      .append("text")
        // keep only the last value of each time series
        .datum(function(d: any) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        // Put the text at the position of the last point
        .attr("transform", function(d) { return "translate(" + x(d.value.Date) + "," + y(d.value.Value) + ")"; })
        .attr("x", 12) // shift the text a bit more right
        .attr("y", function(d: any) {
          if (d.value.Value < 10000) {
            const newPosY = -20 * shiftTop - 10;
            shiftTop++;
            return newPosY;
          } else {
            return -10;
          }
         }) // shift the text a bit more top
        .text(function(d) { return d.name; })
        .style("fill", function(d){ return colors(d.name) })
        .style("font-size", 10)

  // Date Label
  svg.append("text")
    .style("fill", "#2E0B49")
    .style("font-size", 16)
    .attr("x", 0)
    .attr("y", -margin.top + 30)
    .text(`Energy Consumption (${date})`);
};

export const showSinglePointData = (data: any, date: string) => {
  console.log(data);

  resetVisualization();

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
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

  svg.append("text")
    .style("fill", "#2E0B49")
    .style("font-size", 20)
    .attr("x",width / 2 - (margin.left + margin.right))
    .attr("y", margin.top + 10)
    .text(date);


  svg.selectAll(".device-text")
    .data(data)
    .enter()
    .append("text")
      .style("fill", "#2E0B49")
      .style("font-size", 22)
      .style("font-weight", "bold")
      .attr("class", "device-text")
      .attr("transform", "translate(10,50)")
      .attr("y", function(d: any, index: number) { return 40 * (index + 1) })
      .text(function(d: any) {
        if (d.Value > 1000000000) {
          return `${d.name}: ${d.Value / (1000*1000*1000)} Tr kW`
        } else {
          return `${d.name}: ${d.Value} kW`
        }
      });
}

const resetVisualization = () => {
  d3.select(".visualization__container-svg").html("");
};
