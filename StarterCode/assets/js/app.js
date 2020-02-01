var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100,
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/data.csv").then(function(healthData) {
    healthData.forEach(function(data){
        data.income = +data.income;
        data.obesity = parseFloat(data.obesity);
    });

    var xLinearScale = d3.scaleLinear()
        .domain([20, d3.max(healthData, d => d.income)])
        .range([0, width]);
    
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(healthData, d => d.obesity)])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", "1");

    // chartGroup.selectAll("text")
    //     .data(healthData)
    //     .enter()
    //     .append("text")
    //     .text(function(d) {
    //       return d.abbr;
    //     })
    //     .attr("x", function(d) {
    //       console.log(d.income);
    //       return xLinearScale(d.income)-10;
    //     })
    //     .attr("y", function(d) {
    //       console.log(d.obesity);
    //       return yLinearScale(d.obesity)+6;
    //     })
    //     .attr("font-size", "15px")
    //     .attr("fill", "#A6EB24");
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .attr("fill", "#FF5733")
      .offset([100, -100])
      .html(function(d) {
      return (`${d.abbr}<br>Income: ${d.income}<br> Obesity: ${d.obesity}`);
    });

    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

    .on("mouseout", function(data, index) {
        toolTip.hide(data);
     });

    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Level of Obesity");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Income by State");

  }).catch(function(error) {
    console.log(error);
});