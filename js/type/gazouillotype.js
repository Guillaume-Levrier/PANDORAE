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
