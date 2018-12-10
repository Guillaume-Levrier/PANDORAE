const chronotype = (bibliography,links) => {                          // When called, draw the chronotype

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
    logInject("Resetting chronotype to initial position"); // Send message in the "console"
}

//========== X & Y AXIS  ============
var x = d3.scaleLinear()                             // X axis scale (each area has its own attributed value)
    .domain([-.3,1.3])
    .range([0, width-(0.3*width)]);                  // Graph size is 0.7 times the client width (0.3 -> tooltip)

var xAxis = d3.axisBottom(x)                         // Actual X axis
    .scale(x)                                        // Scale has been declared just above
    .ticks(12)                                       // Amount of ticks displayed
    .tickSize(0)                                     // 0 = no vertical lines ; height = vertical lines
    .tickFormat("");                                 // No legend

var y = d3.scaleTime()                               // Y axis scale
    .domain([Past, Future])                          // First shows a range from minus one year to plus one year
    .range([height, 0]);                             // Size on screen is full height of client

var yAxis = d3.axisRight(y)                          // Actual Y axis
    .scale(y)                                        // Scale is declared just above
    .ticks(20)                                       // 20 ticks are displayed
    .tickSize(width)                                 // Ticks are horizontal lines
    .tickPadding(10 - width)                         // Ticks start and end out of the screen
    .tickFormat(multiFormat);                        // Custom legend declared in a different file

//========= LINES & INFO ============
var chrono = d3.line()                               // Each zone is represented by a curve, or a "line"
    .x(d => x(d.zone))                               // The X value of each point is defined by "zone" (stable)
    .y(d => y(d.date));                              // The Y value of each point is defined by "date" (changing)

svg.append("rect")                                   // Putting a rectangle above the grid to make dates easier to read
    .attr("x", 0).attr("y", 0)                       // Rectangle starts at top left
    .attr("width", 110).attr("height", 9999)         // Rectangle dimensions
    .style("fill", "white").style("opacity", .8)     // Rectangle background color and opacity
    .style("stroke-width","0");                      // Invisible borders

var color = d3.scaleOrdinal()                                                  // Line colors
              .domain([0,1])
              .range(["#08154a","#490027","#5c7a38","#4f4280","#6f611b","#5b7abd","#003f13","#b479a9","#3a2e00","#017099","#845421","#008b97","#460d00","#62949e","#211434","#af8450","#30273c","#bd7b70","#005b5c","#c56883","#a68199"]);

//======== DATA CALL & SORT =========
  Promise.all([                                            // Loading data through promises
  //   d3.json(clusters, {credentials: 'include'}),        // Loading clusters
     d3.json(bibliography, {credentials: 'include'})])     // Loading documents
          .then(datajson => {

var docs = datajson[0];                                          // Second array is the documents (docs)
const clusters = [];
const links = [];                                                  // Declaring links as empty array
const nodeDocs = [];
var codeFreq = {};

const csl_material = {'paper-conference': 'event', 'NA2': 'dns', 'personal_communication': 'mail', 'article-magazine': 'chrome_reader_mode', 'report': 'tab', 'broadcast': 'radio', 'chapter': 'list', 'webpage': 'web', 'map': 'map', 'manuscript': 'receipt', 'entry-dictionary': 'format_list_numbered', 'entry-encyclopedia': 'art_track', 'NA5': 'add_to_queue', 'NA4': 'video_label', 'NA3': 'question_answer', 'NA1': 'markunread_mailbox', 'interview': 'speaker_notes', 'legal_case': 'announcement', 'thesis': 'note', 'graphic': 'edit', 'motion_picture': 'videocam', 'article-journal': 'timeline', 'article-newspaper': 'dashboard', 'article': 'description', 'post-weblog': 'content_paste', 'speech': 'subtitles', 'patent': 'card_membership', 'song': 'mic', 'book': 'developer_board', 'legislation': 'assignment', 'bill': 'account_balance'};

const dataSorter = () => {

for (let i=0; i<docs.length; i++){                    // loop on main array

let doc = docs[i].items;

doc.forEach(d => {

  if (d.issued) {

    if (d.issued.hasOwnProperty('date-parts') && d.issued['date-parts'][0].length===3){

        d.date = d.issued['date-parts'][0][0]+"-"+d.issued['date-parts'][0][1]+"-"+d.issued['date-parts'][0][2];
        d.date = parseTime(d.date);
        d.category = docs[i].name;
        d.clusterDate = d.issued['date-parts'][0][0]+"-"+d.issued['date-parts'][0][1]+"-"+"15";
        d.code = d.category +"-"+d.clusterDate;
        d.type = csl_material[d.type];
        d.authors = [];

        if (d.author){
            for (let j=0;j<d.author.length;j++){
              let element = d.author[j].given+' '+d.author[j].family;
              d.authors.push(element);
            }
        }

        codeFreq[d.code] = codeFreq[d.code] || 0;
        codeFreq[d.code] += 1;

        let clusterItem = {};
        clusterItem.date = d.clusterDate;
        clusterItem.code = d.code;
        clusterItem.category = d.category;

        if ((clusters.findIndex(clusterItem =>clusterItem.code===d.code))<0) {
                clusters.push(clusterItem);
              }

        d.clusterDate=parseTime(d.clusterDate);

        nodeDocs.push(d);

        }
      } else {d.toPurge = true}
    })
  }
}

dataSorter();

const clustersNest = d3.nest()                                         // Sorting clusters
                       .key(d => d.category)                           // Sorting them by category
                       .entries(clusters);                             // Selecting relevant data

const clusterData = [];

const clusterSorter = () => {
    for (let i = 0; i<clustersNest.length; i++) {
      let zone = i*(1/clustersNest.length);
      clustersNest[i].zone= zone;
      clustersNest[i].values.forEach(d=>{d.zone=zone;d.date=parseTime(d.date);})
      clusterData.push(clustersNest[i]);
    }
}
clusterSorter();

const zonePropagation = () => {
  nodeDocs.forEach(d => {
      for (let i = 0; i<clusterData.length; i++) {
        if (clusterData[i].key === d.category) {d.zone=clusterData[i].zone};
      }
    })
}
zonePropagation();

//Generate the list of items (titles) contained in each circle, i.e. sharing the same code
const titleList = [];

const docTitleLister = () => {
  for (let i=0; i<docs.length; i++){                               // loop on main array
    for (let j=0; j<docs[i].items.length; j++){                    // loop
      let doc = {};
      doc.title = docs[i].items[j].title;
      doc.code = docs[i].items[j].code;
      titleList.push(doc);
    }
  }
}

docTitleLister();

var titlesIndex = {};

var titleNest = d3.nest().key(d => d.code).entries(titleList);
    titleNest.forEach(d => {d.titles = d.values.map(d => d.title)});
    titleNest.forEach(d => {titlesIndex[d.key] = d.titles; });

//========= CHART DISPLAY ===========
var now = view.append("line")                                               // Red line indicating current time
              .attr("x1", -1)                                               // X coordinate of point of origin
              .attr("y1", d => y(currentTime))                              // Y -> current time, declared above
              .attr("x2", 99999)                                            // X coordinate of point of destination
              .attr("y2", d => y(currentTime))                              // Y -> current time, declared above
              .style('stroke', "DarkRed")                                   // Line color
              .style('stroke-width', 0.5);                                  // Line thickness

var displayDate = view.append("text")                                       // Precise date (page loading timestamp)
              .attr("x", width/1.7)                                         // X coordinate, centre-right
              .attr("y", d => y(currentTime))                               // Y coordinate, current time
              .attr("dy", -5)                                               // Place it above the "now" line
              .style('fill', 'darkred')                                     // Font color
              .style('font-size', '0.3em')                                  // Font size
              .text(d => (currentTime));                                    // Actual date string

var lines = view.selectAll("lines")                                         // Lines by category
              .data(clusterData)                                // Loading relevant data, ie nested clusters
            .enter().append("path")                                         // Lines are paths
              .attr("class", "line")                                        // CSS style of the lines
              .attr("d", d => chrono(d.values))                             //Values of each point/cluster of the lines
              .style('stroke', d => color(d.zone))                          // Color according to key
              .style('stroke-width', 1.5);                                  // Stroke width

var shadowLineData = Array.from(clusterData);

    shadowLineData.forEach(d=>{
         let shadowTop = {};
             shadowTop.date = parseTime("2100-01-01");
             shadowTop.zone = d.zone;

         let shadowBot = {};
             shadowBot.date = parseTime("1800-01-01");
             shadowBot.zone = d.zone;

         d.values.push(shadowTop);
         d.values.push(shadowBot);
       })

var shadowLines = view.selectAll("shadowLines")                                         // Lines by category
              .data(shadowLineData)                                // Loading relevant data, ie nested clusters
            .enter().append("path")                                         // Lines are paths
              .attr("class", "shadowLines")                                        // CSS style of the lines
              .attr("d", d => chrono(d.values))                             //Values of each point/cluster of the lines
              .style("opacity",0.5)
              .style('stroke', "grey")                          // Color according to key
              .style('stroke-width', .5);                                  // Stroke width

var categories = view.selectAll("categoriesText")                                     // Display category name
              .data(clusterData)                                 // Loading relevant data, ie nested clusters
            .enter().append("text")                                         // Lines are paths
              .attr("class", "categories")                                  // CSS style of the lines
              .attr("y", d => -x(d.zone))                     // The X value of each category is defined by "zone"
              .attr("x", d => y(currentTime))                               // Y coordinate, current time
              .attr('fill', d => color(d.zone))                          // Color according to key
              .attr("transform", "translate(12,5) rotate(90)")
              .text(d=>d.key)                                          // Category content

d3.select(lines).lower();

//======== CIRCLES/CLUSTERS =========
var circle = view.selectAll("circle")                               // Clusters are represented as circles
                 .data(clusters)                                    // From the "clusters" array of objects
                 .enter().append("circle")                          // Clusters are circles
                    .attr("class", "dot")                           // They have a css class
                    .attr("r", d => {                               // Their radius is computed as follows
                        var n = codeFreq[d.code], k = 10;
                        return Math.log(k * n / Math.PI);})
                    .attr("cx", d => x(d.zone))                     // Their relative X positions are by zone
                    .attr("cy", d => y(d.date))                     // Their relative Y positions are by date
                    .attr("id", d => d.code)                        // Their ID are their codes
                    .style('fill', d => color(d.zone))              // Their color is by zone
                    .each(d => d.circleexpanded === false)          // Their are by default NOT expanded
                    .on("click", CellSelect);                       // Clicking one circle triggers CellSelect

//======== DOC LIST =========
function listDisplay(d) {                           // Expanding a cluster displays the list of docs it contains

  function listToNode() {};                            // Hovering a title highlights the corresponding node

  function listToDoc() {                               // Clicking a title displays the doc's info in tooltip
      for (var i = nodeData.length-1; i >= 0; i--) {                  // Iterating on the potential docs' data
        if (this.id === nodeData[i].title) {                          // Looking for the index of the relevant title
          d3.select("#tooltip").transition()                                        // Once found, display the tooltip
            .duration(200)
            .style("display", "block");
          d3.select("#tooltip").html( '<strong>' +
            nodeData[i].title + '</strong> <br/>' +
            nodeData[i].authors + '<br/>' +
            formatTime(nodeData[i].date) + '<br/>' +
            nodeData[i].category + ' | ' +
            nodeData[i].type +'<br/><i class="material-icons">'+
            nodeData[i].num+'</i><br/>' +
            nodeData[i].desc + '<br/><br/>' +
            nodeData[i].DOI + '<br/>' +
            'Source: <a target="_blank" href="'+
            nodeData[i].URL+'">'+
            nodeData[i].URL+'</a>');
            }
      }
  }

var docTitles = titlesIndex[d.code];

  d3.select("#tooltip").style("display", "block")
     .html('<ul>' +
     docTitles.map(title => '<li id="'+ title +'" class="doc">' + title + '</li>').join('\n') + '</ul>'
    );
  for (var i = 0; i < docTitles.length; i++) {
    document.getElementById(docTitles[i]).addEventListener("mouseover", listToNode)
    document.getElementById(docTitles[i]).addEventListener("click", listToDoc)
        }
  }

function CellSelect(d) {

    if (d.circleexpanded) {                                           // Check if expanded, and if it is, regroup
      let thisCluster = d3.select(this);
      thisCluster                                                     // Apply the following to this selected object
            .each(d => d.circleexpanded = false)                      // Circle isn't considered expanded anymore
            .transition().duration(500)                               // Circle reduction isn't instantaneous
            .attr("r", d => {                                         // Circle reduction = its radius reduction
                var n = codeFreq[d.code], k = 10;                     // Variables used to determine radius
                return Math.log(k * n / Math.PI);});                  // Formula used to compute radius
            regroup(d);                                               // Trigger node regrouping function
            setTimeout(function(){thisCluster.raise();}, 500);        // Put it above the rest (links)
            let logInjection = "Closing chronotype cluster " + d.code;
            logInject(logInjection);
          }
    else {                                                            // Else expand the node
      d3.select(this)                                                 // Apply the following to this selected object
      //.lower()                                                      // Put it below other objects
      .each(d => d.circleexpanded = true)                             // Circle is considered expanded
      .transition().duration(100)                                     // Circle expansion is fast
      .attr("r",d => {                                                // Circle expands as its radius rises
          var n = codeFreq[d.code], k = 18;                           // Variables used to determine radiu
          return Math.sqrt(k * n / Math.PI);});                       // Formula used to compute radius
      expand(d);                                                      // Trigger node expanding funciton
      listDisplay(d);                                                 // Opening cluster lists all its nodes' titles
      d3.select(this).on("mouseover", listDisplay);                   // Hovering cluster does the same
      let logInjection = "Opening chronotype cluster " + d.code;
      logInject(logInjection);
      }
}

//==========  NODE SUB-GRAPHS =======
// Each cluster contains documents, i.e. each "circle" contains "nodes" which are force graphs
var simulation = d3.forceSimulation()                      // starting simulation
    .alphaMin(0.1)                                         // Each action starts at 1 and decrements "Decay" per Tick
    .alphaDecay(0.035)                                     // "Decay" value
    .force("link",d3.forceLink()
                    .distance(0)
                    .strength(0)
                    .id(d =>  d.title))
    .force('collision',d3.forceCollide()                   // nodes can collide
                         .radius(d => d.expanded?1.8:0)    // if expanded is true, they collide with a force superior to 0
                         .iterations(3))
    .force("x", d3.forceX()
                  .strength(d => d.expanded?0.03:0.15)     // nodes are attracted to their X origin
                  .x(d => x(d.zone)))                      // X origin data
    .force("y", d3.forceY()
                  .strength(d => d.expanded?0.03:0.15)     // nodes are attracted to their Y origin
                  .y(d => y(d.clusterDate)));              // Y origin data

//Declaring node variables
var node = view.selectAll("nodes").append('g'),
    nodetext = view.selectAll("nodetext").append('g'),
    nodeData = [];

//=============  EXPAND  ============
// When a shrinked circle is clicked, its nodes come appear and then it expands

const expand = (d) => {

simulation.alpha(1).restart();

// First the relevant nodes in the data, i.e. those whose code is exactly the same as the clicked circle.
var focusNodes = nodeDocs.filter(item => item.code === d.code);

// Then, add those nodes to the group of nodes which are to be displayed by the graph
nodeData.push.apply(nodeData, focusNodes);

//Nodes
node = node.data(nodeData, item => item)                          // Select all relevant nodes
            .exit().remove()                                      // Remove them all
            .data(nodeData, item => item)                         // Reload the data
            .enter().append("circle")                             // Append the nodes
                .attr("r", 1)                                     // Node radius
                .attr("fill", "#bfbfbf")                          // Node color
                .attr("cx", d => x(d.zone))                       // Node X coordinate
                .attr("cy", d => y(d.clusterDate))                // Node Y coordinate
                .attr("id", d => d.code)                          // Node ID (based on code)
                .style('stroke', d => color(d.zone))              // Node stroke color
                .style('stroke-width', 0.1)                       // Node stroke width
                .style('cursor', 'context-menu')                  // Type of cursor on node hover
                .style('opacity', 0.9)                            // Node opacity
                .each(d => d.expanded = true)                     // All those nodes are "expanded"
                .raise()                                          // Nodes are displayed above the rest
                .merge(node);                                     // Merge the nodes

//Node icons are nodes displayed on top of Nodes
nodetext = nodetext.data(nodeData, item => item)                  // Select all relevant nodes
            .exit().remove()                                      // Remove them all
            .data(nodeData, item => item)                         // Reload the data
            .enter().append("text")                               // Append the text
              .attr("class", "material-icons")                    // Icons are material-icons
              .attr("dy", 0.7)                                    // Relative Y position to each node
              .attr("dx", -0.7)                                   // Relative X position to each node
              .attr("id", d => d.code)                            // ID
              .style('fill', 'white')                             // Icon color
              .style('font-size', '1.4px')                        // Icon size
              .text(d => d.type)                                  // Icon
              .on('click', d => {window.open(d.URL,"_blank");})   // On click, open url in new tab
              .on("mouseover", HighLightandDisplay(.2))           // On hover, HighLightandDisplay
              .on("mouseout", mouseOut)                           // On mouseout, mouseOute
              .raise()                                            // Display above nodes and the rest
              .merge(nodetext)                                    // Merge the nodes
              .call(d3.drag()                                     // Dragging behaviour
                  .on("start", forcedragstarted)
                  .on("drag", forcedragged)
                  .on("end", forcedragended));

nodetext.append("title").text(d => d.title);                      // Hovering a node displays its title as "alt"

simulation.nodes(nodeData);                                       // Load new simulation data

}

//============  REGROUP  ============
// When an expanded circle is clicked, its nodes regroup and then disappear

const regroup = (d) => {

simulation.alpha(1).restart();

node
    .filter(function() {return d3.select(this).attr("id") === d.code})            // Find relevant nodes
    .each(d => d.expanded = false)                                                // Remove colliding
    .transition().delay(450).remove();                                            // Delay then remove nodes
nodetext
    .filter(function() {return d3.select(this).attr("id") === d.code})            // Find relevant nodetext
    .transition().delay(450).remove();                                            // Delay dans remove nodetexts

// First move the nodes either at the end of the array in order not to change any onther nodes'
// index as the D3 simulation properties are attributed by index then injected to svg
nodeData.sort(                                                                   // Literally sorts arrays
      function nodeSort(a, b) {                                                  // Comparing values to each other
      return b.expanded - a.expanded;                                            // Place expanded = false at the end
    }
);

// Splicing out removed nodes from nodeData just after they've been removed
setTimeout(                                                                       // Delay erasal to allow regrouping
  function nodeEraser(i, d) {                                                     // Call the function
    for (var i = nodeData.length-1; i >= 0; i--) {                                // Iterate through all elements
        if (nodeData[i].expanded === false) {                                     // Everytime one is not expanded
            nodeData.splice(i, 1);                                                // It gets removed from data
        }
    }
  }, 500);                                                                        // Delay value in milliseconds

simulation.nodes(nodeData);                                                       // Simulation with updated data
}

//========= LINKS BUILDER ===========
const linksBuilder = () => {                                                      // links are generated directly in JS

var dataLink = [];                                                                // Storage variable

docs.forEach(d => {                                                               // Loop on docs (to be changed)
  for (var i = 0; i < chronoLinksKeywords.length; i++) {                          // Loop on keywords
      let keyword = new RegExp(chronoLinksKeywords[i],'gmi');                     // Keyword as a RegExp
          if (d.desc.search(keyword)>0){                                          // If keyword found
            let item = {};                                                        // Store title and keyword in item
            item.keyword = keyword.source;
            item.title = d.title;
            dataLink.push(item);                                                  // Push item in storage variable
            }
        }
  })

let nestedLinks = d3.nest().key(d => d.keyword).entries(dataLink);                // Nest stored data in new var

for (var i = 0; i < nestedLinks.length; i++) {                                    // Loop nested arrays
  let values = nestedLinks[i].values;                                             // Store arrays content

    for (var j = 0; j < values.length; j++) {                                     // Loop arrays content
      let localLinkStorage = [];                                                  // Storage variable

            for (var k = 0; k < values.length; k++) {                             // Loop all elements on each element
              let link = {"source":"","target":"","keyword":""};                  // Storage link
                link.source = values[j].title;
                link.keyword = values[j].keyword;
                link.target = values[k].title;
                links.push(link);                                                 // Push each link to links variable
                          }
        }
    }
}

// linksBuilder is triggered everytime the chronotype is drawn. Links purging and storing functions are needed.
linksBuilder();

var link = view.selectAll("link")                                                 // Create links
      .data(links)                                                                // With data created above
      .enter().append("line")                                                     // Links are SVG lines
        .attr("stroke-width", 0.15)                                               // Links stroke width
        .attr("stroke", "grey")                                                   // Links color
        .style("opacity", 0.5);                                                   // Links opacity

circle.raise();                                                                   // Circles are raised above links

simulation
    .nodes(nodeDocs)                                                                  // Start the force graph with "docs" as data
    .on("tick", ticked);                                                          // Start the "tick" for the first time

simulation
    .force("link")                                                                // Create the links
    .links(links);                                                                // Data for those links is "links"

function ticked() {                                                               // Actual force function
  link                                                                            // Links coordinates
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  node                                                                            // Node coordinates
  .attr("cx", d => d.x)
  .attr("cy", d => d.y);

  nodetext                                                                        // Nodetext (material icons) coordinates
  .attr("x", d => d.x)
  .attr("y", d => d.y);
}

function forcedragstarted(d) {                                                    // On drag, start dragging behaviour
  if (!d3.event.active) simulation.alpha(1).restart();                            // Reheat all force graph
  d.fx = d.x;
  d.fy = d.y;
}

function forcedragged(d) {                                                        // When dragged, the coordinates of the
  d.fx = d3.event.x;                                                              // dragged node is relatively modified
  d.fy = d3.event.y;                                                              // based on pointer position
}

function forcedragended(d) {
  if (!d3.event.active) simulation.alpha(1).restart();                            // When dragging stops, reheat force graph
  d.fx = null;
  d.fy = null;
}

//============ NARRATIVE ============
function narrative(focused) {                                                     // Experimental narrative function
      d3.select("#xtypeSVG")
         .transition().duration(5000)
         .call(zoom.transform, d3.zoomIdentity
             .translate(width / 2, height / 2)
             .scale(8)
             .translate(-x(focused.zone), -y(focused.date)));
}

//============== HOVER ==============
var linkedByIndex = {};                                                           // No links are highlight by default

links.forEach(d => {linkedByIndex[d.source.index + "," + d.target.index] = 1;});  //

// Check the dictionary to see if nodes are linked
function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  }

// Fade nodes on hover
var HighLightandDisplay = (opacity) => {
  return function(d) {

// Display tooltip
  d3.select("#tooltip").transition()
    .duration(200)
    .style("display", "block");
    d3.select("#tooltip").html( '<strong>' +
      d.title + '</strong> <br/>' +
      d.authors + '<br/>' +
      formatTime(d.date) + '<br/>' +
      d.category + ' | ' +
      d.type +'<br/><i class="material-icons">'+
      d.num+'</i><br/>' +
      d.desc + '<br/><br/>' +
      d.DOI + '<br/>' +
      'Source: <a target="_blank" href="'+
      d.URL+'">'+
      d.URL+'</a>');

// check all other nodes to see if they're connected
      node.style("opacity", function(o) {
          thisOpacity = isConnected(d, o) ? 1 : opacity;
          return thisOpacity;
      });
      nodetext.style("opacity", function(o) {
          thisOpacity = isConnected(d, o) ? 1 : opacity;
          return thisOpacity;
      });
      link.style("stroke-opacity", function(o) {
          return o.source === d || o.target === d ? 1 : opacity;
      });
    };
}

const mouseOut = () => {
        node.style("stroke-opacity", 1);
        node.style("opacity", 1);
        link.style("stroke-opacity", 1);
        link.style("stroke", "#ddd");
        nodetext.style("opacity", 1)
        d3.select("#tooltip").style("display", "none");
    }

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

}                                                                 // Close Chronotype function
