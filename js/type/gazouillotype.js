const gazouillotype = (dataset) => {                          // When called, draw the chronotype

console.log(dataset);

//========== SVG VIEW =============
var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");       // Creating the SVG node

svg.attr("width", width-(0.3*width)).attr("height", height);          // Attributing width and height to svg

var view = svg.append("g")                                            // Appending a group to SVG
              .attr("class", "view");                                 // CSS viewfinder properties

var zoom = d3.zoom()
             .scaleExtent([1, 20])                                    // Extent to which one can zoom in or out
             .translateExtent([[0,0], [width-(0.3*width), height*height]]) // Extent to which one can go up/down/left/right
             .on("zoom", zoomed);                                     // Trigger the actual zooming function

//============ RESET ============
d3.select("#reset").on("click", resetted);           // Clicking the button "reset" triggers the "resetted" function

function resetted() {                                // Going back to origin position function
     d3.select("#xtypeSVG")                          // Selecting the relevant svg element in webpage
        .transition().duration(2000)                 // Resetting takes some time
        .call(zoom.transform, d3.zoomIdentity);      // Using "zoomIdentity", go back to initial position
    ipcRenderer.send('console-logs',"Resetting chronotype to initial position.");// Send message in the "console"
}

//========== X & Y AXIS  ============
var x = d3.scaleTime()                               // Y axis scale
    .domain([Past, Future])                          // First shows a range from minus one year to plus one year
    .range([height, 0]);                             // Size on screen is full height of client

var xAxis = d3.axisBottom(x)                         // Actual X axis
    .scale(x)                                        // Scale has been declared just above
    .ticks(12)                                       // Amount of ticks displayed
    .tickSize(0)                                     // 0 = no vertical lines ; height = vertical lines
    .tickFormat("");                                 // No legend

var y = d3.scaleLinear()                             // X axis scale (each area has its own attributed value)
    .domain([-.3,1.3])
    .range([0, width-(0.3*width)]);                  // Graph size is 0.7 times the client width (0.3 -> tooltip)

var yAxis = d3.axisRight(y)                          // Actual Y axis
    .scale(y)                                        // Scale is declared just above
    .ticks(20)                                       // 20 ticks are displayed
    .tickSize(width)                                 // Ticks are horizontal lines
    .tickPadding(10 - width)                         // Ticks start and end out of the screen
    .tickFormat(multiFormat);                        // Custom legend declared in a different file

//========= LINES & INFO ============



var color = d3.scaleOrdinal()                                                  // Line colors
              .domain([0,1])
              .range(["#08154a","#490027","#5c7a38","#4f4280","#6f611b","#5b7abd","#003f13","#b479a9","#3a2e00","#017099","#845421","#008b97","#460d00","#62949e","#211434","#af8450","#30273c","#bd7b70","#005b5c","#c56883","#a68199"]);

//======== DATA CALL & SORT =========
  Promise.all([                                            // Loading data through promises
     d3.csv(dataset, {credentials: 'include'})])     // Loading documents
          .then(datajson => {

console.log(datajson)

loadType();

});  //======== END OF DATA CALL (PROMISES) ===========


//======== ZOOM & RESCALE ===========
var gX = svg.append("g")                                          // Make X axis rescalable
            .attr("class", "axis axis--x")
            .call(xAxis);

var gY = svg.append("g")                                          // Make Y axis rescalable
            .attr("class", "axis axis--y")
            .call(yAxis);

svg.call(zoom).on("dblclick.zoom", null);                         // Zoom and deactivate doubleclick zooming

function zoomed() {
   view.attr("transform", d3.event.transform);
     gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
     gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
   }

ipcRenderer.send('console-logs',"Starting gazouillotype");           // Starting Chronotype
}                                                                 // Close Chronotype function
