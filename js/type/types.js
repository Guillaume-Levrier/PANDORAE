//========== TYPES ==========
// PANDORAE is a data exploration tools. Once the user's data has been loaded through Flux
// and potentially hand-curated through Zotero and/or rekindled in Chaeros, it is to be sent
// to one of the available Types. Types are simple data visualisation frameworks designed to
// support certain types of data. Each focuses on a certain aspect, and helps the user
// discover patterns on potentially large datasets.


// =========== NODE - NPM ===========
const {remote, ipcRenderer, shell} = require('electron');
const fs = require('fs');
const d3 = require('d3');
const THREE = require('three');
const userDataPath = remote.app.getPath('userData');
const Dexie = require('dexie');

Dexie.debug = true;

let pandodb = new Dexie("PandoraeDatabase");

let structureV1 = "id,date,name";

pandodb.version(1).stores({
  enriched: structureV1,
      scopus: structureV1,
      csljson:structureV1,
      zotero: structureV1,
      twitter: structureV1,
      anthropotype: structureV1,
      chronotype: structureV1,
      geotype: structureV1,
      pharmacotype: structureV1,
      publicdebate: structureV1,
      gazouillotype: structureV1
  });
  pandodb.open();
// =========== LOADTYPE ===========

const loadType = () => {
  xtypeDisplay();
  purgeCore();
  xtypeExists = true;
  coreExists = false;
  document.getElementById("field").value = "";
}


// =========== LINKS ===========
const links = {};
const linkedByIndex = {};
const isConnected = (a, b) => linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;

// =========== DRAG =========
const dragged = (d) => {
  d3.select(this)
      .attr("cx", d.zone = d3.event.x)
      .attr("x", d.zone = d3.event.x);
    }

// ========== TIME ===========
const currentTime = new Date();                           // Precise time when the page has loaded
const Past = d3.timeYear.offset(currentTime,-1);          // Precise time minus one year
const Future = d3.timeYear.offset(currentTime,1);         // Precise time plus one year

// =========== TIME MANAGEMENT ===========
//Parsing and formatting dates
const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%d/%m/%Y");

//locales
const locale = d3.timeFormatLocale({
"dateTime": "%A, le %e %B %Y, %X",
 "date": "%d/%m/%Y",
 "time": "%H:%M:%S",
 "periods": ["AM", "PM"],
 "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
 "Saturday"],
 "shortDays": ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
 "months": ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"],
 "shortMonths": ["Jan.", "Feb.", "Mar", "Avr.", "May", "June", "Jul.","Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
});

const localeFR = d3.timeFormatLocale({
  "dateTime": "%A, le %e %B %Y, %X",
   "date": "%d/%m/%Y",
   "time": "%H:%M:%S",
   "periods": ["AM", "PM"],
   "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi","samedi"],
   "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
   "months": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet","Août", "Septembre", "Octobre", "Novembre", "Décembre"],
   "shortMonths": ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.","Août", "Sept.", "Oct.", "Nov.", "Déc."]
  });

const localeEN = d3.timeFormatLocale({
"dateTime": "%A, le %e %B %Y, %X",
 "date": "%d/%m/%Y",
 "time": "%H:%M:%S",
 "periods": ["AM", "PM"],
 "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
 "Saturday"],
 "shortDays": ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
 "months": ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"],
 "shortMonths": ["Jan.", "Feb.", "Mar", "Avr.", "May", "June", "Jul.","Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
});

const localeZH = d3.timeFormatLocale({
  "dateTime": "%A, le %e %B %Y, %X",
   "date": "%d/%m/%Y",
   "time": "%H:%M:%S",
   "periods": ["AM", "PM"],
   "days": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五","星期六"],
   "shortDays": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
   "months": ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月", "九月", "十月", "十一月", "十二月"],
   "shortMonths": ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月", "九月", "十月", "十一月", "十二月"]
  });

const formatMillisecond = locale.format(".%L"),
    formatSecond = locale.format(":%S"),
    formatMinute = locale.format("%I:%M"),
    formatHour = locale.format("%H"),
    formatDay = locale.format("%d %B %Y"),
    formatWeek = locale.format("%d %b %Y"),
    formatMonth = locale.format("%B %Y"),
    formatYear = locale.format("%Y");

const multiFormat = (date) =>
      (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
      : d3.timeDay(date) < date ? formatHour
      : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
      : d3.timeYear(date) < date ? formatMonth
      : formatYear)(date);

// ========= ANTHROPOTYPE =========
const anthropotype = (datasetAT) => {                 // When called, draw the anthropotype

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

pandodb.anthropotype.get(datasetAT).then(datajson => {

  const data = datajson.content[0].items;          // Humans and institutions are both graph nodes, merging them makes sense
  const links = [];
  
  data.forEach(d=>{
    if (d.title.indexOf("/ Twitter")>0){
      let cleanString = d.title.substring(0,d.title.indexOf(" / Twitter"));
      d.twitterName = cleanString.substring(0,cleanString.indexOf(" (@"));
      d.twitterHandle = cleanString.substring(cleanString.indexOf("(@"),cleanString.length);
    }
  })
  
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
  
  
  //ipcRenderer.send('console-logs',"Starting anthropotype");
  }

// ========== CHRONOTYPE ==========
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
      ipcRenderer.send('console-logs',"Resetting chronotype to initial position.");// Send message in the "console"
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
  pandodb.chronotype.get(bibliography).then(datajson=> {

      var docs = datajson.content;                                          // Second array is the documents (docs)
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
        doc.OA = docs[i].items[j].enrichment.OA;
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
              nodeData[i].num+'</i><br/>'// +
            //  '<img src="././svg/OAlogo.svg" height="16px"/>'
            //  nodeData[i].desc + '<br/><br/>' +
            //  nodeData[i].DOI + '<br/>' +
            //  'Source: <a target="_blank" href="'+
            //  nodeData[i].URL+'">'+
            //  nodeData[i].URL+'</a>'
                );
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
              ipcRenderer.send('console-logs',"Closing chronotype cluster " + d.code);// Send message in the "console"
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
        ipcRenderer.send('console-logs',"Opening chronotype cluster " + d.code);// Send message in the "console"
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
                .on('click', d => {shell.openExternal(d.URL)})   // On click, open url in new tab
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
  /* const linksBuilder = () => {                                                      // links are generated directly in JS
  
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
   */

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
        //d.desc + '<br/><br/>' +
        d.DOI + '<br/>'
        // +
        //'Source: <a target="_blank" href="'+
        //d.URL+'">'+
        //d.URL+'</a>'
      );
  
  ipcRenderer.send('console-logs',"Hovering " + JSON.stringify(d));// Send message in the "console"
  
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
  
  ipcRenderer.send('console-logs',"Starting chronotype");           // Starting Chronotype
  }                                                                 // Close Chronotype function
  
// =========== GEOTYPE =========

const geotype = (locations) => {

  // ========== SVG VIEW ==========
  var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");
  
  svg.attr("width", width-(0.3*width)).attr("height", height);        // Attributing width and height to svg
  
  var view = svg.append("g")                                          // Appending a group to SVG
                .attr("class", "view");                               // CSS viewfinder properties
  
  //globe properties and beginning aspect
  const projection = d3.geoOrthographic()
      .scale(340)
      .translate([width-(0.3*width)*2, height / 2])
      .clipAngle(90)
      .precision(.1)
      .rotate([-20,-40,0]);
  
  //globe, as well as surface projects
  var path = d3.geoPath().projection(projection);
  
  //graticule
  const graticule = d3.geoGraticule();
  
  var velocity = .02;
  
  var zoom = d3.zoom()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0],[1200, 900]])
      .extent([[0, 0],[1200, 900]])
      .on("zoom", zoomed);
  
  //globe outline and background
    view.append("circle")
        .attr("class", "graticule-outline")
        .attr("cx", width-(0.3*width)*2)
        .attr("cy", height / 2)
        .attr("r", projection.scale());
  
  //graticule
    view.append("path")
      .datum(graticule)
      .attr("class", "graticule")
      .attr("d", path);
  
  //parallax
    view.append("parallax")
      .attr("class", "parallax")
      .attr("width", width)
      .attr("height", height)
      .attr("d", path);
  
//Calling data
pandodb.geotype.get(locations).then(locations => {
  var data = locations.content[0].items;
        Promise.all([d3.json("json/world-countries.json")])                
            .then(geo => {

var geoData = geo[0];

  const links = [];
  
  var linksBuffer =[]
  
  const dataArray = [];

  data.forEach(d=>{
      if (d.hasOwnProperty('enrichment')&&d.enrichment.hasOwnProperty('affiliations')){

      d.authors = [];
      if (d.hasOwnProperty('author')){
          for (let j=0;j<d.author.length;j++){
            let element = d.author[j].given+' '+d.author[j].family;
            d.authors.push(element);
          }
      }
      let link = {"DOI":"","points":[]}
      link.DOI = d.DOI;
      for (var k = 0; k < d.enrichment.affiliations.length; k++) {
      if(d.enrichment.affiliations[k].lon!=undefined){
              dataArray.push(d.enrichment.affiliations[k]);
              let thisCity = {"cityname":"","lon":"","lat":""}
              thisCity.cityname = d.enrichment.affiliations[k]['affiliation-city'];
              thisCity.lon = d.enrichment.affiliations[k].lon;
              thisCity.lat = d.enrichment.affiliations[k].lat;
              link.points.push(thisCity);
        }
      }
      linksBuffer.push(link);
    }
  })
  
  for (var i = 0; i < linksBuffer.length; i++) {if (linksBuffer[i].points.length>1) {links.push(linksBuffer[i])}};
  
  
  links.forEach(d=>{
  if (d.points.length<3){
    d.type='LineString';
    d.coordinates=[[],[]];
    d.coordinates[0].push(d.points[0].lon,d.points[0].lat);
    d.coordinates[1].push(d.points[1].lon,d.points[1].lat);
    }
    else{
      d.type='MultiLineString';
      d.coordinates=[];
      for (var i = 0; i < d.points.length-1; i++) {
          let indexCoord = [];
            let subarrayOne = [];
            subarrayOne.push(d.points[i].lon,d.points[i].lat);
            let subarrayTwo = [];
            subarrayTwo.push(d.points[i+1].lon,d.points[i+1].lat);
            indexCoord.push(subarrayOne,subarrayTwo);
            d.coordinates.push(indexCoord)
      }
    }
  })
  
  for (var i = 0; i < data.length; i++) { data[i].index = i;};  // id = item index
  
  data.forEach(d=>{if (d.hasOwnProperty('enrichment') && d.enrichment.hasOwnProperty('affiliations')){}else{data.splice(d.index,1)}});
  
  var cities =  d3.nest().key(d => d['affiliation-city']).entries(dataArray);

  cities.forEach(d=>{
    d.lon = d.values[0].lon;
    d.lat = d.values[0].lat;
    d.country = d.values[0]['affiliation-country'];
    d.affiliations = [];
    d.values = [];
  
    for (var j = 0; j < data.length; j++) {
      if (data[j].hasOwnProperty('enrichment') && data[j].enrichment.hasOwnProperty("affiliations")){
          for (var k = 0; k < data[j].enrichment.affiliations.length; k++) {
          if (data[j].enrichment.affiliations[k]['affiliation-city']===d.key){
            d.affiliations.push(data[j].enrichment.affiliations[k].affilname);
            d.values.push(data[j]);
          }
          }
        }
      }
      
  })
  
  for (var i = 0; i < cities.length; i++) { cities[i].id = i;};  // id = item index
  
  const affilFinder = (city) => {
  
      let institutions=[];
  
        for (var j = 0; j < city.affiliations.length; j++) {
  
          let institution = {"name":"", "papers":[]};
  
          institution.name = city.affiliations[j];
  
          for (var k = 0; k < city.values.length; k++) {
            for (var l = 0; l < city.values[k].enrichment.affiliations.length; l++) {
            if (city.values[k].enrichment.affiliations[l].affilname===city.affiliations[j]) {
              let link = {}
              if (institution.papers.findIndex(paper => paper.title === city.values[k].title)<0) {
                institution.papers.push({"title":city.values[k].title,"DOI":city.values[k].DOI,"OA":city.values[k].enrichment.OA});
              }
           }
         }
        }
        if (institutions.findIndex(f => f.name === city.affiliations[j])<0) {
         institutions.push(institution);
        }
       }
  
      let totalList="";
      institutions.forEach(e=>{
          let localList= "<strong>"+e.name+"</strong><ul>";
              for (var i = 0; i < e.papers.length; i++) {
                let url = "https://dx.doi.org/"+e.papers[i].DOI;
                if (e.papers[i].OA === true) { // If OA flag is true
                  localList = localList+ "<li><img src='././svg/OAlogo.svg' height='16px'/>&nbsp;<a onclick='shell.openExternal("+JSON.stringify(url)+")'>"+e.papers[i].title+"</a></li>"
                } else {  // else just resolve DOI
                localList = localList+ "<li><a onclick='shell.openExternal("+JSON.stringify(url)+")'>"+e.papers[i].title+"</a></li>"
              }
            }
          totalList= totalList+localList+ "</ul>";
      })
  
      return totalList;
  }
  
  
  var countries = view.selectAll("path")
        .data(geoData.features)
        .enter().append("path")
        .attr("class", "boundary")
        .attr("id", d => d.id)
        .attr("d", path);
  
  var collaborations = view.selectAll("lines")
    .data(links)
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", path);
  

  var locations = view.selectAll("locations")
                  .data(cities)
                  .enter().append("path")
                  .attr("id", d => d.id)
                  .attr("class", "locations");
  
        locations.datum(d => d3.geoCircle().center([ d.lon, d.lat ]).radius(.3)())
                  .attr("d", path);
  
        locations.on("mouseover", d => {
                for (var i = 0; i < locations._groups[0].length; i++) {
                    if(d.coordinates[0][0] === locations._groups[0][i].__data__.coordinates[0][0]){
                                            d3.select("#tooltip").transition()
                                               .duration(200)
                                               .style("display", "block");
                                            d3.select("#tooltip").html(
                                              '<strong><h2>' + cities[i].key +
                                              '</strong> <br/><sup>' +cities[i].country +'</sup></h2><br>' +
                                              affilFinder(cities[i])
                                           );
                                          }
                                        }
                                      });
  

// rotate globe

  /*
    //============ NARRATIVE ============
    function narrative(focused) {
      d3.transition()
        .duration(1250)
    .tween("rotate",
      function() {
      var r = d3.interpolate(projection.rotate(), [-focused.longitude, -focused.latitude]);
      return function(t) {
        projection.rotate(r(t));
      };
            })
  
    }
  
    d3.select("#reset").on("click", narrative(data[3]));
  */
})
  });
  
  var λ = d3.scaleLinear()
            .domain([0, width])
            .range([-180, 180]);
  
  var φ = d3.scaleLinear()
            .domain([0, height])
            .range([90, -90]);
  
 var timer = d3.timer(elapsed=>{                                //Rotate globe on start
              projection.rotate([.01 * elapsed, 0]);
              view.selectAll("path").attr("d", path);
              view.selectAll(".graticule").remove();
              view.insert("path", "#AGO")
                .datum(graticule)
                .attr("class", "graticule")
                .attr("d", path);
            })
 


  var drag = d3.drag().subject(()=>{
  
  timer.stop();

  var r = projection.rotate();

            return {
                x: λ.invert(r[0]),
                y: φ.invert(r[1])
              };
           })
    .on("drag", ()=>{
      projection.rotate([λ(d3.event.x), φ(d3.event.y)]);
      view.selectAll("path").attr("d", path);
  
  // The graticule is removed and re-injected below the countries (the first in the list and consequently all others)
  view.selectAll(".graticule").remove();
  view.insert("path", "#AGO")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
  
  });
  
  //drag call
  view.style("transform-origin", "50% 50% 0");
  view.call(drag);
  view.call(zoom);
  
  function zoomed() {view.style('transform', 'scale(' + d3.event.transform.k + ')');
  
        }



          loadType();
  
  ipcRenderer.send('console-logs',"Starting geotype");
  }

// ======== PHARMACOTYPE ==========
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

// ========= GAZOUILLOTYPE =========
const gazouillotype = (dataset,query) => {                             // When called, draw the gazouillotype

  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");       // Creating the SVG node
  
  svg.attr("width",width).attr("height", height);                       // Attributing width and height to svg
  
  var view = svg.append("g")                                            // Appending a group to SVG
                .attr("class", "view");
  
  var brushHeight = 150;                                                // Hardcoding brush height
  
  svg.append("rect")                                    // Inserting a rectangle below the brush to make it easier to read
      .attr("x", 0).attr("y", height-brushHeight)                       // Rectangle starts at top left
      .attr("width", width).attr("height", brushHeight)                 // Rectangle dimensions
      .style("fill", "white")                                           // Rectangle background color
        .style("stroke-width","0");                                     // Invisible borders
  
  var context = svg.append("g")                                         // Creating the "context" SVG group
      .attr("class", "context")                                         // Giving it a CSS/SVG class
      .style("pointer-event","none")
      .attr("transform", "translate(0,"+(height-brushHeight-50)+")");   // Placing it in the dedicated "brush" area
  
  var zoom = d3.zoom()
              .scaleExtent([0.6, Infinity])                                    // Extent to which one can zoom in or out
              .translateExtent([[-200, -Infinity], [Infinity, height+brushHeight]])
              .on("zoom", zoomed);                                     // Trigger the actual zooming function
  
  var brush = d3.brushX()
      .extent([[0, 0], [width, brushHeight-50]]);
      //.on("brush",brushed);
  
  //========== X & Y AXIS  ============                                // Creating two arrays of scales (graph + brush)
  var x = d3.scaleTime().range([0,width-(0.3*width)]),
      x2 = d3.scaleTime().range([0,width-(0.3*width)]);
  
  var xAxis = d3.axisBottom(x).tickFormat(multiFormat);
  var xAxis2 = d3.axisBottom(x2).tickFormat(multiFormat);
  
  var y = d3.scaleLinear().range([height-brushHeight,0]),
      y2 = d3.scaleLinear().range([brushHeight,0]);
  
  var yAxis = d3.axisRight(y);
  
  var area = d3.area()                                                // Brush content is a single object (area)
      .curve(d3.curveMonotoneX)
      .x(d =>x2(d.timespan))
      .y0(brushHeight)
      .y1(d =>y2(d.indexPosition));
  
  var domainDates = [];
  
  // =========== SHARED WORKER ===========
  let typeRequest = {kind:"gazouillotype",dataset:dataset, query:query};
      multiThreader.port.postMessage(typeRequest);
      
  multiThreader.port.onmessage = (res) => {
  
  var dataNest = res.data.dataNest;
  var data = res.data.editedData;
  var median = res.data.median;
  var keywords = res.data.keywords.keywords;
  
  var color = d3.scaleSequential(d3.interpolateBlues)
  .clamp(true)
  .domain([-median*2,median*10]);
  
    var firstDate = new Date(dataNest[0].key);
    var lastDate = new Date(dataNest[dataNest.length-1].key);
    domainDates.push(firstDate,lastDate);
  
    var totalPiles = (domainDates[1].getTime()-domainDates[0].getTime())/600000;
  
    x.domain(domainDates);
    y.domain([0,totalPiles/1.2]);
  
    x2.domain(domainDates);
    y2.domain([0, d3.max(data, d=> d.indexPosition)]);
  
    let radius = 0;
    const radiusCalculator = () => {
    for (var i = 0; i < dataNest.length; i++) {
      if (dataNest[i].values.length>2) {
      radius = (y(dataNest[i].values[1].indexPosition)-y(dataNest[i].values[0].indexPosition))/3;
    break;
        }
      }
    }
  
    radiusCalculator();
  
  const keywordsDisplay = () => {
    document.getElementById("tooltip").innerHTML ="<p> Request content:<br> "+JSON.stringify(keywords)+"</p>";
      };
  
  context.append("path")
      .datum(data)
      .style('fill','steelblue')
      .attr("d", area);
  
  context.append("g")
        .attr("class", "brush")
        .attr("transform", "translate(0,"+(50)+")")
        .call(brush)
        .call(brush.move, x.range())
        .style("cursor","not-allowed");
  
  
  var circle = view.selectAll("circle")
                .data(data)
                .enter().append("circle")
                    .attr("class", "circle")
                   .style('fill',d => color(d.retweet_count))
                   .attr("r", radius)
                   .attr("cx", d => x(d.timespan))
                   .attr("cy", d => y(d.indexPosition))
                     .on("mouseover", function(d) {d3.select(this).style("cursor", "pointer")})
                     .on("click", function(d) {
                             keywords.reduce((res,val) => res.concat(val.split(/ AND /)),[])
                             .forEach(e => {
                              let target = new RegExp('\\b'+e+'\\b','gi');
                               if (target.test(d.text)){
                                 d.text = d.text.replace(target,'<mark>'+e+'</mark>');
                               }
                               if (target.test(d.from_user_name)){
                                 d.from_user_name = d.from_user_name.replace(target,'<mark>'+e+'</mark>');
                               }
                               if (target.test(d.links)){
                                 d.links = d.links.replace(target,'<mark>'+e+'</mark>');
                               }
                             })
                          d3.select("#tooltip").html(
                           '<p class="legend"><strong><a target="_blank" href="https://mobile.twitter.com/'+
                           d.from_user_name+'">' +
                           d.from_user_name + '</a></strong> <br/><div style="border:1px solid black;"><p>' +
                           d.text + "</p></div><br><br> Language: " +
                           d.lang+"<br>Date: "+
                           d.date+ "<br> Favorite count: " + d.favorite_count + "<br>Reply count: "+
                           d.reply_count + "<br>Retweet count: "+
                           d.retweet_count + "<br>Links: <a target='_blank' href='"+
                           d.links+"'>"+
                           d.links+"</a><br> Hashtags: " +
                           d.hashtags+"<br> Mentionned user names: "+
                           d.mentionned_user_names+"<br> Source: "+
                           d.source_name+"<br>Tweet id: <a target='_blank' href='https://mobile.twitter.com/"+d.from_user_name+"/status/"+d.id+"'>"+d.id+"</a><br> Possibly sensitive: "+
                           d.possibly_sensitive+"<br><br> Embeded media<br><img src='"+
                           d.medias_urls+"' width='300' ><br><br><strong>Location</strong><br/>City: "+
                           d.location+"<br> Latitude:"+
                           d.lat+"<br>Longitude: "+
                           d.lng+"<br><br><strong>User info</strong><br><img src='"+
                           d.from_user_profile_image_url+"' max-width='300'><br><br>Account creation date: "+
                           d.from_user_created_at+"<br> Account name: "+
                           d.from_user_name+"<br> User id: "+
                           d.from_user_id  +"<br> User description: "+
                           d.from_user_description + "<br> User follower count: "+
                           d.from_user_followercount+"<br> User friend count: "+
                           d.from_user_friendcount+"<br> User tweet count: "+
                           d.from_user_tweetcount+""+
                         '<br><br>Request content:<br> '+JSON.stringify(keywords)+'<br><br><br><br><br><br><br><br>&nbsp;</p>')});
  
  function narrative(focused) {                                                     // Experimental narrative function
       d3.select("#xtypeSVG")
          .transition().duration(5000)
          .call(zoom.transform, d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(8)
              .translate(-x(focused.timespan), -y(focused.indexPosition)));
  }
  
  narrative(data[0]);
  
  
  
  const reset = () => narrative(data[0]);
  
  d3.select("#option-icon").on("click", reset);           // Clicking the button "reset" triggers the "resetted" function
  
  loadType();
  
  keywordsDisplay();
  /*
  svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height-brushHeight)
        .style("fill","none")
        .style("pointer-events","all")
        .attr("transform", "translate(0,0)")
        .call(zoom);
  */
  }
  //});  //======== END OF DATA CALL (PROMISES) ===========
  
  
  //======== ZOOM & RESCALE ===========
  var gX = svg.append("g")                                          // Make X axis rescalable
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0,"+ (height - 180) +")")
              .call(xAxis);
  
  var gX2 = svg.append("g")                                          // Make X axis rescalable
              .attr("class", "axis axis--x")
              .attr("transform", "translate(0,"+ (height - 50) +")")
              .call(xAxis2);
  
  var gY = svg.append("g")                                          // Make Y axis rescalable
              .attr("class", "axis axis--y")
              .attr("transform", "translate(" + (width -(0.3*width)-70 )+ ",0)")
              .call(yAxis);
  
  svg.call(zoom).on("dblclick.zoom", null);                         // Zoom and deactivate doubleclick zooming
  
  function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    context.select(".brush").call(brush.move, x2.range().map(t.invertX, t));
     view.attr("transform", t);
       gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
       gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
     }
  
  /*
  function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    let target = x.domain();
  
  function medianDate(target) {return new Date(target[0].getTime()+(target[1].getTime()-target[0].getTime())/2)}
  console.log(medianDate(target));
  
     svg.call(zoom.transform, d3.zoomIdentity
         .scale(8)
         .translate(-x(medianDate(target)), -y(10)));
  
  }
  */
  
  function type(d) {
    d.date = new Date(d.created_at);
    d.timespan = new Date(Math.round(d.date.getTime()/600000)*600000);
    d.indexPosition = +d.indexPosition;
    return d;
  }
  ipcRenderer.send('console-logs',"Starting gazouillotype");           // Starting gazouillotype
  }                                                                 // Close gazouillotype function

// ======== TOPOTYPE =======

const topotype = (pubdeb,matching,commun) => {                               // When called, draw the topotype

  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");             // Creating the SVG node
  
  var tooltip = d3.select("tooltip");
  
  var tokenSelected = [];
  
  svg.attr("width", width-(0.3*width)).attr("height", height);                // Attributing width and height to svg
  
  var view = svg.append("g")                                                  // Appending a group to SVG
                .attr("class", "view");                                       // CSS viewfinder properties
  
  const parseTime = d3.timeParse("%Y-%m-%d");                                 // Parsing time function (data encoded)
  const formatTime = d3.timeFormat("%d/%m/%Y");                               // Formatting time function (metric standard)
  const color = d3.scaleLog()                                                 // Color is determined on a log scale
                .domain(d3.extent(d3.range(1, 15)))                           // Domain ranges from 1 to 15
                .interpolate(d => d3.interpolateYlGnBu);                      // Interpolate is the color spectrum
  
  var x = d3.scaleLinear()                                                    // x is a linear scale
            .domain([-140, 140])                                              // Domain means value range on the graph onload
            .range([0, width-(0.3*width)]);                                               // Range is pixel display size
  
  var y = d3.scaleLinear()                                                    // y is a linear scale
      .domain([2000,-800])                                                    // Domain is negative to allow contour display
      .range([0, height]);                                                    // Range is total height
  
  var xAxis = d3.axisBottom(x);                                               // xAxis is the abscissa axis
  var xAxis2 = xAxis;                                                         // xAxis2 is its white contour for lisiblity
  var yAxis = d3.axisRight(y);                                                // yAxis is the yordinate axis
  var yAxis2 = yAxis;                                                         // yAxis white contour for lisiblit
  var xGrid = d3.axisBottom(x).tickSize(height);                              // xGrid is actually axis ticks without axis
  var yGrid = d3.axisRight(y).tickSize(width);                                // Same but for horizontal ticks
  
  var zoom = d3.zoom()                                                        // The graph is zoomable
               .scaleExtent([1, 25])                                          // It can be zoomed/unzoomed on this range
               .translateExtent([[-width,-height], [width*2, height*2]])      // The user can zoom/pan on this area only
               .on("zoom", zoomed);
  
  Promise.all([d3.json(pubdeb, {credentials: 'include'}),                     // Load the main datafile
               d3.json(matching, {credentials: 'include'}),
               d3.json(commun, {credentials: 'include'})                    // Load secondary datafile with prop eval
            ]).then(datajson => {                                             // Then with the response array
            var data = datajson[0];                                           // First array/datafile is rawData var
            var links = datajson[1];                                          // Second is opinionData (-> prop eval)
            var commun = datajson[2];                                          // Second is opinionData (-> prop eval)
  
  var tokens=[];
  
  //managing keywords
  
      for(let i = 0; i < commun.length; i++){
        let token = {};
        token.key = commun[i][0];
        token.count = commun[i][1];        //
        tokens.push(
         "<input class='availableTokens' value='"+token.key+"' name='"+token.key+"' type='checkbox'/><label> " +token.count+" - "+ token.key +"</label><br> ");
      }
  
      var tokenList = "" ;                                      // Create the list as a string
        for (var k=0; k< tokens.length; ++k){                   // For each element of the array
            tokenList = tokenList + tokens[k];        // Add it to the string
          }
  
  const interventionBuilder = (inter,type) => {                               // Create tooltip-displayable data
    let intervention = [];
        switch (type) {
          case 'contrib':                                                     // For contributions
            for (let i = 0; i < inter.length; i++) {
              let item = {};
              item.title = inter[i].contributions_title;
              item.type = inter[i].contributions_section_title;
              item.body = inter[i].contributions_bodyText;
              item.url = inter[i].contributions_url;
              item.votes = [inter[i].contributions_votesCountOk,inter[i].contributions_votesCount,inter[i].contributions_votesCountMitige];
  
              intervention.push("<hr><p class='inter'><strong><a href='"+item.url+"' target='_blank'>"+item.title+"</a> ("+item.type+")</strong><br>"
              +item.body+"<br><i> VOTES: FOR ["+item.votes[0]+"] - AGAINST ["+item.votes[1]+"] - UNDECIDED ["+item.votes[2]+"]</i></p>"); // Push the file in the array
            }
              let contribList = "" ;
              for(var i=0; i<intervention.length; ++i){
                  contribList = contribList + intervention[i];
              }
              tokenSelected.forEach(d => {
                if (contribList.indexOf(d)>-1){
                  let target = new RegExp(d,'gi');
                  contribList = contribList.replace(target,'<mark>'+d+'</mark>');
                }
              })
              document.getElementById('contributions').innerHTML = "<hr><h2>Contributions</h2><br> "+contribList;
  
          break;
  
          case 'arg':                                                         // For arguments
            for (let i = 0; i < inter.length; i++) {
              let item = {};
              item.type = inter[i].contributions_arguments_type;
              item.body = inter[i].contributions_arguments_body;
              item.url = inter[i].contributions_arguments_url;
              item.votes = inter[i].contributions_arguments_votesCount;
              intervention.push("<hr><p class='inter'><strong><a href='"+item.url+"' target='_blank'>"+item.type+"</a></strong><br>"
              +item.body+"<br>Votes supporting this argument : "+item.votes+"</p>"); // Push the file in the array
            }
              let argList = "" ;
              for(var i=0; i<intervention.length; ++i){
                  argList = argList + intervention[i];
              }
              tokenSelected.forEach(d => {
                if (argList.indexOf(d)>-1){
                  let target = new RegExp(d,'gi');
                  argList = argList.replace(target,'<mark>'+d+'</mark>');
                }
              })
              document.getElementById('arguments').innerHTML = "<hr><h2>Arguments</h2><br> "+argList;
  
          break;
                      }
  
                }
    view.append("line")                                                      // Grey line indicating Ordinate at origin
          .attr("x1", d => x(0))
          .attr("y1", d => y(99999))
          .attr("x2", d => x(0))
          .attr("y2", d => y(-99999))
          .style('stroke', "darkgrey")
          .style('stroke-width', 1.5);
  
    view.append("line")                                                      // Grey line indicating Ordinate at origin
          .attr("x1", d => x(9999))
          .attr("y1", d => y(0))
          .attr("x2", d => x(-9999))
          .attr("y2", d => y(0))
          .style('stroke', "darkgrey")
          .style('stroke-width', 1.5);
  
  
    var arrows = view.append("svg:defs").selectAll("marker")
                      .data(["end"])                                         // Different link/path types can be defined here
                    .enter().append("svg:marker")                            // This section adds in the arrows
                      .attr("id", String)
                      .attr("viewBox", "0 -5 10 10")
                      .attr("refX", 150)
                      .attr("refY", 0)
                      .attr("markerWidth", 12)
                      .attr("markerHeight", 12)
                      .attr("orient", "auto")
                      .attr("stroke-width",0.5)
                      .attr("fill","grey")
                      .attr("fill-opacity",.8)
                    .append("svg:path")
                      .attr("d", "M0,-5L10,0L0,5");
  
  var simulation = d3.forceSimulation(data)
              .force('link',d3.forceLink(links).id(d=>d.author_id).strength(0))
              .force('collision', d3.forceCollide(0))
              .force('x', d3.forceX().x(d => x(d.opinionSpectrum.score)))
              .force('y', d3.forceY().y(d => y(d.score.totalScore)))
              .stop();
  
  //d3.timeout(function() {
  
  for (let i = 0, n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i < n; ++i) {
        simulation.tick();
      }
  
      var nodelinks = view.selectAll("line")
                  .data(links)
             .enter().append("line")
                .attr("class",d=> d.type)
                .attr("opacity", d=> Math.log10(0.2+(d.opacity*2)))
                .attr("stroke-width", 0.2)
                .attr("marker-end", "url(#end)")
                .attr("x1", d=> d.source.x)
                .attr("y1", d=> d.source.y)
                .attr("x2", d=> d.target.x)
                .attr("y2", d=> d.target.y);
  
  
   var linkedByIndex = {};
  
   const isConnected = (a, b) => linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
  
    links.forEach(d => {linkedByIndex[d.source.index + "," + d.target.index] = 1;});
        // fade nodes on hover
        function HighLight(opacity) {
            return function(d) {
                nodelinks.style("stroke-opacity", function(o) {
                    return o.source === d || o.target === d ? 1 : opacity;
                });
            };
        }
    function mouseOut() {nodelinks.style("stroke-opacity", d=>Math.log10(0.2+(d.opacity*4)));  }
              //        });
  
  loadType();
  
  
  const updateData = (tokens) => {
  
   var focusTokens = [];
  
  if (tokens === 'fullData') { focusTokens = data;}
  else { focusTokens=  data.filter(item => {
      for (var i = 0; i < tokens.length; i++) {
        if (item.topTerms.indexOf(tokens[i])>-1) {return true}
      }
    });
  }
  
  view.selectAll("path").remove();
  
  densityContour = view.insert("g")                                     // Create contour density graph
             .attr("fill", "none")                                          // Start by making it empty/transparent
             .attr("stroke", "GoldenRod")                                   // Separation lines color
             .attr("stroke-width", .5)                                      // Line thickness
             .attr("stroke-linejoin", "round")                              // Join style
           .selectAll("path")
           .data(d3.contourDensity()                                        // Data format is d3.contourDensity
               .x(d => x(d.opinionSpectrum.score))                          // X is based on opinionSpectrum
               .y(d => y(d.score.totalScore))                               // Y is based on totalScore
               .size([width, height])                                       // Size needs to be defined & stable
               .weight(d => Math.pow(d.score.totalScore,1.2))               // Weight is power function of totalScore
               .bandwidth(9)
               .thresholds(d3.range(1, 20).map(i => Math.pow(1.7, i)))
               (focusTokens, item => item))
                .enter().append("path")
                   .attr("fill",d => color(d.value))                        // Color depends on densityContour value
                   .attr("d", d3.geoPath());
  
  simulation.alpha(1).restart();
  
   var nodes = view.selectAll("circle")
               .data(focusTokens, item => item)                          // Select all relevant nodes
               .exit().remove()                                          // Remove them all
               .data(focusTokens, item => item)
                 .enter().append("circle")
                    .style('fill',"darkgray")
                    .attr('stroke',"black")
                    .attr('stroke-width',.5)
                    .attr("r", 2)
                    .attr("id", d => d.author_id)
                    .attr("cx", d => x(d.opinionSpectrum.score))
                    .attr("cy", d => y(d.score.totalScore))
                    .on("mouseenter", HighLight(0.01))
                    .on("mouseout", mouseOut)
                    .on("mouseover", function(d) {
                         d3.select(this).style("fill", "black");
                         d3.select(this).style("cursor", "crosshair");
                         d3.select("#tooltip").html(
                            '<p class="legend"><strong>Author ID:' + d.author_id +
                            '</strong><br> Amount of Contribtions : '+d.contributions.length +
                            '<br> Amount of Arguments : '+d.args.length +
                            '<br> Amount of Votes : '+d.votes.length +
                            '<br><div id="contributions"></div>'+
                            '<br><div id="arguments"></div></p>')
                        interventionBuilder(d.contributions,"contrib");
                        interventionBuilder(d.args,"arg");
                      });
  
  simulation.nodes(focusTokens);
  
  view.selectAll("line").raise();
  nodelinks.raise();
  nodes.raise();
  
  }
  
  
  
  const reloadList = () => {
  document.getElementById("tooltip").innerHTML ="<form style='line-height:1.5'>"+tokenList+"</form>";
  
  var selectedToken = document.getElementsByClassName('availableTokens');
  
  
  
  
  const selectTokens = () => {
    tokenSelected = [];
    for (let i =0; i<selectedToken.length; i++){
      if (selectedToken[i].checked) {
          tokenSelected.push(selectedToken[i].name)
        }
    }
  
    updateData(tokenSelected);
  
  }
  
  Array.from(selectedToken).forEach(d => {
     d.addEventListener('click', selectTokens);
   });
   updateData('fullData');
  }
  reloadList();
  
  document.getElementById("option-icon").addEventListener("click",reloadList);
  
  
  // add event listener on option-icon
  
  
  
  }); // END OF DATA CALL
  
  
  
  
    // Calling Axes, Grid, Legend and Zoom to be displayed over the main group and to be stable relative to svg while rescaling
  
    var svgWidth = document.getElementById("xtypeSVG").width.animVal.value;
  
    var gXGrid = svg.append("g")
                    .attr("class","grid")
                    .call(xGrid);
  
    var gYGrid = svg.append("g")
                    .attr("class","grid")
                    .call(yGrid);
  
    var gX2 = svg.append("g")
                .attr("transform", "translate(0," + height/2 + ")")
                .attr("fill", "white")
                .attr("class","axishadow")
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .call(xAxis2);
  
    var gY2 = svg.append("g")
                .attr("transform", "translate(" + svgWidth/2 + ",0)")
                .attr("class","axishadow")
                .attr("stroke", "white")
                .attr("stroke-width", 2)
                .call(yAxis2);
  
    var gX = svg.append("g")
                .attr("transform", "translate(0," + height/2 + ")")
                .call(xAxis);
  
    var gY = svg.append("g")
                .attr("transform", "translate(" + svgWidth/2 + ",0)")
                .call(yAxis);
  
    var xLegendLeft = svg.append("text")
                 .attr("x", 10)
                 .attr("y", height/2-5)
                 .attr("stroke", "white")
                 .attr("stroke-width", 2)
                 .attr("text-anchor", "start")
                 .style("font-size","11")
                 .text("← Conservative interventions #");
  
    svg.append("text")
                 .attr("x", 10)
                 .attr("y", height/2-5)
                 .attr("text-anchor", "start")
                 .style("font-size","11")
                 .text("← Conservative interventions #");
  
     var xLegendRight = svg.append("text")
                  .attr("x", width-(0.3*width)-20)
                  .attr("y", height/2-5)
                  .attr("stroke", "white")
                  .attr("stroke-width", 2)
                  .attr("text-anchor", "end")
                  .style("font-size","11")
                  .text("Liberal interventions # →");
  
              svg.append("text")
                  .attr("x", width-(0.3*width)-20)
                  .attr("y", height/2-5)
                  .attr("text-anchor", "end")
                  .style("font-size","11")
                  .text("Liberal interventions # →");
  
    var yLegendTop = svg.append("text")
       .attr("x", -10)
       .attr("y", svgWidth/2-5)
       .attr("stroke", "white")
       .attr("stroke-width", 2)
       .attr("text-anchor", "end")
       .style("font-size","11")
       .attr("transform", "rotate(-90)")
       .text("Intervention impact →");
  
     svg.append("text")
                 .attr("x", -10)
                 .attr("y", svgWidth/2-5)
                 .attr("text-anchor", "end")
                 .style("font-size","11")
                 .attr("transform", "rotate(-90)")
                 .text("Intervention impact →");
  
     var yLegendBot = svg.append("text")
                  .attr("x", -height+30)
                  .attr("y", svgWidth/2-5)
                  .attr("stroke", "white")
                  .attr("stroke-width", 2)
                  .attr("text-anchor", "start")
                  .attr("transform", "rotate(-90)")
                  .style("font-size","11")
                  .text("← Intervention trivialness");
  
     svg.append("text")
                  .attr("x", -height+30)
                  .attr("y", svgWidth/2-5)
                  .attr("text-anchor", "start")
                  .attr("transform", "rotate(-90)")
                  .style("font-size","11")
                  .text("← Intervention trivialness");
  
    svg.call(zoom);
  
    function zoomed() {
         view.attr("transform", d3.event.transform);
         gXGrid.call(xGrid.scale(d3.event.transform.rescaleX(x)));
         gYGrid.call(yGrid.scale(d3.event.transform.rescaleY(y)));
         gX2.call(xAxis2.scale(d3.event.transform.rescaleX(x)));
         gY2.call(yAxis2.scale(d3.event.transform.rescaleY(y)));
         gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
         gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
       };
  
  ipcRenderer.send('console-logs',"Starting topotype");          
  }
  

//========== typesSwitch ==========
// Switch used to which type to draw/generate

const typeSwitch = (type,id) => {


  document.getElementById("field").value = "loading " + type;


      switch (type) {

          case 'anthropotype' : 
            anthropotype(id);
          break;

          case 'chronotype' : 
            chronotype(id);
          break;

          case 'gazouillotype' : 
            gazouillotype(id);
          break;

          case 'geotype' : 
            geotype(id);

          break;

          case 'pharmacotype' : 
            pharmacotype(id);
          break;

          case 'topotype' : 
            topotype(id);
          break;
      }

      ipcRenderer.send('console-logs',"typesSwitch started a "+ type +" process using the following dataset(s) : " + JSON.stringify(id));

}

module.exports = {typeSwitch: typeSwitch};                            // Export the switch as a module
