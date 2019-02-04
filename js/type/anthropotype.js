function anthropotype(datasetAT){                 // When called, draw the anthropotype

//========== SVG VIEW =============
var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");   // Creating the SVG DOM node

svg.attr("width", width).attr("height", height);                  // Attributing width and height to svg

var view = svg.append("g")                                        // Appending a group to SVG
              .attr("class", "view");                             // CSS viewfinder properties

//zoom extent
var zoom = d3.zoom()                                      // Zoom ability
    .scaleExtent([0.5, 10])                               // To which extent do we allow to zoom forward or zoom back
    .on("zoom", zoomed);                                  // Trigger the "zoomed" function on "zoom" behaviour

//======== DATA CALL & SORT =========
Promise.all([d3.json(datasetAT, {credentials: 'include'})])
    .then(datajson => {

const data = datajson[0][0].items;          // Humans and institutions are both graph nodes, merging them makes sense
const links = [];

data.forEach(d=>{
  if (d.title.indexOf("/ Twitter")>0){
    let cleanString = d.title.substring(0,d.title.indexOf(" / Twitter"));
    d.twitterName = cleanString.substring(0,cleanString.indexOf(" (@"));
    d.twitterHandle = cleanString.substring(cleanString.indexOf("(@"),cleanString.length);
  }
})

console.log(data);

//========== FORCE GRAPH ============
var simulation = d3.forceSimulation()                           // Start the force graph
    .alphaMin(0.1)                                              // Each action starts at 1 and decrements "Decay" per Tick
    .alphaDecay(0.035)                                          // "Decay" value
    .force("link",d3.forceLink()                                // Links has specific properties
                    .strength(0.1)                              // Defining non-standard strength value
                    .distance(30)                               // Defining a minimum distance
                    .id(d => d.twitterHandle))                         // Defining an ID (used to compute link data)
    .force('collision', d3.forceCollide(25)                     // Nodes collide with each other (they don't overlap)
                          .iterations(3))                       // More iterations = more constraints (but more cost)
    .force("charge", d3.forceManyBody(-20))                     // Adding ManyBody to repel nodes from each other
    .force("center", d3.forceCenter(width/2, height/2));        // The graph tends towards the center of the svg

/*
var link = view.selectAll("link")                               // Creatin the link variable
               .data(links)                                     // Link data is stored in the "links" variable
               .enter().append("line")                          // Links are SVG lines
                       .attr("class", d => d.type);             // Their class is defined in their "type" property
*/
//============== NODES ==============
/*  SWITCH BACK TO IT ONCE IMAGE ISSUE IS SOLVED
var nodeImage = view.selectAll("nodeImage")                     // Create nodeImage variable
  .data(humans)                                                 // Using the "humans" variable data
  .enter().append("image")                                      // Append images
          .attr("class","nodeImage")                            // This class contains the circular clip path
          .attr("xlink:href", d => "img/anthropo/"+d.img)       // The image path is stored in the img property
          .attr("height", 12)                                   // Image height
          .attr("width", 12)                                    // Image width
          .style("opacity", d => d.opacity/100)                 // Opacity based on object property
          .style('cursor', 'context-menu')                      // Give a specific cursor
    .on("mouseover", d => {
          d3.select("#tooltip").transition()
            .duration(200)
            .style("display", "block");
          d3.select("#tooltip").html(
          '<strong>' + d.twitterName +' '+ d.twitterHandle +
          //'</strong> <br/> <img class="headshots" src="img/anthropo/'+d.img+'">' +
          d.descEN);})
    .on("mouseenter", HighLight(.2))
    .on("mouseout", mouseOut)
    .call(d3.drag()
        .on("start", forcedragstarted)
        .on("drag", forcedragged)
        .on("end", forcedragended));
*/

var nodeImage = view.selectAll("nodeImage")                     // Create nodeImage variable
  .data(data)                                                 // Using the "humans" variable data
  .enter().append("circle")                                      // Append images
          .style("fill","lightblue")
          .attr("r", 6)
    //      .style("opacity", d => d.opacity/100)                 // Opacity based on object property
          .style('cursor', 'pointer')                      // Give a specific cursor
    .on("mouseover", d => {
          d3.select("#tooltip").transition()
            .duration(200)
            .style("display", "block");
          d3.select("#tooltip").html(
            '<strong>' + d.twitterName +'<br>'+ d.twitterHandle +'</strong>');
          })
    .on("mouseenter", HighLight(.2))
    .on('click', d => {window.open(d.URL,"_blank");})   // On click, open url in new tab
    .on("mouseout", mouseOut)
    .call(d3.drag()
        .on("start", forcedragstarted)
        .on("drag", forcedragged)
        .on("end", forcedragended));

// nodeImage.append("title").text(d => d.twitterHandle);


var handle = view.selectAll("handle")
        .data(data)
        .enter().append("text")
        .attr("pointer-events", "none")
        .attr("class", "humans")
        .attr("dx", 10)
        .attr("dy", 2)
        .style('fill', 'black')
        .text(d => d.twitterHandle)
        .on("mouseout", mouseOut);

var name = view.selectAll("name")
      .data(data)
          .enter().append("text")
          .attr("pointer-events", "none")
          .attr("class", "humans")
          .attr("dx", 10)
          .attr("dy", -2)
          .style('fill', 'black')
          .text(d => d.twitterName)
          .on("mouseout", mouseOut);

function isolate(force, filter) {
  var initialize = force.initialize;
  force.initialize = function() { initialize.call(force, data.filter(filter)); };
  return force;
}

//country-specific relative positions
//simulation.force("countriesCollide", isolate(d3.forceCollide(150), d => d.type === "book"));

//starting simulation
simulation
    .nodes(data)
    .on("tick", ticked);
/*
simulation
    .force("link")
    .links(links);
*/

function ticked() {
  /*
  link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
*/

  nodeImage
  .attr("cx", d => d.x)
  .attr("cy", d => d.y);

  name
  .attr("x", d => d.x)
  .attr("y", d => d.y);

  handle
  .attr("x", d => d.x)
  .attr("y", d => d.y);

// If actual images and not circles
//  nodeImage
//  .attr("x", d => d.x - 6)
//  .attr("y", d => d.y - 6);

}

function forcedragstarted(d) {
  if (!d3.event.active) simulation.alpha(1).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function forcedragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function forcedragended(d) {
  if (!d3.event.active) simulation.alpha(1).restart();
  d.fx = null;
  d.fy = null;
}

//============ NARRATIVE ============
function narrative(focused) {
      d3.select("#xtypeSVG")
         .transition().duration(5000)
         .call(zoom.transform, d3.zoomIdentity
             .translate(width / 2, height / 2)
             .scale(8)
             .translate(-x(focused.x), -y(focused.y)));
}

//============== HOVER ==============
//links.forEach(d => {linkedByIndex[d.source.index + "," + d.target.index] = 1;});

// fade nodes on hover
    function HighLight(opacity) {
        return function(d) {

            nodeImage.style("opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });

            handle.style("opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });
            name.style("opacity", function(o) {
                thisOpacity = isConnected(d, o) ? 1 : opacity;
                return thisOpacity;
            });

        /*    link.style("stroke-opacity", function(o) {
                return o.source === d || o.target === d ? 1 : opacity;
            });
            */
        };
    }

    function mouseOut() {
        nodeImage.style("stroke-opacity", 1);
        nodeImage.style("opacity", 1);
    //    link.style("stroke-opacity", 1);
    //    link.style("stroke", "#ddd");
        handle.style("opacity", 1);
        name.style("opacity", 1);
        d3.select("#tooltip").style("display","none");
        }

loadType();

    });

//======== ZOOM & RESCALE ===========
svg.call(zoom)
   .on("dblclick.zoom", null);

function zoomed() {
   view.attr("transform", d3.event.transform);
   }


ipcRenderer.send('console-logs',"Starting anthropotype");
}
