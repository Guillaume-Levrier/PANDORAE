const pharmacotype = (trials) => {

//========== SVG VIEW =============
var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");

svg.attr("width", width).attr("height", height);                      // Attributing width and height to svg

var view = svg.append("g")                                            // Appending a viewroup to SVG
              .attr("class", "view");                                 // CSS viewfinder properties

var zoom = d3.zoom()
             .scaleExtent([0.5, 10])                                    // Extent to which one can zoom in or out
             .on("zoom", zoomed);                                     // Trigger the actual zooming function

//============ RESET ============
d3.select("#reset").on("click", resetted);           // Clicking the button "reset" triggers the "resetted" function

function resetted() {                               // viewoing back to origin position function
     d3.select("#xtypeSVG")                        // Selecting the relevant svg element in webpage
        .transition().duration(2000)                // Resetting takes some time
        .call(zoom.transform, d3.zoomIdentity);    // Using "zoomIdentity", viewo back to initial position
}

//========== X & Y AXIS  ============
//Y axis (timeline)
var x = d3.scaleTime()                               // Y axis scale
    .domain([d3.timeYear.offset(currentTime,-10), Future])
    .range([0, width]);                             // Size on screen is full height of client

//Format of the Y axis
var xAxis = d3.axisBottom(x)                          // Actual Y axis
    .scale(x)                                        // Scale is declared just above
    .tickSize(height-20)
    .ticks(20)                                       // 20 ticks are displayed
    .tickFormat(multiFormat);                        // Custom legend declared in a different file

    var y = d3.scaleLinear()                             // X axis scale (each area has its own attributed value)
        .domain([0,20])
        .range([height, 0]);                          // Screen size is 1.2 times bigger than client width

    //Format of the X axis
    var yAxis = d3.axisRight(y)                         // Actual X axis
        .scale(y)                                        // Scale has been declared just above
        .ticks(12)                                       // Amount of ticks displayed
        .tickSize(3);

var parseClinTime = d3.timeParse("%B %e, %Y");

//======== DATA CALL & SORT =========
  Promise.all([                                                                // Loading data through promises
     d3.csv(trials, {credentials: 'include'})])                  // Loading clinicalTrials
          .then(datacsv => {

            const clinicalTrials = datacsv[0];

            clinicalTrials.forEach(d => {
                d.postDate = parseClinTime(d.FirstPosted);                                    // Parsing the date
                d.lastDate =  parseClinTime(d.LastUpdatePosted);
                d.rank = +d.Rank;                                    // Parsing the date
                d.title = d.Title;
            });

var trials = view.selectAll("lines")
              .data(clinicalTrials)                              // Loading relevant data, ie nested clusters
            .enter().append("line")                                         // Lines are paths
        .attr("y1", d => y(d.rank))
        .attr("y2", d => y(d.rank))
        .attr("x1", d => x(d.postDate))
        .attr("x2", d => x(d.lastDate))
        .style('stroke', "lightblue")             // Node stroke color
        .style('stroke-width', 15)
        .style('stroke-linecap', 'round')                                        // Node stroke width
        .style('cursor', 'context-menu');                                   // Type of cursor on node hover

var trialTitle = view.selectAll("text")
            .data(clinicalTrials)                              // Loading relevant data, ie nested clusters
          .enter().append("text")                                         // Lines are paths
      .attr("class","trialTitles")
      .attr("y", d => y(d.rank))
      .attr("dy", -12)
      .attr("x", d => x(d.postDate))
      .attr("dx", 5)
      .text(d => d.title)
      .style('cursor', 'context-menu')                                   // Type of cursor on node hover
      .on("mouseover", HighLightandDisplay(.2));                            // On hover, HighLightandDisplay

trialTitle.on("mouseout",mouseOut);

      function HighLightandDisplay(opacity) {
        return function(d) {
      //Display tooltip
            d3.select("#tooltip").
transition()
              .duration(200)
              .style("display", "block");
            d3.select("#tooltip").
html('<strong>' + d.title + '</strong> <br/> posted on : ' +
              formatTime(d.postDate) + '<br/>' +
              'Source: <a target="_blank" href="'+d.URL+'">'+d.URL+'</a>');
          };
      }
          function mouseOut() {
              d3.select("#tooltip").
style("display","none");
              }

  loadType();

});

//Make X axis rescalable
var gX = svg.append("g")
            .attr("class", "axis axis--x")
            .call(xAxis);

//Make Y axis rescalable
var gY = svg.append("g")
            .attr("class", "axis axis--y")
            .attr("display","none")
            .call(yAxis);

//Zoom
svg.call(zoom).on("dblclick.zoom", null);

function zoomed() {
   view.attr("transform", d3.event.transform);
     gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
     gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
   }

ipcRenderer.send('console-logs',"Starting pharmacotype");         
}
