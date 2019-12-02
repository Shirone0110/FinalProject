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
        PercentEarning: (parseFloat(d.Womensearnings) / parseFloat(d.Mensearnings) * 100).toFixed(2),
        NoWomen: parseFloat(d.Numberofwomen),
        NoMen: parseFloat(d.Numberofmen),
        PercentNo: (parseFloat(d.Numberofwomen) / parseFloat(d.Numberofmen) * 100).toFixed(2)
    }
}

var setOccupation = function(d)
{
    return {
        Occupation: d.Occupation,
        WomenEarning: parseFloat(d.Womenearnings),
        MenEarning: parseFloat(d.Menearnings),
        Industry: d.Industry,
        Common: d.Mostcommonfor,
        Percent: (parseFloat(d.Womenearnings) / parseFloat(d.Menearnings) * 100).toFixed(2)
    }
}

var setWagegrowth = function(d)
{
    return {
        Age: parseFloat(d.Age),
        Paymale: parseFloat(d.Medianpaymale),
        Payfemale: parseFloat(d.Medianpayfemale),
        Growthmale: parseFloat(d.wagegrowthmale),
        Growthfemale: parseFloat(d.wagegrowthfemale)
    }
}

var setAgegroup = function(d) 
{
    return {
        Start: parseFloat(d.Agestart),
        End: parseFloat(d.Ageend),
        Ratio: parseFloat(d.Earningratio)
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
    
    d3.select("#graph1")
        .append("text")
        .attr("x", 90)
        .attr("y", 0 - (margins.top / 2))
        .style("font-size", "24px")
        .text("Female to male earnings ratio of workers in the U.S. from 1990 to 2018")
    
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
        .call(xAxis)
        .attr("font-size", 14);
    
    d3.select(".axis")
        .append("g")
        .attr("id", "yAxis")
        .call(yAxis)
        .attr("font-size", 14);
    
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
    
    d3.select("#graph1")
        .selectAll("circle")
        .on("mouseover", function(d, index)
        {
            var label = d.toString();
            if (index > 26) 
            {
                label = label + "\n Click me!";
            }
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
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
    
    d3.select("#graph1")
    .on("click", function()
    {
        var x = d3.event.pageX, y = d3.event.pageY;
        //console.log(x, y);
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
                        hash[element.Industry].Occ = [];
                    })

                    data2.forEach(function(e2)
                    {
                        //console.log(e2.Industry);
                        hash[e2.Industry].Occ.push(e2);
                    })
                })
                //console.log(data1);
                setup2(data1);
            })
        }
    })
    
    d3.select("svg")
        .on("click", function()
        {
            var x = d3.event.pageX, y = d3.event.pageY;
            if ((x2018 - x) * (x2018 - x) + (y2018 - y) * (y2018 - y) <= 9)
            {
                d3.csv("Data/Wagegrowth.csv", setWagegrowth).then(function(data1)
                {
                    d3.csv("Data/Agegroup.csv", setAgegroup).then(function(data2)
                    {
                        setup4(data1, data2);
                    })
                })
            }
        })
}

var setup4 = function(Wagegrowth, Agegroup)
{
    var screen = {width: 1000, height: 600};
    var margins = {top: 100, right: 50, bottom: 50, left: 50};

    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("id", "graph4")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", false);
    
    d3.select("#graph4")
        .append("text")
        .attr("x", 50)
        .attr("y", -70)
        .style("font-size", "24px")
        .text("Female to male earnings ratio of workers in the U.S. in Q4 2018, by age group")
    
    d3.select("#graph4")
        .append("text")
        .attr("x", 70)
        .attr("y", -40)
        .style("font-size", "24px")
        .text("and percent wage growth vs. 22-year-old by gender in the U.S. in 2018")
    
    d3.select("#graph1")
        .classed("hidden", true);
    
    var xScale = d3.scaleBand()
                    .domain(d3.range(16, 67))
                    .range([0, width]);
    
    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale)
        .ticks(10);
    var yAxis = d3.axisLeft(yScale);
    d3.select("#graph4")
        .append("g")
        .classed("graph4axis", "true");
    
    d3.select(".graph4axis")
        .append("g")
        .attr("id", "graph4xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    d3.select(".graph4axis")
        .append("g")
        .attr("id", "graph4yAxis")
        .call(yAxis);
    
    drawAgegroup(Agegroup, xScale, yScale);
    drawgrowth(Wagegrowth, xScale, yScale);
}

var drawAgegroup = function(dataset, xScale, yScale)
{
    d3.select("#graph4")
        .append("g")
        .attr("id", "graph4ratio")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d)
        {
            return xScale(d.Start) + 8;
        })
        .attr("y", function(d)
        {
            return yScale(d.Ratio);
        })
        .attr("height", function(d)
        {
            return yScale(100 - d.Ratio);
        })
        .attr("width", function(d)
        {
            return xScale(d.End) - xScale(d.Start);
        })
        .attr("fill", "yellow");
    
    d3.select("#graph4ratio")
        .selectAll("rect")
        .on("mouseover", function(d)
        {
            //console.log(d);
            var label = d.Ratio.toString() + "%";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
}

var drawgrowth = function(dataset, xScale, yScale)
{
    console.log(dataset);
    d3.select("#graph4")
        .append("g")
        .attr("id", "graph4femalegrowth")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", "blue")
        .attr("cx", function(d, i)
        {
            return xScale(d.Age) + 8;
        })
        .attr("cy", function(d)
        {
            return yScale(d.Growthfemale);
        })
        .attr("r", 3)
    
    d3.select("#graph4")
        .append("g")
        .attr("id", "graph4malegrowth")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", "red")
        .attr("cx", function(d)
        {
            return xScale(d.Age) + 8;
        })
        .attr("cy", function(d)
        {
            return yScale(d.Growthmale);
        })
        .attr("r", 3)
    
    d3.select("#graph4femalegrowth")
        .selectAll("circle")
        .on("mouseover", function(d)
        {
            //console.log(d);
            var label = d.Growthfemale.toString() + "%";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
    d3.select("#graph4malegrowth")
        .selectAll("circle")
        .on("mouseover", function(d)
        {
            //console.log(d);
            var label = d.Growthmale.toString() + "%";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
}

var setup2 = function(dataset)
{
    console.log(dataset);
    
    var screen = {width: 800, height: 1000};
    var margins = {top: 120, right: 50, bottom: 50, left: 300};

    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    d3.select("svg")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("id", "graph2")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", false);
    
    d3.select("#graph2")
        .append("text")
        .attr("x", 0)
        .attr("y", -90)
        .style("font-size", "24px")
        .text("Gender wage gap by industry in the U.S. in 2017")
    
    d3.select("#graph2")
        .append("text")
        .attr("x", 15)
        .attr("y", -60)
        .style("font-size", "24px")
        .text("by median weekly earnings (in U.S. dollars)")
    
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
    
    d3.selectAll(".tick text").on("click", function(d)
    {
        console.log(d);
        dataset.forEach(function(element)
        {
            if (element.Industry == d && element.Occ.length != 0)
            {
                setup3(element.Occ, screen.width, margins.top);
            }
        })
    })
    
    draw2(dataset, lowxScale, highxScale, NumyScale);
}

var insertLinebreaks = function (d) 
{
    var el = d3.select(this);
    var words = d.toString().split(' ');
    el.text('');

    for (var i = 0; i < words.length; i++) 
    {
        var tspan = el.append('tspan').text(words[i] + " ");
        if (i > 0 && (i % 3 == 0))
            tspan.attr('x', -10).attr('dy', '20');
    }
};

var setup3 = function(dataset, initwidth, margintop)
{
    var marginleft = initwidth + 50;
    d3.selectAll("#subgraph *").remove();
    
    d3.select("#subgraph")
        .style("left", marginleft + "px")
        .style("top", margintop + "px")
        .classed("hidden", false)
        .append("svg")
        .attr("id", "Occgraph")
    
    var screen = {width: 700, height: 600};
    var margins = {top: 50, right: 20, bottom: 50, left: 250};

    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    d3.select("#Occgraph")
        .attr("width", screen.width)
        .attr("height", screen.height)
        .append("g")
        .attr("id", "graph3")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", false);
    
    d3.select("#graph3")
        .append("text")
        .attr("x", -50)
        .attr("y", -20)
        .style("font-size", "24px")
        .text("Gender wage gap by occupation in the U.S. in 2017")
    
    d3.select("#graph3")
        .append("text")
        .attr("x", 0)
        .attr("y", 10)
        .style("font-size", "24px")
        .text("by median weekly earnings (in U.S. dollars)")
    
    var yScale = d3.scaleBand()
        .domain(dataset.map(function(d){return d.Occupation;}))
        .range([0, 75 * dataset.length])
    
    var xScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, width])
    
    var NumyScale = d3.scaleLinear()
        .domain([0, dataset.length])
        .range([height - 75 * dataset.length, height])
    
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
    
    d3.select("#graph3")
        .append("g")
        .classed("graph3axis", "true");
    
    d3.select(".graph3axis")
        .append("g")
        .attr("id", "graph3xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .attr("font-size", 14);
    
    d3.select(".graph3axis")
        .append("g")
        .attr("id", "graph3yAxis")
        .attr("transform", "translate(0," + (height - 75 * dataset.length) + ")")
        .call(yAxis)
        .attr("font-size", 14);
    
    d3.select("#graph3")
        .selectAll(".tick text")
        .each(insertLinebreaks);
    
    draw3(dataset, xScale, NumyScale);
}

var draw3 = function(dataset, xScale, yScale)
{
    d3.select("#graph3")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function(d, i)
        {
            return yScale(i) + 25;
        })
        .attr("height", 20)
        .attr("width", function(d)
        {
            return xScale(d.Percent);
        })
        .attr("fill", "green");
    
    d3.select("#graph3")
        .selectAll("rect")
        .on("mouseover", function(d)
        {
            //console.log(d);
            var label = d.Percent.toString() + "%";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
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
    
    d3.select("#PercentEarning")
        .selectAll("rect")
        .on("mouseover", function(d)
        {
            //console.log(d);
            var label = d.PercentEarning.toString() + "%";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
    d3.select("#PercentNo")
        .selectAll("rect")
        .on("mouseover", function(d)
        {
            //console.log(d);
            var label = d.PercentNo.toString() + "%";
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function()
        {
            d3.select("#tooltip")
                .classed("hidden", true);
        })
}