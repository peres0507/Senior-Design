var barChartId = "barChartPTest";


var  tooltip;

function fillColor(d){
    if (d.reference!=0){
        if(d.reference<d.pValue) return "#F00"; else return "#0F0";
    }else return "#888";
 

  }

////////////////////////////////////////////////////////////
//// Render Scatter Line Chart /////////////////////////////
////////////////////////////////////////////////////////////
function renderBarChart(data) {

    // Tooltip container
 tooltip = d3
 .select("body")
 .append("div")
 .attr("id", "tooltip2")
 .style("opacity", 0);
   
var chart = {};
// Get the chart container's dimension
var chartContainer = d3.select("#" + barChartId);
var chartContainerWidth = chartContainer.node().clientWidth;
var chartContainerHeight = chartContainer.node().clientHeight;

    // Chart dimension and style variables
 var margin = { top: 50, right: 10, bottom: 30, left: 50 };
 var width = chartContainerWidth - margin.left - margin.right;
 var height = chartContainerHeight - margin.top - margin.bottom;
 
 //var data = [];
 //data.push({"Confidence":"test","pValue":"850"});
 //data.push({"Confidence":"0.05","pValue":"650"});


 var svg = chartContainer
 .append("svg")
 .attr("width", chartContainerWidth)
 .attr("height", chartContainerHeight);

 g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
 g.append("text")
      .attr("class", "bus-stop-name h5")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("text-transform", "uppercase");

      var axisG = g.append("g").attr("class", "axis");
      var xAxisTopG = axisG.append("g").attr("class", "x axis top");

  // Add x axis title
  axisG
  .append("text")
  .attr("x", width / 2)
  .attr("y", height + 28)
  .attr("text-anchor", "middle")
  .text("Test");
 
 var x = d3.scaleBand()
     .rangeRound([0, width])
     .padding(0.1);
 
 var y = d3.scaleLinear()
     .rangeRound([height, 0]);
 

     chart.update = function(data) {
      
      
  
        var t = d3.transition().duration(750);
  
    
    
       
        g.selectAll(".axisY").remove();
     
        var textChart = "";
        if(data[0].reference>data[0].pValue){
          textChart = "Test for Equal Waiting Time: Accepted -> Take Any Bus";
        }else{
          textChart = "Test for Equal Waiting Time: Rejected -> Take M100";
        }
        g.select(".bus-stop-name").text(textChart);
        
    
 
 var x = d3.scaleBand()
 .rangeRound([0, width])
 .padding(0.1);

var y = d3.scaleLinear()
 .rangeRound([height, 0]);




 x.domain(data.map(function (d) {
         return d.Confidence;
     }));
 y.domain([0, d3.max(data, function (d) {
             return Number(d.pValue);
         })]);

 g.append("g")
 .attr("transform", "translate(0," + height + ")")
 .call(d3.axisBottom(x))

 g.append("g")
 .attr("class", "axisY")
 .call(d3.axisLeft(y))
 .append("text")
 .attr("fill", "#000")
 .attr("transform", "rotate(-90)")
 .attr("y", 6)
 .attr("dy", "0.71em")
 .attr("text-anchor", "end")
 .text("p-value");




 g.selectAll(".bar")
 .remove()
 .exit()
 .data(data)
 .enter()
 .append("rect")
 .attr("class", "bar")
 .attr("x", function (d) {
     return x(d.Confidence);
 })
 .attr("y", function (d) {
     return y(Number(d.pValue));
 })
 .attr("width", x.bandwidth())
 .attr("fill", fillColor)
 .attr("height", function (d) {
     return height - y(Number(d.pValue));
 })
 .on("mouseover", function(bus) {
    d3.select(this)
      .transition()
      .duration(100)
    var buses = d3.select(this.parentNode).datum(); // Used for detecting overlapping waiting time
    showWaitTimeLineTooltip(bus, buses);
  })
  .on("mousemove", moveTooltip)
  .on("mouseout", function() {
    d3.select(this)
      .transition()
      .duration(100)
    hideTooltip();
  });


  
       
      
  
       
      };

     return chart;
}

// Parse the date / time
//var	parseDate = d3.time.format("%Y-%m").parse;

/**/

function moveTooltip(event) {

    // Get tooltip size
    var bcr = tooltip.node().getBoundingClientRect();
    // Get mouse position
    var clientX, clientY;
    if (event.originalEvent) {
      // Leaflet
      clientX = event.originalEvent.clientX;
      clientY = event.originalEvent.clientY;
    } else {
      // D3
      clientX = d3.event.clientX;
      clientY = d3.event.clientY;
    }
    tooltip
     // .style("top", clientY - bcr.height - 10 + "px")
     // .style("left", clientX - bcr.width / 2 + "px");
     .style("top", clientY - 10 + "px")
     .style("left", clientX + "px");
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }

  function showWaitTimeLineTooltip(interval) {
  
   var number = parseFloat(interval.pValue).toFixed(3);
    var html = `
      <table>
        <tbody>
          <tr><th>p-value</th><td>${number}</td></tr>
         
        </tbody>
      </table>
    `;
    tooltip.html(html);
    tooltip.style("opacity", 1);
  }

