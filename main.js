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
        //.attr("width", screen.width)
        //.attr("height", screen.width)
        .append("g")
        .attr("id", "graph1")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", false);
    
    d3.select("#graph2")
        .classed("hidden", true);
    
    d3.select("#graph4")
        .classed("hidden", true);
    
    d3.select("#subgraph")
        .classed("hidden", true);
    
    d3.select("#graph3")
        .classed("hidden", true);
    
    d3.select("#graph1")
        .append("text")
        .attr("x", 30)
        .attr("y", 0 - (margins.top / 2))
        .style("font-size", "24px")
        .text("Female to male earnings ratio of workers in the U.S. from 1990 to 2018 (percent)")
    
    var xScale = d3.scaleBand()
        .domain(d3.range(1990, 2019))
        .range([0, width])
    
    var numxScale = d3.scaleLinear()
                    .domain([0, 29])
                    .range([0, width]);
    
    var yScale = d3.scaleLinear()
                    .domain([60, 90])
                    .range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale)
        .tickValues([1990, 1995, 2000, 2005, 2010, 2015, 2018]);
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
    
    d3.select("#graph1")
        .append("g")
        .attr("id", "circles")
    
    initialdraw1(dataset, numxScale, yScale);
    
    draw1(dataset, numxScale, yScale);
    
    d3.select("#button1")
        .on("click", function()
        {
            d3.select("#graph1")
                .classed("hidden", false);
        
            d3.select("#graph2")
                .classed("hidden", true);
            
            d3.select("#subgraph")
                .classed("hidden", true);
        
            d3.select("#graph4")
                .classed("hidden", true);
        
            d3.select("#legend")
                .classed("hidden", true);
        
            initialdraw1(dataset, numxScale, yScale);
            
            draw1(dataset, numxScale, yScale);
        })
}

var x2017, y2017, x2018, y2018;

var initialdraw1 = function(dataset, xScale, yScale)
{
    d3.selectAll("#circles *").remove();
    
    d3.select("#circles")
        .selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("fill", "black")
        .attr("cx", function(num, index)
        {
            return xScale(index) + 15;
        })
        .attr("cy", yScale(0))
        .attr("r", 0)
}

var draw1 = function(dataset, xScale, yScale)
{
    //console.log(dataset);
    
    d3.select("#circles")
        .selectAll("circle")
        .transition()
        .duration(500)
        .attr("fill", "black")
        .attr("cx", function(num, index)
        {
            return xScale(index) + 15;
        })
        .attr("cy", function(num)
        {
            return yScale(num);
        })
        .attr("r", 6)
    
    var line = d3.select("#graph1")
        .append("g")
        .attr("id", "line")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
    
    var lineGenerator = d3.line()
        .x(function(num, index){return xScale(index) + 15})
        .y(function(num){return yScale(num)})
        .curve(d3.curveNatural);
    
    line.append("path")
        .datum(dataset)
        .attr("d", lineGenerator);
    
    d3.select("#graph1")
        .selectAll("circle")
        .on("mouseover", function(d, index)
        {
            d3.select(this)
                .attr("fill", "yellow")
            
            var label = (1990 + index).toString() + "," + d.toString() + "%";
            if (index > 26) 
            {
                //label = label + "\n Click me!";
                d3.select("#clickme")
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY + 20) + "px")
                    .classed("hidden", false)
            }
            d3.select("#tooltip")
                .text(label)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 18) + "px")
                .classed("hidden", false)
        })
        .on("mouseout", function()
        {
            d3.select(this)
                .attr("fill", "black")
        
            d3.select("#tooltip")
                .classed("hidden", true);
        
            d3.select("#clickme")
                .classed("hidden", true);
        })
    
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
    
    d3.csv("Data/Wagegrowth.csv", setWagegrowth).then(function(data1)
    {
        d3.csv("Data/Agegroup.csv", setAgegroup).then(function(data2)
        {
            setup4(data1, data2);
        })
    })
    
    d3.selectAll("#legend *").remove();
    
    d3.select("#legend")
        .classed("hidden", false)
        .attr("transform", "translate(0, 0)")
    
    d3.select("#legend")
        .append("text")
        .attr("font-size", "24px")
        .attr("x", 50)
        .attr("y", 70)
        .text("See the last 2 dots!")
        .attr("fill", "black")
}

var setup4 = function(Wagegrowth, Agegroup)
{
    var screen = {width: 1000, height: 600};
    var margins = {top: 100, right: 50, bottom: 50, left: 50};

    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    
    d3.select("svg")
        //.attr("width", screen.width)
        //.attr("height", screen.height)
        .append("g")
        .attr("id", "graph4")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", true);
    
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
    
    //d3.select("#graph1")
    //    .classed("hidden", true);
    
    var xScale = d3.scaleBand()
                    .domain(d3.range(16, 67))
                    .range([0, width]);
    
    var yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);
    
    var xAxis = d3.axisBottom(xScale)
        .tickValues([16, 24, 25, 30, 34, 35, 40, 44, 45, 50, 54, 55, 60, 64, 65]);
    var yAxis = d3.axisLeft(yScale)
        //.ticks(5);
    d3.select("#graph4")
        .append("g")
        .classed("graph4axis", "true");
    
    d3.select(".graph4axis")
        .append("g")
        .attr("id", "graph4xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .style("font-size", 14);
    
    d3.select(".graph4axis")
        .append("g")
        .attr("id", "graph4yAxis")
        .call(yAxis)
        .style("font-size", 14);
    
    x2018 = 941;
    y2018 = 197;
    
    d3.select("#graph4")
        .append("g")
        .attr("id", "graph4ratio")
        .selectAll("rect")
        .data(Agegroup)
        .enter()
        .append("rect")
    
    d3.select("#graph4")
        .append("g")
        .attr("id", "graph4femalegrowth")
        .selectAll("circle")
        .data(Wagegrowth)
        .enter()
        .append("circle")
    
    d3.select("#graph4")
        .append("g")
        .attr("id", "graph4malegrowth")
        .selectAll("circle")
        .data(Wagegrowth)
        .enter()
        .append("circle")
    
    initialdrawAgegroup(Agegroup, xScale, yScale);
    initialdrawgrowth(Wagegrowth, xScale, yScale);
    
    d3.select("svg")
        .on("click", function()
        {
            var x = d3.event.pageX, y = d3.event.pageY;
            if ((x2018 - x) * (x2018 - x) + (y2018 - y) * (y2018 - y) <= 40)
            {
                d3.select("#graph1")
                    .classed("hidden", true)
                
                d3.select("#graph4")
                    .classed("hidden", false)
                
                initialdrawAgegroup(Agegroup, xScale, yScale);
                initialdrawgrowth(Wagegrowth, xScale, yScale);
                
                drawAgegroup(Agegroup, xScale, yScale);
                drawgrowth(Wagegrowth, xScale, yScale);
            }
        })
}

var initialdrawAgegroup = function(dataset, xScale, yScale)
{
    d3.select("#graph4ratio")
        .selectAll("rect")
        .attr("x", function(d)
        {
            return xScale(d.Start) + 8;
        })
        .attr("y", yScale(0))
        .attr("height", 0)
        .attr("width", function(d)
        {
            return xScale(d.End) - xScale(d.Start);
        })
        .attr("fill", "yellow");
}

var drawAgegroup = function(dataset, xScale, yScale)
{
    d3.select("#graph4ratio")
        .selectAll("rect")
        .transition()
        .duration(1000)
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
            d3.select(this)
            .attr("fill", "green")
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
            d3.select(this)
                .attr("fill", "yellow")
        
            d3.select("#tooltip")
                .classed("hidden", true);
        })
}

var initialdrawgrowth = function(dataset, xScale, yScale)
{
    d3.select("#graph4femalegrowth")
        .selectAll("circle")
        .transition()
        .duration(1000)
        .attr("fill", "blue")
        .attr("cx", function(d, i)
        {
            return xScale(d.Age) + 8;
        })
        .attr("cy", yScale(0))
        .attr("r", 0)
    
    d3.select("#graph4malegrowth")
        .selectAll("circle")
        .transition()
        .duration(1000)
        .delay(500)
        .attr("fill", "red")
        .attr("cx", function(d)
        {
            return xScale(d.Age) + 8;
        })
        .attr("cy", yScale(0))
        .attr("r", 0)
}

var drawgrowth = function(dataset, xScale, yScale)
{
    console.log(dataset);
    d3.select("#graph4femalegrowth")
        .selectAll("circle")
        .transition(2000)
        .delay(1000)
        .attr("fill", "blue")
        .attr("cx", function(d, i)
        {
            return xScale(d.Age) + 8;
        })
        .attr("cy", function(d)
        {
            return yScale(d.Growthfemale);
        })
        .attr("r", 4)
    
    var linefemale = d3.select("#graph4femalegrowth")
        .append("g")
        .attr("id", "linefemale")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1)
    
    var lineGenerator = d3.line()
        .x(function(d){return xScale(d.Age) + 8})
        .y(function(d){return yScale(d.Growthfemale)})
        .curve(d3.curveNatural);
    
    linefemale.append("path")
        .datum(dataset)
        .attr("d", lineGenerator);
    
    d3.select("#graph4malegrowth")
        .selectAll("circle")
        .transition(2000)
        .delay(2000)
        .attr("fill", "red")
        .attr("cx", function(d)
        {
            return xScale(d.Age) + 8;
        })
        .attr("cy", function(d)
        {
            return yScale(d.Growthmale);
        })
        .attr("r", 4)
    
    var lineGenerator = d3.line()
        .x(function(d){return xScale(d.Age) + 8})
        .y(function(d){return yScale(d.Growthmale)})
        .curve(d3.curveNatural);
    
    var linemale = d3.select("#graph4malegrowth")
        .append("g")
        .attr("id", "linemale")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
    
    d3.select("#linemale")
        .append("path")
        .datum(dataset)
        .attr("d", lineGenerator);
    
    d3.select("#graph4femalegrowth")
        .selectAll("circle")
        .on("mouseover", function(d)
        {
            d3.select(this)
                .attr("fill", "green")
        
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
            d3.select(this)
                .attr("fill", "blue")
        
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
    d3.select("#graph4malegrowth")
        .selectAll("circle")
        .on("mouseover", function(d)
        {
            d3.select(this)
                .attr("fill", "green")
        
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
            d3.select(this)
                .attr("fill", "red")
        
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
     drawLegend2();
}

var insertLinebreaks = function (d) 
{
    var el = d3.select(this);
    var words = d.toString().split(' ');
    el.text('');

    for (var i = 0; i < words.length; i++) 
    {
        var tspan = el.append('tspan').text(words[i] + " ");
        //tspan.textLength = 175;
        if (i > 0 && (i % 2 == 0))
            tspan.attr('x', -10).attr('dy', '20');
    }
};

var initialdraw3 = function(dataset, xScale, yScale)
{ 
    d3.select("#graph3")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", xScale(0))
        .attr("y", function(d, i)
        {
            return yScale(i) + 10;
        })
        .attr("height", 20)
        .attr("width", 0)
        .attr("fill", "green")
}

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
    
    var screen = {width: 550, height: 600};
    var margins = {top: 80, right: 20, bottom: 50, left: 175};

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
        .attr("x", -170)
        .attr("y", -50)
        .style("font-size", "24px")
        .text("Gender wage gap by occupation in the U.S. in 2017")
    
    d3.select("#graph3")
        .append("text")
        .attr("x", -110)
        .attr("y", -20)
        .style("font-size", "24px")
        .text("by median weekly earnings (percent)")
    
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
    
    initialdraw3(dataset, xScale, NumyScale);
    
    draw3(dataset, xScale, NumyScale);
}

var drawLegend2 = function()
{   
    d3.select("#legend")
        .classed("hidden", false)
    
    d3.selectAll("#legend *").remove();
    
    d3.select("#legend")
        .append("g")
        .attr("id", "legendrect")
        .attr("fill", "yellow")
        .attr("transform", "translate(0, 20)")
        .append("rect")
        .attr("width", 10).attr("height", 10)

    d3.select("#legendrect")
        .append("text")
        .text("Percent earnings of female to male by age group")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px");
    
    d3.select("#legend")
        .append("g")
        .attr("id", "legendred")
        .attr("fill", "red")
        .attr("transform", "translate(0, 60)")
        .append("circle")
        .attr("cx", 5).attr("cy", 5)
        .attr("r", 4)
    
    d3.select("#legendred")
        .append("text")
        .text("Male percent wage growth vs. 22-year-old")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px")
    
    d3.select("#legend")
        .append("g")
        .attr("id", "legendblue")
        .attr("fill", "blue")
        .attr("transform", "translate(0, 100)")
        .append("circle")
        .attr("cx", 5).attr("cy", 5)
        .attr("r", 4)
    
    d3.select("#legendblue")
        .append("text")
        .text("Female percent wage growth vs. 22-year-old")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px")
}

var draw3 = function(dataset, xScale, yScale)
{
    d3.select("#graph3")
        .selectAll("rect")
        .transition(2000)
        .attr("y", function(d, i)
        {
            return yScale(i) + 25;
        })
        .attr("height", 20)
        .attr("width", function(d)
        {
            return xScale(d.Percent);
        })
        .attr("fill", function(d)
        {
            if (d.Common == "Men") return "yellow";
            if (d.Common == "Women") return "pink";
            if (d.Common == "Both") return "orange";
        });
    
    d3.select("#legendocc")
        .classed("hidden", false);
    
    d3.select("#graph3")
        .selectAll("rect")
        .on("mouseover", function(d)
        {
            d3.select(this)
                .attr("fill", "green")
        
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
            d3.select(this)
                .attr("fill", function(d)
                {
                if (d.Common == "Men") return "yellow";
                if (d.Common == "Women") return "pink";
                if (d.Common == "Both") return "orange";
                })
        
            d3.select("#tooltip")
                .classed("hidden", true);
        })
}

var setup2 = function(dataset)
{
    console.log(dataset);
    
    var screen = {width: 1000, height: 1000};
    var margins = {top: 120, right: 50, bottom: 50, left: 50, mid: 150};

    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    var regionWidth = width / 2 - margins.mid;
    
    d3.select("svg")
        //.attr("width", screen.width)
        //.attr("height", screen.height)
        .append("g")
        .attr("id", "graph2")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")")
        .classed("hidden", true);
    
    d3.select("#graph2")
        .append("text")
        .attr("x", regionWidth - 60)
        .attr("y", -90)
        .style("font-size", "24px")
        .text("Gender wage gap by industry in the U.S. in 2017")
    
    d3.select("#graph2")
        .append("text")
        .attr("x", regionWidth - 10)
        .attr("y", -60)
        .style("font-size", "24px")
        .text("by median weekly earnings (percent)")
    
    //d3.select("#graph1")
    //    .classed("hidden", true);
    
    d3.select("#button1")
        .classed("hidden", false);
    
    d3.select("#graph2")
        .append("g")
        .attr("id", "graph2Left");
    
    d3.select("#graph2")
        .append("g")
        .attr("id", "graph2Right")
        .attr("transform", "translate(" + (width - regionWidth) + ",0)");
    
    var yScale = d3.scaleBand()
        .domain(dataset.map(function(d){return d.Industry;}))
        .range([0, height])
    
    var LeftxScale = d3.scaleLinear()
        .domain([110, 0])
        .range([0, regionWidth])
    
    var NumyScale = d3.scaleLinear()
        .domain([0, 14])
        .range([5, height - 45])
    
    var RightxScale = d3.scaleLinear()
        .domain([0, 300])
        .range([width - regionWidth, width])
    
    var LeftxAxis = d3.axisBottom(LeftxScale)
        .ticks(5);
    var yAxisLeft = d3.axisRight(yScale)
        .tickPadding(margins.mid - 4);
    var RightxAxis = d3.axisBottom(RightxScale)
        .ticks(7);
    var yAxisRight = d3.axisLeft(yScale)
        .tickFormat("");
    
    d3.select("#graph2Left")
        .append("g")
        .classed("graph2Leftaxis", "true");
    
    d3.select("#graph2Right")
        .append("g")
        .classed("graph2Rightaxis", "true");
    
    console.log(regionWidth);
    
    d3.select(".graph2Leftaxis")
        .append("g")
        .attr("id", "leftxAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(LeftxAxis)
        .attr("font-size", 14);
    
    d3.select(".graph2Leftaxis")
        .append("g")
        .attr("id", "graph2yAxisLeft")
        .attr("transform", "translate(" + regionWidth + ",0)")
        .call(yAxisLeft)
        .attr("font-size", 14)
        .selectAll("text")
        .style("text-anchor", "middle");
    
    d3.select(".graph2Rightaxis")
        .append("g")
        .attr("id", "rightxAxis")
        .attr("transform", "translate(-600," + height + ")")
        .call(RightxAxis)
        .attr("font-size", 14);
    
    d3.select(".graph2Rightaxis")
        .append("g")
        .attr("id", "graph2yAxisRight")
        .call(yAxisRight);
    
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
    
    x2017 = 910;
    y2017 = 196;
    
    d3.select("#graph2")
        .append("g")
        .attr("id", "PercentEarning")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
    
    d3.select("#graph2")
        .append("g")
        .attr("id", "PercentNo")
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
    
    initialdraw2(dataset, LeftxScale, RightxScale, NumyScale, width, regionWidth)
    
    d3.select("#graph1")
    .on("click", function()
    {
        var x = d3.event.pageX, y = d3.event.pageY;
        console.log(x, y);
        if ((x2017 - x) * (x2017 - x) + (y2017 - y) * (y2017 - y) <= 40)
        {
            d3.select("#graph1")
                .classed("hidden", true)
            
            d3.select("#graph2")
                .classed("hidden", false)
            
            draw2(dataset, LeftxScale, RightxScale, NumyScale, width, regionWidth);
        }
    })
}

var initialdraw2 = function(dataset, LeftxScale, RightxScale, yScale, width, regionWidth)
{    
    d3.select("#PercentEarning")
        .selectAll("rect")
        .transition(2000)
        .attr("x", LeftxScale(0))
        .attr("y", function(d, i)
        {
            return yScale(i) + 10;
        })
        .attr("height", 20)
        .attr("width", 0)
        .attr("fill", "red")
    
    d3.select("#PercentNo")
        .selectAll("rect")
        .transition(2000)
        .attr("x", function(d)
        {
            return width - regionWidth;
        })
        .attr("y", function(d, i)
        {
            return yScale(i) + 10;
        })
        .attr("height", 20)
        .attr("width", 0)
        .attr("fill", "blue")
}

var drawLegend = function()
{   
    d3.select("#legend")
        .classed("hidden", false);
    
    d3.selectAll("#legend *").remove();
    
    d3.select("#legend")
        .append("g")
        .attr("id", "legendred")
        .attr("fill", "red")
        .attr("transform", "translate(0, 20)")
        .append("rect")
        .attr("width", 10).attr("height", 10)

    d3.select("#legendred")
        .append("text")
        .text("Percent earnings of female to male by industry")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px");

    d3.select("#legend")
        .append("g")
        .attr("id", "legendblue")
        .attr("fill", "blue")
        .attr("transform", "translate(0, 50)")
        .append("rect")
        .attr("width", 10).attr("height", 10)

    d3.select("#legendblue")
        .append("text")
        .text("Percent number of female workers to male workers")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px")

    d3.select("#legendblue")
        .append("text")
        .text("by industry")
        .attr("x", 15).attr("y", 40)
        .attr("fill", "black")
        .attr("font-size", "20px")
    
    d3.select("#legend")
        .append("g")
        .attr("id", "legendocc")
    
    d3.select("#legendocc")
        .append("g")
        .attr("id", "commonmen")
        .attr("fill", "yellow")
        .attr("transform", "translate(0, 110)")
        .append("rect")
        .attr("width", 10).attr("height", 10)

    d3.select("#commonmen")
        .append("text")
        .text("Occupation most common for men")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px")
    
    d3.select("#legendocc")
        .append("g")
        .attr("id", "commonwomen")
        .attr("fill", "pink")
        .attr("transform", "translate(0, 150)")
        .append("rect")
        .attr("width", 10).attr("height", 10)

    d3.select("#commonwomen")
        .append("text")
        .text("Occupation most common for women")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px")
    
    d3.select("#legendocc")
        .append("g")
        .attr("id", "commonboth")
        .attr("fill", "orange")
        .attr("transform", "translate(0, 190)")
        .append("rect")
        .attr("width", 10).attr("height", 10)

    d3.select("#commonboth")
        .append("text")
        .text("Occupation most common for both men and women")
        .attr("x", 15).attr("y", 10)
        .attr("fill", "black")
        .attr("font-size", "20px")
    
    d3.select("#legendocc")
        .classed("hidden", true);
}

var draw2 = function(dataset, LeftxScale, RightxScale, yScale, width, regionWidth)
{   
    
    d3.select("#PercentEarning")
        .selectAll("rect")
        .transition(2000)
        .attr("x", function(d)
        {
            return LeftxScale(d.PercentEarning);
        })
        .attr("y", function(d, i)
        {
            return yScale(i) + 10;
        })
        .attr("height", 20)
        .attr("width", function(d)
        {
            return LeftxScale(110 - d.PercentEarning);
        })
        .attr("fill", "red")
    
    d3.select("#PercentNo")
        .selectAll("rect")
        .transition(2000)
        .attr("x", function(d)
        {
            return width - regionWidth;
        })
        .attr("y", function(d, i)
        {
            return yScale(i) + 10;
        })
        .attr("height", 20)
        .attr("width", function(d)
        {
            //console.log(RightxScale(d.PercentNo));
            return RightxScale(d.PercentNo) - (width - regionWidth);
        })
        .attr("fill", "blue")
    
    d3.select("#PercentEarning")
        .selectAll("rect")
        .on("mouseover", function(d)
        {
            d3.select(this)
                .attr("fill", "yellow")
        
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
            d3.select(this)
                .attr("fill", "red")
        
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
    d3.select("#PercentNo")
        .selectAll("rect")
        .on("mouseover", function(d)
        {
            d3.select(this)
                .attr("fill", "yellow")
        
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
            d3.select(this)
                .attr("fill", "blue")
        
            d3.select("#tooltip")
                .classed("hidden", true);
        })
    
    drawLegend();
}