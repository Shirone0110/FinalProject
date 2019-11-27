var Wagegap = function(d)
{
    return parseFloat(d.Percent);
}

d3.csv("Data/Wagegap.csv", Wagegap).then(function(data)
{
    console.log(data);
    setup(data);
})

var screen = {width: 1000, height: 600};
var margins = {top: 50, right: 50, bottom: 50, left: 50};

var setup = function(dataset)
{
    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("id", "graph1")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    var xScale = d3.scaleLinear()
                    .domain([0, 29])
                    .range([0, width]);
    
    var yScale = d3.scaleLinear()
                    .domain([60, 90])
                    .range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    d3.select("svg")
        .append("g")
        .classed("axis", "true");
    
    d3.select(".axis")
        .append("g")
        .attr("id", "xAxis")
        .attr("transform", "translate(" + margins.left + "," + (margins.top + height) + ")")
        .call(xAxis);
    
    d3.select(".axis")
        .append("g")
        .attr("id", "yAxis")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .call(yAxis);
    
    draw(dataset, xScale, yScale);
}

var draw = function(dataset, xScale, yScale)
{
    //console.log(dataset);
    d3.select("#graph1")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", "black")
        .attr("cx", function(num, index)
        {
            return xScale(index);
        })
        .attr("cy", function(num)
        {
            return yScale(num);
        })
        .attr("r", 3)
        .attr("id", function(num, index)
        {
            return index;
        })
    
    var line = d3.select("#graph1")
        .append("g")
        .attr("id", "line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
    
    var lineGenerator = d3.line()
        .x(function(num, index){return xScale(index)})
        .y(function(num){return yScale(num)})
        .curve(d3.curveNatural);
    
    line.append("path")
        .datum(dataset)
        .attr("d", lineGenerator);
}