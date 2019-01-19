const gazouillotype = (dataset,query) => {                          // When called, draw the gazouillotype

//========== SVG VIEW =============
var svg = d3.select(xtype).append("svg").attr("id","xtypeSVG");       // Creating the SVG node

var keywordsTooltip = d3.select("#tooltip").append("div").attr("id","keywords");

svg.attr("width", width-(0.3*width)).attr("height", height);          // Attributing width and height to svg

var view = svg.append("g")                                            // Appending a group to SVG
              .attr("class", "view");                                 // CSS viewfinder properties

var zoom = d3.zoom()
            .scaleExtent([0.6, 10])                                    // Extent to which one can zoom in or out
            .translateExtent([[-200, -Infinity], [Infinity, height+100]])
            .on("zoom", zoomed);                                     // Trigger the actual zooming function

//========== X & Y AXIS  ============
var x = d3.scaleTime().range([0,width]);

var xAxis = d3.axisBottom(x).tickFormat(multiFormat);

var y = d3.scaleLinear().range([height,0]);

var yAxis = d3.axisRight(y);

//======== DATA CALL & SORT =========

Promise.all([                                            // Loading data through promises
   d3.csv(dataset, {credentials: 'include'}),        // Loading clusters
   d3.json(query, {credentials: 'include'})])     // Loading documents
        .then(datajson => {

var data = datajson[0];
var keywords = datajson[1].keywords;

var meanRetweetsArray = [];

data.forEach(d=>{
          d.date = new Date(d.created_at);
          d.timespan = new Date(Math.round(d.date.getTime()/600000)*600000);
          if (d.retweet_count>0) {meanRetweetsArray.push(d.retweet_count)};
  })

  meanRetweetsArray.sort((a, b) => a - b);
  var median = meanRetweetsArray[parseInt(meanRetweetsArray.length/2)];

  var color = d3.scaleSequential(d3.interpolateBlues)
                .clamp(true)
                .domain([-median*2,median*10]);

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

var firstDate = new Date(dataNest[0].key);
var twoDaysLater = new Date(firstDate.getTime()+1.728e+8);



x.domain([firstDate,twoDaysLater]);
y.domain([0,200]);

d3.select("#tooltip").html("<p>"+JSON.stringify(keywords)+"</p>");

var circle = view.selectAll("circle")
              .data(data)
              .enter().append("circle")
                 .style('fill',d => color(d.retweet_count))
                 .attr("r", d=> 1.5)
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
                       '<br><br><br><br><br><br><br><br><br><br>&nbsp;</p>')});


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
