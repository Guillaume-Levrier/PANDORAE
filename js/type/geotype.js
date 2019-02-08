function geotype(locations){

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
Promise.all([
        d3.json("json/world-countries.json", {credentials: 'include'}),
        d3.json(locations,  {credentials: 'include'})])
    .then(datajson => {

var geoData = datajson[0];

var data = datajson[1][0].items;

const links = [];

var linksBuffer =[]

const dataArray = [];

data.forEach(d=>{
    if (d.hasOwnProperty('shortTitle')){
    d.affiliation=JSON.parse(d.shortTitle);
    delete d.shortTitle;
    d.authors = [];
    if (d.hasOwnProperty('author')){
        for (let j=0;j<d.author.length;j++){
          let element = d.author[j].given+' '+d.author[j].family;
          d.authors.push(element);
        }
    }
    let link = {"DOI":"","points":[]}
    link.DOI = d.DOI;
    for (var k = 0; k < d.affiliation.length; k++) {
      dataArray.push(d.affiliation[k]);
      let thisCity = {"cityname":"","lon":"","lat":""}
      thisCity.cityname = d.affiliation[k]['affiliation-city'];
      thisCity.lon = d.affiliation[k].lon;
      thisCity.lat = d.affiliation[k].lat;
      link.points.push(thisCity);
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

data.forEach(d=>{if (d.hasOwnProperty('affiliation')){}else{data.splice(d.index,1)}});

var cities =  d3.nest().key(d => d['affiliation-city']).entries(dataArray);

cities.forEach(d=>{
  d.lon = d.values[0].lon;
  d.lat = d.values[0].lat;
  d.country = d.values[0]['affiliation-country'];
  d.affiliations = [];
  d.values = [];

  for (var j = 0; j < data.length; j++) {
    if (data[j].hasOwnProperty("affiliation")){
        for (var k = 0; k < data[j].affiliation.length; k++) {
        if (data[j].affiliation[k]['affiliation-city']===d.key){
          d.affiliations.push(data[j].affiliation[k].affilname);
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
          for (var l = 0; l < city.values[k].affiliation.length; l++) {
          if (city.values[k].affiliation[l].affilname===city.affiliations[j]) {
            let link = {}
            if (institution.papers.findIndex(paper => paper === city.values[k].title)<0) {
              institution.papers.push({"title":city.values[k].title,"DOI":city.values[k].DOI});
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
              localList = localList+ "<li><a target='blank' href='https://dx.doi.org/"+e.papers[i].DOI+"'>"+e.papers[i].title+"</a></li>"
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
							  .data(cities.filter(d=>{return d.lon != undefined})) // filtering out null island
							  .enter().append("path")
                .attr("id", d => d.id)
								.attr("class", "locations");

      locations.datum(d => d3.geoCircle().center([ d.lon, d.lat ]).radius(.5)())
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

});

//the globe can be dragged
var λ = d3.scaleLinear()
        	.domain([0, width])
        	.range([-180, 180]);

var φ = d3.scaleLinear()
          .domain([0, height])
          .range([90, -90]);

var drag = d3.drag().subject(()=>{

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
