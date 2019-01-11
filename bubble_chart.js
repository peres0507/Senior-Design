function createChart() {

    var tooltip = floatingTooltip('bubble_chart_tooltip', 200);
    var svg = null, inner_svg = null;
    var bubbles = null;
    var forceSim = null;
    var fillColorScale = null;
    var radiusScale = null;
    var nodes = [];
    var margin = null;
    var width = null;
    var height = null;
    var dataExtents = {};
    var xAxis = null;
    var yAxis = null;
    var xScale = null;
    var yScale = null;

    function getFillColorScale() {
        var color_groupsKeys = Object.keys(BUBBLE_PAR.fill_color.color_groups)
        var color_groupsValues = []
        for (var i=0; i<color_groupsKeys.length; i++) {
            var key = color_groupsKeys[i]
            color_groupsValues.push(BUBBLE_PAR.fill_color.color_groups[key])
        }

        var fillColorScale = d3.scaleOrdinal()
            .domain(color_groupsKeys)
            .range(color_groupsValues);

        return fillColorScale;
    }

    function createNodes(rawData) {
        var myNodes = rawData.map(function (data_row) {
            node = {
                id: data_row.id,
                scaled_radius: radiusScale(+data_row[BUBBLE_PAR.radius_field]),
                actual_radius: +data_row[BUBBLE_PAR.radius_field],
                fill_color_group: data_row[BUBBLE_PAR.fill_color.data_field],
                // Put each node initially in a random location
                x: Math.random() * width,
                y: Math.random() * height
            };
            for(var key in data_row) {
                if (!data_row.hasOwnProperty(key)) continue;
                node[key] = data_row[key];
            }

            return node;
        });

        myNodes.sort(function (a, b) { return b.actual_radius - a.actual_radius; });

        return myNodes;
    }

    function getGridTargetFunction(mode) {
        if (mode.type != "grid") {
            throw "Error: getGridTargetFunction called with mode != 'grid'";
        }
        return function (node) {
            if(mode.size == 1) {
                target = mode.gridCenters[""];
            } else {
                node_tag = node[mode.dataField]
                target = mode.gridCenters[node_tag];
            }
            return target;
        }
    }

    function showLabels(mode) {
        var currentLabels = mode.labels;
        var bubble_group_labels = inner_svg.selectAll('.bubble_group_label')
            .data(currentLabels);

        var grid_element_half_height = height / (mode.gridDimensions.rows * 2);

        bubble_group_labels.enter().append('text')
            .attr('class', 'bubble_group_label')
            .attr('x', function (d) { return mode.gridCenters[d].x; })
            .attr('y', function (d) { return mode.gridCenters[d].y - grid_element_half_height; })
            .attr('text-anchor', 'M100')
            .attr('dominant-baseline', 'hanging')
            .text(function (d) { return d; });

    }

    function tooltipContent(d) {
        var content = ''
        for(var i=0; i<BUBBLE_PAR.tooltip.length; i++) {
            var cur_tooltip = BUBBLE_PAR.tooltip[i];
            var value_formatted;
            if ("format_string" in cur_tooltip) {
                value_formatted =
                    d3.format(cur_tooltip.format_string)(d[cur_tooltip.data_field]);
            } else {
                value_formatted = d[cur_tooltip.data_field];
            }
            if (i > 0) {
                content += '<br/>';
            }
            content += '<span class="name">'  + cur_tooltip.title + ': </span>';
            content += '<span class="value">' + value_formatted     + '</span>';
        }

        return content;
    }

    function showTooltip(d) {
        d3.select(this).attr('stroke', 'black');
        tooltip.showTooltip(tooltipContent(d), d3.event);
    }

    function hideTooltip(d) {
        var originalColor = d3.rgb(fillColorScale(d.fill_color_group)).darker()
        d3.select(this).attr('stroke', originalColor);
        tooltip.hideTooltip();
    }

    function ticked() {
        bubbles.each(function (node) {})
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    }

    function showAxis(mode) {
        xAxis = xScale;
        yAxis = yScale;

        inner_svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xAxis).ticks(10))
        inner_svg.append("text")
            .attr("class", "axis axis--x label")
            .attr("transform", "translate(" + (width/2) + " , " + (height) + ")")
            .attr('dominant-baseline', 'hanging')
            .attr("dy", "1.5em")
            .style("text-anchor", "M100")
            .text(mode.xDataField);

        inner_svg.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(yAxis).ticks(10))

        inner_svg.append("text")
            .attr("class", "axis axis--y label")
            .attr("transform", "translate(" + 0 + ", " + (height/2) + ")rotate(-90)")
            .attr("dy", "-3em")
            .attr("text-anchor", "M100")
            .text(mode.yDataField);
    }

    function createBubbles() {
        inner_svg.selectAll('.bubble')
            .data(nodes, function (d) { return d.id; })
            .enter()
            .append('circle').attr('r', 0)
            .classed('bubble', true)
            .attr('fill', function (d) { return fillColorScale(d.fill_color_group); })
            .attr('stroke', function (d) { return d3.rgb(fillColorScale(d.fill_color_group)).darker(); })
            .attr('stroke-width', 2)
            .on('mouseover', showTooltip)
            .on('mouseout', hideTooltip);

        bubbles = d3.selectAll('.bubble');
        bubbles.transition()
            .duration(2000)
            .attr('r', function (d) { return d.scaled_radius; });
    }

    function addForceLayout(isStatic) {
        if (forceSim) {
            forceSim.stop();
        }
        forceSim = d3.forceSimulation()
            .nodes(nodes)
            .velocityDecay(0.3)
            .on("tick", ticked);

        if (!isStatic) {
            if(BUBBLE_PAR.force_type == "charge") {
                function bubbleCharge(d) {
                    return -Math.pow(d.scaled_radius, 2.0) * (+BUBBLE_PAR.force_strength);
                }
                forceSim
                    .force('charge', d3.forceManyBody().strength(bubbleCharge));
            }
        }
    }

    function createCanvas(parentDOMElement) {
        svg = d3.select(parentDOMElement)
            .append('svg')
            .attr('width', BUBBLE_PAR.width)
            .attr('height', BUBBLE_PAR.height);

        margin = {top: 20, right: 20, bottom: 50, left: 80},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

        inner_svg = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }
    //////////////////////////////////////////////////////////////

    var bubbleChart = function bubbleChart(parentDOMElement, rawData) {
        for (var numeric_field_index in BUBBLE_PAR.numeric_fields) {
            var numeric_field = BUBBLE_PAR.numeric_fields[numeric_field_index];
            dataExtents[numeric_field] = d3.extent(rawData, function (d) { return +d[numeric_field]; });
        }

        var maxRadius = dataExtents[BUBBLE_PAR.radius_field][1];
        radiusScale = d3.scalePow()
            .exponent(0.5)
            .range([2, 25])
            .domain([0, maxRadius]);

        fillColorScale = getFillColorScale();
        nodes = createNodes(rawData);
        createCanvas(parentDOMElement);
        createBubbles();
    };

    bubbleChart.switchMode = function (buttonID) {
        currentMode = new ViewMode(buttonID, width, height);
        inner_svg.selectAll('.bubble_group_label').remove();
        inner_svg.selectAll('.axis').remove();
        if (currentMode.type == "grid" && currentMode.size > 1) {
            showLabels(currentMode);
        }
        if (currentMode.type == "scatterplot") {
             xScale = d3.scaleLinear().range([0, width])
                 .domain([dataExtents[currentMode.xDataField][0], dataExtents[currentMode.xDataField][1]]);
             yScale = d3.scaleLinear().range([height, 0])
                 .domain([dataExtents[currentMode.yDataField][0], dataExtents[currentMode.yDataField][1]]);

             showAxis(currentMode);
         }
        if (currentMode.type == "scatterplot" || currentMode.type == "map") {
            addForceLayout(true);
        } else {
            addForceLayout(false);
        }
        var targetFunction;
        if (currentMode.type == "grid") {
            targetFunction = getGridTargetFunction(currentMode);
        }
        if (currentMode.type == "scatterplot") {
            targetFunction = function (d) {
                return {
                    x: xScale(d[currentMode.xDataField]),
                    y: yScale(d[currentMode.yDataField])
                };
            };
        }
        var targetForceX = d3.forceX(function(d) {return targetFunction(d).x})
            .strength(+BUBBLE_PAR.force_strength);
        var targetForceY = d3.forceY(function(d) {return targetFunction(d).y})
            .strength(+BUBBLE_PAR.force_strength);
        forceSim
            .force("x", targetForceX)
            .force("y", targetForceY);
        forceSim.alphaTarget(1).restart();
    };
    return bubbleChart;
}

/////////////////////////////////////////////////////////////////////////////////////
function ViewMode(button_id, width, height) {
    var mode_index;
    for(mode_index=0; mode_index<BUBBLE_PAR.modes.length; mode_index++) {
        if(BUBBLE_PAR.modes[mode_index].button_id == button_id) {
            break;
        }
    }

    var curMode = BUBBLE_PAR.modes[mode_index];
    this.buttonId = curMode.button_id;
    this.type = curMode.type;

    if (this.type == "grid") {
        this.gridDimensions = curMode.grid_dimensions;
        this.labels = curMode.labels;
        if (this.labels == null) { this.labels = [""]; }
        this.dataField = curMode.data_field;
        this.size = this.labels.length;
        this.gridCenters = {};
        for(var i=0; i<this.size; i++) {
            var cur_row = Math.floor(i / this.gridDimensions.columns);
            var cur_col = i % this.gridDimensions.columns;
            var currentCenter = {
                x: (2 * cur_col + 1) * (width / (this.gridDimensions.columns * 2)),
                y: (2 * cur_row + 1) * (height / (this.gridDimensions.rows * 2))
            };
            this.gridCenters[this.labels[i]] = currentCenter;
        }
    }
    if (this.type == "scatterplot") {
        this.xDataField = curMode.x_data_field;
        this.yDataField = curMode.y_data_field;
        this.xFormatString = curMode.x_format_string;
        this.yFormatString = curMode.y_format_string;
    }

};

/////////////////////////////////////////////////////////////////////////////////////

document.title = BUBBLE_PAR.report_title;
report_title.innerHTML = BUBBLE_PAR.report_title;
var myBubbleChart = createChart();

d3.csv("data/" + BUBBLE_PAR.data_file, function (error, data) {
    if (error) { console.log(error); }
    myBubbleChart('#vis', data);
    myBubbleChart.switchMode(BUBBLE_PAR.modes[0].button_id)
});

function setupButtons() {
    for (i = 0; i<BUBBLE_PAR.modes.length; i++) {
        var button_element = document.createElement("a");
        button_element.href = "#";
        if (i == 0) {
            button_element.className = "button active";
        } else {
            button_element.className = "button";
        }
        button_element.id = BUBBLE_PAR.modes[i].button_id;
        button_element.innerHTML = BUBBLE_PAR.modes[i].button_text;
        document.getElementById("toolbar").appendChild(button_element);
    }
    d3.select('#toolbar')
        .selectAll('.button')
        .on('click', function () {
            d3.selectAll('.button').classed('active', false);
            d3.select(this).classed('active', true);
            var buttonId = d3.select(this).attr('id');
            myBubbleChart.switchMode(buttonId);
        });
}

setupButtons();
