const gazouillotype = (dataset,query) => {                          // When called, draw the gazouillotype

console.log(dataset);

//========== SVG VIEW =============
var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");       // Creating the SVG node

svg.attr("width", width-(0.3*width)).attr("height", height);          // Attributing width and height to svg

var view = svg.append("g")                                            // Appending a group to SVG
              .attr("class", "view");                                 // CSS viewfinder properties

var zoom = d3.zoom()
             .scaleExtent([-5, 10])                                    // Extent to which one can zoom in or out
             .on("zoom", zoomed);                                     // Trigger the actual zooming function

//============ RESET ============
d3.select("#reset").on("click", resetted);           // Clicking the button "reset" triggers the "resetted" function

function resetted() {                                // Going back to origin position function
     d3.select("#xtypeSVG")                          // Selecting the relevant svg element in webpage
        .transition().duration(2000)                 // Resetting takes some time
        .call(zoom.transform, d3.zoomIdentity);      // Using "zoomIdentity", go back to initial position
    ipcRenderer.send('console-logs',"Resetting gazouillotype to initial position.");// Send message in the "console"
}

//========== X & Y AXIS  ============
var x = d3.scaleTime().range([0,width*2]);

var xAxis = d3.axisBottom(x).ticks(d3.timeMinute.every(60)).tickFormat(multiFormat);

var y = d3.scaleLinear().range([height*1.5,0]);

var yAxis = d3.axisRight(y);

//======== DATA CALL & SORT =========

Promise.all([                                            // Loading data through promises
   d3.csv(dataset, {credentials: 'include'}),        // Loading clusters
   d3.json(query, {credentials: 'include'})])     // Loading documents
        .then(datajson => {

var data = datajson[0];
var keywords = datajson[1].keywords;
console.log(keywords);

var meanRetweetsArray = [];

data.forEach(d=>{
          d.date = new Date(d.created_at);
          d.timespan = new Date(Math.round(d.date.getTime()/600000)*600000);
          meanRetweetsArray.push(d.retweet_count);
          keywords.forEach(e => {
            if (d.text.indexOf(e)>-1){
              let target = new RegExp(e,'gi');
              d.text = d.text.replace(target,'<mark>'+e+'</mark>');
            }
            if (d.from_user_name.indexOf(e)>-1){
              let target = new RegExp(e,'gi');
              d.from_user_name = d.from_user_name.replace(target,'<mark>'+e+'</mark>');
            }
            if (d.links.indexOf(e)>-1){
              let target = new RegExp(e,'gi');
              d.links = d.links.replace(target,'<mark>'+e+'</mark>');
            }
          })
  })

  meanRetweetsArray.sort((a, b) => a - b);
  let lowMiddle = Math.floor((meanRetweetsArray.length - 1) / 2);
  let highMiddle = Math.ceil((meanRetweetsArray.length - 1) / 2);
  let median = (meanRetweetsArray[lowMiddle] + meanRetweetsArray[highMiddle]) / 2;

  var color = d3.scaleSequential(d3.interpolateBlues)
                .domain([0,median*10]);


  var dataNest = d3.nest()
                    .key(d => {return d.timespan;})
                    .entries(data);

const piler = () => {
    for (i = 0; i < dataNest.length; i++) {
      let j = dataNest[i].values.length + 1;
        for (k = 0; k < dataNest[i].values.length; k++) {
          dataNest[i].values[k].indexPosition = j-1;
          j--;
        }
    }
  }

  piler();

x.domain(d3.extent(data, d => d.timespan));
y.domain(d3.extent(data, d => d.indexPosition));

console.log(data)
console.log(dataNest)

var circle = view.selectAll("circle")
              .data(data)
              .enter().append("circle")
                 .style('fill',d => color(d.retweet_count))
                 .attr("r", d=> 2)
                 .attr("cx", d => x(d.timespan))
                 .attr("cy", d => y(d.indexPosition))
                   .on("click", function(d) {
                        d3.select(this).style("cursor", "pointer");
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
                       '<br><br><br><br><br><br><br><br><br><br>&nbsp;</p>')});


loadType();

});  //======== END OF DATA CALL (PROMISES) ===========


//======== ZOOM & RESCALE ===========
var gX = svg.append("g")                                          // Make X axis rescalable
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0,"+ (height - 50) +")")
            .call(xAxis);

var gY = svg.append("g")                                          // Make Y axis rescalable
            .attr("class", "axis axis--y")
            .attr("transform", "translate(" + (width -420 )+ ",0)")
            .call(yAxis);

svg.call(zoom).on("dblclick.zoom", null);                         // Zoom and deactivate doubleclick zooming

function zoomed() {
   view.attr("transform", d3.event.transform);
     gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
     gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
   }

ipcRenderer.send('console-logs',"Starting gazouillotype");           // Starting gazouillotype
}                                                                 // Close gazouillotype function
