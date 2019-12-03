//========== TYPES ==========
// PANDORAE is a data exploration tool. Once the user's data has been loaded through Flux
// and potentially curated through Zotero and/or rekindled in Chaeros, it is to be sent
// to one of the available Types. Types are simple data visualisation frameworks designed to
// support certain types of data. Each focuses on a certain perspective, and helps the user
// discover patterns on potentially larger datasets.

// =========== NODE MODULES ===========

//BEGIN NODE MODULES
const { remote, ipcRenderer, shell } = require("electron");
const fs = require("fs");
const d3 = require("d3");
const csv = require("csv-parser");
const versor = require("versor");

//END NODE MODULES


var field = document.getElementById("field");

const dataDownload = (data) => {

var source = document.getElementById("source")

var datasetName = "";

if (data.hasOwnProperty("id")) {
  datasetName = data.id;
  datasetName = datasetName.replace(/\//ig,"_");
  datasetName = datasetName.replace(/:/ig,"+");
}

source.style.cursor = "pointer";

source.addEventListener("click",e=>{
  fs.writeFile(dialog.showSaveDialog({"defaultPath":datasetName+".json"}),JSON.stringify(data),()=>{
    ipcRenderer.send(
      "console-logs",
      "Downloading dataset "+data.id+".json"
    );
  })

})

}

const localDownload = (data) => {         //same but for exports

setTimeout(()=>{
  var source = document.getElementById("source")
  
  var datasetName = "";
  
  if (data.hasOwnProperty("id")) {
    datasetName = data.id;
    datasetName = datasetName.replace(/\//ig,"_");
    datasetName = datasetName.replace(/:/ig,"+");
  }
  
  source.style.cursor = "pointer";
  
  var a = document.createElement('a');

    var json = JSON.stringify(data);
    var blob = new Blob([json], {type: "application/json"});
    var url  = URL.createObjectURL(blob);    
    a.href=url;
    a.download= datasetName+".json";
    a.textContent = source.innerText;
    source.innerText = ""
    source.appendChild(a)
  },300)
  }

const resizer = () =>location.reload();

//======= NARRATIVE FUNCTIONS =======


const zoom = d3.zoom();
//var drag = d3.drag(); 

var zoomed = (targetDrag,transTime) =>{
  console.log("error: zoom couldn't load")
}

var dragged = (target,transTime) =>{
  console.log("error: drag couldn't load")
}


var currentZoom;
var currentDrag;

const moveTo = (step) => {
 
  let buttons = document.querySelectorAll("div.presentationStep");

  buttons.forEach(but=>{
      but.style.backgroundColor="white";
      but.style.color="black";
  })

  buttons[parseInt(step.stepIndex)-1].style.backgroundColor="black";
  buttons[parseInt(step.stepIndex)-1].style.color="white";

    if (step.hasOwnProperty("slideContent")) {
      showSlide(step.slideContent)
    } else {
      hideSlide()
    }

    if (step.hasOwnProperty("zoom")){
      zoomed(step.zoom,2000);
      currentZoom=step.zoom;
    }

    if (step.hasOwnProperty("drag")){
      dragged(step.drag,2000);
     // currentDrag=step.drag;
    }

}

window.addEventListener("keydown", e=> {

  let buttons = document.querySelectorAll("div.presentationStep");
  let currentButtonId=0;
  
  for (let i = 0; i < buttons.length; i++) {
  if(buttons[i].style.backgroundColor==="black"){
    currentButtonId=i;
  }
  }
  
  switch (e.key) {
    case "ArrowRight":
      if(currentButtonId<=buttons.length-1){
         moveTo(presentationStep[currentButtonId+1])
        }
      break;
  
    case "ArrowLeft" :
        if (currentButtonId>=1){
        moveTo(presentationStep[currentButtonId-1])
        }
      break;
  
    case "Backspace" : 
      if (currentButtonId>0){
      presentationStep.splice(currentButtonId,1)
      regenerateSteps()
      }
    break;
  }
  })

// text slides
const createSlide = () => {

  if (document.getElementById("slide")) {}
  else{
  
    var slide = document.createElement("div");
    slide.id ="slide";
  
    var slideText = document.createElement("input");
        slideText.type = "textarea";
        slideText.id = "slideText";
       
        slide.appendChild(slideText);
  
        document.body.appendChild(slide);
  
        slide.style.animation = "darken 1s forwards";
        slideText.style.animation = "slideIn 1s forwards";
  
    }
  };
  
  
  const showSlide = (text) => {
  
    if (document.getElementById("slide")) {hideSlide()}
    
    var slide = document.createElement("div");
    slide.id ="slide";
  
    var slideText = document.createElement("div");
        slideText.id = "slideText"
        slideText.innerHTML= text;
  
        slide.appendChild(slideText);
  
        document.body.appendChild(slide);
  
        slide.style.animation = "darken 1s forwards";
        slideText.style.animation = "slideIn 1s forwards";
  
  };
  
  const hideSlide = () => {
    
  if (document.getElementById("slide")) {
  
      slide.style.animation = "brighten 1s forwards";
      slideText.style.animation = "slideOut 1s forwards";
  
      setTimeout(() => {
        document.getElementById("slide").remove();
      }, 1100);
    }
  }
  
  const stepCreator = (thisStep) => {

    let stepIndex = thisStep.stepIndex
  
    var step = document.createElement("DIV")
    step.innerText= stepIndex;
    step.className="presentationStep";
    step.id="presentationStep"+parseInt(stepIndex);
  
    step.addEventListener("click",()=>{moveTo(presentationStep[parseInt(stepIndex)-1])})
  
    presentationBox.appendChild(step)
  
  }
  
  const addPresentationStep = () => {
  
    let stepData={zoom:currentZoom,tooltip:JSON.stringify(tooltip.innerHTML),drag:currentDrag}
  
    if (document.getElementById("slideText")){
      stepData.slideContent =document.getElementById("slideText").value;
    }
   
    let buttons = document.querySelectorAll("div.presentationStep");
   let currentButtonId=0;
  
   for (let i = 0; i < buttons.length; i++) {
    if(buttons[i].style.backgroundColor==="black"){
      currentButtonId=i;
    }
   }
  
   if (currentButtonId===0){
    presentationStep.push(stepData)
  } else {
  presentationStep.splice(currentButtonId+1,0,stepData)
  }
   regenerateSteps();
  }
  
  const regenerateSteps = () => {
  
        while (presentationBox.firstChild) {
          presentationBox.removeChild(presentationBox.firstChild)
        }
  
        for (let i = 0; i < presentationStep.length; i++) {
          presentationStep[i].stepIndex=i+1;
          stepCreator(presentationStep[i])
        }
  }
  
  //regenerateSteps();
  
  //


// =========== LOADTYPE ===========
// LoadType is the process that removes the main display canvas and then displays
// the xtype div and xtype SVG element. It is usually called when the data has been
// loaded and rekindled by the type function, i.e. when the visualisation is (almost)
// ready to show
const loadType = () => {
  xtypeDisplay();
  purgeCore();
  xtypeExists = true;
  coreExists = false;
  ipcRenderer.send("audio-channel", "button1");
  field.value = "";
  const exporter = () => categoryLoader('export');
 iconCreator("export-icon",toggleMenu)
 iconCreator("step-icon",addPresentationStep)
 iconCreator("slide-icon",createSlide)
 setTimeout(() => {
  document.getElementById("slide-icon").addEventListener("dblclick",e=>{
    if (document.getElementById("slide")) {
      addPresentationStep();
      hideSlide();
    }
  })
 }, 200);
 
  document.getElementById('fluxMenu').style.display = "none";
  document.getElementById('type').style.display = "none";
  document.getElementById('menu-icon').addEventListener("click", ()=>{
    document.body.style.animation = "fadeout 0.1s";
    setTimeout(() => {
      document.body.remove();
      remote.getCurrentWindow().reload();
    }, 100);
  })


var exportButton = document.createElement("DIV");
exportButton.innerText = "export"
exportButton.className="tabs menu-item"
exportButton.addEventListener("click",e=>categoryLoader('export'))

document.getElementById("menu").insertBefore(exportButton,document.getElementById("quitBut"))

window.onresize = resizer;
};



// =========== XTYPE ===========
const xtype = document.getElementById("xtype"); // xtype is a div containing each (-type) visualisation
var width = xtype.clientWidth; // Fetching client width
var height = xtype.clientHeight; // Fetching client height
var toolWidth = 0.3 * width + 20; // The tooltip is around a third of total available screen width

// =========== PRESENTATION BOX ===========
var presentationBox = document.createElement("div")
presentationBox.id = "presentationBox"
document.body.appendChild(presentationBox)

// ========== TIME ===========
const currentTime = new Date(); // Precise time when the page has loaded
const Past = d3.timeYear.offset(currentTime, -1); // Precise time minus one year
const Future = d3.timeYear.offset(currentTime, 1); // Precise time plus one year

// =========== TIME MANAGEMENT ===========
//Parsing and formatting dates
const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%d/%m/%Y");

//locales
const locale = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  shortDays: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  shortMonths: [
    "Jan.",
    "Feb.",
    "Mar",
    "Avr.",
    "May",
    "June",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec."
  ]
});

const localeFR = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi"
  ],
  shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ],
  shortMonths: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc."
  ]
});

const localeEN = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ],
  shortDays: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ],
  shortMonths: [
    "Jan.",
    "Feb.",
    "Mar",
    "Avr.",
    "May",
    "June",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec."
  ]
});

const localeZH = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  shortDays: [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六"
  ],
  months: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ],
  shortMonths: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月"
  ]
});

const formatMillisecond = locale.format(".%L"),
  formatSecond = locale.format(":%S"),
  formatMinute = locale.format("%I:%M"),
  formatHour = locale.format("%H"),
  formatDay = locale.format("%d/%m/%Y"),
  formatWeek = locale.format("%d %b %Y"),
  formatMonth = locale.format("%m/%Y"),
  formatYear = locale.format("%Y");

const multiFormat = date =>
  (d3.timeSecond(date) < date
    ? formatMillisecond
    : d3.timeMinute(date) < date
    ? formatSecond
    : d3.timeHour(date) < date
    ? formatMinute
    : d3.timeDay(date) < date
    ? formatHour
    : d3.timeMonth(date) < date
    ? d3.timeWeek(date) < date
      ? formatDay
      : formatWeek
    : d3.timeYear(date) < date
    ? formatMonth
    : formatYear)(date);


// ========= ANTHROPOTYPE =========
const anthropotype = id => {  // When called, draw the anthropotype

//========== SVG VIEW =============
  var svg = d3.select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG"); // Creating the SVG DOM node

  svg.attr("width", width).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  //zoom extent
  zoom
    .scaleExtent([0.2, 15]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([[-width * 2, -height * 2], [width * 3, height * 3]])
    .on("zoom", e=> {zoomed(d3.event.transform)}); 

//======== DATA CALL & SORT =========
  pandodb.anthropotype.get(id).then(datajson => {

      dataDownload(datajson);

      const docData = datajson.content[0].items;

      var criteriaList = [];

      docData.forEach(d => criteriaList.push(d.title));

      var currentCriteria = [];

      const menuBuilder = () => {
        criteriaList.forEach(d => {
          let crit = document.createElement("div");
          crit.className = "criteriaTab";
          crit.id = d;
          crit.innerHTML = d;
          crit.onclick = function() {
            cartoSorter(d);
          };
          document.getElementById("tooltip").appendChild(crit);
        });
      };

      //========== FORCE GRAPH ============
      var simulation = d3.forceSimulation() // Start the force graph
        .alphaMin(0.1) // Each action starts at 1 and decrements "Decay" per Tick
        .alphaDecay(0.01) // "Decay" value
        .force("link",d3.forceLink() // Links has specific properties
            .strength(0.08) // Defining non-standard strength value
            .id(d => d.id)
        ) // Defining an ID (used to compute link data)
        .force("collision", d3.forceCollide(5).iterations(5)) // Nodes collide with each other (they don't overlap)
        .force(
          "charge",
          d3.forceManyBody().strength(d => {
            let str = -70;
            if (d.hasOwnProperty("author")) {
              str = str - d.author.length * 35;
            }
            return str;
          })
        ) // Adding ManyBody to repel nodes from each other
        .force("center", d3.forceCenter(width / 2, height / 2)); // The graph tends towards the center of the svg

      var nodeImage = view.selectAll("nodeImage");
          nodeImage.append("title").text(d => d.name);
      var link = view.selectAll("link");
      var masks = view.selectAll("masks");
      var sortInfo = view.selectAll("sortInfo");
      var name = view.selectAll("name");

      const ticked = () => {
        nodeImage.attr("x", d => d.x).attr("y", d => d.y);
        masks.attr("cx", d => d.x).attr("cy", d => d.y);
        name.attr("x", d => d.x).attr("y", d => d.y);
        sortInfo.attr("x", d => d.x).attr("y", d => d.y);

        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
      };

      const cartoSorter = criteria => {
        nodeImage.remove();
        masks.remove();
        name.remove();
        sortInfo.remove();
        link.remove();
        simulation.alpha(1).restart();

        let criteriaIndex = currentCriteria.indexOf(criteria);

        if (criteriaIndex < 0) {
          currentCriteria.push(criteria);
          document.getElementById(criteria).style.backgroundColor = "black";
          document.getElementById(criteria).style.color = "white";
          var newCriteria = { given: "" };
          newCriteria.family = criteria;
        } else {
          currentCriteria.splice(criteriaIndex, 1);
          document.getElementById(criteria).style.backgroundColor = "white";
          document.getElementById(criteria).style.color = "black";
        }

        let data = [];
        let dataCheck = [];
        let links = [];

        currentCriteria.forEach(criteria => {
          docData.forEach(doc => {
            if (doc.title === criteria) {
              doc.id = doc.title;
              doc.author.forEach(auth => {
                let checkCode = auth.family + auth.given;
                if (dataCheck.indexOf(checkCode) < 0) {
                  dataCheck.push(checkCode);
                  auth.crit = [];
                  auth.crit.push(doc.title);
                  data.push(auth);
                } else {
                  for (let j = 0; j < data.length; j++) {
                    if (
                      data[j].family === auth.family &&
                      data[j].given === auth.given
                    ) {
                      data[j].crit.push(doc.title);
                    }
                  }
                }
              });
            }
          });
        });

        data.forEach(d => {
          d.id = d.given + " " + d.family;
          d.crit.forEach(crit => {
            let link = {};
            link.source = d.id;
            link.target = crit;
            links.push(link);
          });
        });

        docData.forEach(doc => {
          for (let i = 0; i < currentCriteria.length; i++) {
            if (currentCriteria[i] === doc.title) {
              data.push(doc);
            }
          }
        });

        nodeImage = view.selectAll("nodeImage") // Create nodeImage variable
          .exit()
          .remove()
          .data(data) // Using the "humans" variable data
          .enter()
          .append("image") // Append images
          .attr("class", "nodeImage") // This class contains the circular clip path
          .attr("height", 40) // Image height
          .attr("width", 40); // Image width

        nodeImage.append("title").text(d => d.name);

        link = view.selectAll("link") // Creatin the link variable
          .exit().remove()
          .data(links) // Link data is stored in the "links" variable
          .enter()
            .append("line")
            .attr("stroke","#d3d3d3")
            .style("fill", "none");

        masks = view.selectAll("masks")
          .exit().remove()
          .data(data)
          .enter()
            .append("circle")
            .attr("r", d => {
              let r = 7;
              if (d.hasOwnProperty("author")) {
                r = r + d.author.length * 4;
              }
              return r;
            })
            .attr("fill", "rgba(63, 191, 191, 0.20)")
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .call(
              d3.drag()
                .on("start", forcedragstarted)
                .on("drag", forcedragged)
                .on("end", forcedragended)
            );

        sortInfo = view.selectAll("sortInfo")
          .exit().remove()
          .data(data)
            .enter()
            .append("text")
            .attr("pointer-events", "none")
            .attr("dx", 0)
            .attr("dy", 0)
            .style("fill", "black");

        name = view.selectAll("name")
          .exit().remove()
          .data(data)
          .enter()
            .append("text")
            .attr("class", "humans")
            .attr("dx", 7)
            .attr("dy", -5)
            .style("fill", "black")
            .style("cursor", "pointer")
            .style("font-size", "15px")
            .style("font-family","sans-serif")
            .on("click", d => {
              name.filter(e => e === d).style("fill", "DeepSkyBlue");
            })
            .on("dblclick", d => {
              name.filter(e => e === d).style("fill", "black");
            })
            .text(d => d.id);

        simulation.nodes(data).on("tick", ticked);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
      };

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

      loadType();
      menuBuilder();
      cartoSorter(docData[0].title);
    }).catch(error => {field.value = "error - invalid dataset";ipcRenderer.send("console-logs","Anthropotype error: dataset " + id + " is invalid.");});

  //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

   zoomed = (thatZoom,transTime) =>{
    view.attr("transform", thatZoom);
  }

  ipcRenderer.send("console-logs", "Starting anthropotype");
};



// ========= FILOTYPE =========
const filotype = id => {
  
  var svg = d3.select(xtype)
  .append("svg")
  .attr("id", "xtypeSVG")
  .style("font-family","sans-serif");

svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

var view = svg.append("g") // Appending a group to SVG
  .attr("id", "view");

  zoom.scaleExtent([0.2, 20])                               // To which extent do we allow to zoom forward or zoom back
      .translateExtent([[-Infinity,-Infinity],[Infinity,Infinity]])
      .on("zoom", e=> {zoomed(d3.event.transform)}); 

  var color = d3.scaleOrdinal(d3.schemeAccent);

     //======== DATA CALL & SORT =========
   
pandodb.filotype.get(id).then(datajson => {
     
  dataDownload(datajson);

    datajson.content.forEach(tweet=>{
      var tweetText = tweet.full_text;
      tweet.mentions = new Array;
// remove mentions from tweet text
       tweet.entities.user_mentions.forEach(user=>{
         var thisMention = "@"+user.screen_name;
         tweetText = tweetText.replace(thisMention,"");
        tweet.mentions.push(user.name)
      }) 

// make several lines out of each tweet
      let line=0;
      for (let i = 0; i < tweetText.length; i+=60) {
       line++
       let thisLine = tweetText.slice(i,i+60)
       if (tweetText[i+59]!= " " && tweetText[i+60]!= " " ) {
         thisLine = thisLine+"-";
       }
       tweet["line"+line] = thisLine;
      }
    })  

    var tree = data => {
      var root = d3.stratify()
                    .id(d => d.id_str)
                    .parentId(d =>d.in_reply_to_status_id_str)(data);
      root.x = 100;
      root.y = 30;
      return d3.tree().nodeSize([root.x, root.y])(root);
    }

      const root = tree(datajson.content);

      let x0 = Infinity;
      let x1 = -x0;
        root.each(d => {
          if (d.x > x1) x1 = d.x;
          if (d.x < x0) x0 = d.x;
        });

      function elbow(d, i) {
             return "M" + d.source.x + "," + d.source.y + "H" + d.target.x + "V" + d.target.y                    
       } 

          var link = view.append("g")
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("stroke-opacity", .5)
                .attr("stroke-width", .2)
                .attr("class","links")
              .selectAll("path")
                .data(root.links())
                .join("path")
                .attr("d", elbow);
                
var lineFontSize = parseFloat(width/500);
              
                var node = view.append("g")
                    .selectAll("g")
                    .data(root.descendants())
                    .join("g")
                      .attr("transform", d => `translate(${d.x},${d.y})`);
                 
                         node.append("clipPath")
                              .attr("id",function(d,i){ return "node_clip"+i })
                              .append("circle")                              
                              .attr("r",5);

                      node.append("image")
                      .attr("y", -lineFontSize*2)
                      .attr("x", -lineFontSize*2)
                      .attr("width",lineFontSize*4)
                      .attr("height",lineFontSize*4)
                      .style("cursor","cell")
                      .attr("xlink:href", d=>d.data.user.profile_image_url_https)
                      .attr("clip-path",function(d,i){ return "url(#node_clip"+i+")" })
                      .on("click",d=>{

                      var id = d.data.id_str;
                      var targets=d.descendants();
                      let polyPoints = []
                      let targetsY = d3.nest().key(d => d.y).entries(targets);
                  
                      for (let i = 0; i < targetsY.length; i++) {
                        let x = d3.min(targetsY[i].values, d => d.x);
                        let y = parseFloat(targetsY[i].key);
                        polyPoints.push([x,y])
                      }

                      for (let i = targetsY.length-1; i > 0; i=i-1) {                       
                        let x = d3.max(targetsY[i].values, d => d.x)+100;
                        let y = parseFloat(targetsY[i].key);
                        polyPoints.push([x,y])
                      }

                     var line = d3.line().curve(d3.curveCardinalClosed)(polyPoints);
     
                        if (document.getElementById(id)){
                          var element = document.getElementById(id);
                          element.parentNode.removeChild(element);
                        } else {
                            var highlighted = view.append("path")
                                                  .attr("d",line)
                                                  .attr("id",id)
                                                  .attr("stroke", color(id))
                                                  .style("fill","transparent");
                                    highlighted.lower();
                          }
                          
                      });
                
                  node.append("text")
                      .attr("dy", -2)
                      .attr("x", 6)
                      .attr("text-anchor","start")
                      .style("font-size",lineFontSize*2)
                      .text(d => d.data.user.name)
                    .clone(true).lower()
                      .attr("stroke", "white");

                      node.append("text")
                      .attr("dy", 1.5)
                      .attr("x", 6)
                      .attr("text-anchor","start")
                      .style("font-size",lineFontSize/2)
                      .text(d => d.data.id_str)
                      .style("cursor","pointer")
                      .on("click",d=>{
                        d3.select("#tooltip").html(
                          '<p class="legend"><strong><a target="_blank" href="https://mobile.twitter.com/' +
                            d.data.user.name +
                            '">' +
                            d.data.user.name +
                            '</a></strong> <br/><div style="border:1px solid black;"><p>' +
                            d.data.full_text +
                            "</p></div><br><br> Language: " +
                            d.data.user.lang +
                            "<br>Mentions: " +
                            d.data.mentions +
                            "<br>Date: " +
                            d.data.created_at +
                            "<br> Favorite count: " +
                            d.data.favorite_count +
                            "<br>Retweet count: " +
                            d.data.retweet_count +
                            "<br> Source: " +
                            d.data.source +
                            "<br>Tweet id: <a target='_blank' href='https://mobile.twitter.com/" +
                            d.data.user.screen_name +
                            "/status/" +
                            d.data.id_str +
                            "'>" +
                            d.data.id_str +
                            "</a>" +
                            "<br><br><strong>User info</strong><br><img src='" +
                            d.data.user.profile_image_url_https +
                            "' max-width='300'><br><br>Account creation date: " +
                            d.data.user.created_at +
                            "<br> Account name: " +
                            d.data.user.screen_name +
                            "<br> User id: " +
                            d.data.user.id +
                            "<br> User description: " +
                            d.data.user.description +
                            "<br> User follower count: " +
                            d.data.user.followers_count +
                            "<br> User friend count: " +
                            d.data.user.friends_count +
                            "<br> User tweet count: " +
                            d.data.user.statuses_count)
                      });
                 
        node.append("text")
            .attr("dy", lineFontSize*2)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line1)
            .clone(true).lower()
            .attr("stroke", "white");

        node.append("text")
            .attr("dy", lineFontSize*3.5)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line2)
            .clone(true).lower()
            .attr("stroke", "white");

        node.append("text")
            .attr("dy", lineFontSize*5)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line3)
            .clone(true).lower()
            .attr("stroke", "white");
        
        node.append("text")
            .attr("dy", lineFontSize*6.5)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line4)
            .clone(true).lower()
            .attr("stroke", "white");

        node.append("text")
            .attr("dy", lineFontSize*8)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line5)
            .clone(true).lower()
            .attr("stroke", "white");

        node.append("text")
            .attr("dy", lineFontSize*9.5)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line6)
            .clone(true).lower()
            .attr("stroke", "white");

        node.append("text")
            .attr("dy", lineFontSize*11)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line7)
            .clone(true).lower()
            .attr("stroke", "white");

        node.append("text")
            .attr("dy", lineFontSize*12.5)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line8)
            .clone(true).lower()
            .attr("stroke", "white");
        
        node.append("text")
            .attr("dy", lineFontSize*14)
            .attr("x", 6)
            .attr("text-anchor","start")
            .style("font-size",lineFontSize)
            .text(d => d.data.line9)
            .clone(true).lower()
            .attr("stroke", "white");

      loadType();
    
      }).catch(error => {console.log(error);field.value = "filotype error";ipcRenderer.send("console-logs","Filotype error: cannot start corpus " + id + ".");});

     //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

  zoomed = (thatZoom,transTime) => view.attr("transform", thatZoom);
  
     ipcRenderer.send("console-logs", "Starting Filotype");
   };

/*
// ========= CALENDOTYPE =========
// a better way to manage events rather than documents.
const calendotype = id => {
  
  var svg = d3.select(xtype)
  .append("svg")
  .attr("id", "xtypeSVG")
  .style("font-family","sans-serif");

svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

var view = svg.append("g") // Appending a group to SVG
  .attr("id", "view");

  zoom.scaleExtent([0.2, 20])                               // To which extent do we allow to zoom forward or zoom back
      .translateExtent([[-Infinity,-Infinity],[Infinity,Infinity]])
      .on("zoom", e=> {zoomed(d3.event.transform)}); 

  var color = d3.scaleOrdinal(d3.schemeAccent);

     //======== DATA CALL & SORT =========
   
pandodb.calendotype.get(id).then(datajson => {
     
  dataDownload(datajson);

  //parse dates into actual js dates
  //datajson.forEach()

 // parse by day
 const data = d3.nest().key(d.date.getUTCDate()).entries(datajson);

  const years = d3.nest()
      .key(d => d.date.getUTCFullYear())
    .entries(data)
    .reverse();


      loadType();
    
      }).catch(error => {console.log(error);field.value = "filotype error";ipcRenderer.send("console-logs","Filotype error: cannot start corpus " + id + ".");});

     //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

  zoomed = (thatZoom,transTime) => view.attr("transform", thatZoom);
  
     ipcRenderer.send("console-logs", "Starting Filotype");
   };
*/
// ========= DOXATYPE =========
const doxatype = id => {
  
var tweetList = document.createElement("div");
    tweetList.id = "tweetList"
    document.getElementById("xtype").append(tweetList)

   //======== DATA CALL & SORT =========
 
   pandodb.doxatype.get(id).then(datajson => {
   
    dataDownload(datajson);


    var totalTweets = datajson.content;

    var visTweets = [];

        const purgeList = () => {
          var child = tweetList.lastElementChild;  
          while (child) { 
            tweetList.removeChild(child); 
              child = tweetList.lastElementChild; 
          } 
        }

    const displayTweets = (tweets) => {

      tweets.forEach(tweet=>{
          let thisTweet= document.createElement("div");
          thisTweet.id = tweet.id;
          thisTweet.className = "doxaTweet";
          let url = "https://twitter.com/i/web/status/"+tweet.id
          thisTweet.innerHTML = "<img class='doxaHS' src="+tweet.from_user_profile_image_url+">"+
          "<strong>"+tweet.from_user_name+"</strong> <i style='cursor:pointer' onclick='shell.openExternal("+JSON.stringify(url)+")'>"+ tweet.id +"</i>"+"<br>"+
          tweet.text+"<br>"+
          tweet.created_at;
          tweetList.appendChild(thisTweet)
      })
    }

      const updateVisible = () => {
        visTweets = [];
        var options = document.getElementsByClassName("toggleOptions");
        for (let i = 0; i < options.length; i++) {
          if (options[i].checked) {
            for (var cat in totalTweets) {
              if (cat === options[i].id) {
                totalTweets[cat].forEach(tweet=>visTweets.push(tweet));
              }
            }
          }
        }
        purgeList();
        displayTweets(visTweets);
        console.log(visTweets)
      }

    var toggleList = document.createElement("FORM");
        toggleList.id = "toggleList";

    for (var cat in totalTweets) {
      var toggleOption = document.createElement("INPUT");
      toggleOption.id = cat;
      toggleOption.type ="checkbox";
      toggleOption.className = "toggleOptions"
      toggleOption.onclick = updateVisible;

      var toggleLabel = document.createElement("LABEL");
      toggleLabel.id = "cat";
      toggleLabel.innerText="("+totalTweets[cat].length+") - "+cat;
      
      toggleList.appendChild(toggleOption);
      toggleList.appendChild(toggleLabel);
      toggleList.appendChild(document.createElement("BR"));

    }

    loadType();
    var title = document.createElement("h2");
    title.innerText=datajson.name;
    document.getElementById("tooltip").appendChild(title);
    document.getElementById("tooltip").appendChild(toggleList);
    }).catch(error => {console.log(error);field.value = "error - Cannot start corpus";ipcRenderer.send("console-logs","Doxa error: cannot start corpus " + id + ".");});
 
   ipcRenderer.send("console-logs", "Starting Doxatype");
 };


// ========= HYPHOTYPE =========
const hyphotype = id => {
  
 //  SVG VIEW 
  var svg = d3.select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG")
    .style("cursor","move"); // Creating the SVG DOM node

    svg.style("background-color","#e6f3ff")

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg.append("g") // Appending a group to SVG
    .attr("id", "view");

  //zoom extent
  
  zoom.scaleExtent([0.2, 20])                               // To which extent do we allow to zoom forward or zoom back
      .translateExtent([[-width*2,-height*2],[width*3,height*3]])
      .on("zoom", e=> {zoomed(d3.event.transform)});                                  // Trigger the "zoomed" function on "zoom" behaviour

  
      var color =  d3.scaleOrdinal()
      .domain([0, 1])    
      .range(["#1d302a",
      "#d971db",
      "#76b940",
      "#4a238b",
      "#4abe73",
      "#965bd3",
      "#c2ae3b",
      "#5a6bd7",
      "#cf7f2f",
      "#5e8adb",
      "#d24a34",
      "#59beaf",
      "#dc4492",
      "#55812f",
      "#9f3094",
      "#85b789",
      "#342564",
      "#aaaa6c",
      "#86519a",
      "#816e2a",
      "#ba93d4",
      "#364e25",
      "#c53a5c",
      "#43815e",
      "#d574a8",
      "#5cafce",
      "#863a23",
      "#97a0c4",
      "#4a2023",
      "#d1976f",
      "#381d3d",
      "#aca393",
      "#802c58",
      "#4e7a7c",
      "#d6756d",
      "#576095",
      "#604b30",
      "#d699ac",
      "#3c4b63",
      "#8c5f6b"]);
   
    var colorFill = d3.scaleLog()                                                 // Color is determined on a log scale
    .domain(d3.extent(d3.range(1, 11)))                           // Domain ranges from 1 to 15
    .interpolate(d => d3.interpolateOranges);                      // Interpolate is the color spectrum


    var x = d3.scaleLinear()                                                    // x is a linear scale
    .domain([-width, width])                                              // Domain means value range on the graph onload
    .range([0, width-toolWidth]);                                               // Range is pixel display size

var y = d3.scaleLinear()                                                    // y is a linear scale
.domain([height,-height])                                                    // Domain is negative to allow contour display
.range([0, height]);                                                    // Range is total height

var xAxis = d3.axisBottom(x);                                               // xAxis is the abscissa axis
var xAxis2 = xAxis;                                                         // xAxis2 is its white contour for lisiblity
var yAxis = d3.axisRight(y);                                                // yAxis is the yordinate axis
var yAxis2 = yAxis;                                                         // yAxis white contour for lisiblit
var xGrid = d3.axisBottom(x).tickSize(height);                              // xGrid is actually axis ticks without axis
var yGrid = d3.axisRight(y).tickSize(width);                                // Same but for horizontal ticks


  //======== DATA CALL & SORT =========

  pandodb.hyphotype.get(id).then(datajson => {

      var tooltipTop ="<strong>" + datajson.name.toUpperCase() + "</strong></br>";

      dataDownload(datajson);

      var links = [];

      if (datajson.hasOwnProperty("presentationStep")) { presentationStep = datajson.narrative};

      let corpusStatus = datajson.content.corpusStatus;

      let weStatus = datajson.content.weStatus;

      let nodeData = datajson.content.nodeData;

      let networkLinks = datajson.content.networkLinks;

      let tags = datajson.content.tags;
      
       for (var subTag in tags) {
         let taggedNodes=0;
      
        for (let tagVal in tags[subTag]) {
         
          taggedNodes = taggedNodes+ tags[subTag][tagVal]
        }
       tags[subTag].NA = parseInt(nodeData.length-taggedNodes);
      }
 
      var tagDiv= ""

      for (var prop in tags) {
        tagDiv = tagDiv +  '<option value="'+prop+'">'+prop+'</option>';

      }
      tagDiv = tagDiv +  "</select>"


      for (let j = 0; j < nodeData.length; j++) {
        for (let i = 0; i < networkLinks.length; i++) {
          let link = {}
          if(nodeData[j].id===networkLinks[i][0]){
            for (let f = 0; f < nodeData.length; f++) {
              if(nodeData[f].id===networkLinks[i][1]){
                link.source = networkLinks[i][0];
                link.target = networkLinks[i][1];
                link.weight = networkLinks[i][2];
                links.push(link);
              }
            } 
           } 
      }
    }
     
      weStatus = weStatus[weStatus.length-1];
      
      tooltipTop = tooltipTop + 
      "<br> Corpus ID: "+ corpusStatus.corpus_id +
      "<br> Corpus status: " + corpusStatus.status +
      "<li> Total: " + weStatus.total + "</li>"+
      "<li> Discovered: " + weStatus.discovered + "</li>"+
      "<li> Undecided: " + weStatus.undecided + "</li>"+
      "<li> Out: " + weStatus.out + "</li>"+
      "<li> In: " + weStatus.in + "</li>"+
      "</ul><br>Filtrer par tags<br><select id='tagDiv'>"+tagDiv+"<br><div id='tagList'></div>"+
      "<br><br><div id='weDetail'></div><br><br><br><div id='whois'></div><br><br><br><br><br>";

      multiThreader.port.postMessage({type:"hy", nodeData:nodeData,links:links, tags:tags,width:width,height:height});

      multiThreader.port.onmessage = hyWorkerAnswer => {
      
        if (hyWorkerAnswer.data.type==="tick") {progBarSign(hyWorkerAnswer.data.prog)} else  // removed in export

        if (hyWorkerAnswer.data.type === "hy") {

      nodeData = hyWorkerAnswer.data.nodeData;
      links = hyWorkerAnswer.data.links;
      contours = hyWorkerAnswer.data.contours;
       
    var densityContour = view.insert("g")                                     // Create contour density graph
       .attr("fill", "none")                                          // Start by making it empty/transparent
       .attr("class","contours")
       .attr("stroke", "GoldenRod")                                   // Separation lines color
       .attr("stroke-width", .5)                                      // Line thickness
       .attr("stroke-linejoin", "round")                              // Join style
     .selectAll("path")
     .data(contours)
     .enter().append("path")
       .attr("stroke-width", .5)
       .attr("fill",d => colorFill(d.value*100))
       .attr("d", d3.geoPath());

const drawAltitudeLevel = (selectedData) => {

    var thresholds = [];

    selectedData.forEach(thisContour => thresholds.push(parseInt(thisContour.value*10000)));

    function addlabel(text, xy, angle) {

      angle += Math.cos(angle) < 0 ? Math.PI : 0;
      
      labels_g.append("text")
              .attr("fill", "#fff")
              .attr("stroke", "none")
              .attr("class", "labels")
              .attr("text-anchor", "middle")
              .attr("dy", "0.3em")
              .attr("transform", `translate(${xy})rotate(${parseInt(angle * (180 / Math.PI))})`)
              .style("font-weight","bolder")
              .text(text)
              .style("font-size", ".5px");
    }


var labels_g = view.append("g").attr("id","labels_g");

    for (const cont of selectedData) {
    
        cont.coordinates.forEach(polygon =>
          polygon.forEach((ring, j) => {
            const p = ring.slice(1, Infinity),
              possibilities = d3.range(cont.coordinates.length, cont.coordinates.length * 5),
              scores = possibilities.map(d => -((p.length - 1) % d)),
              n = possibilities[d3.scan(scores)],
              start = 1 + (d3.scan(p.map(xy => (j === 0 ? -1 : 1) * xy[1])) % n),
              margin = 2;
  
            p.forEach((xy, i) => {
              if (
                i % n === start &&
                xy[0] > margin &&
                xy[0] < width - margin &&
                xy[1] > margin &&
                xy[1] < height - margin
              ) {
                const a = (i - 2 + p.length) % p.length,
                  b = (i + 2) % p.length,
                  dx = p[b][0] - p[a][0],
                  dy = p[b][1] - p[a][1];
                if (dx === 0 && dy === 0) return;
  
                addlabel(parseInt(cont.value*10000), xy, Math.atan2(dy, dx));
              }
            });
          })
        );
    }
  }
  
  drawAltitudeLevel(contours);
   
    var nodes = view.insert("g")
                  .selectAll("circle")
                    .data(nodeData)
                    .enter().append("circle")
                        .style('fill',d=>color(d.tags.USER))
                        .attr('stroke',"black")
                        .attr('cx',d=>d.x)
                        .attr('cy',d=>d.y)
                        .style("cursor","pointer")
                        .attr('stroke-width',.2)
                        .attr("r", d=> 1+Math.log(d.indegree+1))
                        .attr("id", d => d.id)
                        .on("click",d=>{
                          var weDetail = "<h3>WE Detail</h3>";

                          for (var prop in d){
                            weDetail = weDetail+ "<br><strong>"+ prop + "</strong>: "+d[prop];
                          }

                            document.getElementById("weDetail").innerHTML = weDetail;
                            document.getElementById("whois").innerHTML = ""; 

                    (async function(){
                      const whois = require('whois-json')

                       var whoisDetails = await whois(d.name);
                           
                      var whoisResult = "<h3>Whois result</h3>";
                      for (var prop in whoisDetails){
                        whoisResult = whoisResult+ "<br><strong>"+ prop + "</strong>: "+whoisDetails[prop];
                      }

                            document.getElementById("whois").innerHTML = whoisResult;
                          })()

                        });
 
const addWeTitle = () =>{

var webEntName= view.selectAll(".webEntName") 
        .data(nodeData)
        .enter().append("text")
        .attr("class","webEntName")
        .attr("id",d=>d.name)
        .style("font-size","2px")
        .attr("x",d=>d.x)
        .attr("y",d=>d.y)
        .attr("dy",-.5)
        .style("font-family","sans-serif")
        .text(d=>d.name);

        document.querySelectorAll(".webEntName").forEach(d=> d.__data__.dx = -d.getBBox().width/2)
        webEntName.attr("dx",d=>d.dx)

        nodeData.forEach(d=>d.box=document.getElementById(d.name).getBBox());

  var webEntNameRect =  view.selectAll("rect") 
           .data(nodeData)
           .enter().append("rect")
           .attr("class","contrastRect")
           .attr("fill","white")
           .attr("stroke","black")
           .attr("stroke-width",.1)
           .attr("x",d=>d.box.x)
           .attr("y",d=>d.box.y)
           .attr("width",d=>d.box.width+1)
           .attr("height",d=>d.box.height+.2);  

           nodes.raise();  
           webEntName.raise()  

          }

    addWeTitle();

const resetContourGraph = () => {

  d3.selectAll(".contours").remove();
  d3.select("#labels_g").remove();
  
  view.insert("g")                                     // Create contour density graph
  .attr("fill", "none")                                          // Start by making it empty/transparent
  .attr("class","contours")
  .attr("stroke", "GoldenRod")                                   // Separation lines color
  .attr("stroke-width", .5)                                      // Line thickness
  .attr("stroke-linejoin", "round")                              // Join style
      .selectAll("path")
      .data(contours)
      .enter().append("path")
        .attr("stroke-width", .5)
        .attr("fill",d => colorFill(d.value*100))
        .attr("d", d3.geoPath());

  drawAltitudeLevel(contours);
  
  d3.selectAll(".contours").lower();
  d3.selectAll("circle").attr("opacity","1")
  d3.selectAll(".contrastRect").attr("opacity","1")
  d3.selectAll(".webEntName").attr("opacity","1")
  d3.selectAll(".labels").attr("opacity","1")

}

const displayContour = () => {

let checkTags = document.querySelectorAll("input.tagCheckbox")

let cat=document.getElementById("tagDiv").value;

let tags = []

checkTags.forEach(box=>{if (box.checked) {tags.push(box.value)}});



  d3.selectAll(".contours").remove();

  

  view.insert("g")                                     // Create contour density graph
  .attr("fill", "none")                                          // Start by making it empty/transparent
  .attr("class","contours")
  .attr("id","oldContour")
  .attr("stroke", "GoldenRod")                                   // Separation lines color
  .attr("stroke-width", .5)                                      // Line thickness
  .attr("stroke-linejoin", "round")                              // Join style
  .attr("opacity",.25)
    .selectAll("path")
    .data(contours)
    .enter().append("path")
      .attr("stroke-width", .5)
      .attr("fill",d => colorFill(d.value*100))
      .attr("d", d3.geoPath());
      d3.selectAll(".contours").lower();


var tagNodes=[];

tags.forEach(tag=>{
  let thisTagNodes = nodeData.filter(item => item.tags.USER[cat][0] === tag);
  thisTagNodes.forEach(node=>tagNodes.push(node))
})


 

  var thisContour = d3.contourDensity()      
                      .size([width, height])                
                      .weight(d => d.indegree)              
                      .x(d => d.x)                       
                      .y(d => d.y)                       
                      .bandwidth(9)
                      .thresholds(d3.max(tagNodes,d=>d.indegree))(tagNodes);

d3.select("#labels_g").remove();

 var thisContourPath =  view.insert("g")                                     // Create contour density graph
    .attr("fill", "none")                                          // Start by making it empty/transparent
    .attr("class","contours")
    .attr("stroke", "GoldenRod")                                   // Separation lines color
    .attr("stroke-width", .5)                                      // Line thickness
    .attr("stroke-linejoin", "round")                              // Join style
        .selectAll("path")
        .data(thisContour)
        .enter().append("path")
          .attr("stroke-width", .5)
          .attr("fill",d => colorFill(d.value*100))
          .attr("d", d3.geoPath());

    drawAltitudeLevel(thisContour);

    d3.selectAll(".contours").lower();          
    d3.select("#oldContour").lower();          
    d3.selectAll("circle").attr("opacity",".1")
    d3.selectAll(".contrastRect").attr("opacity",".1")
    d3.selectAll(".webEntName").attr("opacity",".1")
    tags.forEach(tag=>{
      d3.selectAll("circle").filter(item => item.tags.USER[cat][0] === tag).attr("opacity","1");
      d3.selectAll(".contrastRect").filter(item => item.tags.USER[cat][0] === tag).attr("opacity","1");
      d3.selectAll(".webEntName").filter(item => item.tags.USER[cat][0] === tag).attr("opacity","1");
    })

  
    d3.select("#legend").remove();

    var legend = svg.insert("g").attr("id","legend")

    var shownTags="";

    for (let i = 0; i < tags.length; i++) {
      shownTags = shownTags+tags[i]+" "
    }

    var legendText = legend.append('text').text(cat+" - "+shownTags);

       let textBound=document.querySelector('#legend').getBBox()
      
        legend.append("rect")
                .attr("id","legend")
                .attr("fill","white")
                .attr("stroke","black")
                .attr("stroke-width",.5)
                .attr("x",width-toolWidth-parseInt(textBound.width)-20)
                .attr("y",height-30)
                .attr("width",parseInt(textBound.width)+20)
                .attr("height",30);
      
                legendText.attr("x",width-toolWidth-parseInt(textBound.width)-15)
                .attr("y",height-30)
                .attr("dx",5)
                .attr("dy",20);

                legendText.raise();

} 


      const showTags = (tag,list) =>{

          let tagList = document.getElementById(list);
          tagList.innerHTML="";
          let thisTagList = document.createElement("DIV");
          let tagsArray = []
    
          for (var prop in tags) {

            if(prop === tag) {
            
              for (let thisTag in tags[prop]) {
              // let criteria = prop;
                var thisTagCheckbox = document.createElement("INPUT")
                    thisTagCheckbox.type = "checkbox"
                    thisTagCheckbox.className = "tagCheckbox"
                    //thisTagCheckbox.id = "chck"+thisTag;
                    thisTagCheckbox.value = thisTag;
                    thisTagCheckbox.addEventListener("change",e=>{displayContour()})
            
                var thisTagOption = document.createElement("SPAN")
                    thisTagOption.innerText = thisTag+":"+tags[prop][thisTag];
                    thisTagOption.style.color = color(thisTag);
                
                var thisTagLine = document.createElement("DIV")
                    thisTagLine.value = parseInt(tags[prop][thisTag]);
                    thisTagLine.appendChild(thisTagCheckbox)
                    thisTagLine.appendChild(thisTagOption)
                    

                tagsArray.push(thisTagLine);
              }
    
            }
    
          }
      
          tagsArray.sort((a,b)=>d3.descending(a.value, b.value));
          tagsArray.forEach(d=>thisTagList.appendChild(d))
          tagList.appendChild(thisTagList)
          nodes.style('fill',d=>color(d.tags.USER[tag][0]))
          nodes.raise();   
        }
    
    
    setTimeout(()=> {document.getElementById('tagDiv').addEventListener("change",e=>{
            resetContourGraph();
            showTags(e.srcElement.value,'tagList');
            })
         
    },200)
   
loadType();
document.getElementById("tooltip").innerHTML = tooltipTop;

}
} // end of HY worker answer


  //    })  // end of get webentities data

    //  }) // end of start corpus
    }).catch(error => {console.log(error);field.value = "error - Cannot start corpus";ipcRenderer.send("console-logs","Hyphotype error: cannot start corpus " + id + ".");});


  //======== ZOOM & RESCALE ===========

  var gXGrid = svg.append("g")
  .call(xGrid);

var gYGrid = svg.append("g")
  .call(yGrid);


let upHeight = parseInt(height-50);

var gX2 = svg.append("g")
.attr("transform", "translate(0," + upHeight + ")")
.attr("fill", "white")
.attr("stroke", "white")
.attr("stroke-width", 2)
.call(xAxis2);

var gY2 = svg.append("g")
.attr("transform", "translate(" + 50 + ",0)")
.attr("stroke", "white")
.attr("stroke-width", 2)
.call(yAxis2);

var gX = svg.append("g")
.attr("transform", "translate(0," + upHeight + ")")
.call(xAxis);

var gY = svg.append("g")
.attr("transform", "translate(" + 50 + ",0)")
.call(yAxis);

d3.selectAll(".tick:not(:first-of-type) line").attr("stroke","rgba(100,100,100,.5)")


  svg.call(zoom).on("dblclick.zoom", null);

// ===== NARRATIVE =====


  zoomed = (thatZoom,transTime) => {
    currentZoom = thatZoom;
     view.transition().duration(transTime).attr("transform", thatZoom);
     gXGrid.transition().duration(transTime).call(xGrid.scale(thatZoom.rescaleX(x)));
     gYGrid.transition().duration(transTime).call(yGrid.scale(thatZoom.rescaleY(y)));
     gX2.transition().duration(transTime).call(xAxis2.scale(thatZoom.rescaleX(x)));
     gY2.transition().duration(transTime).call(yAxis2.scale(thatZoom.rescaleY(y)));
     gX.transition().duration(transTime).call(xAxis.scale(thatZoom.rescaleX(x)));
     gY.transition().duration(transTime).call(yAxis.scale(thatZoom.rescaleY(y)));
     d3.transition().duration(transTime).selectAll(".tick:not(:first-of-type) line").attr("stroke","rgba(100,100,100,.5)")
  }

// Presentation Recorder








  
  ipcRenderer.send("console-logs", "Starting Hyphotype");
};

// ========== CHRONOTYPE ==========
const chronotype = (id, links) => { // When called, draw the chronotype

/* CHRONOTYPE REVAMP TO DO LIST
- exit clusters, use radial area chart instead to figure amount of docs per week
- create a disk selection tool
- push/pop documents according to period selected
- select several periods at once
- add option to display doc titles
*/
//========== SVG VIEW =============
  var svg = d3.select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG"); 

  svg.attr("width", width - toolWidth).attr("height", height) // Attributing width and height to svg
      .attr("viewBox", [-(width - toolWidth) / 2, -height / 2, (width - toolWidth), height])
      
  var view = svg.append("g") // Appending a group to SVG
                .attr("id", "view"); // CSS viewfinder properties
/*
  zoom.scaleExtent([0.1, 20]) // Extent to which one can zoom in or out
                .translateExtent([[-Infinity, -Infinity], [Infinity, Infinity]]) // Extent to which one can go up/down/left/right
.on("zoom", e=> {zoomed(d3.event.transform)}); 
*/

var innerRadius = height/3.5;
var outerRadius = height/2;

  //============ RESET ============
  d3.select("#reset").on("click", resetted); // Clicking the button "reset" triggers the "resetted" function

  function resetted() {
    // Going back to origin position function
    d3.select("#xtypeSVG") // Selecting the relevant svg element in webpage
      .transition()
      .duration(2000) // Resetting takes some time
      .call(zoom.transform, d3.zoomIdentity); // Using "zoomIdentity", go back to initial position
    ipcRenderer.send(
      "console-logs",
      "Resetting chronotype to initial position."
    ); // Send message in the "console"
  }

  //========== X & Y AXIS  ============
  var x = d3.scaleUtc()
            .range([0, 2 * Math.PI])
/*
  var xAxis = d3.axisBottom(x) // Actual X axis
    .scale(x) // Scale has been declared just above
    .ticks(12) // Amount of ticks displayed
    .tickSize(0) // 0 = no vertical lines ; height = vertical lines
    .tickFormat(""); // No legend
*/

  var y = d3.scaleLinear() // Y axis scale
            .range([innerRadius, outerRadius]);

   

   // .domain([Past, Future]) // First shows a range from minus one year to plus one year
    
    //.range([height, 0]); // Size on screen is full height of client
/*
  var yAxis = d3.axisRight(y) // Actual Y axis
    .scale(y) // Scale is declared just above
    .ticks(20) // 20 ticks are displayed
    .tickSize(width) // Ticks are horizontal lines
    .tickPadding(10 - width) // Ticks start and end out of the screen
    .tickFormat(multiFormat); // Custom legend declared in a different file
*/

  //========= LINES & INFO ============

  var chronoArea = d3.areaRadial()
                     .curve(d3.curveLinear)
                     .angle(d => x(d.date));

  /*
  var chrono = d3.line() // Each zone is represented by a curve, or a "line"
    .x(d => x(d.zone)) // The X value of each point is defined by "zone" (stable)
    .y(d => y(d.date)); // The Y value of each point is defined by "date" (changing)
*/
/*
var chrono  = d3.lineRadial()
    //.curve(d3.curveLinearClosed)
    .radius(d => x(d.zone))
    .angle(d => y(d.date))
*/
/*
  svg.append("rect") // Putting a rectangle above the grid to make dates easier to read
    .attr("x", 0)
    .attr("y", 0) // Rectangle starts at top left
    .attr("width", 110)
    .attr("height", 9999) // Rectangle dimensions
    .style("fill", "white")
    .style("opacity", 0.8) // Rectangle background color and opacity
    .style("stroke-width", "0"); // Invisible borders
*/
  var color = d3.scaleOrdinal() // Line colors
    .domain([0, 1])
    .range([
      "#08154a",
      "#490027",
      "#5c7a38",
      "#4f4280",
      "#6f611b",
      "#5b7abd",
      "#003f13",
      "#b479a9",
      "#3a2e00",
      "#017099",
      "#845421",
      "#008b97",
      "#460d00",
      "#62949e",
      "#211434",
      "#af8450",
      "#30273c",
      "#bd7b70",
      "#005b5c",
      "#c56883",
      "#a68199"
    ]);


  //======== DATA CALL & SORT =========
  pandodb.chronotype.get(id).then(datajson => {

      dataDownload(datajson);

      var docs = datajson.content; // Second array is the documents (docs)
     // const clusters = [];
      const links = []; // Declaring links as empty array
      const nodeDocs = [];
     // var codeFreq = {};
      const csl_material = {
        "paper-conference": "event",
        NA2: "dns",
        personal_communication: "mail",
        "article-magazine": "chrome_reader_mode",
        report: "tab",
        broadcast: "radio",
        chapter: "list",
        webpage: "web",
        map: "map",
        manuscript: "receipt",
        "entry-dictionary": "format_list_numbered",
        "entry-encyclopedia": "art_track",
        NA5: "add_to_queue",
        NA4: "video_label",
        NA3: "question_answer",
        NA1: "markunread_mailbox",
        interview:"speaker_notes",
        legal_case: "announcement",
        thesis: "note",
        graphic: "edit",
        motion_picture: "videocam",
        "article-journal": "timeline",
        "article-newspaper": "dashboard",
        article: "description",
        "post-weblog": "content_paste",
        speech: "subtitles",
        patent: "card_membership",
        song: "mic",
        book: "developer_board",
        legislation: "assignment",
        bill: "account_balance"
      };

      const dataSorter = () => {
        for (let i = 0; i < docs.length; i++) {
          // loop on main array

          let doc = docs[i].items;

          doc.forEach(d => {
            if (d.issued) {
              if (
                d.issued.hasOwnProperty("date-parts") &&
                d.issued["date-parts"][0].length === 3
              ) {
                d.date =
                  d.issued["date-parts"][0][0] +
                  "-" +
                  d.issued["date-parts"][0][1] +
                  "-" +
                  d.issued["date-parts"][0][2];
                d.date = parseTime(d.date);
                d.category = docs[i].name;
                d.clusterDate =
                  d.issued["date-parts"][0][0] +
                  "-" +
                  d.issued["date-parts"][0][1] +
                  "-" +
                  "15";
                d.code = d.category + "-" + d.clusterDate;
                d.type = csl_material[d.type];
                d.authors = [];

                if (d.author) {
                  for (let j = 0; j < d.author.length; j++) {
                    let element = d.author[j].given + " " + d.author[j].family;
                    d.authors.push(element);
                  }
                }

               // codeFreq[d.code] = codeFreq[d.code] || 0;
               // codeFreq[d.code] += 1;
/*
                let clusterItem = {};
                clusterItem.date = d.clusterDate;
                clusterItem.code = d.code;
                clusterItem.category = d.category;
              

                if (
                  clusters.findIndex(
                    clusterItem => clusterItem.code === d.code
                  ) < 0
                ) {
                  clusters.push(clusterItem);
                }

                d.clusterDate = parseTime(d.clusterDate);
*/
                nodeDocs.push(d);
              }
            } else {
              d.toPurge = true;
            }
          });
        }
      };

     dataSorter();

var firstDate = d3.min(nodeDocs, d => d.date);
var lastDate = d3.max(nodeDocs, d => d.date);
var maxDocs=0; 

  var dateAmount=[];

  let currentDate = firstDate;

  while (currentDate<lastDate) {
    var month = currentDate.getUTCMonth();
    var year = currentDate.getFullYear();
    var thisDate=JSON.stringify(year)+"-"+JSON.stringify(month)+"-15";
    dateAmount.push(thisDate);
  currentDate.setMonth(currentDate.getMonth()+1);
  }   

      const clustersNest = d3.nest() // Sorting clusters
        .key(d => d.category) // Sorting them by category
        .entries(nodeDocs); // Selecting relevant data

        y.domain([0, clustersNest.length+1])

        x.domain([d3.min(nodeDocs, d => d.date),d3.max(nodeDocs, d => d.date)]).nice()

        clustersNest.forEach(cluster=>{
          let nestedCluster = d3.nest()
                                .key(d=>d.clusterDate)
                                .entries(cluster.values)
                    cluster.values=nestedCluster;
        })


     for (let i = 0; i < clustersNest.length; i++) {
      
      clustersNest[i].zone=i;
          let radialVal=[];

          dateAmount.forEach(d=>{
            radialVal.push({key:d,date:parseTime(d),value:0,zone:i})
          })
          
          clustersNest[i].values.forEach(val=>{
            let valIndex = dateAmount.indexOf(val.key);

            if (valIndex>-1){
              radialVal[valIndex].value = val.values.length;
              if (val.values.length>maxDocs) {
                maxDocs = val.values.length;
              }
            }
          })   
          radialVal.forEach(d=>{;})
          clustersNest[i].radialVal=radialVal;
    }

/*
      for (let i = 0; i < clustersNest.length; i++) {
        clustersNest[i].values.forEach(doc=>doc.date=parseTime(doc.date));
        clustersNest[i].zone=i;
      }

      const clusterData = [];

      const clusterSorter = () => {
        for (let i = 0; i < clustersNest.length; i++) {
          let zone = i * (1 / clustersNest.length);
          clustersNest[i].zone = zone;
          clustersNest[i].values.forEach(d => {
            d.zone = zone;
            d.date = parseTime(d.date);
          });
          clusterData.push(clustersNest[i]);
        }
      };
      //clusterSorter();

      const zonePropagation = () => {
        nodeDocs.forEach(d => {
          for (let i = 0; i < clustersNest.length; i++) {
            if (clustersNest[i].key === d.category) {
              d.zone = clustersNest[i].zone;
            }
          }
        });

        clusters.forEach(d=> {
          for (let i = 0; i < clustersNest.length; i++) {
            if (clustersNest[i].key === d.category) {
              d.zone = clustersNest[i].zone;
            }
          }
         } )

      };
      zonePropagation();

      blankCreator();
*/
/*
      //Generate the list of items (titles) contained in each circle, i.e. sharing the same code
      const titleList = [];

      const docTitleLister = () => {
        for (let i = 0; i < docs.length; i++) {
          // loop on main array
          for (let j = 0; j < docs[i].items.length; j++) {
            // loop
            let doc = {};
            doc.title = docs[i].items[j].title;
            doc.code = docs[i].items[j].code;
            if (docs[i].items[j].hasOwnProperty("enrichement")) {
              doc.OA = docs[i].items[j].enrichment.OA;
            } else {
              doc.OA = false;
            }
            titleList.push(doc);
          }
        }
      };

      docTitleLister();

      var titlesIndex = {};

      var titleNest = d3.nest()
        .key(d => d.code)
        .entries(titleList);
      titleNest.forEach(d => {
        d.titles = d.values.map(d => d.title);
      });
      titleNest.forEach(d => {
        titlesIndex[d.key] = d.titles;
      });
*/
//========= CHART DISPLAY ===========

var radialLines= view.append("g")
                      .attr("id","radialLines")
                     
      clustersNest.forEach(corpus=>{
        radialLines.append("path")
        .attr("stroke",color(corpus.zone))
        .attr("fill",color(corpus.zone))
        .style("opacity",.5)
        .attr("d", chronoArea
        .innerRadius(d => y(d.zone))
        .outerRadius(d => y(parseFloat(d.zone+(d.value/(maxDocs+1)))))
      (corpus.radialVal));
      })


      /*


    var radialLines= view.append("g")
      .attr("id","radialAreas")

      radialLines.append("path")  
      .attr("fill", "transparent")
      .attr("stroke","black")
    .attr("d", lineRadial.radius(d => y(parseFloat(d.zone+ parseFloat("0."+codeFreq[d.code]))))
      (clusters));
*/
     // .attr("fill", d => color(d.zone))
     // .attr("fill-opacity", 0.2)
     /*
      .attr("d", chronoArea
          .innerRadius(d => y(d.zone))
          .outerRadius(d => y(parseFloat(d.zone+ parseFloat("0."+codeFreq[d.code]))))
        (clusters));
*/
/*
      var now = view.append("line") // Red line indicating current time
        .attr("x1", (width-toolWidth)/2) // X coordinate of point of origin
        .attr("y1", height/2) // Y -> current time, declared above
        .attr("x2", 99999) // X coordinate of point of destination
        .attr("y2", d => x(currentTime)) // Y -> current time, declared above
        .style("stroke", "DarkRed") // Line color
        .style("stroke-width", 0.5); // Line thickness

      var displayDate = view.append("text") // Precise date (page loading timestamp)
        .attr("x", width / 1.7) // X coordinate, centre-right
        .attr("y", d => y(currentTime)) // Y coordinate, current time
        .attr("dy", -5) // Place it above the "now" line
        .style("fill", "darkred") // Font color
        .style("font-size", "0.3em") // Font size
        .text(d => currentTime); // Actual date string
*/
/*
var catCircles = view.selectAll("catCircles")
.data(clustersNest)
.enter()
.append("circle") 
  .attr("cx",(width-toolWidth)/2)
  .attr("cy",height/2)
  .attr("r",d=>innerRadius+((outerRadius-innerRadius)/clustersNest.length)*d.zone)
  .style("stroke", d => color(d.zone)) // Color according to key
  .attr("fill","none")
  .style("stroke-width", 2); // Stroke width
*/
/*
      var lines = view.selectAll("lines") // Lines by category
        //.data(clusterData) // Loading relevant data, ie nested clusters
        .data(clustersNest)
        .enter()
        .append("path") // Lines are paths
        .attr("class", "line") // CSS style of the lines
        .style("pointer-events","none")
        .style("shape-rendering","crispEdges")
        .style("fill","none")
        .attr("d", d => chrono(d.values)) //Values of each point/cluster of the lines
        .style("stroke", d => color(d.zone)) // Color according to key
        .style("stroke-width", 1.5); // Stroke width
*/
        /*
      var shadowLineData = Array.from(clustersNest) //clusterData);

      shadowLineData.forEach(d => {
        let shadowTop = {};
        shadowTop.date = parseTime("2100-01-01");
        shadowTop.zone = d.zone;

        let shadowBot = {};
        shadowBot.date = parseTime("1800-01-01");
        shadowBot.zone = d.zone;

        d.values.push(shadowTop);
        d.values.push(shadowBot);
      });

      var shadowLines = view.selectAll("shadowLines") // Lines by category
        .data(shadowLineData) // Loading relevant data, ie nested clusters
        .enter()
        .append("path") // Lines are paths
        .attr("class", "shadowLines") // CSS style of the lines
        .attr("d", d => chrono(d.values)) //Values of each point/cluster of the lines
        .style("opacity", 0.5)
        .style("stroke", "#d3d3d3") // Color according to key
        .style("stroke-width", 0.5); // Stroke width
*/
/*
      var categories = view.selectAll("categoriesText") // Display category name
       // .data(clusterData) // Loading relevant data, ie nested clusters
       .data(clustersNest)
        .enter()
        .append("text") // Lines are paths
       // .attr("class", "categories") // CSS style of the lines
        .style("font-size","20px")
        .style("font-family","sans-serif")
        .attr("y", d => -x(d.zone)) // The X value of each category is defined by "zone"
        .attr("x", d => y(currentTime)) // Y coordinate, current time
        .attr("fill", d => color(d.zone)) // Color according to key
        .attr("transform", "translate(12,5) rotate(90)")
        .text(d => d.key); // Category content
*/
    //  d3.select(lines).lower();

      //======== CIRCLES/CLUSTERS =========
      /*
      var circle = view.append("g") // Clusters are represented as circles
         .attr("id","nodeClusters");
         circle.selectAll("circle")
        .data(clusters) // From the "clusters" array of objects
        .enter()
        .append("circle") // Clusters are circles
        .attr("class", "dot") // They have a css class
        .attr("r", d => {
          // Their radius is computed as follows
          var n = codeFreq[d.code],
            k = 10;
          return Math.log((k * n) / Math.PI);
        })
        //.attr("cx", d => x(d.zone)) // Their relative X positions are by zone
        //.attr("cy", d => y(d.date)) // Their relative Y positions are by date

        .attr("cx", d =>  d3.pointRadial(x(d.date), y(d.zone))[0])
        .attr("cy", d =>  d3.pointRadial(x(d.date), y(d.zone))[1])
       // .attr("transform", "translate("+(width-toolWidth)/2+"," + height/2  + ")")
        .attr("id", d => d.code) // Their ID are their codes
        .style("fill", d => color(d.zone)) // Their color is by zone
        .each(d => d.circleexpanded === false) // Their are by default NOT expanded
        .on("click", CellSelect); // Clicking one circle triggers CellSelect
*/
        /*
      var circleContent = view.selectAll("textAmount") // Clusters are represented as circles
        .data(clusters) // From the "clusters" array of objects
        .enter()
        .append("text") // Clusters are circles
        .attr("x", d => x(d.zone)) // Their relative X positions are by zone
        .attr("y", d => y(d.date)) // Their relative Y positions are by date
        .style("font-familey","sans-serif")
        .attr(
          "dx",
          d => "-" + JSON.stringify(codeFreq[d.code]).length / 2 + "px"
        )
        .attr("dy", "1px")
        .style("fill", "white") // Their color is by zone
        .style("font-size", "2px")
        .text(d => codeFreq[d.code]);
*/
      //======== DOC LIST =========
      /*
      function listDisplay(d) {
        // Expanding a cluster displays the list of docs it contains

        function listToNode() {} // Hovering a title highlights the corresponding node
        function listToDoc() {
          // Clicking a title displays the doc's info in tooltip
          for (var i = nodeData.length - 1; i >= 0; i--) {
            // Iterating on the potential docs' data
            if (this.id === nodeData[i].title) {
              // Looking for the index of the relevant title
              d3.select("#tooltip")
                .transition() // Once found, display the tooltip
                .duration(200)
                .style("display", "block");
              d3.select("#tooltip").html(
                "<strong>" +
                  nodeData[i].title +
                  "</strong> <br/>" +
                  nodeData[i].authors +
                  "<br/>" +
                  formatTime(nodeData[i].date) +
                  "<br/>" +
                  nodeData[i].category +
                  " | " +
                  nodeData[i].type +
                  '<br/><i class="material-icons">' +
                  nodeData[i].num +
                  "</i><br/>" // +
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

       
         d3.select("#tooltip")
          .style("display", "block")
          .html(
            "<ul>" +
              docTitles
                .map(
                  title =>
                    '<li id="' + title + '" class="doc">' + title + "</li>"
                )
                .join("\n") +
              "</ul>"
          ); 
        for (var i = 0; i < docTitles.length; i++) {
          document
            .getElementById(docTitles[i])
            .addEventListener("mouseover", listToNode);
          document
            .getElementById(docTitles[i])
            .addEventListener("click", listToDoc);
        }
      }

      function CellSelect(d) {
        if (d.circleexpanded) {
          // Check if expanded, and if it is, regroup
          let thisCluster = d3.select(this);
          thisCluster // Apply the following to this selected object
            .each(d => (d.circleexpanded = false)) // Circle isn't considered expanded anymore
            .transition()
            .duration(500) // Circle reduction isn't instantaneous
            .attr("r", d => {
              // Circle reduction = its radius reduction
              var n = codeFreq[d.code],
                k = 10; // Variables used to determine radius
              return Math.log((k * n) / Math.PI);
            }); // Formula used to compute radius
          regroup(d); // Trigger node regrouping function
          setTimeout(function() {
            thisCluster.raise();
           // circleContent.raise();
          }, 500); // Put it above the rest (links)
          ipcRenderer.send(
            "console-logs",
            "Closing chronotype cluster " + d.code
          ); // Send message in the "console"
        } else {
          // Else expand the node
          d3.select(this) // Apply the following to this selected object
            //.lower()                                                      // Put it below other objects
            .each(d => (d.circleexpanded = true)) // Circle is considered expanded
            .transition()
            .duration(100) // Circle expansion is fast
            .attr("r", d => {
              // Circle expands as its radius rises
              var n = codeFreq[d.code],
                k = 18; // Variables used to determine radiu
              return Math.sqrt((k * n) / Math.PI);
            }); // Formula used to compute radius
          expand(d); // Trigger node expanding funciton
          listDisplay(d); // Opening cluster lists all its nodes' titles
          d3.select(this).on("mouseover", listDisplay); // Hovering cluster does the same
          ipcRenderer.send(
            "console-logs",
            "Opening chronotype cluster " + d.code
          ); // Send message in the "console"
        }
      }

      //==========  NODE SUB-GRAPHS =======
      // Each cluster contains documents, i.e. each "circle" contains "nodes" which are force graphs
      var simulation = d3.forceSimulation() // starting simulation
        .alphaMin(0.1) // Each action starts at 1 and decrements "Decay" per Tick
        .alphaDecay(0.035) // "Decay" value
        .force(
          "link",
          d3.forceLink()
            .distance(0)
            .strength(0)
            .id(d => d.title)
        )
        .force(
          "collision",
          d3.forceCollide() // nodes can collide
            .radius(d => (d.expanded ? 1.8 : 0)) // if expanded is true, they collide with a force superior to 0
            .iterations(3)
        )
        .force(
          "x",
          d3.forceX()
            .strength(d => (d.expanded ? 0.03 : 0.15)) // nodes are attracted to their X origin
            .x(//d => x(d.zone)
            d=>d3.pointRadial(x(d.date), y(d.zone))[0]
            )
        ) // X origin data
        .force(
          "y",
          d3.forceY()
            .strength(d => (d.expanded ? 0.03 : 0.15)) // nodes are attracted to their Y origin
            .y(
              //d => y(d.clusterDate)
              d=>d3.pointRadial(x(d.date), y(d.zone))[1]
              )
        );//.force("center", d3.forceCenter((width-toolWidth) / 2, height / 2));

      //Declaring node variables
      var node = view.selectAll("nodes").append("g"),
        nodetext = view.selectAll("nodetext").append("g"),
        nodeData = [];

      //=============  EXPAND  ============
      // When a shrinked circle is clicked, its nodes come appear and then it expands

      const expand = d => {
        simulation.alpha(1).restart();

        // First the relevant nodes in the data, i.e. those whose code is exactly the same as the clicked circle.
        var focusNodes = nodeDocs.filter(item => item.code === d.code);

        // Then, add those nodes to the group of nodes which are to be displayed by the graph
        nodeData.push.apply(nodeData, focusNodes);

        //Nodes
        node = node
          .data(nodeData, item => item) // Select all relevant nodes
          .exit()
          .remove() // Remove them all
          .data(nodeData, item => item) // Reload the data
          .enter()
          .append("circle") // Append the nodes
          .attr("r", 1) // Node radius
          .attr("fill", "#bfbfbf") // Node color
          .attr("cx", d => x(d.zone)) // Node X coordinate
          .attr("cy", d => y(d.clusterDate)) // Node Y coordinate
          .attr("id", d => d.code) // Node ID (based on code)
          .style("stroke", d => color(d.zone)) // Node stroke color
          .style("stroke-width", 0.1) // Node stroke width
          .style("cursor", "context-menu") // Type of cursor on node hover
          .style("opacity", 0.9) // Node opacity
          .each(d => (d.expanded = true)) // All those nodes are "expanded"
          .raise() // Nodes are displayed above the rest
          .merge(node); // Merge the nodes

        //Node icons are nodes displayed on top of Nodes
        nodetext = nodetext
          .data(nodeData, item => item) // Select all relevant nodes
          .exit()
          .remove() // Remove them all
          .data(nodeData, item => item) // Reload the data
          .enter()
          .append("text") // Append the text
          .attr("class", "material-icons") // Icons are material-icons
          .attr("dy", 0.7) // Relative Y position to each node
          .attr("dx", -0.7) // Relative X position to each node
          .attr("id", d => d.code) // ID
          .style("fill", "white") // Icon color
          .style("font-size", "1.4px") // Icon size
          .text(d => d.type) // Icon
          .on("click", d => {
            shell.openExternal("https://dx.doi.org/" + d.DOI);
          }) // On click, open url in new tab
          .on("mouseover", HighLightandDisplay(0.2)) // On hover, HighLightandDisplay
          .on("mouseout", mouseOut) // On mouseout, mouseOute
          .raise() // Display above nodes and the rest
          .merge(nodetext) // Merge the nodes
          .call(
            d3.drag() // Dragging behaviour
              .on("start", forcedragstarted)
              .on("drag", forcedragged)
              .on("end", forcedragended)
          );

        nodetext.append("title").text(d => d.title); // Hovering a node displays its title as "alt"

        simulation.nodes(nodeData); // Load new simulation data
      };

      //============  REGROUP  ============
      // When an expanded circle is clicked, its nodes regroup and then disappear

      const regroup = d => {
        simulation.alpha(1).restart();

        node
          .filter(function() {
            return d3.select(this).attr("id") === d.code;
          }) // Find relevant nodes
          .each(d => (d.expanded = false)) // Remove colliding
          .transition()
          .delay(450)
          .remove(); // Delay then remove nodes
        nodetext
          .filter(function() {
            return d3.select(this).attr("id") === d.code;
          }) // Find relevant nodetext
          .transition()
          .delay(450)
          .remove(); // Delay dans remove nodetexts

        // First move the nodes either at the end of the array in order not to change any onther nodes'
        // index as the D3 simulation properties are attributed by index then injected to svg
        nodeData.sort(
          // Literally sorts arrays
          function nodeSort(a, b) {
            // Comparing values to each other
            return b.expanded - a.expanded; // Place expanded = false at the end
          }
        );

        // Splicing out removed nodes from nodeData just after they've been removed
        setTimeout(
          // Delay erasal to allow regrouping
          function nodeEraser(i, d) {
            // Call the function
            for (var i = nodeData.length - 1; i >= 0; i--) {
              // Iterate through all elements
              if (nodeData[i].expanded === false) {
                // Everytime one is not expanded
                nodeData.splice(i, 1); // It gets removed from data
              }
            }
          },
          500
        ); // Delay value in milliseconds

        simulation.nodes(nodeData); // Simulation with updated data
      };

  
      var link = view.selectAll("link") // Create links
        .data(links) // With data created above
        .enter()
        .append("line") // Links are SVG lines
        .attr("stroke-width", 0.15) // Links stroke width
        .attr("stroke", "#d3d3d3") // Links color
        .style("opacity", 0.5); // Links opacity

      //circle.raise(); // Circles are raised above links
     // circleContent.raise();

      simulation
        .nodes(nodeDocs) // Start the force graph with "docs" as data
        .on("tick", ticked); // Start the "tick" for the first time

      simulation
        .force("link") // Create the links
        .links(links); // Data for those links is "links"

      function ticked() {
        // Actual force function
        link // Links coordinates
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node // Node coordinates
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);

        nodetext // Nodetext (material icons) coordinates
          .attr("x", d => d.x)
          .attr("y", d => d.y);
      }

      function forcedragstarted(d) {
        // On drag, start dragging behaviour
        if (!d3.event.active) simulation.alpha(1).restart(); // Reheat all force graph
        d.fx = d.x;
        d.fy = d.y;
      }

      function forcedragged(d) {
        // When dragged, the coordinates of the
        d.fx = d3.event.x; // dragged node is relatively modified
        d.fy = d3.event.y; // based on pointer position
      }

      function forcedragended(d) {
        if (!d3.event.active) simulation.alpha(1).restart(); // When dragging stops, reheat force graph
        d.fx = null;
        d.fy = null;
      }

      //============ NARRATIVE ============
      function narrative(focused) {
        // Experimental narrative function
        d3.select("#xtypeSVG")
          .transition()
          .duration(5000)
          .call(
            zoom.transform,
            d3.zoomIdentity
              .translate(width / 2, height / 2)
              .scale(8)
              .translate(-x(focused.zone), -y(focused.date))
          );
      }

      //============== HOVER ==============
      var linkedByIndex = {}; // No links are highlight by default

      links.forEach(d => {
        linkedByIndex[d.source.index + "," + d.target.index] = 1;
      }); //

      // Check the dictionary to see if nodes are linked
      function isConnected(a, b) {
        return (
          linkedByIndex[a.index + "," + b.index] ||
          linkedByIndex[b.index + "," + a.index] ||
          a.index == b.index
        );
      }

      // Fade nodes on hover
      var HighLightandDisplay = opacity => {
        return function(d) {
          // Display tooltip
          d3.select("#tooltip")
            .transition()
            .duration(200)
            .style("display", "block");
          d3.select("#tooltip").html(
            "<strong>" +
              d.title +
              "</strong> <br/>" +
              d.authors +
              "<br/>" +
              formatTime(d.date) +
              "<br/>" +
              d.category +
              " | " +
              d.type +
              '<br/><i class="material-icons">' +
              d.num +
              "</i><br/>" //+
            //d.desc + '<br/><br/>' +
            // d.DOI + '<br/>'
            // +
            //'Source: <a target="_blank" href="'+
            //d.URL+'">'+
            //d.URL+'</a>'
          );

          ipcRenderer.send("console-logs", "Hovering " + JSON.stringify(d)); // Send message in the "console"

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
      };

      const mouseOut = () => {
        node.style("stroke-opacity", 1);
        node.style("opacity", 1);
        link.style("stroke-opacity", 1);
        link.style("stroke", "#ddd");
        nodetext.style("opacity", 1);
        d3.select("#tooltip").style("display", "none");
      };
*/

// Circular Brush, based on Elijah Meeks https://github.com/emeeks/d3.svg.circularbrush

function circularbrush() {
	var _extent = [0,Math.PI * 2];
    var _circularbrushDispatch = d3.dispatch('brushstart', 'brushend', 'brush');
	var _arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
	var _brushData = [
		{startAngle: _extent[0], endAngle: _extent[1], class: "extent"},
		{startAngle: _extent[0] - .2, endAngle:  _extent[0], class: "resize e"},
		{startAngle: _extent[1], endAngle: _extent[1] + .2, class: "resize w"}
		];
	var _newBrushData = [];
	var d3_window = d3.select(window);
	var _origin;
	var _brushG;
	var _handleSize = .2;
	var _scale = d3.scaleLinear().domain(_extent).range(_extent);
	var _tolerance = 0.00001;

	function _circularbrush(_container) {

		updateBrushData();

		_brushG = _container
		.append("g")
		.attr("class", "circularbrush");

		_brushG
		.selectAll("path.circularbrush")
		.data(_brushData)
		.enter()
		.insert("path", "path.resize")
		.attr("d", _arc)
		.attr("class", function(d) {return d.class + " circularbrush"})

		_brushG.select("path.extent")
		.on("mousedown.brush", resizeDown)

		_brushG.selectAll("path.resize")
		.on("mousedown.brush", resizeDown)

		return _circularbrush;
	}

	_circularbrush.extent = function(_value) {
		var _d = _scale.domain();
		var _r = _scale.range();

		var _actualScale = d3.scaleLinear()
		.domain([-_d[1],_d[0],_d[0],_d[1]])
		.range([_r[0],_r[1],_r[0],_r[1]])

		if (!arguments.length) return [_actualScale(_extent[0]),_actualScale(_extent[1])];

		_extent = [_scale.invert(_value[0]),_scale.invert(_value[1])];

		return this
	}

	_circularbrush.handleSize = function(_value) {
		if (!arguments.length) return _handleSize;

		_handleSize = _value;
		_brushData = [
		{startAngle: _extent[0], endAngle: _extent[1], class: "extent"},
		{startAngle: _extent[0] - _handleSize, endAngle:  _extent[0], class: "resize e"},
		{startAngle: _extent[1], endAngle: _extent[1] + _handleSize, class: "resize w"}
		];
		return this
	}

	_circularbrush.innerRadius = function(_value) {
		if (!arguments.length) return _arc.innerRadius();

		_arc.innerRadius(_value);
		return this
	}

	_circularbrush.outerRadius = function(_value) {
		if (!arguments.length) return _arc.outerRadius();

		_arc.outerRadius(_value);
		return this
	}

	_circularbrush.range = function(_value) {
		if (!arguments.length) return _scale.range();

		_scale.range(_value);
		return this
	}

	_circularbrush.arc = function(_value) {
		if (!arguments.length) return _arc;

		_arc = _value;
		return this

	}

	_circularbrush.tolerance = function(_value) {
		if (!arguments.length) return _tolerance;

		_tolerance = _value;
		return this
	}

	_circularbrush.filter = function(_array, _accessor) {
		var data = _array.map(_accessor);

		var extent = _circularbrush.extent();
		var start = extent[0];
		var end = extent[1];
		var firstPoint = _scale.range()[0];
		var lastPoint = _scale.range()[1];
		var filteredArray = [];
		var firstHalf = [];
		var secondHalf = [];

		if (Math.abs(start - end) < _tolerance) {
			return _array;
		}

	    if (start < end) {
	    	filteredArray = _array.filter(function (d) {
	    		return _accessor(d) >= start && _accessor(d) <= end;
	    	});
	    }
	    else {
	      var firstHalf = _array.filter(function (d) {
	         return (_accessor(d) >= start && _accessor(d) <= lastPoint);
	      });
	      var secondHalf = _array.filter(function (d) {
	         return (_accessor(d) <= end && _accessor(d) >= firstPoint);
	      });
		  filteredArray = firstHalf.concat(secondHalf);
	    }

		return filteredArray;

  }
  
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  };
  

    d3_rebind(_circularbrush, _circularbrushDispatch, "on");

	return _circularbrush;

	function resizeDown(d) {
		var _mouse = d3.mouse(_brushG.node());

		if (_brushData[0] === undefined) {
			_brushData[0] = d;
		}
		_originalBrushData = {startAngle: _brushData[0].startAngle, endAngle: _brushData[0].endAngle};

		_origin = _mouse;

		if (d.class == "resize e") {
			d3_window
			.on("mousemove.brush", function() {resizeMove("e")})
			.on("mouseup.brush", extentUp);
		}
		else if (d.class == "resize w") {
			d3_window
			.on("mousemove.brush", function() {resizeMove("w")})
			.on("mouseup.brush", extentUp);
		}
		else {
			d3_window
			.on("mousemove.brush", function() {resizeMove("extent")})
			.on("mouseup.brush", extentUp);
		}

		_circularbrushDispatch.brushstart();

	}

	function resizeMove(_resize) {
		var _mouse = d3.mouse(_brushG.node());
		var _current = Math.atan2(_mouse[1],_mouse[0]);
		var _start = Math.atan2(_origin[1],_origin[0]);

		if (_resize == "e") {
			var clampedAngle = Math.max(Math.min(_originalBrushData.startAngle + (_current - _start), _originalBrushData.endAngle), _originalBrushData.endAngle - (2 * Math.PI));

			if (_originalBrushData.startAngle + (_current - _start) > _originalBrushData.endAngle) {
				clampedAngle = _originalBrushData.startAngle + (_current - _start) - (Math.PI * 2);
			}
			else if (_originalBrushData.startAngle + (_current - _start) < _originalBrushData.endAngle - (Math.PI * 2)) {
				clampedAngle = _originalBrushData.startAngle + (_current - _start) + (Math.PI * 2);
			}

			var _newStartAngle = clampedAngle;
			var _newEndAngle = _originalBrushData.endAngle;
		}
		else if (_resize == "w") {
			var clampedAngle = Math.min(Math.max(_originalBrushData.endAngle + (_current - _start), _originalBrushData.startAngle), _originalBrushData.startAngle + (2 * Math.PI))

			if (_originalBrushData.endAngle + (_current - _start) < _originalBrushData.startAngle) {
				clampedAngle = _originalBrushData.endAngle + (_current - _start) + (Math.PI * 2);
			}
			else if (_originalBrushData.endAngle + (_current - _start) > _originalBrushData.startAngle + (Math.PI * 2)) {
				clampedAngle = _originalBrushData.endAngle + (_current - _start) - (Math.PI * 2);
			}

			var _newStartAngle = _originalBrushData.startAngle;
			var _newEndAngle = clampedAngle;
		}
		else {
			var _newStartAngle = _originalBrushData.startAngle + (_current - _start * 1);
			var _newEndAngle = _originalBrushData.endAngle + (_current - _start * 1);
		}


		_newBrushData = [
		{startAngle: _newStartAngle, endAngle: _newEndAngle, class: "extent"},
		{startAngle: _newStartAngle - _handleSize, endAngle: _newStartAngle, class: "resize e"},
		{startAngle: _newEndAngle, endAngle: _newEndAngle + _handleSize, class: "resize w"}
		]

		brushRefresh();

		if (_newStartAngle > (Math.PI * 2)) {
			_newStartAngle = (_newStartAngle - (Math.PI * 2));
		}
		else if (_newStartAngle < -(Math.PI * 2)) {
			_newStartAngle = (_newStartAngle + (Math.PI * 2));
		}

		if (_newEndAngle > (Math.PI * 2)) {
			_newEndAngle = (_newEndAngle - (Math.PI * 2));
		}
		else if (_newEndAngle < -(Math.PI * 2)) {
			_newEndAngle = (_newEndAngle + (Math.PI * 2));
		}

		_extent = ([_newStartAngle,_newEndAngle]);

		_circularbrushDispatch.brush();

	}

	function brushRefresh() {
		_brushG
			.selectAll("path.circularbrush")
			.data(_newBrushData)
			.attr("d", _arc)
	}


	function extentUp() {

		_brushData = _newBrushData;
		d3_window.on("mousemove.brush", null).on("mouseup.brush", null);

		_circularbrushDispatch.brushend();
	}

	function updateBrushData() {
		_brushData = [
		{startAngle: _extent[0], endAngle: _extent[1], class: "extent"},
		{startAngle: _extent[0] - _handleSize, endAngle:  _extent[0], class: "resize e"},
		{startAngle: _extent[1], endAngle: _extent[1] + _handleSize, class: "resize w"}
		];
	}

}

//cf http://bl.ocks.org/emeeks/5850fa6583bfd90e7899

var brush = circularbrush()
  .range([0, 2 * Math.PI])
  .innerRadius(innerRadius)
  .outerRadius(outerRadius+15);
  //.on("brush", pieBrush);

view.append("g")
    .attr("fill","rgba(25,85,122,.3)")
    .attr("id","brush")
    .call(brush);
  
    view.on("click",d=>{console.log(brush.extent()[0])})

  function pieBrush() {
    //var extent = ;
    console.log("From " + months[Math.round(extent[0])] + " till " + months[Math.round(extent[1])] + "")
  }

     var xticks = x.ticks(18);
     xticks.shift()
     
     

    var xAxis = g => g
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("id","xAxis")
      .call(g => g.selectAll("g")
        .data(xticks)
        .join("g")
          .each((d, i) => d.id = JSON.stringify(d))
          .call(g => g.append("path")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.2)
              .attr("d", d => `
                M${d3.pointRadial(x(d), innerRadius-10)}
                L${d3.pointRadial(x(d), outerRadius+20)}
              `))
            

          .call(g => g.append("text")
            //.append("text")
              
             // .attr("xlink:href", d => d.id.href)
             .attr("x",d=> d3.pointRadial(x(d), innerRadius-30)[0])
             .attr("y",d=> d3.pointRadial(x(d), innerRadius-30)[1])
              .text(d3.utcFormat("%Y"))));
              
              view.on("mousemove", d=>{
                    //absurd results for now
                    
                  // console.log(x.invert(d3.event.x));
                
              });

              view.append("g").call(xAxis);


            var  yAxis = g => g
              .attr("text-anchor", "middle")
              .attr("font-family", "sans-serif")
              .attr("font-size", 10)
              .attr("id","yAxis")
              .call(g => g.selectAll("g")
                .data(y.ticks().reverse())
                .join("g")
                  .attr("fill", "none")
                  .call(g => g.append("circle")
                      .attr("stroke",  d=>{
                        if(Number.isInteger(d)&&d<clustersNest.length){
                         return color(d)
                      } else {return "rgba(0,0,0,.2)"}
                    }
                      )
                      
                      .attr("r", y))
                  .call(g => g.append("text")
                      .attr("y", d => -y(d+.5))
                      .attr("dy", "0.35em")
                      .attr("stroke", "#fff") 
                      .attr("stroke-width", 1)
                      .text(d =>{ if(Number.isInteger(d)&&d<clustersNest.length){ return clustersNest[d].key }})
                    .clone(true)
                      .attr("y", d => y(d+.5))
                    .selectAll(function() { return [this, this.previousSibling]; })
                    .clone(true)
                      .attr("fill", "currentColor")
                      .attr("stroke", "none")))

                      view.append("g").call(yAxis);

        

      loadType();
    }).catch(error => {field.value = "error - invalid dataset";ipcRenderer.send("console-logs","Chronotype error: dataset " + id + " is invalid.");console.log(error);}); 
//======== END OF DATA CALL (PROMISES) ===========

  //======== ZOOM & RESCALE ===========
  /*
  var gX = svg.append("g") 
              .attr("class", "axis axis--x")
              .style("stroke-opacity",.2)
              .call(xAxis);

  var gY = svg.append("g") 
              .attr("class", "axis axis--y")
              .style("stroke-opacity",.1)
              .call(yAxis);
*/
              
/*
  svg.call(zoom).on("dblclick.zoom", null); // Zoom and deactivate doubleclick zooming


   zoomed =(thatZoom) => {
    
    view.attr("transform", thatZoom);
    //gX.call(xAxis.scale(thatZoom.rescaleX(x)));
    //gY.call(yAxis.scale(thatZoom.rescaleY(y)));
  }
*/
  ipcRenderer.send("console-logs", "Starting chronotype"); // Starting Chronotype
}; // Close Chronotype function

// =========== GEOTYPE =========

const geotype = id => {
  // ========== SVG VIEW ==========
  var svg = d3.select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view")
    .attr("id", "view"); // CSS viewfinder properties

  //globe properties and beginning aspect
  const projection = d3.geoOrthographic()
    .scale(800)
    .translate([width - toolWidth * 2, height / 2])
    .clipAngle(90)
    .precision(0.01)
    .rotate([-20, -40, 0]);

  //globe, as well as surface projects
  var path = d3.geoPath().projection(projection);

  //graticule
  const graticule = d3.geoGraticule();

  var velocity = 0.02;

  zoom.scaleExtent([0, 50])
    .translateExtent([[0, 0], [1200, 900]])
    .extent([[0, 0], [1200, 900]])
    .on("zoom", e=> {zoomed(d3.event.transform)}); 

  //globe outline and background
  view.append("circle")
    .style("fill","#e6f3ff")
    .style("stroke","#333")
    .style("stroke-width",1)
    .attr("cx", width - toolWidth * 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale());

  //versor insertion signal for interactive exports

  //Calling data
  pandodb.geotype.get(id).then(datajson => {

      dataDownload(datajson);


      var data = [];

      for (let i = 0; i < datajson.content.length; i++) {
        datajson.content[i].items.forEach(d => data.push(d));
      }

      Promise.all([d3.json("json/world-countries.json")]).then(geo => {
        var geoData = geo[0];

        const links = [];

        var brushContent;

        var linksBuffer = [];

        const dataArray = [];

        data.forEach(d => {
          if (
            d.hasOwnProperty("enrichment") &&
            d.enrichment.hasOwnProperty("affiliations")
          ) {
            if (d.hasOwnProperty("issued")) {
              d.date =
                JSON.stringify(d.issued["date-parts"][0][0]) +
                "," +
                d.issued["date-parts"][0][1];
            }

            d.authors = [];
            if (d.hasOwnProperty("author")) {
              for (let j = 0; j < d.author.length; j++) {
                let element = d.author[j].given + " " + d.author[j].family;
                d.authors.push(element);
              }
            }
            let link = { DOI: "", points: [] };
            link.DOI = d.DOI;
            for (var k = 0; k < d.enrichment.affiliations.length; k++) {
              if (d.enrichment.affiliations[k].lon != undefined) {
                d.enrichment.affiliations[k].affilId =
                  d.enrichment.affiliations[k]["affiliation-city"] +
                  "-" +
                  d.enrichment.affiliations[k]["affiliation-country"];

                dataArray.push(d.enrichment.affiliations[k]);

                let thisCity = { cityname: "", lon: "", lat: "", affilId: "" };
                thisCity.cityname =
                  d.enrichment.affiliations[k]["affiliation-city"];
                thisCity.lon = d.enrichment.affiliations[k].lon;
                thisCity.lat = d.enrichment.affiliations[k].lat;
                thisCity.affilId = d.enrichment.affiliations[k].affilId;
                link.points.push(thisCity);
              }
            }
            linksBuffer.push(link);
          } else {
            data.splice(d.index, 1);
          }
        });

        for (var i = 0; i < linksBuffer.length; i++) {
          if (linksBuffer[i].points.length > 1) {
            links.push(linksBuffer[i]);
          }
        }

        links.forEach(d => {
          if (d.points.length < 3) {
            d.type = "LineString";
            d.coordinates = [[], []];
            d.coordinates[0].push(d.points[0].lon, d.points[0].lat);
            d.coordinates[1].push(d.points[1].lon, d.points[1].lat);
          } else {
            d.type = "MultiLineString";
            d.coordinates = [];
            for (var i = 0; i < d.points.length - 1; i++) {
              let indexCoord = [];
              let subarrayOne = [];
              subarrayOne.push(d.points[i].lon, d.points[i].lat);
              let subarrayTwo = [];
              subarrayTwo.push(d.points[i + 1].lon, d.points[i + 1].lat);
              indexCoord.push(subarrayOne, subarrayTwo);
              d.coordinates.push(indexCoord);
            }
          }
        });

        for (var i = 0; i < data.length; i++) {
          data[i].index = i;
        } // id = item index

        var cities = d3.nest()
          .key(d => d.affilId)
          .entries(dataArray);

        cities.forEach(d => {
          d.lon = d.values[0].lon;
          d.lat = d.values[0].lat;
          d.country = d.values[0]["affiliation-country"];
          d.city = d.values[0]["affiliation-city"];
          d.affiliations = [];
          d.values = [];

          for (var j = 0; j < data.length; j++) {
            if (
              data[j].hasOwnProperty("enrichment") &&
              data[j].enrichment.hasOwnProperty("affiliations")
            ) {
              for (var k = 0; k < data[j].enrichment.affiliations.length; k++) {
                if (data[j].enrichment.affiliations[k].affilId === d.key) {
                  d.affiliations.push(
                    data[j].enrichment.affiliations[k].affilname
                  );
                  d.values.push(data[j]);
                }
              }
            }
          }
        });

        for (var i = 0; i < cities.length; i++) {
          cities[i].id = i;
        } // id = item index

        const affilFinder = city => {
          // purge existing tooltip content
          let geoToolTip = document.getElementById('tooltip');
          while (geoToolTip.firstChild) {
            geoToolTip.removeChild(geoToolTip.firstChild);
          }

          let cityTitle = document.createElement("h2")
          cityTitle.innerText = city.city;

          let country = document.createElement("h3")
          country.innerText = city.country;
          
          geoToolTip.appendChild(cityTitle)
          geoToolTip.appendChild(country)


          let institutions = [];

          for (var j = 0; j < city.affiliations.length; j++) {
            let institution = { name: "", papers: [] };

            institution.name = city.affiliations[j];

            for (var k = 0; k < city.values.length; k++) {
              for (
                var l = 0;
                l < city.values[k].enrichment.affiliations.length;
                l++
              ) {
                if (
                  city.values[k].enrichment.affiliations[l].affilname ===
                  city.affiliations[j]
                ) {
                  let link = {};
                  if (
                    institution.papers.findIndex(
                      paper => paper.title === city.values[k].title
                    ) < 0
                  ) {
                    institution.papers.push({
                      title: city.values[k].title,
                      DOI: city.values[k].DOI,
                      OA: city.values[k].enrichment.OA,
                      visibility: city.values[k].visibility
                    });
                  }
                }
              }
            }
            if (
              institutions.findIndex(f => f.name === city.affiliations[j]) < 0
            ) {
              institutions.push(institution);
            }
          }

          institutions.forEach(e => {

            var list = document.createElement('UL')
            let inst =document.createElement("SPAN");
            
            for (var i = 0; i < e.papers.length; i++) {
              if (e.papers[i].visibility){     
                inst.innerHTML="<strong>"+e.name+"</strong>";
                break;
              }
            }

            for (var i = 0; i < e.papers.length; i++) {
          
              let url = "https://dx.doi.org/" + e.papers[i].DOI;
              let docDOM = document.createElement('LI');

              if (e.papers[i].visibility) {
                if (e.papers[i].OA) {
                  docDOM.innerHTML = "<img src='././svg/OAlogo.svg' height='16px'/>&nbsp;"+e.papers[i].title;
                  list.appendChild(docDOM);
                } else {
                  docDOM.innerHTML = e.papers[i].title;
                  list.appendChild(docDOM);
                }
              }
             
              docDOM.addEventListener("click",e=>{
                shell.openExternal(url)
              });
            
              
            }
            document.getElementById('tooltip').appendChild(inst);
            document.getElementById('tooltip').appendChild(list);
            
          });
       

        };

        // countries
        var countryMap = view.append("g").attr("id", "countryMap");

        countryMap
          .selectAll("path")
          .data(geoData.features)
          .enter()
          .append("path")
          .style("fill","white")
          .style("stroke","#c6c6c6")
          .style("stroke-width",.5)
          .attr("id", d => d.id)
          .attr("d", path);

        //graticule
        countryMap
          .append("path")
          .datum(graticule)
          .style("fill","transparent")
          .style("stroke","white")
          .style("stroke-width",.7)
          .attr("d", path);

        var locGroup = view.append("g").attr("id", "cityLocations"); // Create a group for cities + links (circles + arcs)

        cities.forEach(city =>
          city.values.forEach(paper => (paper.visibility = true))
        ); // Make all cities visible at first
        links.forEach(link => (link.visibility = true)); // Make all links visibile at first

const linkLoc = () => {
          // generate links and cities

          document
            .getElementById("view")
            .removeChild(document.getElementById("cityLocations")); // remove all cities & links

          var locGroup = view.append("g").attr("id", "cityLocations"); // recreate the cities & links svg group

          cities.forEach(city => {
            // for each city
            let radius = 1; // base radius is 1
            for (let i = 0; i < city.values.length; i++) {
              // for each article in each city
              if (city.values[i].visibility) {
                // if the article has been published in this timeframe
                radius = radius + 1; // add a unit to the radius
              }
            }
            if (radius === 1) {
              city.radius = 0;
            } // if it stays at 1, no articles published
            else { // else, the radius is log(article number) + 1
              city.radius = Math.log(radius) + 1.5;

            } 
          });

          cities.sort((a, b) => d3.descending(a.radius, b.radius)) // Make sure smaller nodes are above bigger nodes


         var areaList = new Object;

          cities.forEach(city=>{
            city.cluster = JSON.stringify(parseInt(city.lon))+"|"+JSON.stringify(parseInt(city.lat));

            if (areaList[city.cluster]===undefined){
              areaList[city.cluster]=1;
            } else {
              areaList[city.cluster]= areaList[city.cluster]+1;
            }
          })

           for (var key in areaList){
            
            let count = areaList[key]

            let currentCluster = [];
            if(count>1){
              for (let i = 0; i < cities.length; i++) {
                if (cities[i].cluster===key){
                  currentCluster.push(i)
                }
              }
              currentCluster.forEach(cityIndex=>cities[cityIndex].smallInCluster=true);
              currentCluster.sort((a, b) => d3.descending(a.radius, b.radius)) // Make sure smaller nodes are above bigger nodes
              cities[currentCluster[0]].smallInCluster=false;
            }
          }; 

          var affilLinks = locGroup
            .selectAll("lines") // add the links
            .data(links)
            .enter()
            .append("path")
           .style("fill","none")
           .style("stroke-width",".1")
           .style("stroke-linecap","round")
            .style("stroke", d => {
              if (d.visibility) {
                return "crimson";
              } else {
                return "transparent";
              }
            }) // links always exist, they just become transparent if the articles are not in the timeframe
            .attr("d", path);

          var locNames = locGroup
            .selectAll("text")
            .data(cities)
            .enter()
            .append("text")
            .style("fill", "black")
            .style("fond-style", "Noto Sans")
            .style("user-select", "none")
            .style("display",d=>{
              if(d.hasOwnProperty("smallInCluster")&&d.smallInCluster===true) {
                return "none"
              } else{
                return "block"
              }
            })
            .style("font-size", d => {
              if (d.radius > 0) {
                return d.radius + 0.1 + "px";
              } else {
                return "0";
              }
            })
            .attr("transform", d => {
              var loc = projection([d.lon, d.lat]),
                x = loc[0];
              y = loc[1];
              return "translate(" + (x + d.radius) + "," + y + ")";
            })
            .text(d => d.city);

          // ADDING THE CITIES

          var locations = locGroup
            .selectAll(".locations")
            .data(cities)
            .enter()
            .append("path")
            .attr("id", d => d.city)
            .attr("class","locations")
            .style("fill","rgba(0, 82, 158, 0.55)")
            .style("stroke","none")
            .style("cursor","help");



          locations
            .datum(d =>
              d3.geoCircle()
                .center([d.lon, d.lat])
                .radius(d.radius * 0.05)()
            )
            .attr("d", path);

          locations.on("mouseover", d => {
           

            d3.selectAll(".arc").style("opacity",".15"); 
            d3.selectAll(".locations").style("opacity",".4"); 

            for (var i = 0; i < locations._groups[0].length; i++) {
              if (
                d.coordinates[0][0] ===
                locations._groups[0][i].__data__.coordinates[0][0]
              ) {
               d3.select(locations._groups[0][i]).style("opacity","1");
              
               affilFinder(cities[i])   
              
       
                
                  d3.selectAll(".arc")._groups[0].forEach(lk=>{
                    if(lk.__data__.points[0].cityname===cities[i].city){
                        d3.select(lk).style("opacity","1")
                    }

                    if(lk.__data__.points[1].cityname===cities[i].city){
                      d3.select(lk).style("opacity","1")
                  }
                 

                })

              }
           
            }
          });

          locations.on("mouseout", () => {
            d3.selectAll(".arc").style("opacity","1");
            d3.selectAll(".locations").style("opacity","1")
        });

        };

        linkLoc(); // start it a first time
        // Brush Data

        // === Bar Range Slider ===
        // adapted from https://observablehq.com/@bumbeishvili/data-driven-range-sliders

        const barRangeSlider = (
          initialDataArray,
          accessorFunction,
          aggregatorFunction,
          paramsObject
        ) => {
          const chartWidth = width - toolWidth - 40;
          let chartHeight = 100;
          let startSelection = 100;

          const argumentsArr = [initialDataArray];

          const initialData = initialDataArray;
          const accessor = accessorFunction;
          const aggregator = aggregatorFunction;
          let params = argumentsArr.filter(isPlainObj)[0];
          if (!params) {
            params = {};
          }
          params.minY = params.yScale ? 0.0001 : 0;
          params.yScale = params.yScale || d3.scaleLinear();
          chartHeight = params.height || chartHeight;
          params.yTicks = params.yTicks || 4;
          params.freezeMin = params.freezeMin || false;

          var accessorFunc = d => d;
          if (initialData[0].value != null) {
            accessorFunc = d => d.value;
          }
          if (typeof accessor == "function") {
            accessorFunc = accessor;
          }

          const grouped = d3.nest()
            .key(d => d.date)
            .entries(initialData);

          for (let i = 0; i < grouped.length; i++) {
            grouped[i].date = new Date(grouped[i].key);
          }

          for (let i = 0; i < grouped.length; i++) {
            if (grouped[i].key === "undefined") {
              grouped.splice(i, 1);
            }
          }

          const isDate = true;
          var dateExtent,
            dateScale,
            scaleTime,
            dateRangesCount,
            dateRanges,
            scaleTime;
          if (isDate) {
            dateExtent = d3.extent(grouped.map(d => d.date));

            dateExtent[0].setFullYear(dateExtent[0].getFullYear() - 1);
            dateExtent[1].setFullYear(dateExtent[1].getFullYear() + 1);

            dateRangesCount = Math.round(width / 5);
            dateScale = d3.scaleTime()
              .domain(dateExtent)
              .range([0, dateRangesCount]);
            scaleTime = d3.scaleTime()
              .domain(dateExtent)
              .range([0, chartWidth]);
            dateRanges = d3.range(dateRangesCount)
              .map(d => [dateScale.invert(d), dateScale.invert(d + 1)]);
          }

          d3.selection.prototype.patternify = function(params) {
            var container = this;
            var selector = params.selector;
            var elementTag = params.tag;
            var data = params.data || [selector];

            // Pattern in action
            var selection = container
              .selectAll("." + selector)
              .data(data, (d, i) => {
                if (typeof d === "object") {
                  if (d.id) {
                    return d.id;
                  }
                }
                return i;
              });
            selection.exit().remove();
            selection = selection
              .enter()
              .append(elementTag)
              .merge(selection);
            selection.attr("class", selector);
            return selection;
          };

          const handlerWidth = 2,
            handlerFill = "#E1E1E3",
            middleHandlerWidth = 10,
            middleHandlerStroke = "#8E8E8E",
            middleHandlerFill = "#EFF4F7";

          const svg = d3.select("#xtypeSVG");

          let sliderOffsetHeight = document.body.offsetHeight - 120;

          const chart = svg
            .append("g")
            .attr("transform", "translate(30," + sliderOffsetHeight + ")");

          grouped.forEach(d => {
            d.key = d.date;
            d.value = d.values.length;
          });

          const values = grouped.map(d => d.value);
          const min = d3.min(values);
          const max = d3.max(values);
          const maxX = grouped[grouped.length - 1].key;
          const minX = grouped[0].key;

          var minDiff = d3.min(grouped, (d, i, arr) => {
            if (!i) return Infinity;
            return d.key - arr[i - 1].key;
          });

          let eachBarWidth = chartWidth / minDiff / (maxX - minX);

          if (eachBarWidth > 20) {
            eachBarWidth = 20;
          }

          if (minDiff < 1) {
            eachBarWidth = eachBarWidth * minDiff;
          }

          if (eachBarWidth < 1) {
            eachBarWidth = 1;
          }

          const scale = params.yScale
            .domain([params.minY, max])
            .range([0, chartHeight - 25]);

          const scaleY = scale
            .copy()
            .domain([max, params.minY])
            .range([0, chartHeight - 25]);

          const scaleX = d3.scaleLinear()
            .domain([minX, maxX])
            .range([0, chartWidth]);

          var axis = d3.axisBottom(scaleX);
          if (isDate) {
            axis = d3.axisBottom(scaleTime);
          }
          const axisY = d3.axisLeft(scaleY)
            .tickSize(-chartWidth - 20)
            .ticks(max == 1 ? 1 : params.yTicks)
            .tickFormat(d3.format(".2s"));

          const bars = chart
            .selectAll(".bar")
            .data(grouped)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", eachBarWidth)
            .attr("height", d => scale(d.value))
            .attr("fill", "steelblue")
            .attr("y", d => -scale(d.value) + (chartHeight - 25))
            .attr("x", (d, i) => scaleX(d.key) - eachBarWidth / 2)
            .attr("opacity", 0.9);

          const xAxisWrapper = chart
            .append("g")
            .attr("id","brushXAxis")
            .attr("transform", `translate(${0},${chartHeight - 25})`)
            .call(axis);

          const yAxisWrapper = chart
            .append("g")
            .attr("transform", `translate(${-10},${0})`)
            .call(axisY);

          const brush = chart
            .append("g")
            .attr("id", "selectionBrush")
            .attr("class", "brush")
            .call(
              d3.brushX()
                .extent([[0, 0], [chartWidth, chartHeight]])
                .on("start", brushStarted)
                .on("end", brushEnded)
                .on("brush", brushed)
            );

          chart.selectAll(".selection").attr("fill-opacity", 0.1);

          var handle = brush
            .patternify({
              tag: "g",
              selector: "custom-handle",
              data: [
                {
                  left: true
                },
                {
                  left: false
                }
              ]
            })
            .attr("cursor", "ew-resize")
            .attr("pointer-events", "all");

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect",
              data: d => [d]
            })
            .attr("width", handlerWidth)
            .attr("height", 100)
            .attr("fill", handlerFill)
            .attr("stroke", handlerFill)
            .attr("y", -50)
            .attr("pointer-events", "none");

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect-middle",
              data: d => [d]
            })
            .attr("width", middleHandlerWidth)
            .attr("height", 30)
            .attr("fill", middleHandlerFill)
            .attr("stroke", middleHandlerStroke)
            .attr("y", -16)
            .attr("x", -middleHandlerWidth / 4)
            .attr("pointer-events", "none")
            .attr("rx", 3);

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect-line-left",
              data: d => [d]
            })
            .attr("width", 0.7)
            .attr("height", 20)
            .attr("fill", middleHandlerStroke)
            .attr("stroke", middleHandlerStroke)
            .attr("y", -100 / 6 + 5)
            .attr("x", -middleHandlerWidth / 4 + 3)
            .attr("pointer-events", "none");

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect-line-right",
              data: d => [d]
            })
            .attr("width", 0.7)
            .attr("height", 20)
            .attr("fill", middleHandlerStroke)
            .attr("stroke", middleHandlerStroke)
            .attr("y", -100 / 6 + 5)
            .attr("x", -middleHandlerWidth / 4 + middleHandlerWidth - 3)
            .attr("pointer-events", "none");

          handle.attr("display", "none");

          function brushStarted() {
            if (d3.event.selection) {
              startSelection = d3.event.selection[0];
            }
          }

          function brushEnded() {
          
            if (!d3.event.selection) {
              handle.attr("display", "none");

              output({
                range: [minX, maxX]
              });
              return;
            }
            if (d3.event.sourceEvent.type === "brush") return;

            var d0 = d3.event.selection.map(scaleX.invert),
              d1 = d0.map(d3.timeDay.round);

            if (d1[0] >= d1[1]) {
              d1[0] = d3.timeDay.floor(d0[0]);
              d1[1] = d3.timeDay.offset(d1[0]);
            }

            brushContent = d1;
            let visArticleAmnt = 0;

            links.forEach(link => (link.visibility = false)); // Make all links invisible


            cities.forEach(city => {
              city.values.forEach(paper => {
                paper.date = new Date(paper.date);
                var linkIndex = links.findIndex(link => link.DOI === paper.DOI);

                if (
                  paper.date >= brushContent[0] &&
                  paper.date <= brushContent[1]
                ) {
                  paper.visibility = true;
                  visArticleAmnt = visArticleAmnt + 1;
                  if (linkIndex > -1 && links[linkIndex].DOI!=undefined) {
                    links[linkIndex].visibility = true;
                  }
                } else {
                  paper.visibility = false;
                //  if (linkIndex > -1) {
                //    links[linkIndex].visibility = false;
                //  }
                }
                
              });
            });

            document.getElementById("docCountDiv").innerHTML =
              visArticleAmnt + " articles";
            linkLoc();
            d3.select("#tooltip").html("");
          }

          function brushed(d) {
            if (d3.event.sourceEvent.type === "brush") return;
          
            if (params.freezeMin) {
              if (d3.event.selection[0] < startSelection) {
                d3.event.selection[1] = Math.min(
                  d3.event.selection[0],
                  d3.event.selection[1]
                );
              }
              if (d3.event.selection[0] >= startSelection) {
                d3.event.selection[1] = Math.max(
                  d3.event.selection[0],
                  d3.event.selection[1]
                );
              }

              d3.event.selection[0] = 0;
           
              d3.select(this).call(d3.event.target.move, d3.event.selection);
            }

            var d0 = d3.event.selection.map(scaleX.invert);
            const s = d3.event.selection;
           
            handle.attr("display", null).attr("transform", function(d, i) {
            
              return "translate(" + (s[i] - 2) + "," + chartHeight / 2 + ")";
            });
            output({
              range: d0
            });
          }

          yAxisWrapper.selectAll(".domain").remove();
          xAxisWrapper.selectAll(".domain").attr("opacity", 0.1);

          chart.selectAll(".tick line").attr("opacity", 0.1);

          function isPlainObj(o) {
            return typeof o == "object" && o.constructor == Object;
          }

          function output(value) {
            const node = svg.node();
            node.value = value;
            node.value.data = getData(node.value.range);
            if (isDate) {
              node.value.range = value.range.map(d => dateScale.invert(d));
            }
            node.dispatchEvent(new CustomEvent("input"));
          }

          function getData(range) {
            const dataBars = bars
              .attr("fill", "steelblue")
              .filter(d => {
                return d.key >= range[0] && d.key <= range[1];
              })
              .attr("fill", "red")
              .nodes()
              .map(d => d.__data__)
              .map(d => d.values)
              .reduce((a, b) => a.concat(b), []);

            return dataBars;
          }

          const returnValue = Object.assign(svg.node(), {
            value: {
              range: [minX, maxX],
              data: initialData
            }
          });

          if (isDate) {
            returnValue.value.range = returnValue.value.range.map(d =>
              dateScale.invert(d)
            );
          }

          return returnValue;
        };

        var docCountDiv = document.createElement("div");
        docCountDiv.id = "docCountDiv";
        docCountDiv.style.position = "absolute";
        docCountDiv.style.fontSize = "10px";
        docCountDiv.style.top = document.body.offsetHeight - 15 + "px";
        docCountDiv.style.left = parseInt(width - toolWidth) / 2 + "px";
        docCountDiv.innerHTML = data.length + " articles";
        xtype.appendChild(docCountDiv);

        barRangeSlider(data);

        loadType();
      });// end of world-country call
    }).catch(error => {field.value = "error - invalid dataset";ipcRenderer.send("console-logs","Geotype error: dataset " + id + " is invalid.");});

let v0, q0, r0;

    function dragstarted() {
      v0 = versor.cartesian(projection.invert(d3.mouse(this)));
      q0 = versor((r0 = projection.rotate()));
    }

   dragged = function (targetDrag,transTime) {
     
      if (targetDrag){
       

  
        d3.transition()
  .duration(2000)
  .attrTween("render", () => t => {
  
      var x = d3.interpolateNumber(currentDrag[0],targetDrag[0])(t)
      var y = d3.interpolateNumber(currentDrag[1],targetDrag[1])(t)
      var z = d3.interpolateNumber(currentDrag[2],targetDrag[2])(t)

     coord = [x,y,z]

      projection.rotate(coord)
      view.selectAll("path").attr("d", path);
  

      var globeCenter = projection.invert([document.getElementById("xtypeSVG").width.baseVal.value/2,document.getElementById("xtypeSVG").width.baseVal.value/2]);

      d3.select("#cityLocations").selectAll("text")
            .style("display", d => {
              //hide if behind the globe or in cluster
      
              if(d.hasOwnProperty("smallInCluster")&&d.smallInCluster===true) {
                return "none"
              } 
      
              if ( d.lon>globeCenter[0]-90 && d.lon < globeCenter[0]+90 && d.lat>globeCenter[1]-90 && d.lat < globeCenter[1]+90) {
              return "block";
            } else {
              return "none";
            }
            })
              .attr("transform", d => {
      
                var loc = projection([d.lon, d.lat]),
                x = loc[0],
                y = loc[1];
                
                return "translate(" + (x + d.radius) + "," + y + ")";
              })
              .text(d => d.city);
                
  }).on("end",()=>{
currentDrag = coord;
  })
      } else {
        const v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)));
        const q1 = versor.multiply(q0, versor.delta(v0, v1));  
        projection.rotate(versor.rotation(q1)); // rotate projection
        currentDrag = versor.rotation(q1);
   
      var globeCenter = projection.invert([document.getElementById("xtypeSVG").width.baseVal.value/2,document.getElementById("xtypeSVG").width.baseVal.value/2]);

d3.select("#cityLocations").selectAll("text")
      .style("display", d => {
        //hide if behind the globe or in cluster

        if(d.hasOwnProperty("smallInCluster")&&d.smallInCluster===true) {
          return "none"
        } 

        if ( d.lon>globeCenter[0]-90 && d.lon < globeCenter[0]+90 && d.lat>globeCenter[1]-90 && d.lat < globeCenter[1]+90) {
        return "block";
      } else {
        return "none";
      }
      })
        .attr("transform", d => {

          var loc = projection([d.lon, d.lat]),
          x = loc[0],
          y = loc[1];
          
          return "translate(" + (x + d.radius) + "," + y + ")";
        })
        .text(d => d.city);

      view.selectAll("path").attr("d", path);
    }
  }

    view.call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged));

  view.style("transform-origin", "50% 50% 0");
  view.call(zoom);

   zoomed = (thatZoom,transTime) => {
    currentZoom =  thatZoom;
    view.transition().duration(transTime).style("transform", "scale(" + thatZoom.k + ")");
  }
 
  ipcRenderer.send("console-logs", "Starting geotype");
};


// ========= GAZOUILLOTYPE =========
const gazouillotype = id => {
  // When called, draw the gazouillotype

  //========== SVG VIEW =============
  var svg = d3.select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG"); // Creating the SVG node

  svg.attr("width", width-toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view")
    .attr("id", "piles");

  var brushHeight = 150; // Hardcoding brush height

  svg
    .append("rect") // Inserting a rectangle below the brush to make it easier to read
    .attr("x", 0)
    .attr("y", height - brushHeight) // Rectangle starts at top left
    .attr("width", width)
    .attr("height", brushHeight) // Rectangle dimensions
    .style("fill", "white") // Rectangle background color
    .style("stroke-width", "0"); // Invisible borders

  

  svg.call(zoom.on("zoom", e=> {zoomed(d3.event.transform)})); 

  var brushXscale;

  //========== X & Y AXIS  ============                                // Creating two arrays of scales (graph + brush)
  var x = d3.scaleTime();
  var y = d3.scaleLinear()
          .range([height - brushHeight, 0])
          .domain([0,210]);

  var xAxis = d3.axisBottom(x).tickFormat(multiFormat);

  var yAxis = d3.axisRight(y).tickFormat(d3.format(".2s"));

  var domainDates = [];
  var bufferData = [];
  var lineData = [];

  const scrapToApiFormat = data => {
    if (data.hasOwnProperty("date")) {
      data.from_user_name = data.username;
      data.created_at = data.date;
      data.retweet_count = data.retweets;
      data.favorite_count = data.favorites;
      delete data.username;
      delete data.date;
      delete data.retweets;
      delete data.favorites;
    }
  };

  // LOADING DATA

  pandodb.gazouillotype.get(id).then(datajson => {
    // Load dataset info from pandodb

    dataDownload(datajson);

    datajson.content.tweets = []; // Prepare array to store tweets into

    let tranche = { date: "", tweets: [] }; // A tranche will be a pile on the graph
    let twDate = 0; // Date variable
    let twtAmount = 0; // Tweet amount variable
    let radius = parseFloat(width/1200);

    fs.createReadStream(datajson.content.path) // Read the flatfile dataset provided by the user
      .pipe(csv()) // pipe buffers to csv parser
      .on("data", data => {
        // each line becomes an object
        scrapToApiFormat(data); // convert the object to the twitter API format
        data.date = new Date(data.created_at); // get the date
        data.stamp = Math.round(data.date.getTime() / 600000) * 600000; // make it part of a 10-min pile in milliseconds
        data.timespan = new Date(data.stamp); // turn that into a proper JS date

        if (data.stamp === twDate) {
          // If a pile already exists
          tranche.tweets.push(data); // add this tweet to the current pile
        } else {
          // else
          twtAmount += tranche.tweets.length; // add the amount of the previous pile to the previous total
          datajson.content.tweets.push(tranche); // push the pile to the main array
          twDate = data.stamp; // change pile date
          tranche = { date: data.timespan, tweets: [] }; // create new pile object
          tranche.tweets.push(data); // add tweet to this new pile
          ipcRenderer.send(
            "chaeros-notification",
            twtAmount + " tweets loaded"
          ); // send new total to main display
        }
      })
      .on("end", () => {
        // Once file has been totally read

        ipcRenderer.send("chaeros-notification", "rebuilding data"); // send new total to main display

        datajson.content.tweets.shift(); // Remove first empty value

        // RE-SORT PILES TO MAKE SURE THEY ARE PAST->FUTURE

        var data = datajson.content.tweets; // Reassign data
        var keywords = datajson.content.keywords;

var requestContent= "Request content :<br><ul>";

keywords.forEach(kw=>{
  requestContent=requestContent+"<li>"+kw+"</li>"
})
requestContent=requestContent+"</ul>"

        // Find out the mean retweet value to attribute color scale
        var meanRetweetsArray = [];

        data.forEach(tweetDataset => {
          tweetDataset.tweets.forEach(d => {
            d.date = new Date(d.created_at);
            d.timespan = new Date(
              Math.round(d.date.getTime() / 600000) * 600000
            );
            if (d.retweet_count > 0) {
              meanRetweetsArray.push(d.retweet_count);
            }
          });
        });

        meanRetweetsArray.sort((a, b) => a - b);
        var median = meanRetweetsArray[parseInt(meanRetweetsArray.length / 2)];

        var color = d3.scaleSequential(d3.interpolateBlues)
          .clamp(true)
          .domain([-median * 2, median * 10]);

        var altColor = d3.scaleSequential(d3.interpolateOranges)
          .clamp(true)
          .domain([-median * 2, median * 10]);

        // Assign each tweet a place in the pile according to their index position
        const piler = () => {
          for (i = 0; i < data.length; i++) {
            let j = data[i].tweets.length + 1;
            for (k = 0; k < data[i].tweets.length; k++) {
              data[i].tweets[k].indexPosition = j - 1;
              j--;
            }
          }
        };

        piler();

        var firstDate = new Date(data[0].date);
        
        function addDays(date, days) {
          var result = new Date(date);
          result.setDate(result.getDate() + days);
          return result;
        }
        var plusDate = addDays(firstDate,2)
        var lastDate = new Date(data[data.length - 1].date);

        domainDates.push(firstDate, lastDate);

        var pileExtent = (lastDate - firstDate) / 600000;

        data.forEach(d => {
          d.tweets.forEach(tweet => bufferData.push(tweet));
        });

        let circleData = [];
        for (let i = 0; i < bufferData.length; i++) {
          circleData.push(bufferData[i]);
        }

        const keywordsDisplay = () => {
          document.getElementById("tooltip").innerHTML = requestContent
        };

        x.domain([firstDate,plusDate]).range([0, width - toolWidth]);
        xAxis.ticks(x.range()[1] / 100);
        zoom.translateExtent([[-width / 3, 0], [Infinity, height]]);
             
        let areaData = [];

        data.forEach(d => {
          let point = {
            timespan: d.tweets[0].timespan,
            indexPosition: +d.tweets[0].indexPosition
          };
          areaData.push(point);
        });

        ipcRenderer.send("chaeros-notification", "generating network"); // send new total to main display


        multiThreader.port.postMessage({type:"gz", dataset: circleData });

        multiThreader.port.onmessage = gzWorkerAnswer => {
        if (gzWorkerAnswer.data.type==="gz"){
          
          circleData = gzWorkerAnswer.data.msg; 
 
          view.selectAll("circle")
            .data(circleData)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("id", d => d.id)
            .style("fill", d => color(d.retweet_count))
            .style("cursor", "pointer")
            .attr("r", radius)
            .attr("cx", d => x(d.timespan))
            .attr("cy", d => y(d.indexPosition))
            .on("click", d => {
              d3.select("#linktosource").remove();
              lineData = [];
              lineData.push(d);
              circleData.forEach(tweet => {
                document.getElementById(tweet.id).style =
                  "fill :" + color(tweet.retweet_count);

                if (tweet.id === d.retweeted_id) {
                  lineData.push(tweet);
                }

                if (
                  d.retweeted_id.length > 1 &&
                  tweet.retweeted_id === d.retweeted_id
                ) {
                  document.getElementById(tweet.id).style = "fill : salmon";
                }
                if (tweet.from_user_id === d.from_user_id) {
                  document.getElementById(tweet.id).style =
                    "fill : " + altColor(tweet.retweet_count);
                }
              });

              if (parseInt(d.retweeted_id)) {             // if it is a NaN, returns false
                document.getElementById(d.retweeted_id).style = "fill : red";

                var line = (line = d3.line()
                  .x(line => x(line.timespan))
                  .y(line => y(line.indexPosition)));

                view.append("path")
                  .datum(lineData)
                  .attr("id", "linktosource")
                  .style("stroke", "red")
                  .style("stroke-linecap", "round")
                  .style("stroke-width", radius / 3)
                  .attr("d", line);
              }

              keywords
                .reduce((res, val) => res.concat(val.split(/ AND /)), [])
                .forEach(e => {
                  let target = new RegExp("\\b" + e + "\\b", "gi");
                  if (target.test(d.text)) {
                    d.text = d.text.replace(target, "<mark>" + e + "</mark>");
                  }
                  if (target.test(d.from_user_name)) {
                    d.from_user_name = d.from_user_name.replace(
                      target,
                      "<mark>" + e + "</mark>"
                    );
                  }
                  if (target.test(d.links)) {
                    d.links = d.links.replace(target, "<mark>" + e + "</mark>");
                  }
                });
              d3.select("#tooltip").html(
                '<p class="legend"><strong><a target="_blank" href="https://mobile.twitter.com/' +
                  d.from_user_name +
                  '">' +
                  d.from_user_name +
                  '</a></strong> <br/><div style="border:1px solid black;"><p>' +
                  d.text +
                  "</p></div><br><br> Language: " +
                  d.lang +
                  "<br>Date: " +
                  d.date +
                  "<br> Favorite count: " +
                  d.favorite_count +
                  "<br>Reply count: " +
                  d.reply_count +
                  "<br>Retweet count: " +
                  d.retweet_count +
                  "<br>Links: <a target='_blank' href='" +
                  d.links +
                  "'>" +
                  d.links +
                  "</a><br> Hashtags: " +
                  d.hashtags +
                  "<br> Mentionned user names: " +
                  d.mentionned_user_names +
                  "<br> Source: " +
                  d.source_name +
                  "<br>Tweet id: <a target='_blank' href='https://mobile.twitter.com/" +
                  d.from_user_name +
                  "/status/" +
                  d.id +
                  "'>" +
                  d.id +
                  "</a><br> Possibly sensitive: " +
                  d.possibly_sensitive +
                  "<br><br> Embeded media<br><img src='" +
                  d.medias_urls +
                  "' width='300' ><br><br><strong>Location</strong><br/>City: " +
                  d.location +
                  "<br> Latitude:" +
                  d.lat +
                  "<br>Longitude: " +
                  d.lng +
                  "<br><br><strong>User info</strong><br><img src='" +
                  d.from_user_profile_image_url +
                  "' max-width='300'><br><br>Account creation date: " +
                  d.from_user_created_at +
                  "<br> Account name: " +
                  d.from_user_name +
                  "<br> User id: " +
                  d.from_user_id +
                  "<br> User description: " +
                  d.from_user_description +
                  "<br> User follower count: " +
                  d.from_user_followercount +
                  "<br> User friend count: " +
                  d.from_user_friendcount +
                  "<br> User tweet count: " +
                  d.from_user_tweetcount +
                  "" +
                  "<br><br>" +
                  requestContent +
                  "<br><br><br><br><br><br><br><br></p>"
              );
            });


        
        



           

  // === Bar Range Slider ===
  // adapted from https://observablehq.com/@bumbeishvili/data-driven-range-sliders

          const barRangeSlider = (
            initialDataArray,
            accessorFunction,
            aggregatorFunction,
            paramsObject
          ) => {
            const chartWidth = width - toolWidth - 40;
            let chartHeight = 100;
            let startSelection = 100;

            const argumentsArr = [...arguments];

            const initialData = initialDataArray;
            const accessor = accessorFunction;
            const aggregator = aggregatorFunction;
            let params = argumentsArr.filter(isPlainObj)[0];
            if (!params) {
              params = {};
            }
            params.minY = params.yScale ? 0.0001 : 0;
            params.yScale = params.yScale || d3.scaleLinear();
            chartHeight = params.height || chartHeight;
            params.yTicks = params.yTicks || 4;
            params.freezeMin = params.freezeMin || false;

            var accessorFunc = d => d;
            if (initialData[0].value != null) {
              accessorFunc = d => d.value;
            }
            if (typeof accessor == "function") {
              accessorFunc = accessor;
            }

            const grouped = initialData;

            const isDate = true;
            var dateExtent,
              dateScale,
              scaleTime,
              dateRangesCount,
              dateRanges,
              scaleTime;

            dateExtent = d3.extent(grouped.map(d => d.timespan));

          

            dateRangesCount = Math.round(width / 5);
            dateScale = d3.scaleTime()
              .domain(dateExtent)
              .range([0, dateRangesCount]);
            scaleTime = d3.scaleTime()
              .domain(dateExtent)
              .range([0, chartWidth]);
          
            dateRanges = d3.range(dateRangesCount)
              .map(d => [dateScale.invert(d), dateScale.invert(d + 1)]);

            d3.selection.prototype.patternify = function(params) {
              var container = this;
              var selector = params.selector;
              var elementTag = params.tag;
              var data = params.data || [selector];

              // Pattern in action
              var selection = container
                .selectAll("." + selector)
                .data(data, (d, i) => {
                  if (typeof d === "object") {
                    if (d.id) {
                      return d.id;
                    }
                  }
                  return i;
                });
              selection.exit().remove();
              selection = selection
                .enter()
                .append(elementTag)
                .merge(selection);
              selection.attr("class", selector);
              return selection;
            };

            const handlerWidth = 2,
              handlerFill = "#E1E1E3",
              middleHandlerWidth = 10,
              middleHandlerStroke = "#8E8E8E",
              middleHandlerFill = "#EFF4F7";

            const svg = d3.select(xtypeSVG);

            let sliderOffsetHeight = document.body.offsetHeight - 120;

            const chart = svg
              .append("g")
              .attr("transform", "translate(30," + sliderOffsetHeight + ")")
              .attr("id", "chart");

            grouped.forEach(d => {
              d.key = d.timespan;
              d.value = d.indexPosition;
            });
            
            const values = grouped.map(d => d.value);
            const min = d3.min(values);
            const max = d3.max(values);
            const maxX = grouped[grouped.length - 1].key;
            const minX = grouped[0].key;

            var minDiff = d3.min(grouped, (d, i, arr) => {
              if (!i) return Infinity;
              return d.key - arr[i - 1].key;
            });

            let eachBarWidth = chartWidth / minDiff / (maxX - minX);

            if (eachBarWidth > 20) {
              eachBarWidth = 20;
            }

            if (minDiff < 1) {
              eachBarWidth = eachBarWidth * minDiff;
            }

            if (eachBarWidth < 1) {
              eachBarWidth = 1;
            }

            const scale = params.yScale
              .domain([params.minY, max])
              .range([0, chartHeight - 25]);

            const scaleY = scale
              .copy()
              .domain([max, params.minY])
              .range([0, chartHeight - 25]);

            const scaleX = d3.scaleLinear()
              .domain([minX, maxX])
              .range([0, chartWidth])
              

              var axis = d3.axisBottom(scaleX);

              if (isDate) {
                axis = d3.axisBottom(scaleTime).tickFormat(d3.timeFormat("%d/%m/%y"));
              }

            const axisY = d3.axisLeft(scaleY)
              .tickSize(-chartWidth - 20)
              .ticks(max == 1 ? 1 : params.yTicks)
              .tickFormat(d3.format(".2s"));

            brushXscale = scaleX;

            const bars = chart
              .selectAll(".bar")
              .data(grouped)
              .enter()
              .append("rect")
              .attr("class", "bar")
              .attr("width", eachBarWidth)
              .attr("height", d => scale(d.value))
              .attr("fill", "steelblue")
              .attr("y", d => -scale(d.value) + (chartHeight - 25))
              .attr("x", (d, i) => scaleX(d.key) - eachBarWidth / 2)
              .attr("opacity", 0.9);

            const xAxisWrapper = chart
              .append("g")
              .attr("id","brushXAxis")
              .attr("transform", `translate(${0},${chartHeight - 25})`)
              .call(axis);

            const yAxisWrapper = chart
              .append("g")
              .attr("transform", `translate(${-10},${0})`)
              .call(axisY);

            const brush = chart
              .append("g")
              .attr("id", "selectionBrush")
              .attr("class", "brush")
              .call(
                d3.brushX()
                  .extent([[0, 0], [chartWidth, chartHeight]])
                  .on("start", brushStarted)
                  .on("end", brushEnded)
                  .on("brush", brushed)
              );

            chart.selectAll(".selection").attr("fill-opacity", 0.1);

            var handle = brush
              .patternify({
                tag: "g",
                selector: "custom-handle",
                data: [
                  {
                    left: true
                  },
                  {
                    left: false
                  }
                ]
              })
              .attr("cursor", "ew-resize")
              .attr("pointer-events", "all");

            handle
              .patternify({
                tag: "rect",
                selector: "custom-handle-rect",
                data: d => [d]
              })
              .attr("width", handlerWidth)
              .attr("height", 100)
              .attr("fill", handlerFill)
              .attr("stroke", handlerFill)
              .attr("y", -50)
              .attr("pointer-events", "none");

            handle
              .patternify({
                tag: "rect",
                selector: "custom-handle-rect-middle",
                data: d => [d]
              })
              .attr("width", middleHandlerWidth)
              .attr("height", 30)
              .attr("fill", middleHandlerFill)
              .attr("stroke", middleHandlerStroke)
              .attr("y", -16)
              .attr("x", -middleHandlerWidth / 4)
              .attr("pointer-events", "none")
              .attr("rx", 3);

            handle
              .patternify({
                tag: "rect",
                selector: "custom-handle-rect-line-left",
                data: d => [d]
              })
              .attr("width", 0.7)
              .attr("height", 20)
              .attr("fill", middleHandlerStroke)
              .attr("stroke", middleHandlerStroke)
              .attr("y", -100 / 6 + 5)
              .attr("x", -middleHandlerWidth / 4 + 3)
              .attr("pointer-events", "none");

            handle
              .patternify({
                tag: "rect",
                selector: "custom-handle-rect-line-right",
                data: d => [d]
              })
              .attr("width", 0.7)
              .attr("height", 20)
              .attr("fill", middleHandlerStroke)
              .attr("stroke", middleHandlerStroke)
              .attr("y", -100 / 6 + 5)
              .attr("x", -middleHandlerWidth / 4 + middleHandlerWidth - 3)
              .attr("pointer-events", "none");

            handle.attr("display", "none");

            function brushStarted() {
              if (d3.event.selection) {
                startSelection = d3.event.selection[0];
              }
            }

            function brushEnded() {
             
              if (!d3.event.selection) {
                handle.attr("display", "none");

                output({
                  range: [minX, maxX]
                });
                return;
              }
              if (d3.event.sourceEvent.type === "brush") return;

              var d0 = d3.event.selection.map(scaleX.invert),
                d1 = d0.map(d3.timeDay.round);

              if (d1[0] >= d1[1]) {
                d1[0] = d3.timeDay.floor(d0[0]);
                d1[1] = d3.timeDay.offset(d1[0]);
              }

              brushContent = d1;

              let midDate;

              midDate = new Date(
                brushContent[0].getTime() +
                  (brushContent[1].getTime() - brushContent[0].getTime()) / 2
              );

              // TO DO
              // COMPUTE ZOOM SCALE ACCORDING TO d1

              d3.select("#xtypeSVG")
                .transition()
                .duration(750)
                .call(
                  zoom.transform,
                  d3.zoomIdentity.translate(-x(d1[0]), -y(200))
                );

              let visibleTweets = 0;

              grouped.forEach(pile => {
                if (
                  pile.key >= brushContent[0] &&
                  pile.key <= brushContent[1]
                ) {
                  visibleTweets =
                    parseInt(visibleTweets) + parseInt(pile.value);
                }
              });

           //   document.getElementById("docCountDiv").innerHTML = visibleTweets + " tweets";
            }

            function brushed(d) {
              if (d3.event.sourceEvent.type === "brush") return;
          

              if (params.freezeMin) {
                if (d3.event.selection[0] < startSelection) {
                  d3.event.selection[1] = Math.min(
                    d3.event.selection[0],
                    d3.event.selection[1]
                  );
                }
                if (d3.event.selection[0] >= startSelection) {
                  d3.event.selection[1] = Math.max(
                    d3.event.selection[0],
                    d3.event.selection[1]
                  );
                }

                d3.event.selection[0] = 0;
              

                d3.select(this).call(d3.event.target.move, d3.event.selection);
              }

              var d0 = d3.event.selection.map(scaleX.invert);
              const s = d3.event.selection;

              handle.attr("display", null).attr("transform", function(d, i) {
              
                return "translate(" + (s[i] - 2) + "," + chartHeight / 2 + ")";
              });
              output({
                range: d0
              });
            }

            yAxisWrapper.selectAll(".domain").remove();
            xAxisWrapper.selectAll(".domain").attr("opacity", 0.1);

            chart.selectAll(".tick line").attr("opacity", 0.1);

            function isPlainObj(o) {
              return typeof o == "object" && o.constructor == Object;
            }

            function output(value) {
              const node = svg.node();
              node.value = value;
              node.value.data = getData(node.value.range);
              if (isDate) {
                node.value.range = value.range.map(d => dateScale.invert(d));
              }
              node.dispatchEvent(new CustomEvent("input"));
            }

            function getData(range) {
              const dataBars = bars
                .attr("fill", "steelblue")
                .filter(d => {
                  return d.key >= range[0] && d.key <= range[1];
                })
                //  .attr("fill", "red")
                .nodes()
                .map(d => d.__data__)
                .map(d => d.values)
                .reduce((a, b) => a.concat(b), []);

              return dataBars;
            }

            const returnValue = Object.assign(svg.node(), {
              value: {
                range: [minX, maxX],
                data: initialData
              }
            });

            if (isDate) {
              returnValue.value.range = returnValue.value.range.map(d =>
                dateScale.invert(d)
              );
            }

            return returnValue;
          };

          var docCountDiv = document.createElement("div");
          docCountDiv.id = "docCountDiv";
          docCountDiv.style.position = "absolute";
          docCountDiv.style.fontSize = "10px";
          docCountDiv.style.top = document.body.offsetHeight - 15 + "px";
          docCountDiv.style.left = parseInt(width - toolWidth) / 2 + "px";
          docCountDiv.innerHTML = circleData.length + " tweets";
          xtype.appendChild(docCountDiv);

          barRangeSlider(areaData);

          loadType();

          keywordsDisplay();
          }
        }; //======== END OF GZ WORKER ANWSER ===========
      });
  }).catch(error => {console.log(error);field.value = " error";ipcRenderer.send("console-logs"," error: cannot start corpus " + id + ".");}); //======== END OF DATA CALL (PROMISES) ===========

  //======== ZOOM & RESCALE ===========

  svg.append("rect")
      .attr("x","0")
      .attr("y",parseInt(height - 180))
      .attr("width",width)
      .attr("height","40px")
      .attr("fill","rgba(255,255,255,.7)");

  svg.append("rect")
      .attr("x",parseInt(width - toolWidth - 65))
      .attr("y","0")
      .attr("width","80px")
      .attr("height",height)
      .attr("fill","rgba(255,255,255,.7)");

  var gX = svg
    .append("g") // Make X axis rescalable
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + (height - 180) + ")")
    .call(xAxis);

  var gY = svg
    .append("g") // Make Y axis rescalable
    .attr("class", "axis axis--y")
    .attr("transform", "translate(" + (width - toolWidth - 70) + ",0)")
    .call(yAxis);

  svg.call(zoom).on("dblclick.zoom", null); // Zoom and deactivate doubleclick zooming

  var currentZoom;

   zoomed = (thatZoom,transTime) => {
    
   // if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    
    var t = thatZoom;
    currentZoom = t;
    
    view.transition().duration(transTime).attr("transform", t);

    gX.transition().duration(transTime).call(xAxis.scale(t.rescaleX(x)));
    gY.transition().duration(transTime).call(yAxis.scale(t.rescaleY(y)));
  
    let ext1 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[0])));
    let ext2 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[1])));

    d3.select("#selectionBrush")
      .select(".selection")
      .transition().duration(transTime)
      .attr("x",ext1)
      .attr("width",parseInt(ext2-ext1));

    d3.select("#selectionBrush")
      .select("g")
      .transition().duration(transTime)
      .attr(
        "transform",
        "translate(" + ext1 + ",50)"
      );

    d3.select("#selectionBrush")
      .selectAll("g")
      .transition().duration(transTime)
      .select(function() {
        return this.nextElementSibling;
      })
      .attr(
        "transform",
        "translate(" + ext2 + ",50)"
      );
  }

// ===== NARRATIVE =====

// Presentation Recorder
/*
 moveTo = (step) => {

let buttons = document.querySelectorAll("div.presentationStep");

buttons.forEach(but=>{
but.style.backgroundColor="white";
but.style.color="black";
})

buttons[parseInt(step.stepIndex)-1].style.backgroundColor="black";
buttons[parseInt(step.stepIndex)-1].style.color="white";

var t = step.zoom;

view.transition().duration(2000).attr("transform", t);

gX.transition().duration(2000).call(xAxis.scale(t.rescaleX(x)));
gY.transition().duration(2000).call(yAxis.scale(t.rescaleY(y)));

let ext1 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[0])));
let ext2 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[1])));

d3.select("#selectionBrush")
  .select(".selection")
  .transition().duration(2000)
  .attr("x",ext1)
  .attr("width",parseInt(ext2-ext1));

d3.select("#selectionBrush")
  .select("g")
  .transition().duration(2000)
  .attr(
    "transform",
    "translate(" + ext1 + ",50)"
  );

d3.select("#selectionBrush")
  .selectAll("g")
  .select(function() {
    return this.nextElementSibling;
  })
  .transition().duration(2000)
  .attr(
    "transform",
    "translate(" + ext2 + ",50)"
  );

tooltip.innerHTML = JSON.parse(step.tooltip);

}
*/



const stepCreator = (thisStep) => {

let stepIndex = thisStep.stepIndex

var step = document.createElement("DIV")
step.innerText= stepIndex;
step.className="presentationStep";
step.id="presentationStep"+parseInt(stepIndex);

step.addEventListener("click",()=>{moveTo(presentationStep[parseInt(stepIndex)-1])})

presentationBox.appendChild(step)

}

const addPresentationStep = () => {

let stepData={zoom:currentZoom,tooltip:JSON.stringify(tooltip.innerHTML)}


let buttons = document.querySelectorAll("div.presentationStep");
let currentButtonId=0;

for (let i = 0; i < buttons.length; i++) {
  if(buttons[i].style.backgroundColor==="black"){
    currentButtonId=i;
  }
}

if (currentButtonId===0){
  presentationStep.push(stepData)
} else {
presentationStep.splice(currentButtonId+1,0,stepData)
}

regenerateSteps();
}

const regenerateSteps = () => {

    while (presentationBox.firstChild) {
      presentationBox.removeChild(presentationBox.firstChild)
    }

    for (let i = 0; i < presentationStep.length; i++) {
      presentationStep[i].stepIndex=i+1;
      stepCreator(presentationStep[i])
    }
}

regenerateSteps();

  ipcRenderer.send("console-logs", "Starting gazouillotype"); // Starting gazouillotype
}; // Close gazouillotype function


// PHARMACOTYPE IS BACK

const pharmacotype = (id) => {

  var svg = d3.select(xtype)
  .append("svg")
  .attr("id", "xtypeSVG");

svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

var view = svg.append("g") // Appending a group to SVG
  .attr("id", "view");

  zoom.scaleExtent([0.2, 20])                               // To which extent do we allow to zoom forward or zoom back
      .translateExtent([[-Infinity,-Infinity],[Infinity,Infinity]])
      .on("zoom", e=> {zoomed(d3.event.transform)}); 

  var x = d3.scaleTime() // Y axis scale
  
  var xAxis = d3.axisBottom(x) // Actual Y axis
                .scale(x) // Scale is declared just above
                .ticks(5) // 20 ticks are displayed
                .tickSize(height) // Ticks are vertical lines
                .tickPadding(10 - height); // Ticks start and end out of the screen
  
var y = d3.scalePoint();

     //======== DATA CALL & SORT =========
   
pandodb.pharmacotype.get(id).then(datajson => {
     
  dataDownload(datajson);

var data = datajson.content.entries;
 
var trialNames = []

const clinTriDateParser = (date) => {

  var fullParseTime = d3.timeParse("%B %d, %Y");
   var partialParseTime = d3.timeParse("%B %Y");

   if (date.search(',')>-1) {
   
     return fullParseTime(date)
   } else {
     return partialParseTime(date)
   }

}

 data.forEach(d=>{

   // Setting up IDs
   d.id=d.Study.ProtocolSection.IdentificationModule.BriefTitle;
   trialNames.push(d.id);

   d.highlighted = 0;

  

  if(d.Study.ProtocolSection.DesignModule.hasOwnProperty("PhaseList")){

   let phases = d.Study.ProtocolSection.DesignModule.PhaseList.Phase;
  
   let phase = phases[phases.length-1].slice(-1);
 
   if (parseInt(phase)) {
    d.currentPhase = phase;
   } else {
    d.currentPhase = 0;
   }
  
  } else {
    d.currentPhase = 0;

  }

   d.StudyFirstSubmitDate = clinTriDateParser(d.Study.ProtocolSection.StatusModule.StudyFirstSubmitDate);
   d.StartDate = clinTriDateParser(d.Study.ProtocolSection.StatusModule.StartDateStruct.StartDate);
   if (d.Study.ProtocolSection.StatusModule.hasOwnProperty("PrimaryCompletionDateStruct")){
      d.PrimaryCompletionDate = clinTriDateParser(d.Study.ProtocolSection.StatusModule.PrimaryCompletionDateStruct.PrimaryCompletionDate);
    }

    if (d.Study.ProtocolSection.StatusModule.hasOwnProperty("CompletionDateStruct")){
        d.CompletionDate = clinTriDateParser(d.Study.ProtocolSection.StatusModule.CompletionDateStruct.CompletionDate);
    }   

   
   
  })
  
x.domain([data[0].StudyFirstSubmitDate, new Date('2025')]) // First shows a range from minus one year to plus one year
 .range([0, width - toolWidth]); // Size on screen is full height of client

y.domain(trialNames)
 .rangeRound([0, 20*data.length])
 .padding(1)

const g = view.append("g")
              .selectAll("g")
              .data(data)
              .join("g")
                .attr("transform", (d, i) => `translate(0,${y(d.id)})`);

    g.append("line")
      .attr("stroke", "#aaa")
      .attr("x1", d => x(d.StudyFirstSubmitDate))
      .attr("x2", d => x(d.CompletionDate));

    g.append("circle")
      .attr("cx",d=> x(d.StudyFirstSubmitDate))
      .attr("fill", "rgb(209, 60, 75)")
      .attr("r", 3.5);

    g.append("circle")
      .attr("cx",d=> x(d.StartDate))
      .attr("fill", "rgb(252, 172, 99)")
      .attr("r", 3.5);

    g.append("circle")
      .attr("cx",d=> x(d.PrimaryCompletionDate))
      .attr("fill", "rgb(169, 220, 162)")
      .attr("r", 3.5);

    g.append("circle")
      .attr("cx",d=> x(d.CompletionDate))
      .attr("fill", "rgb(66, 136, 181)")
      .attr("r", 3.5);

  var titles = g.append("text")
      .attr("fill", "black")
      .style("font-size",8)
      .attr("id",d=>JSON.stringify(d.Rank))
      .attr("x", d => x(d.CompletionDate))
      .attr("dx",8)
      .attr("dy",3)
      .style("cursor","pointer")
      .text(d=>d.id)
      .on("click",d=>{     

        let idMod = d.Study.ProtocolSection.IdentificationModule
        let statMod = d.Study.ProtocolSection.StatusModule
        let descMod = d.Study.ProtocolSection.DescriptionModule
        let overSight = d.Study.ProtocolSection.OversightModule


        d3.select("#tooltip").html("<h2>"+idMod.BriefTitle+"</h2>"+
        "<h3>"+idMod.Organization.OrgFullName+" - "+idMod.Organization.OrgClass.toLowerCase()+"</h3>"+"<br>"+
       " <input type='button' style='cursor:pointer' onclick='shell.openExternal("+JSON.stringify("https://clinicaltrials.gov/ct2/show/"+idMod.NCTId)+")' value='Open on ClinicalTrials.gov'></input><br><br>"+
        "<strong>Full title:</strong> "+idMod.OfficialTitle+"<br>"+
        "<strong>NCTId:</strong> "+idMod.NCTId+"<br>"+
        "<strong>Org Id:</strong> "+idMod.OrgStudyIdInfo.OrgStudyId+"<br>"+"<br>"+
        "<h3>Status</h3>"+
        "<strong>Overall status:</strong> "+statMod.OverallStatus+"<br>"+
        "<strong>Last verified:</strong> "+statMod.StatusVerifiedDate+"<br>"+
        "<strong>Expanded access:</strong> "+statMod.ExpandedAccessInfo.HasExpandedAccess+"<br>"+
        "<strong>FDA regulated:</strong> Drug ["+overSight.IsFDARegulatedDrug+"] - Device ["+overSight.IsFDARegulatedDevice+"]<br>"+
        "<h3>Description</h3>"+
        "<strong>Brief summary:</strong> "+descMod.BriefSummary+"<br>"+"<br>"+
        "<strong>Detailed description:</strong> "+descMod.DetailedDescription+"<br>"

      


        )

        if (document.getElementById(JSON.stringify(d.Rank)).style.fill==="black") { 
          document.getElementById(JSON.stringify(d.Rank)).style.fill="blue";
          d.highlighted=1;  
      } else { 
          document.getElementById(JSON.stringify(d.Rank)).style.fill="black";
          d.highlighted=0;  
      };
  
        });
  
     
var titleAlignDistance = d3.max(data, d => x(d.CompletionDate)+8)

var aligned=false;

const alignTrialTitles = () => {

  const distance = (trial) => titleAlignDistance-x(trial.CompletionDate)+8;

  if(aligned) {
    titles.transition()
          .delay((d, i) => i * 10)
          .attr("transform", d => `translate(${0},0)`)
    aligned = false;
  } else {
    titles.transition()
          .delay((d, i) => i * 10)
          .attr("transform", d => `translate(${distance(d)},0)`)
          aligned = true;
        }
}


  const sortTrials = (criteria) =>{

    var permute;

  switch (criteria) {
    case "Highlighted":
      permute = d3.permute(trialNames,d3.range(data.length).sort((i, j) => data[j].highlighted - data[i].highlighted))
      break;

      case "Type of organisation":
        permute = d3.permute(trialNames,d3.range(data.length).sort((i, j) => data[i].Study.ProtocolSection.IdentificationModule.Organization.OrgClass.length - data[j].Study.ProtocolSection.IdentificationModule.Organization.OrgClass.length))
        titles.text(d=>d.id+ " - "+d.Study.ProtocolSection.IdentificationModule.Organization.OrgClass)
        break;

        case "Start date":
        permute = d3.permute(trialNames,d3.range(data.length).sort((i, j) => data[i].StartDate - data[j].StartDate))
        break;

        case "Completion date":
        permute = d3.permute(trialNames,d3.range(data.length).sort((i, j) => data[i].CompletionDate - data[j].CompletionDate))
        break;

        case "Phase":
        permute = d3.permute(trialNames,d3.range(data.length).sort((i, j) => data[i].currentPhase - data[j].currentPhase))
        titles.text(d=>d.id+ " - Phase: "+d.currentPhase)

        break;
  }

        y.domain(permute);

      g.transition()
        .delay((d, i) => i * 10)
        .attr("transform", d => `translate(0,${y(d.id)})`)
      
    }

var criteriaList = ["Highlighted","Type of organisation","Start date","Completion date","Phase"];

var sortingList = document.createElement("div");
sortingList.id = "sortingList"
sortingList.style = "left:50px;cursor:pointer;position:absolute;font-size:12px;text-align:center;margin:auto;z-index:15;top:130px;background-color:white;border: 1px solid rgb(230,230,230);display:none"

criteriaList.forEach(crit=>{
  var thisCrit = document.createElement("div")
  thisCrit.id = crit;
  thisCrit.innerText = crit;
  thisCrit.className="dialog-buttons"
  thisCrit.style="width:100%;text-align:center;padding:2px;margin:2px;"
  thisCrit.addEventListener("click",e=>sortTrials(crit))
  sortingList.appendChild(thisCrit)
})

document.body.appendChild(sortingList)


const trialSorter = () => {
  if (sortingList.style.display==="none") {
    sortingList.style.display="block"
    } else {
      sortingList.style.display="none"
  }
}

iconCreator("sort-icon",trialSorter)
iconCreator("align-icon",alignTrialTitles)


      loadType();
    
      }).catch(error => {console.log(error);field.value = " error";ipcRenderer.send("console-logs"," error: cannot start corpus " + id + ".");});
   
//======== ZOOM & RESCALE ===========

var legend = svg.append("g").attr("id","legend")

legend.append("rect").attr("x",10).attr("y",height-70).attr("width",170).attr("height",50).attr("fill","white").attr("stroke","black")

legend.append("circle").attr("cx",20).attr("cy",height-60).attr("fill", "rgb(209, 60, 75)").attr("r", 3.5);
legend.append("text").attr("x",25).attr("y",height-60).attr("dy",4).style("font-size",10).text("FIRST SUBMIT DATE");

legend.append("circle").attr("cx",20).attr("cy",height-50).attr("fill", "rgb(252, 172, 99)").attr("r", 3.5);
legend.append("text").attr("x",25).attr("y",height-50).attr("dy",4).style("font-size",10).text("START DATE");

legend.append("circle").attr("cx",20).attr("cy",height-40).attr("fill", "rgb(169, 220, 162)").attr("r", 3.5);
legend.append("text").attr("x",25).attr("y",height-40).attr("dy",4).style("font-size",10).text("PRIMARY COMPLETION DATE");

legend.append("circle").attr("cx",20).attr("cy",height-30).attr("fill", "rgb(66, 136, 181)").attr("r", 3.5);
legend.append("text").attr("x",25).attr("y",height-30).attr("dy",4).style("font-size",10).text("COMPLETION DATE");



  svg.call(zoom).on("dblclick.zoom", null);

  var gX = svg.append("g") 
              .attr("class", "axis axis--x")
              .style("stroke-opacity",.1)
              .call(xAxis);

   zoomed = (thatZoom,transTime) => {
    view.attr("transform", thatZoom);
    gX.call(xAxis.scale(thatZoom.rescaleX(x)));
    gX.lower()
  }
    ipcRenderer.send("console-logs", "Starting Pharmacotype");

};

//========== typesSwitch ==========
// Switch used to which type to draw/generate

const typeSwitch = (type, id) => {
  field.value = "loading " + type;

  switch (type) {

    case "pharmacotype":
        pharmacotype(id);
        break;

    case "hyphotype":
      hyphotype(id);
      break;

      case "filotype":
        filotype(id);
        break;

      case "doxatype":
        doxatype(id);
        break;

    case "anthropotype":
      anthropotype(id);
      break;

    case "chronotype":
      chronotype(id);
      break;

    case "gazouillotype":
      gazouillotype(id);
      break;

    case "geotype":
      geotype(id);

      break;

    case "pharmacotype":
      pharmacotype(id);
      break;

    case "topotype":
      topotype(id);
      break;

  }

  ipcRenderer.send(
    "console-logs",
    "typesSwitch started a " +
      type +
      " process using the following dataset(s) : " +
      JSON.stringify(id)
  );

  document.getElementById("source").innerText = "Source: " + id;
};

// MODULE EXPORT - don't removen useful for iframe export

module.exports = { typeSwitch: typeSwitch }; // Export the switch as a module
