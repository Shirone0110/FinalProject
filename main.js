var Wagegap = function(d)
{
    return parseFloat(d.Percent);
}

d3.csv("Data/Wagegap.csv", Wagegap).then(function(data)
{
    console.log(data);
    setup(data);
})

var setIndustry = function(d)
{
    return {
        Industry: d.Industry,
        WomenEarning: parseFloat(d.Womensearnings),
        MenEarning: parseFloat(d.Mensearnings),
        PercentEarning: parseFloat(d.Womensearnings) / parseFloat(d.Mensearnings) * 100,
        NoWomen: parseFloat(d.Numberofwomen),
        NoMen: parseFloat(d.Numberofmen),
        PercentNo: parseFloat(d.Numberofwomen) / parseFloat(d.Numberofmen) * 100
    }
}

var setOccupation = function(d)
{
    return {
        Occupation: d.Occupation,
        WomenEarning: parseFloat(d.Womenearnings),
        MenEarning: parseFloat(d.Menearnings),
        Industry: d.Industry,
        Common: d.Mostcommonfor
    }
}

var setup = function(dataset)
{
    var screen = {width: 1000, height: 600};
    var margins = {top: 50, right: 50, bottom: 50, left: 50};

    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("id", "graph1")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", false);
    
    var xScale = d3.scaleLinear()
                    .domain([0, 29])
                    .range([0, width]);
    
    var yScale = d3.scaleLinear()
                    .domain([60, 90])
                    .range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    d3.select("#graph1")
        .append("g")
        .classed("axis", "true");
    
    d3.select(".axis")
        .append("g")
        .attr("id", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    d3.select(".axis")
        .append("g")
        .attr("id", "yAxis")
        .call(yAxis);
    
    draw1(dataset, xScale, yScale);
}

var x2017, y2017, x2018, y2018;

var draw1 = function(dataset, xScale, yScale)
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
        /*.attr("id", function(num, index)
        {
            return "no" + index;
        })*/
    
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
    
    d3.select("#no27")
        .on("mouseover", function()
        {
            var label = "Click me!";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
                .classed("hidden", false);
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
    x2017 = 895;
    y2017 = 195;
    
    x2018 = 926;
    y2018 = 197;
    
    d3.select("svg")
    .on("click", function()
    {
        var x = d3.event.pageX, y = d3.event.pageY;
        console.log(x, y);
        if ((x2017 - x) * (x2017 - x) + (y2017 - y) * (y2017 - y) <= 9)
        {
            d3.csv("Data/Industry.csv", setIndustry).then(function(data1)
            {
                //console.log(data1);
                d3.csv("Data/Occupation.csv", setOccupation).then(function(data2)
                {
                    //console.log(data2);
                    var hash = {};
                    data1.forEach(function(element)
                    {
                        hash[element.Industry] = element;
                    })

                    data2.forEach(function(e2)
                    {
                        //console.log(e2.Industry);
                        hash[e2.Industry].Occ = e2;
                    })
                })
                console.log(data1);
                setup2(data1);
            })
        }
    })
}

var setup2 = function(dataset)
{
    var screen = {width: 1000, height: 800};
    var margins = {top: 50, right: 50, bottom: 50, left: 300};

    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("id", "graph2")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", false);
    
    d3.select("#graph1")
        .classed("hidden", true);
    
    var yScale = d3.scaleBand()
        .domain(dataset.map(function(d){return d.Industry;}))
        .range([0, height])
    
    var lowxScale = d3.scaleLinear()
        .domain([0, 110])
        .range([0, width])
    
    var NumyScale = d3.scaleLinear()
        .domain([0, 14])
        .range([5, height - 45])
    
    var highxScale = d3.scaleLinear()
        .domain([0, 280])
        .range([0, width])
    
    var lowxAxis = d3.axisBottom(lowxScale);
    var yAxis = d3.axisLeft(yScale);
    var highxAxis = d3.axisTop(highxScale);
    
    d3.select("#graph2")
        .append("g")
        .classed("graph2axis", "true");
    
    d3.select(".graph2axis")
        .append("g")
        .attr("id", "lowxAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(lowxAxis)
        .attr("font-size", 14);
    
    d3.select(".graph2axis")
        .append("g")
        .attr("id", "graph2yAxis")
        .call(yAxis)
        .attr("font-size", 14);
    
    d3.select(".graph2axis")
        .append("g")
        .attr("id", "highxAxis")
        .call(highxAxis)
        .attr("font-size", 14);
    
    d3.selectAll(".tick text").on("mouseover", function(d)
    {
        console.log(d);
    })
    
    draw2(dataset, lowxScale, highxScale, NumyScale);
}

var draw2 = function(dataset, lowxScale, highxScale, yScale)
{   
    d3.select("#graph2")
        .append("g")
        .attr("id", "PercentEarning")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function(d, i)
        {
            return yScale(i) + 20;
        })
        .attr("height", 20)
        .attr("width", function(d)
        {
            return lowxScale(d.PercentEarning);
        })
        .attr("fill", "red")
    
    d3.select("#graph2")
        .append("g")
        .attr("id", "PercentNo")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function(d, i)
        {
            return yScale(i);
        })
        .attr("height", 20)
        .attr("width", function(d)
        {
            return highxScale(d.PercentNo);
        })
        .attr("fill", "blue")
}