document.addEventListener("DOMContentLoaded", function() {
  ////////////////////////////////////////////////////////////
  //// Initial Setup /////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  var scatterLineChartId = "scatterLineChart";
  var scatterLineChartPTestId = "scatterLineChartPTest";
  var mapId = "busStopMap";
  var dataURL = "busdata.csv";

  var stopIdColumn = "60_Common Stop_id";
  var stopNameColumn = "Common Stop_ID name";

  var data; // ProcessedData
  var scatterLineChart;
  var scatterLineChartPTest;
  var barChart;

  // Tooltip container
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);

  // Load data and initialize the visualization
  d3.csv(dataURL).then(function(csvData) {
    processData(csvData);
    scatterLineChart = renderScatterLineChart();
    scatterLineChartPTest = renderScatterLineChartPTest();
    barChart = renderBarChart([]);
    renderMap(); // render map last because it dispatch a click event on one marker
  });

  ////////////////////////////////////////////////////////////
  //// Process Data //////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function processData(csvData) {
    var nonNumberColumns = ["Time", stopNameColumn, stopIdColumn];
    // Loop through each row
    csvData.forEach(function(d) {
      // Group wait times by bus name
      d.M100WaitTime = [];
      d.M101WaitTime = [];

      // Loop through each column
      csvData.columns.forEach(function(column) {
        // Convert number values from text to numbers
        if (nonNumberColumns.indexOf(column) === -1) {
          d[column] = +d[column];
        }

        // Group wait times by bus name
        if (column.startsWith("M100")) {
          d.M100WaitTime.push({
            busName: "M100",
            busId: column,
            waitTime: d[column],
            stopId: d[stopIdColumn] // For wait line tooltip
          });
          delete d[column];
        } else if (column.startsWith("M101")) {
          d.M101WaitTime.push({
            busName: "M101",
            busId: column,
            waitTime: d[column],
            stopId: d[stopIdColumn] // For wait line tooltip
          });
          delete d[column];
        }
      });
    });
    data = csvData;
  }

  ////////////////////////////////////////////////////////////
  //// Render Map ////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function renderMap() {
    // Initialize a Leaflet map
    var map = L.map(mapId);

    // Add openstreetmap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Marker icons
    // Default marker -- blue
    var blueIcon = new L.Icon({
      iconUrl:
        "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    // Selected marker -- red
    var redIcon = new L.Icon({
      iconUrl:
        "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    // Hovered marker -- orange
    var orangeIcon = new L.Icon({
      iconUrl:
        "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Keep track of selected marker
    var selectedMarker;

    // Add a marker for each bus stop
    var busStopMarkers = data.map(function(stop) {
      var marker = L.marker([stop.Latitude, stop.Longitude], {
        icon: blueIcon
      }).addTo(map);

      // Bind the bus stop's data to its marker
      marker.data = stop;

      // Add event listeners to each maker
      marker
        .on("mouseover", function() {
          // Change marker to orange except for the selected marker
          if (
            !(this.data[stopIdColumn] === selectedMarker.data[stopIdColumn])
          ) {
            this.setIcon(orangeIcon);
          }
          showMarkerTooltip(this.data);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", function() {
          // Change marker back to blue except for the selected marker
          if (
            !(this.data[stopIdColumn] === selectedMarker.data[stopIdColumn])
          ) {
            this.setIcon(blueIcon);
          }
          hideTooltip();
        })
        .on("click", function() {
          // If there's a previously selected marker, set it back to blue
          if (selectedMarker) {
            selectedMarker.setIcon(blueIcon);
          }
          selectedMarker = this;
          // Set the selected marker to red
          this.setIcon(redIcon);

          scatterLineChart.update(this.data);
        });

      return marker;
    });

    // Put all bus stop markers into a Leaflet feature group
    var busStopMarkersGroup = new L.featureGroup(busStopMarkers);
    // Fit all bus top markers on the map
    map.fitBounds(busStopMarkersGroup.getBounds());

    // Programmatically click one marker
    selectedMarker = busStopMarkers[0];
    selectedMarker.fire("click");
  }

  ////////////////////////////////////////////////////////////
  //// Render Scatter Line Chart /////////////////////////////
  ////////////////////////////////////////////////////////////
  function renderScatterLineChart() {
    var chart = {};
    // Get the chart container's dimension
    var chartContainer = d3.select("#" + scatterLineChartId);
    var chartContainerWidth = chartContainer.node().clientWidth;
    var chartContainerHeight = chartContainer.node().clientHeight;

    // Chart dimension and style variables
    var margin = { top: 50, right: 10, bottom: 30, left: 50 };
    var width = chartContainerWidth - margin.left - margin.right;
    var height = chartContainerHeight - margin.top - margin.bottom;

    var lineStrokeColor = "#999";
    var hoveredLineStrokeColor = "#000";
    var lineStrokeWidth = 1.5;
    var hoveredLineStrokeWidth = 3;
    var averageLineStrokeColor = "#e41a1c";
    var averageLineStrokeWidth = 2.5;
    var hoveredAverageLineStrokeWidth = 5;

    // Scales
    var busNames = ["M100", "M101"];
    // The x scale is used to place the wait time lines
    var xScale = d3.scaleLinear().range([0, width]);
    // The y scale is used to place the bus rows
    var yScale = d3
      .scaleBand()
      .domain(busNames)
      .range([0, height])
      .padding(0.1);

    // Axes
    var xAxisTop = d3
      .axisTop()
      .scale(xScale)
      .tickSizeOuter(0);
    var xAxisBottom = d3
      .axisBottom()
      .scale(xScale)
      .tickSizeOuter(0);
    var yAxis = d3.axisLeft().scale(yScale);

    var svg = chartContainer
      .append("svg")
      .attr("width", chartContainerWidth)
      .attr("height", chartContainerHeight);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Bus stop name
    g.append("text")
      .attr("class", "bus-stop-name h5")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("text-transform", "uppercase");

    // Set up axes
    var axisG = g.append("g").attr("class", "axis");

    // Render y axis (bus names)
    var yAxisG = axisG
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);
    yAxisG.select("path").remove();
    yAxisG
      .selectAll(".tick")
      .select("text")
      .attr("class", "h5");

    // Set up x axis containers
    var xAxisTopG = axisG.append("g").attr("class", "x axis top");

    var xAxisBottomG = axisG
      .append("g")
      .attr("class", "x axis bottom")
      .attr("transform", "translate(0," + height + ")");

    // Add x axis title
    axisG
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 28)
      .attr("text-anchor", "middle")
      .text("Wait Time (Seconds)");

    // Set up row container
    var gRow = g
      .selectAll(".bus-row")
      .data(busNames)
      .enter()
      .append("g")
      .attr("class", "bus-row")
      .attr("transform", function(bus) {
        return "translate(0," + yScale(bus) + ")";
      });

    gRow.append("g").attr("class", "wait-time-lines");

    // There is only one average line, no need to use enter-update-exit pattern
    gRow
      .append("line")
      .attr("class", "average-wait-time-line")
      .attr("y1", 0)
      .attr("y2", yScale.bandwidth())
      .attr("stroke", averageLineStrokeColor)
      .attr("stroke-width", averageLineStrokeWidth)
      .on("mouseover", function(average) {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("stroke-width", hoveredAverageLineStrokeWidth);
        showAverageWaitTimeLineTooltip(average);
      })
      .on("mousemove", moveTooltip)
      .on("mouseout", function() {
        d3.select(this)
          .transition()
          .duration(100)
          .attr("stroke-width", averageLineStrokeWidth);
        hideTooltip();
      });

    // Update chart according to bus stop data;
    chart.update = function(stop) {
      // Update x scale
      var waitTimeExtent = d3.extent(
        stop.M100WaitTime.concat(stop.M101WaitTime),
        function(d) {
          return d.waitTime;
        }
      );
      xScale.domain(waitTimeExtent).nice();

      var t = d3.transition().duration(750);

      // Update bus stop name
      g.select(".bus-stop-name").text(stop[stopNameColumn]);

      // Update x axes
      xAxisTopG.transition(t).call(xAxisTop);
      xAxisBottomG.transition(t).call(xAxisBottom);

      // Update the scatter line charts data
      var waitTimeData = [stop.M100WaitTime, stop.M101WaitTime];
      waitTimeData.forEach(function(d) {
        d.averageWaitTime = d3.mean(d, function(bus) {
          return bus.waitTime;
        });
        d.deviationWaitTime = d3.deviation(d, function(bus) {
          return bus.waitTime;
        });
        d.busName = d[0].busName;
        d.stopId = stop[stopIdColumn];
      });
      gRow.data(waitTimeData);

      pTest(waitTimeData, stop);

      // Update wait time lines
      // UPDATE
      var waitTimeLine = gRow
        .select(".wait-time-lines")
        .selectAll(".wait-time-line")
        .data(
          function(bus) {
            return bus;
          },
          function(bus) {
            return bus.busId;
          }
        );

      // EXIT
      waitTimeLine.exit().remove();

      // ENTER + MERGE
      waitTimeLine
        .enter()
        .append("line")
        .attr("class", "wait-time-line")
        .attr("y1", 0)
        .attr("y2", yScale.bandwidth())
        .attr("stroke", lineStrokeColor)
        .attr("stroke-width", lineStrokeWidth)
        .on("mouseover", function(bus) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("stroke", hoveredLineStrokeColor)
            .attr("stroke-width", hoveredLineStrokeWidth);
          var buses = d3.select(this.parentNode).datum(); // Used for detecting overlapping waiting time
          showWaitTimeLineTooltip(bus, buses);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("stroke", lineStrokeColor)
            .attr("stroke-width", lineStrokeWidth);
          hideTooltip();
        })
        .merge(waitTimeLine)
        .transition(t)
        .attr("x1", function(bus) {
          return xScale(bus.waitTime);
        })
        .attr("x2", function(bus) {
          return xScale(bus.waitTime);
        });

      // Update average wait time line
      gRow
        .select(".average-wait-time-line")
        .transition(t)
        .attr("x1", function(buses) {
          return xScale(buses.averageWaitTime);
        })
        .attr("x2", function(buses) {
          return xScale(buses.averageWaitTime);
        });
    };
    return chart;
  }

   ////////////////////////////////////////////////////////////
  //// Render Scatter Line Chart PTest ////////////////////////
  ////////////////////////////////////////////////////////////
  function renderScatterLineChartPTest() {
    var chart = {};
    // Get the chart container's dimension
    var chartContainer = d3.select("#" + scatterLineChartPTestId);
    var chartContainerWidth = chartContainer.node().clientWidth;
    var chartContainerHeight = chartContainer.node().clientHeight;

    // Chart dimension and style variables
    var margin = { top: 50, right: 10, bottom: 30, left: 50 };
    var width = chartContainerWidth - margin.left - margin.right;
    var height = chartContainerHeight - margin.top - margin.bottom;

    var lineStrokeColor = "#999";
    var hoveredLineStrokeColor = "#000";
    var lineStrokeWidth = 1.5;
    var hoveredLineStrokeWidth = 3;
    var averageLineStrokeColor = "#e41a1c";
    var averageLineStrokeWidth = 2.5;
    var hoveredAverageLineStrokeWidth = 5;
    var equalLineStrokeWidth = 2.5;
    var equalLineStrokeColor = "#00ff00";
    var slowLineStrokeWidth = 2.0;
    var slowLineStrokeColor = "#ff0000";
    var fastLineStrokeColor = "#00ff00";
    var fastLineStrokeWidth = 2.0;

    // Scales
    var busNames = ["t-test"];
    // The x scale is used to place the wait time lines
    var xScale = d3.scaleLinear().range([0, width]);
    // The y scale is used to place the bus rows
    var yScale = d3
      .scaleBand()
      .domain(busNames)
      .range([0, height])
      .padding(0.1);

    // Axes
   
    var xAxisBottom = d3
      .axisBottom()
      .scale(xScale)
      .tickSizeOuter(0);
    var yAxis = d3.axisLeft().scale(yScale);

    var svg = chartContainer
      .append("svg")
      .attr("width", chartContainerWidth)
      .attr("height", chartContainerHeight);

    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Bus stop name
    g.append("text")
      .attr("class", "bus-stop-name h5")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("text-transform", "uppercase");

    // Set up axes
    var axisG = g.append("g").attr("class", "axis");

    // Render y axis (bus names)
    var yAxisG = axisG
      .append("g")
      .attr("class", "y axis")
      .call(yAxis);
    yAxisG.select("path").remove();
    yAxisG
      .selectAll(".tick")
      .select("text")
      .attr("class", "h5");

    // Set up x axis containers

    var xAxisBottomG = axisG
      .append("g")
      .attr("class", "x axis bottom")
      .attr("transform", "translate(0," + height + ")");

    // Add x axis title
    axisG
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 28)
      .attr("text-anchor", "middle")
      .text("Wait Time Interval Difference (Seconds)");

    // Set up row container
    var gRow = g
      .selectAll(".bus-row")
      .data(busNames)
      .enter()
      .append("g")
      .attr("class", "bus-row")
      .attr("transform", function(bus) {
        return "translate(0," + yScale(bus) + ")";
      });

    gRow.append("g").attr("class", "wait-time-lines");


    // Update chart according to bus stop data;
    chart.update = function(stop) {
      
      // Update x scale
      var waitTimeExtent = d3.extent(
        stop.Interval,
        function(d) {
          return d.waitTime;
        }
      );

      xScale.domain(waitTimeExtent).nice();

      var t = d3.transition().duration(750);

      // Update bus stop name
      //g.select(".bus-stop-name").text(stop[stopNameColumn]);
      var textChart = "";
      if(stop.Interval[0].hypothesis==true){
        textChart = "Test for Equal Waiting Time: Accepted -> Take Any Bus";
      }else{
        var whichBus = "";
        if(stop.Interval[0].fastest){
          whichBus = stop.Interval[0].busName;
        }else{
          whichBus = stop.Interval[1].busName;  
        }
        textChart = "Test for Equal Waiting Time: Rejected -> Take "+whichBus;
      }
      g.select(".bus-stop-name").text(textChart);

      // Update x axes
      //xAxisTopG.transition(t).call(xAxisTop);
      xAxisBottomG.transition(t).call(xAxisBottom);

      // Update the scatter line charts data
    
     var waitTimeData = [stop.Interval];
      gRow.data(waitTimeData);


      // Update wait time lines
      // UPDATE
      var waitTimeLine = gRow
        .select(".wait-time-lines")
        .selectAll(".wait-time-line")
        .data(
          function(bus) {
            return bus;
          },
          function(bus) {
            return bus.busId;
          }
        );

      // EXIT
      waitTimeLine.exit().remove();

      function lineColor(d){
        if (d.hypothesis){
          return equalLineStrokeColor;
        }else {
          if(d.fastest) return fastLineStrokeColor;
          else return slowLineStrokeColor;
        }

      }

      function lineWidth(d){
          if(d.fastest) return fastLineStrokeWidth;
          else return slowLineStrokeWidth;
      }
      // ENTER + MERGE
      waitTimeLine
        .enter()
        .append("line")
        .attr("class", "wait-time-line")
        .attr("y1", 0)
        .attr("y2", yScale.bandwidth())
        .attr("stroke", lineColor)
        .attr("stroke-width", lineWidth)
        .on("mouseover", function(bus) {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("stroke", lineColor)
            .attr("stroke-width", hoveredLineStrokeWidth);
          var buses = d3.select(this.parentNode).datum(); // Used for detecting overlapping waiting time
          showWaitTimeLineTooltipPTest(bus, buses);
        })
        .on("mousemove", moveTooltip)
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(100)
            .attr("stroke", lineColor)
            .attr("stroke-width", lineWidth);
          hideTooltip();
        })
        .merge(waitTimeLine)
        .transition(t)
        .attr("x1", function(bus) {
          return xScale(bus.waitTime);
        })
        .attr("x2", function(bus) {
          return xScale(bus.waitTime);
        });

    };
    return chart;
  }

  function pTest(busData,stop){

    ///Let's apply 'Tests of Significance for Two Unknown Means and Unknown Standard Deviations'
    ///Calculate the confidence interval x1-x2 +- t*(15)*sqrt(s1^2/n + s2^2/n)
    ///If the interval contains the 0, the hypothesis is correct: waiting times are the same for Both buses
    ///If not, one of the buses has less waiting time.
    var t15_005 = 2.131; //t distribution 15 degrees of freedom (16 samples), Confidence level 95%
    var N = 16;
    var x1 = busData[0].averageWaitTime;
    var x2 = busData[1].averageWaitTime;
    var s1 = busData[0].deviationWaitTime;
    var s2 = busData[1].deviationWaitTime;
    var sq = Math.sqrt((Math.pow(s1,2)/N)+(Math.pow(s2,2)/N));
    var conf1 = x1 - x2 - t15_005 * sq;
    var conf2 = x1 - x2 + t15_005 * sq;

    var pvalue = (x1-x2)/sq;
    document.getElementById('int1').innerHtml = conf1;
    document.getElementById('int1').textContent = conf1;
    document.getElementById('int2').innerHtml = conf2;
    document.getElementById('int2').textContent = conf2;
    document.getElementById('pvalue').textContent = pvalue;

    var hypothesisAccepted = false;
    var fastest = "M100";
    if((conf1<0 && conf2>0) || (conf2<0 && conf1>0)) hypothesisAccepted = true;
    
    if(!hypothesisAccepted){
      if(Math.abs(conf1)>Math.abs(conf2)) fastest = "M100"; else fastest = "M101";
    }else{
      fastest = "";
    }

    var stopId = busData[0].stopId;
    stop.Interval = [];
    stop.Interval.push({hypothesis: hypothesisAccepted, average: false, fastest: (fastest=="M100" ? true : false), busId:"", busName:"M100", stopId:stopId, waitTime:Math.floor(conf1)});
    stop.Interval.push({hypothesis: hypothesisAccepted, average: false, fastest: (fastest=="M101" ? true : false), busId:"", busName:"M101", stopId:stopId, waitTime:Math.floor(conf2)});
   // stop.Interval.push({hypothesis: hypothesisAccepted, average: true, fastest: (fastest=="" ? true : false), busId:"", busName:"", stopId:"", waitTime:0});
    stop.Interval.averageWaitTime= 0;
    stop.Interval.busName="";
    stop.Interval.deviationWaitTime=0;
    stop.Interval.stopId="";

    scatterLineChartPTest.update(stop);

    var data = [];
    data.push({"Confidence":"M100 & M101","pValue":""+Math.abs(pvalue),"reference":""+t15_005});
    data.push({"Confidence":"0.05","pValue":""+t15_005, "reference":"0"});

    barChart.update(data);
    
   
  }
  ////////////////////////////////////////////////////////////
  //// Tooltip ///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////
  function showMarkerTooltip(stop) {
    var html = `
      <table>
        <tbody>
          <tr><th>Stop Name</th><td style="text-transform: uppercase">${
            stop[stopNameColumn]
          }</td></tr>
          <tr><th>Stop Id</th><td>${stop[stopIdColumn]}</td></tr>
          <tr><th>Latitude</th><td>${stop.Latitude}</td></tr>
          <tr><th>Longitude</th><td>${stop.Longitude}</td></tr>
        </tbody>
      </table>
    `;
    tooltip.html(html);
    tooltip.style("opacity", 1);
  }

  function showWaitTimeLineTooltip(bus, buses) {
    var overlappedBuses = buses.filter(function(d) {
      return d.waitTime === bus.waitTime;
    });
    var overlappedBusesIds = overlappedBuses
      .map(function(d) {
        return d.busId;
      })
      .join(", ");
    var html = `
      <table>
        <tbody>
          <tr><th>Stop Id</th><td>${bus.stopId}</td></tr>
          <tr><th>Bus Name</th><td>${bus.busName}</td></tr>
          <tr><th>Bus Id</th><td>${overlappedBusesIds}</td></tr>
          <tr><th>Wait Time</th><td>${bus.waitTime} seconds</td></tr>
        </tbody>
      </table>
    `;
    tooltip.html(html);
    tooltip.style("opacity", 1);
  }
  
  function showWaitTimeLineTooltipPTest(bus, buses) {
    var overlappedBuses = buses.filter(function(d) {
      return d.waitTime === bus.waitTime;
    });
    var overlappedBusesIds = overlappedBuses
      .map(function(d) {
        return d.busId;
      })
      .join(", ");
      var advice = "";
      if (bus.fastest){
        advice = "Take this bus line!";
      }
    var html = `
      <table>
        <tbody>
          <tr><th>Stop Id</th><td>${bus.stopId}</td></tr>
          <tr><th>Bus Name</th><td>${bus.busName}</td></tr>
          <tr><th>Difference Wait Time</th><td>${bus.waitTime} seconds</td></tr>
          <tr><th>${advice}</th><td></td></tr>
        </tbody>
      </table>
    `;
    tooltip.html(html);
    tooltip.style("opacity", 1);
  }

  function showAverageWaitTimeLineTooltip(buses) {
    var formatAverageWaitTime = d3.format(".1f"); // Only keeps one decimal place
    var html = `
      <table>
        <tbody>
          <tr><th>Stop Id</th><td>${buses.stopId}</td></tr>
          <tr><th>Bus Name</th><td>${buses.busName}</td></tr>
          <tr><th>Average Wait Time</th><td>${formatAverageWaitTime(
            buses.averageWaitTime
          )} seconds</td></tr>
        </tbody>
      </table>
    `;
    tooltip.html(html);
    tooltip.style("opacity", 1);
  }

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
      .style("top", clientY - bcr.height - 10 + "px")
      .style("left", clientX - bcr.width / 2 + "px");
  }

  function hideTooltip() {
    tooltip.style("opacity", 0);
  }
});
