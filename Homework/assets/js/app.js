var svgWidth = 1000;
var svgHeight = 600;

var margin = {
  top: 100,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(cenData) {
  // if (error) return console.warn(error);
  // console.log(cenData)
  // parse data
  cenData.forEach(function(data) {
    data.age = +data.age;
    data.healthcare = +data.healthcare;
    data.poverty = +data.poverty;
    var circleLable = data.abbr;
    console.log(circleLable, data.poverty, data.healthcare)
  }); 

  // create x scale
  var xLinearScale = d3.scaleLinear()
    .domain([6, d3.max(cenData, data => data.poverty)])
    .range([0, width]);

  // Create y scale function d3.max(cenData, d => d.healthcare)
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(cenData, data => data.healthcare)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(cenData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    .classed("stateCircle", true)
    .attr("fill", "green")
    .attr("opacity", ".5");

  chartGroup.selectAll("text.test")
    .data(cenData)
    .enter()
    .append("text")
    .text((d) => d.abbr)
    .attr("font-size", "10px")
    .attr("font-weight", "bold")
    .attr("font-color", "white")
    .attr("x", d => xLinearScale(d.poverty) - 7)
    .attr("y", d => yLinearScale(d.healthcare) + 4) 
  });

  chartGroup.append("text")
    .attr("x", 380)
    .attr("y", 470)
    .attr("font-weight", "bold")
    .attr("font-size", "20px")
    .attr("font-family", "sans-serif")
    .classed("axis-text", true)
    .text("Poverty (Percentage)");

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("font-weight", "bold")
    .attr("font-size", "20px")
    .attr("font-family", "sans-serif")
    .classed("axis-text", true)
    .text("% lack Healthcare");

