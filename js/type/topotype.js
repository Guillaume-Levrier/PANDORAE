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


}
