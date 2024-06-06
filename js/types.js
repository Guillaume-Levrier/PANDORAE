//========== TYPES ==========
// PANDORAE is a data exploration tool. Once the user's data has been loaded through Flux
// and potentially curated through Zotero and/or rekindled in Chaeros, it is to be sent
// to one of the available Types. Types are simple data visualisation frameworks designed to
// support certain types of data. Each focuses on a certain perspective, and helps the user
// discover patterns on potentially larger datasets.

// =========== NODE MODULES ===========

//BEGIN NODE MODULES
//const { ipcRenderer, shell } = require("electron");
//const fs = require("fs");
//const d3 = require("d3");
const csv = require("csv-parser");
const versor = require("versor");
//const Quill = require("quill");
const MultiSet = require("mnemonist/multi-set"); // Load Mnemonist to manage other data structures
const helpers = require("mnemonist/set");
const { create } = require("d3");
//const { min } = require("d3-array");
const { clipboard } = require('electron')

//END NODE MODULES

var field;

window.onload = function () {
  field = document.getElementById("field");
};

const dataDownload = (data) => {
  var source = document.getElementById("source");

  var datasetName = "";

  if (data.hasOwnProperty("id")) {
    datasetName = data.id;
    datasetName = datasetName.replace(/\//gi, "_");
    datasetName = datasetName.replace(/:/gi, "+");
  }

  source.style.cursor = "pointer";

  source.addEventListener("click", (e) => {
    ipcRenderer
      .invoke(
        "saveDataset",
        { defaultPath: datasetName + ".json" },
        JSON.stringify(data)
      )
      .then((res) => {});
  });
};

const localDownload = (data) => {
  //same but for exports

  setTimeout(() => {
    var source = document.getElementById("source");

    var datasetName = "";

    if (data.hasOwnProperty("id")) {
      datasetName = data.id;
      datasetName = datasetName.replace(/\//gi, "_");
      datasetName = datasetName.replace(/:/gi, "+");
    }

    source.style.cursor = "pointer";

    var a = document.createElement("a");

    var json = JSON.stringify(data);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = datasetName + ".json";
    a.textContent = source.innerText;
    source.innerText = "";
    source.appendChild(a);
  }, 300);
};

const resizer = () => location.reload();

//======= NARRATIVE FUNCTIONS =======

const zoom = d3.zoom();

var zoomed = (targetDrag, transTime) => {
  console.log("error: zoom couldn't load");
};

var dragged = (target, transTime) => {
  console.log("error: drag couldn't load");
};

var currentZoom;
var currentDrag;

const moveTo = (step) => {
  let buttons = document.querySelectorAll("div.presentationStep");

  buttons.forEach((but) => {
    but.style.backgroundColor = "white";
    but.style.color = "black";
  });

  buttons[parseInt(step.stepIndex) - 1].style.backgroundColor = "black";
  buttons[parseInt(step.stepIndex) - 1].style.color = "white";

  if (step.hasOwnProperty("slideContent")) {
    showSlide(step.slideContent);
  } else {
    hideSlide();
  }

  if (step.hasOwnProperty("zoom")) {
    zoomed(step.zoom, 2000);
    currentZoom = step.zoom;
  }

  if (step.hasOwnProperty("drag")) {
    dragged({}, step.drag, 2000);
  }
};

window.addEventListener("keydown", (e) => {
  let buttons = document.querySelectorAll("div.presentationStep");
  let currentButtonId = 0;

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].style.backgroundColor === "black") {
      currentButtonId = i;
    }
  }

  switch (e.key) {
    case "ArrowRight":
      if (currentButtonId <= buttons.length - 1) {
        moveTo(presentationStep[currentButtonId + 1]);
      }
      break;

    case "ArrowLeft":
      if (currentButtonId >= 1) {
        moveTo(presentationStep[currentButtonId - 1]);
      }
      break;

    case "Backspace":
      if (currentButtonId > 0) {
        //issue here to remove last remaining slide
        presentationStep.splice(currentButtonId, 1);
        regenerateSteps();
      }
      break;
  }
});

// text slides
const createSlide = () => {
  if (document.getElementById("slide")) {
  } else {
    var slide = document.createElement("div");
    slide.id = "slide";

    var slideText = document.createElement("div");
    slideText.id = "slideText";

    var textcontainer = document.createElement("div");
    textcontainer.id = "textcontainer";

    var validateSlide = document.createElement("div");
    validateSlide.id = "validSlide";
    validateSlide.innerText = "✓";
    validateSlide.onclick = () => {
      addPresentationStep();
      hideSlide();
    };

    slideText.appendChild(textcontainer);
    slide.appendChild(slideText);
    slide.appendChild(validateSlide);

    document.body.appendChild(slide);

    var quillEdit = new Quill("#textcontainer", {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block"],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
      },
      placeholder: "Write here...",
      theme: "snow",
    });

    slide.style.animation = "darken 1s forwards";
    slideText.style.animation = "slideIn 1s forwards";
    validateSlide.style.animation = "slideIn 1s forwards";
  }
};

const showSlide = (text) => {
  if (document.getElementById("slide")) {
    hideSlide();
  }

  var slide = document.createElement("div");
  slide.id = "slide";

  var slideText = document.createElement("div");
  slideText.id = "slideText";
  slideText.className = "ql-snow ql-editor";
  slideText.innerHTML = text;

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
};

const stepCreator = (thisStep) => {
  let stepIndex = thisStep.stepIndex;

  var step = document.createElement("DIV");
  step.innerText = stepIndex;
  step.className = "presentationStep";
  step.id = "presentationStep" + parseInt(stepIndex);

  step.addEventListener("click", () => {
    moveTo(presentationStep[parseInt(stepIndex) - 1]);
  });

  presentationBox.appendChild(step);
};

const addPresentationStep = () => {
  let stepData = {
    zoom: currentZoom,
    tooltip: JSON.stringify(tooltip.innerHTML),
    drag: currentDrag,
  };

  if (document.getElementById("slideText")) {
    stepData.slideContent =
      document.getElementsByClassName("ql-editor")[0].innerHTML;
  }

  let buttons = document.querySelectorAll("div.presentationStep");
  let currentButtonId = 0;

  for (let i = 0; i < buttons.length; i++) {
    if (buttons[i].style.backgroundColor === "black") {
      currentButtonId = i;
    }
  }

  if (currentButtonId === 0) {
    presentationStep.push(stepData);
  } else {
    presentationStep.splice(currentButtonId + 1, 0, stepData);
  }
  regenerateSteps();
};

const regenerateSteps = () => {
  while (presentationBox.firstChild) {
    presentationBox.removeChild(presentationBox.firstChild);
  }

  for (let i = 0; i < presentationStep.length; i++) {
    presentationStep[i].stepIndex = i + 1;
    stepCreator(presentationStep[i]);
  }
};

const regenPrevSteps = (data) => {
  if (data.hasOwnProperty("presentation")) {
    presentationStep = data.presentation;
    regenerateSteps();
  }
};

const savePresentation = () => {
  pandodb[currentType.type].get(currentType.id).then((data) => {
    data.presentation = presentationStep;
    pandodb[currentType.type].put(data);
  });
};

// =========== LOADTYPE ===========
const backToPres = () => {
  document.body.style.animation = "fadeout 0.7s";
  setTimeout(() => {
    document.body.remove();
    ipcRenderer.send("backToPres", currentMainPresStep);
  }, 700);
};

// =========== LOADTYPE ===========
// LoadType is the process that removes the main display canvas and then displays
// the xtype div and xtype SVG element. It is usually called when the data has been
// loaded and rekindled by the type function, i.e. when the visualisation is (almost)
// ready to show
const loadType = (type, id) => {
  type = type;
  id = id;

  dispose = true;
  xtypeDisplay();
  purgeCore();
  xtypeExists = true;
  coreExists = false;

  ipcRenderer.send("audio-channel", "button1");
  field.value = "";
  const exporter = () => categoryLoader("export");

  if (currentMainPresStep.step) {
    iconCreator("back-to-pres", backToPres);
  } else {
    iconCreator("export-icon", toggleMenu);
    iconCreator("step-icon", addPresentationStep);
    iconCreator("slide-icon", createSlide);
    iconCreator("save-icon", savePresentation);
  }

  document.getElementById("fluxMenu").style.display = "none";
  document.getElementById("type").style.display = "none";
  document.getElementById("menu-icon").addEventListener("click", () => {
    document.body.style.animation = "fadeout 0.1s";
    setTimeout(() => {
      document.body.remove();
      location.reload();
    }, 100);
  });

  var exportButton = document.createElement("DIV");
  exportButton.innerText = "export";
  exportButton.className = "tabs menu-item";
  exportButton.addEventListener("click", (e) => categoryLoader("export"));

  document
    .getElementById("menu")
    .insertBefore(exportButton, document.getElementById("quitBut"));

  window.onresize = resizer;
};

// =========== XTYPE ===========

var width, height, toolWidth;

var presentationBox = document.createElement("div");
presentationBox.id = "presentationBox";

window.addEventListener("load", (event) => {
  xtype = document.getElementById("xtype");
  width = xtype.clientWidth; // Fetching client width
  height = xtype.clientHeight; // Fetching client height
  toolWidth = 0.3 * width + 20; // The tooltip is around a third of total available screen width
  document.body.appendChild(presentationBox);
});

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
    "Saturday",
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
    "December",
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
    "Dec.",
  ],
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
    "samedi",
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
    "Décembre",
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
    "Déc.",
  ],
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
    "Saturday",
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
    "December",
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
    "Dec.",
  ],
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
    "星期六",
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
    "十二月",
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
    "十二月",
  ],
});

const formatMillisecond = locale.format(".%L"),
  formatSecond = locale.format(":%S"),
  formatMinute = locale.format("%I:%M"),
  formatHour = locale.format("%H"),
  formatDay = locale.format("%d/%m/%Y"),
  formatWeek = locale.format("%d %b %Y"),
  formatMonth = locale.format("%m/%Y"),
  formatYear = locale.format("%Y");

const multiFormat = (date) =>
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

// ========= ARCHOTYPE =========
const archotype = (id) => {
  // When called, draw the archotype

  //========== SVG VIEW =============
  const svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG DOM node

  svg.attr("width", width).attr("height", height); // Attributing width and height to svg

  const bgrect = svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white");

  const view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  //zoom extent
  zoom
    .scaleExtent([-Infinity, Infinity]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, d) => {
      zoomed(transform);
    });

  var criteriaList = [];
  var currentCriteria = [];

  let resolver, arkViewer;

  ipcRenderer.invoke("checkflux", true).then((result) => {
    availability = JSON.parse(result);

    for (const service in availability.dnsLocalServiceList) {
      switch (availability.dnsLocalServiceList[service].type) {
        case "BNF-SOLR":
          resolver =
            availability.dnsLocalServiceList[service].url +
            ":" +
            availability.dnsLocalServiceList[service].port;

          arkViewer = availability.dnsLocalServiceList[service].arkViewer;

          break;
      }
    }
  });

  // size is probably not good as such, to be updated

  let ma = 4;
  let mb = ma / 2;

  svg
    .append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 55)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "black")
    .attr("stroke", "gray")
    .attr("stroke-width", 0.2)
    .attr("d", "M 0,-2 L 4 ,0 L 0,2");

  const toolContent = document.createElement("div");

  var captureTimeline;

  //======== DATA CALL & SORT =========

  pandodb.archotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      const documents = datajson.content[0].items;

      var nodeData = [];
      var linkData = [];

      const nodemap = {};

      const domainMap = {};

      // divider is here for dev/testing purpose, when the testing machine cannot handle
      // a corpus with too many documents.
      const divider = 1;

      const documentMap = {};

      for (let i = 0; i < documents.length / divider; ++i) {
        const d = documents[i];

        const coreURL = d.URL.replace(arkViewer,"");

        const parsedURL = new URL(coreURL.substring(coreURL.indexOf("http")));
        // console.log(id)

        const id = parsedURL.href;

        documentMap[id] = d;

        const elem = {
          id,
          title: d.title,
          domain: false,
          type: "capture",
          color: "blue",
        };

        // To establish the domain, one could in theory use the "container-title" property
        // however this proves to be unreliable accross time, collection and captures.
        // hence the need to rebuild it manually.

        const domain = parsedURL.host;
        d.domain = false;

        if (!domainMap.hasOwnProperty(domain)) {
          // A domain node doesn't exist in the dataset, it is just a way to group
          // all page captures together, by binding them to their host
          //console.log(domain)
          nodeData.push({
            id: domain,
            name: domain,
            domain: true,
            type: "domain",
            color: "orange",
          });
        }

        // add direction to links too !

        // link type 1 - describe here
        // A gray link is a link between a domain node
        // and a page capture node.

        linkData.push({
          source: elem.id,
          target: domain,
          color: "transparent",
          weight: 0.5,
          type: "page2domain",
        });

        nodeData.push(elem);
        nodemap[elem.id] = 1;
        domainMap[domain] = 1;
      }

      var ghostNodeMap = {};
      var ghostLinksMap = {};

      for (let i = 0; i < documents.length / divider; ++i) {
        const d = documents[i];

        const pageCaptureHypertextLinks = d.enrichment.links;

        // these hypertext links the page capture is listed as having

        if (pageCaptureHypertextLinks) {
          // d.URL is the complete permalink, with the URL of the hosting service / the timestamp
          // i.e. http://archivemachine.com/20090609015145/http://www.example.com/spip.php?document8683

          // sourceURL is d.URL without the hosting service and the timestamp, built as an URL object

          try {
            
          
          const sourceURL = new URL(d.URL.substring(d.URL.lastIndexOf("http")));

          // source is the href of the sourceURL object
          // i.e. http://www.example.com/spip.php?document8683
          const source = sourceURL.href;

          // source host is the website host
          // i.e. www.example.com
          const sourceHost = sourceURL.host; // || source.hostname;

          if (nodemap.hasOwnProperty(source)) {
            // For each hypertext link the document is listed as having, check:
            // 1- if there is a direct link between pages at time of their latest capture (blue link)
            // 2- if there is a link between this page and another page of the target domain, but which isn't in the corpus

            pageCaptureHypertextLinks.forEach((target) => {
              var host;
              try {
                const thisURL = new URL(target);
                host = thisURL.host; //|| thisURL.hostname;
              } catch (error) {
                console.log(error);
                ipcRenderer.send(
                  "console-logs",
                  "archotype error: url " + target + " is invalid."
                );

                //This will allow skipping the next part
                host = "";
              }

              if (host.length > 2) {
                if (nodemap.hasOwnProperty(target)) {
                  // link type 1 - blue

                  linkData.push({
                    source,
                    target,
                    color: "rgb(100,160,210)",
                    weight: 0.5,
                    type: "page2page",
                  });
                } else if (
                  domainMap.hasOwnProperty(host) &&
                  host != sourceHost &&
                  host.indexOf(sourceHost) === -1 &&
                  sourceHost.indexOf(host) === -1
                ) {
                  // link type 2 - orange
                  //deactivated for testing
                  /* linkData.push({
                    source,
                    target: host,
                    color: "rgb(255,140,10)",
                    weight: 0.5,
                    type: "pageNOTcorpus",
                  });
                   */
                } else {
                  // this links to a page that wasn't captured, so add a ghost node+link;
                  ghostNodeMap[target] = 1;
                  ghostLinksMap[sourceURL + target] = {
                    source,
                    target,
                    color: "rgb(150,150,150)",
                    weight: 0.1,
                    type: "ghost",
                  };
                }
              }
            });
          }
        
        } catch (error) {
        console.log(error)           
          }
      }
}
      // add ghosts nodes
      Object.keys(ghostNodeMap).forEach((d) =>
        nodeData.push({
          id: d,
          name: "",
          domain: false,
          type: "ghost",
          color: "rgb(150,150,150)",
        })
      );

      linkData = [...linkData, ...Object.values(ghostLinksMap)];

      // Get node groups
      // The decision here is to only list 1 degree common ghosts,
      // that is finding when two captures have a common outgoing links.

      ipcRenderer.send("chaeros-notification", "rebuilding by domain");

      //========== REBUILDING CLUSTERS
      //This function is the first step.
      //It puts nodes belonging to the same domain
      //in a same group.
      //

      function groupCapturesByDomain() {
        // map all domains
        const domainMap = {};

        linkData.forEach((link) => {
          if (link.type === "page2domain") {
            if (!domainMap.hasOwnProperty(link.target)) {
              domainMap[link.target] = new Set();
            }
            domainMap[link.target].add(link.source);
          }
        });

        nodeData.forEach((node) => {
          for (const domain in domainMap) {
            if (domainMap[domain].has(node.id)) {
              node.group = domain;
            }
          }
        });
      }

      // This is the second step
      // grouping ghosts to captures;

      function groupGhostsByCapture() {
        const captureMap = {};

        // Map all captures and their ghosts
        linkData.forEach((link) => {
          if (link.type === "ghost") {
            if (!captureMap.hasOwnProperty(link.source)) {
              captureMap[link.source] = new Set();
            }
            captureMap[link.source].add(link.target);
          }
        });

        //create a map of nodes to get faster access
        //because RAM is free real estate

        const nodeMap = {};

        nodeData.forEach((n) => (nodeMap[n.id] = n));

        for (const capture in captureMap) {
          //for each capture, iterate over ghosts
          //and give tem the capture's group

          captureMap[capture].forEach(
            (ghostID) => (nodeMap[ghostID].group = nodeMap[capture].group)
          );
        }
      }

      // Link by capture to capture

      function groupByCaptureToCaptureLinks() {
        const linkSet = new Set();

        linkData.forEach((d) => {
          if (d.type === "page2page") {
            const sourceHost = new URL(d.source).host;
            const targetHost = new URL(d.target).host;

            if (sourceHost != targetHost) {
              linkSet.add({ sourceHost, targetHost });
            }
          }
        });

        // remove the symmetry
        const linkMap = {};

        linkSet.forEach((d) => {
          if (!linkMap.hasOwnProperty(d.targetHost + d.sourceHost)) {
            linkMap[d.sourceHost + d.targetHost] = d;
          }
        });

        const groupMap = {};

        for (const id in linkMap) {
          groupMap[linkMap[id].sourceHost] = id;
          groupMap[linkMap[id].targetHost] = id;
        }

        nodeData.forEach((node) => {
          if (groupMap.hasOwnProperty(node.group)) {
            node.group = groupMap[node.group];
          }
        });
      }

      // find ghosts who recieve more than 1 link
      // and see if these links come from nodes
      // coming from different groups

      function groupByGhostBridgeLinks() {
        // first, map all ghosts

        const ghostMap = {};

        nodeData.forEach((node) => {
          if (node.type === "ghost") {
            ghostMap[node.id] = node;
          }
        });

        const linkByTarget = {};

        // then, iterate on links and map them by target;

        linkData.forEach((link) => {
          if (link.type === "ghost") {
            if (!linkByTarget.hasOwnProperty(link.target)) {
              linkByTarget[link.target] = [];
            }
            linkByTarget[link.target].push(link);
          }
        });

        //prepare a nodemap
        const nodeMap = {};
        nodeData.forEach((n) => (nodeMap[n.id] = n));

        //store bridge links in an array
        const bridgeLinks = new Set();

        for (const target in linkByTarget) {
          const linksArray = linkByTarget[target];

          //if there is only one link, it cannot
          //be a bridge
          if (linksArray.length === 1) {
            delete linkByTarget[target];
          } else {
            linksArray.forEach((link) => {
              const sourceHost = new URL(link.source).host;
              const targetHost = new URL(link.target).host;

              if (sourceHost != targetHost) {
                bridgeLinks.add({ sourceHost, targetHost });
              }
            });
          }
        }

        // remove the multiples
        const linkMap = {};

        bridgeLinks.forEach((d) => (linkMap[d.sourceHost + d.targetHost] = d));

        //now map by targets
        const targetMap = {};

        Object.values(linkMap).forEach((target) => {
          if (!targetMap.hasOwnProperty(target.targetHost)) {
            targetMap[target.targetHost] = [];
          }
          targetMap[target.targetHost].push(target.sourceHost);
        });

        // now comes the tedious part
        // first, iterate over the map

        for (const target in targetMap) {
          // make an array of hosts that belong to the same group
          const hosts = targetMap[target];
          hosts.push(target);

          // make it a set
          const hostSet = new Set(hosts);

          //create a group name
          const groupName = "GROUPNAME:" + hosts.toString();

          //find the groups all these nodes belong to
          //and add them to a set

          const relevantGroups = new Set();

          nodeData.forEach((node) => {
            if (node.type != "domain") {
              const nodeHost = new URL(node.id).host;
              if (hostSet.has(nodeHost)) {
                relevantGroups.add(node.group);
              }
            }
          });

          // if they already belong to the same group,
          // no action needed. If not, these groups
          // need to be merged.

          if (relevantGroups.size > 1) {
            nodeData.forEach((node) => {
              if (relevantGroups.has(node.group)) {
                node.group = groupName;
              }
            });
          }
        }
      }

      // last pass, let the domains find their groups
      // that were lost in the process

      function reattributeDomains() {
        //prepare a nodemap
        const nodeMap = {};
        nodeData.forEach((n) => (nodeMap[n.id] = n));

        linkData.forEach((link) => {
          if (link.type === "page2domain") {
            nodeMap[link.target].group = nodeMap[link.source].group;
          }
        });
      }

      function groupNodes() {
        // step one, group captures by domain.
        groupCapturesByDomain();

        // step two, group ghosts by capture
        // and give them the domain name
        groupGhostsByCapture();

        // now all nodes have group.
        // next step is to connect clusters that link to one another.
        groupByCaptureToCaptureLinks();

        // last step is to connect the groups that link
        // to common ghosts

        groupByGhostBridgeLinks();

        // solve domains
        reattributeDomains();
      }

      groupNodes();

      /// ============ END OF REBUILDING CLUSTERS

      const nodegroupmap = {};

      nodeData.forEach((d) => {
        const groupName = d.group;
        if (!nodegroupmap.hasOwnProperty(groupName)) {
          nodegroupmap[groupName] = { nameParts: {}, nodes: [] };
        }

        nodegroupmap[groupName].nodes.push(d);

        if (d.domain) {
          nodegroupmap[groupName].nameParts[d.id] = 1;
        }
      });

      // =========================
      // data management is mostly above this line

      // below is visualisation

      const g = svg.append("g");

      // Create a simulation with several forces.
      const simulation = d3
        .forceSimulation(nodeData)
        .force(
          "link",
          d3.forceLink(linkData).id((d) => d.id)
        )
        .force("charge", d3.forceManyBody(-300).distanceMax(1000))
        .force("center", d3.forceCenter(width / 2, height / 2).strength(0.5))
        .on("tick", ticked);

      // Set the position attributes of links and nodes each time the simulation ticks.
      function ticked() {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

        nodetitle.attr("x", (d) => d.x).attr("y", (d) => d.y);
        titlecontrast
          .attr("x", (d) => d.x - d.name.length * 2)
          .attr("y", (d) => d.y - 7);
      }

      // Reheat the simulation when drag starts, and fix the subject position.
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      // Update the subject (dragged node) position during drag.
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      // Restore the target alpha so the simulation cools after dragging ends.
      // Unfix the subject position now that it’s no longer being dragged.
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      var currentSelection = 0;

      const nodeGroupArray = Object.values(nodegroupmap).sort(
        (a, b) => a.nodes.length - b.nodes.length
      );

      let clusterMeta = "";

      const selectedClusterMetadata = (nodes) => {
        const div = document.getElementById("clusterMetaData");

        if (div) {
          var counter = { ghosts: 0, captures: 0, domains: [] };

          nodes.forEach((n) => {
            switch (n.type) {
              case "capture":
                counter.captures++;
                break;

              case "ghost":
                counter.ghosts++;
                break;

              case "domain":
                counter.domains.push(n.id);
                break;

              default:
                break;
            }
          });

          clusterMeta = `<br><hr><br>For this corpus, this cluster contains: <br>
- ${counter.captures} captured pages available in the archive<br>
- ${counter.ghosts} pages "linked to pages" by the most recent available capture in the corpus, which might or might not be in the corpus<br>
<br><br>
The captures in this cluster come from ${counter.domains.length} domain(s):<br>
`;

          counter.domains.forEach((d) => (clusterMeta += "- " + d + "<br>"));

          div.innerHTML = clusterMeta;
        }
      };

      const archotypeSelectionMenu = () => {
        if (captureTimeline) {
          captureTimeline
            .transition()
            .duration(250)
            .attr("transform", `translate(${width},${height * 0.1})`);
        }

        if (clusterMeta) {
          toolContent.innerHTML =
            "<div id='clusterMetaData'>" + clusterMeta + "</div><br><hr><br>";
        } else {
          toolContent.innerHTML =
            "<div id='clusterMetaData'><h3>Select a cluster</h3></div><br><hr><br>";
        }

        link.style("display", "block");
        node.style("display", "block");

        nodeGroupArray.forEach((group, i) => {
          // radio selection

          const groupName = `${Object.keys(group.nameParts).toString()} (${
            group.nodes.length
          })`;

          const radioGroup = document.createElement("input");
          radioGroup.type = "radio";
          radioGroup.checked = currentSelection === i;
          radioGroup.value = groupName;
          radioGroup.name = "nodeCluster";
          radioGroup.id = groupName;

          radioGroup.addEventListener("change", () => {
            if (radioGroup.checked) {
              regenerateGraph(group.nodes);

              currentSelection = i;
            }
          });

          const radioLabel = document.createElement("label");
          radioLabel.innerText = groupName;
          radioLabel.for = radioLabel;
          toolContent.append(
            radioGroup,
            radioLabel,
            document.createElement("br")
          );
        });
      };

      bgrect.on("click", archotypeSelectionMenu);

      //let domainCount = Object.keys(domainMap).length;

      var node = g.append("g");
      var link = g.append("g");
      var nodetitle = g.append("g");
      var titlecontrast = g.append("g");

      const regenerateGraph = (localNodeData) => {
        // purge existing graph
        node.remove();
        link.remove();
        nodetitle.remove();
        titlecontrast.remove();

        // recreate linkData

        const localLinkData = [];

        const nodeMap = {};
        const localDomainData = [];

        localNodeData.forEach((d) => {
          nodeMap[d.id] = 1;

          if (d.domain) {
            localDomainData.push(d);
          }
        });

        linkData.forEach((link) => {
          if (
            nodeMap.hasOwnProperty(link.target.id) ||
            nodeMap.hasOwnProperty(link.source.id)
          ) {
            if (link.target.id != link.source.id){ 
              localLinkData.push(link);
            }
          }
        });

        //recreate SVG groups

        // Add a line for each link, and a circle for each node.
        link = g
          .append("g")
          .attr("stroke", "#999")
          .selectAll()
          .data(localLinkData)
          .join("line")
          .style("display", (d) =>
            d.color === "tranparent" ? "none" : "block"
          )
          .attr("stroke-width", (d) => d.weight)
          .attr("stroke", (d) => d.color)
          .attr("marker-end", (d) =>{ 
            if (d.type === "page2page" && d.color != "transparent"){ 
            return  "url(#arrow)"
            }
            }
          );

        // on click, fetch the data from the data source if it exists

        node = g
          .append("g")
          .attr("stroke", "#fff")
          .attr("stroke-width", 1.5)
          .selectAll()
          .data(localNodeData)
          .join("circle")
          .attr("r", 5)
          .attr("fill", (d) => d.color);

        titlecontrast = g
          .append("g")
          .selectAll()
          .data(localDomainData)
          .join("rect")
          .attr("fill", "rgba(255,255,255,0.8)")
          .attr("width", (d) => d.name.length * 4)
          .attr("height", 9);

        nodetitle = g
          .append("g")
          .attr("text-anchor", "middle")
          .attr("dy", "-5px")
          .style("user-select", "none")
          .style("pointer-events", "none")
          .style("font-weight", "bolder")
          .selectAll()
          .data(localDomainData)
          .join("text")
          .style("font-size", "6px")
          .attr("fill", "black")
          .text((d) => d.name);

        // here, it is taken as a given that the async race will be won by the
        // invoker given that interrogating dexie is more tedious but this might
        // end up breaking at some point for framework reasons.

        node.style("cursor", (d) => (d.domain ? "move" : "pointer"));

        let previousCircle = 0;
        let previousSearch = 0;

        // This function is called when the user is within an authorized network that
        // can resolve a web archive page capture. It shows the authorized metadata (potentially, the page's content)
        // and lets them look for a string in the "content" field (if accessible).

        const displayLastCaptureMetadata = (doc) => {
          /*
          const accessButton = document.createElement("button");
          accessButton.innerText = "Open in archive explorer";
          accessButton.style = "margin:10px;";

          const archtarget = `${arkViewer}/${doc.wayback_date}/${doc.url}`;

          accessButton.addEventListener("click", () =>
            shell.openExternal(archtarget)
          );
*/
           const copyButton = document.createElement("button");
          copyButton.innerText = "Copy permalink";
          copyButton.style = "margin:10px;";

          const permalink = `${arkViewer}/${doc.wayback_date}/${doc.url}`;
          copyButton.addEventListener("click", () =>
            clipboard.writeText(permalink)
          );

          const content = document.createElement("div");

          const toolSearch = document.createElement("input");
          toolSearch.style = "padding:5px;border-bottom:1px solid #141414";
          toolSearch.type = "text";
          toolSearch.placeholder = "Search term or expression";

          toolSearch.addEventListener("focusin", () => (keylock = 1));
          toolSearch.addEventListener("focusout", () => (keylock = 0));

          const toolResult = document.createElement("div");

          const searchTerm = () => {
            toolResult.innerHTML =
              "Fragments from the content of the captured page:<br><br>";
            var sliced = "";

            const target = toolSearch.value;
            previousSearch = target;

            if (target.length > 2) {
              var re = new RegExp(target, "gi"),
                str = doc.content;
              while ((match = re.exec(str)) != null) {
                // var extrait = doc.content.substring(match.index - 150, match.index + 150)
                //.replace(target, "<mark>" + target + "</mark>")

                const extrait =
                  doc.content.substring(match.index - 150, match.index) +
                  "<mark>" +
                  doc.content.substring(
                    match.index,
                    match.index + target.length
                  ) +
                  "</mark>" +
                  doc.content.substring(
                    match.index + target.length,
                    match.index + 150
                  );

                sliced += extrait + "<br><hr><br>";
              }

              toolResult.innerHTML =
                "<div style = 'border:1px solid black; padding:5px'>" +
                sliced +
                "</div><br><hr><br>";
            }
          };

          if (previousSearch) {
            toolSearch.value = previousSearch;
            searchTerm();
          }

          toolSearch.addEventListener("change", searchTerm);
          toolContent.innerHTML = "";

          if (doc.hasOwnProperty("url")) {
            content.innerHTML += `<div style = "font-weight:bold" >url</div ><div>${doc["url"]}</div><br>`;
          }
          for (const key in doc) {
            content.innerHTML += `<div style = "font-weight:bold" > ${key}</div ><div>${doc[key]}</div><br>`;
          }
          toolContent.append(toolSearch, copyButton, toolResult, content);
        };

        // This displays all available captures of that page on a timeline and loads
        // a selected capture on click

        const displayOtherCaptures = (docs) => {
          //purge previous timeline
          if (captureTimeline) {
            captureTimeline.remove();
          }

          //create new
          captureTimeline = svg
            .append("g")
            .attr("id", "captureTimeline")
            .attr(
              "transform",
              `translate(${width - toolWidth},${height * 0.1})`
            );

          //background rect
          captureTimeline
            .append("rect")
            .attr("height", height * 0.84)
            .attr("rx", 10)
            .attr("width", 200)
            .attr("y", -height * 0.02)
            .attr("x", -80)
            .attr("stroke", "gray")
            .attr("stroke-width", 0.5)
            .attr("fill", "rgba(255,255,255,0.8)");

          const data = [];
          var dateMap = {};

          docs.forEach((d) => {
            const capture = {};
            capture.date = new Date(d.crawl_date);
            capture.id = d.id;
            const day = JSON.stringify(d.wayback_date).substring(0, 8);

            capture.metadata = d;

            if (!dateMap.hasOwnProperty(day)) {
              dateMap[day] = 0;
            }

            dateMap[day]++;

            capture.count = dateMap[day];

            data.push(capture);
          });

          const y = d3
            .scaleUtc()
            .domain(d3.extent(data, (d) => d.date))
            .nice()
            .range([height * 0.8, 0]);

          const x = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.count))
            .nice()
            .range([8, 52]);

          captureTimeline
            .append("g")
            .call(d3.axisLeft(y).tickFormat(d3.utcFormat("%d / %m / %Y")));

          captureTimeline
            .append("g")
            .selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d) => x(d.count))
            .attr("cy", (d) => y(d.date))
            .attr("r", 5)
            .style("cursor", "pointer")
            .on("click", (e, d) => {
              d3.select(e.target).attr("fill", "green");
              displayLastCaptureMetadata(d.metadata);
            });

          captureTimeline
            .transition()
            .duration(250)
            .attr(
              "transform",
              `translate(${width - toolWidth - 65},${height * 0.1})`
            );
        };

        node.on("click", (e, d) => {
          const circle = d3.select(e.target);

          const linkedNodeMap = {};
          linkedNodeMap[d.id] = 1;

          link.style("display", (l) => {
            if (l.target.id === d.id) {
              linkedNodeMap[l.source.id] = 1;
              return "block";
            } else if (l.source.id === d.id) {
              linkedNodeMap[l.target.id] = 1;
              return "block";
            } else {
              return "none";
            }
          });

          node.style("display", (n) => {
            if (linkedNodeMap.hasOwnProperty(n.id)) {
              return "block";
            } else {
              return "none";
            }
          });

          circle.attr("stroke-width", 3).attr("stroke", "#FF0F0F");

          if (previousCircle) {
            previousCircle.attr("stroke-width", 3).attr("stroke", "#0FFF50");
          }

          previousCircle = circle;
          if (resolver) {
            if (captureTimeline) {
              captureTimeline
                .transition()
                .duration(250)
                .attr("transform", `translate(${width},${height * 0.1})`);
            }

            var targetCollection;

            switch (d.type) {
              case "domain":
                break;

              case "ghost":
                // interrogating ghosts, ie pages that are not in the corpus
                // but that are linked to by captures within the corpus
                // these may or may not be in the archive

                //  this is a ghost, find the origine capture linking to it
                // to make sure it is collection-consistent

                localLinkData.forEach((l) => {
                  if (l.target.id === d.id) {
                    targetCollection =
                      documentMap[l.source.id].enrichment.solrCollection;
                  }
                });

              case "capture":
                // find the collection to target
                // if this is a capture, this is straightforward
                if (documentMap.hasOwnProperty(d.id)) {
                  targetCollection =
                    documentMap[d.id].enrichment.solrCollection;
                    console.log(documentMap[d.id])
                }

                if (targetCollection) {
                  fetch(
                    `http://${resolver}/solr/${targetCollection}/select?q=url:${JSON.stringify(
                      d.id.replaceAll("&", "%26")
                    )}`
                  )
                    .then((r) => r.json())
                    .then((r) => {
                      toolContent.innerHTML = JSON.stringify(r);

                      if (r.response.numFound > 0) {
                        displayOtherCaptures(r.response.docs);
                        displayLastCaptureMetadata(
                          r.response.docs[r.response.docs.length - 1]
                        );
                      } else {
                        toolContent.innerHTML =
                          "<hr>" + d.id + " not found.<hr>";
                      }
                    })
                    .catch((e) => {
                      toolContent.innerHTML = "";
                      switch (d.type) {
                        case "domain":
                          toolContent.innerHTML = d.id;
                          break;
                        case "ghost":
                          toolContent.innerHTML = `
                          <hr>
                        ${d.id}
                          <br><hr><br>
                          You are not connected to the archive repository.`;
                          break;
                        case "capture":
                          for (const key in documentMap[d.id]) {
                            toolContent.innerHTML += `<strong>${key}</strong><br>${
                              documentMap[d.id][key]
                            }  <br><hr>`;
                          }

                          documentMap[d.id].enrichment.links.forEach(
                            (l) => (toolContent.innerHTML += `<br>${l}`)
                          );

                          break;
                      }
                    });
                }
                break;

              default:
                break;
            }
          } else {
            toolContent.innerHTML = "";
            switch (d.type) {
              case "domain":
                toolContent.innerHTML = d.id;
                break;
              case "ghost":
                toolContent.innerHTML = `
                <hr>
              ${d.id}
                <br><hr><br>
                You are not connected to the archive repository.`;
                break;
              case "capture":
                for (const key in documentMap[d.id]) {
                  toolContent.innerHTML += `<strong>${key}</strong><br>${
                    documentMap[d.id][key]
                  }  <br><hr>`;
                }

                documentMap[d.id].enrichment.links.forEach(
                  (l) => (toolContent.innerHTML += `<br>${l}`)
                );

                break;
            }
          }
        });

        node.append("title").text((d) => d.id);

        link.raise();

        // drag behavior
        node.call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

        simulation.nodes(localNodeData).on("tick", ticked);
        simulation.force("link").links(localLinkData);
        simulation.alpha(1).restart();

        selectedClusterMetadata(localNodeData);
      };

      //select first, smallest corpus to display something on start
      regenerateGraph(nodeGroupArray[0].nodes);

      svg.call(
        d3
          .zoom()
          .extent([
            [0, 0],
            [width, height],
          ])
          .scaleExtent([-999, 10])
          .on("zoom", zoomed)
      );

      function zoomed({ transform }) {
        g.attr("transform", transform);
      }

      // legend
      const createLegend = () => {
        const legend = svg.append("g");

        // legend bg rect
        legend
          .append("rect")
          .attr("width", 320)
          .attr("height", 45)
          .attr("stroke", "black")
          .attr("stroke-width", 0.5)
          .attr("fill", "white")
          .attr("x", 10)
          .attr("y", window.innerHeight - 68);

        const linksLegend = [
          {
            color: "rgb(100,100,100)",
            weight: 0.5,
            desc: "capture <-> ghost link",
          },
          {
            color: "rgb(100,160,210)",
            weight: 2,
            desc: "capture -> other capture link",
          },
          {
            //deactivated
            color: "rgb(255,140,10)",
            weight: 0,
            desc: "", //"capture -> other domain link",
          },
        ];

        const nodeLegend = [
          {
            color: "rgb(150,150,150)",
            desc: "Ghost page (not in corpus)",
          },
          {
            color: "blue",
            desc: "Page capture",
          },
          {
            color: "orange",
            desc: "Host",
          },
        ];

        for (let i = 0; i < 3; i++) {
          const l = linksLegend[i];

          const n = nodeLegend[i];

          legend
            .append("circle")

            .attr("fill", n.color)
            .attr("cx", 20)
            .attr("r", 4)
            .attr("cy", window.innerHeight - 58 + i * 12);

          legend
            .append("text")
            .text(n.desc)
            .style("font-size", "9px")
            .attr("x", 35)
            .attr("y", window.innerHeight - 55 + i * 12);

          legend
            .append("rect")
            .attr("width", 20)
            .attr("height", l.weight * 2)
            .attr("fill", l.color)
            .attr("x", 165)
            .attr("y", window.innerHeight - 60 + i * 12);

          legend
            .append("text")
            .text(l.desc)
            .style("font-size", "9px")
            .attr("x", 195)
            .attr("y", window.innerHeight - 55 + i * 12);
        }
      };

      createLegend();

      loadType();

      document.getElementById("tooltip").append(toolContent);

      archotypeSelectionMenu();
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - invalid dataset";
      ipcRenderer.send(
        "console-logs",
        "archotype error: dataset " + id + " is invalid."
      );
    });

  //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

  zoomed = (thatZoom, transTime) => {
    view.attr("transform", thatZoom);
  };

  ipcRenderer.send("console-logs", "Starting archotype");
};

// ========= ANTHROPOTYPE =========
const anthropotype = (id) => {
  // When called, draw the anthropotype

  //========== SVG VIEW =============
  const svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG DOM node

  svg.attr("width", width).attr("height", height); // Attributing width and height to svg

  const bgrect = svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "white");

  const view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  //zoom extent
  zoom
    .scaleExtent([-Infinity, Infinity]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, d) => {
      zoomed(transform);
    });

  var criteriaList = [];
  var currentCriteria = [];

  //======== CURRENT WIP =========

  // Create a more elaborate tooltip
  // that lets users create a tag (text + color)
  // and then apply that tag to nodes

  //======== DATA CALL & SORT =========
  pandodb.anthropotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      var docData = [];

      if (datajson.content.length === 1) {
        docData = datajson.content[0].items;
      } else {
        for (let i = 0; i < datajson.content.length; i++) {
          datajson.content[i].items.forEach((e) => {
            e.color = i + 1;
            docData.push(e);
          });
        }
      }

      docData.forEach((d) => criteriaList.push(d.title));

      const menuBuilder = () => {
        const menu = document.createElement("div");
        menu.style = "display:flex;flex-direction: column;";

        const buttons = document.createElement("div");

        buttons.style =
          "padding:5px;border:1px solid black;display: flex;justify-content: space-around;";

        const criteriaButton = document.createElement("div");
        criteriaButton.innerText = "Document List";
        criteriaButton.style.cursor = "pointer";

        const tagButton = document.createElement("div");
        tagButton.innerText = "Tags";
        tagButton.style.cursor = "pointer";

        buttons.append(criteriaButton, tagButton);

        const menuContent = document.createElement("div");

        menu.append(buttons, menuContent);

        function populateCriteria() {
          menuContent.innerHTML = "";
          criteriaList.forEach((d) => {
            let crit = document.createElement("div");
            crit.className = "criteriaTab";
            crit.style.borderBottom = "1px solid #141414";
            crit.style.marginBottom = "5px";
            crit.style.cursor = "pointer";
            crit.id = d;
            crit.innerHTML = d;
            crit.onclick = function () {
              cartoSorter(d);
            };
            menuContent.appendChild(crit);
          });
        }

        populateCriteria();

        function populateTags() {
          menuContent.innerHTML = "";
        }

        criteriaButton.addEventListener("click", populateCriteria);

        tagButton.addEventListener("click", populateTags);

        document.getElementById("tooltip").append(menu);
      };

      //========== FORCE GRAPH ============
      var simulation = d3
        .forceSimulation() // Start the force graph
        .alphaMin(0.1) // Each action starts at 1 and decrements "Decay" per Tick
        .alphaDecay(0.01) // "Decay" value
        .force(
          "link",
          d3
            .forceLink() // Links has specific properties
            .strength(0.08) // Defining non-standard strength value
            .id((d) => d.id)
        ) // Defining an ID (used to compute link data)
        .force("collision", d3.forceCollide(5).iterations(5)) // Nodes collide with each other (they don't overlap)
        .force(
          "charge",
          d3.forceManyBody().strength((d) => {
            let str = -70;
            if (d.hasOwnProperty("author")) {
              str = str - d.author.length * 35;
            }
            return str;
          })
        ) // Adding ManyBody to repel nodes from each other
        .force("center", d3.forceCenter(width / 2, height / 2)); // The graph tends towards the center of the svg

      var link = view.append("g").selectAll("link");
      var node = view.append("g");

      const ticked = () => {
        node.attr("transform", (d) => `translate(${d.x},${d.y})`);
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);
      };

      const cartoSorter = (criteria) => {
        document.getElementById("tooltip").innerHTML = "";

        menuBuilder();
        node.remove();
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

        currentCriteria.forEach((criteria) => {
          docData.forEach((doc) => {
            if (doc.title === criteria) {
              doc.id = doc.title;
              if (doc.hasOwnProperty("author")) {
                doc.author.forEach((auth) => {
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
            }
          });
        });

        data.forEach((d) => {
          d.id = d.given + " " + d.family;
          d.crit.forEach((crit) => {
            let link = {};
            link.source = d.id;
            link.target = crit;
            links.push(link);
          });
        });

        docData.forEach((doc) => {
          for (let i = 0; i < currentCriteria.length; i++) {
            if (currentCriteria[i] === doc.title) {
              data.push(doc);
            }
          }
        });

        link = view
          .selectAll("link") // Creatin the link variable
          .exit()
          .remove()
          .data(links) // Link data is stored in the "links" variable
          .enter()
          .append("line")
          .attr("stroke", "#d3d3d3")
          .style("fill", "none");

        node = view
          .selectAll("g")
          .exit()
          .remove()
          .data(data)
          .join("g")
          .attr("id", (d) => d.id)

          .call(
            d3
              .drag()
              .on("start", forcedragstarted)
              .on("drag", forcedragged)
              .on("end", forcedragended)
          );

        node
          .append("circle")
          .attr("r", (d) => {
            let r = 7;
            if (d.hasOwnProperty("author")) {
              r = r + d.author.length * 4;
            }
            return r;
          })
          .attr("fill", (d) => (d.hasOwnProperty("color") ? d.color : "gray"))
          .attr("opacity", 0.3)
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        node
          .append("text")
          .attr("class", "humans")
          .attr("dx", "10")
          .attr("dy", "4")
          .style("fill", "black")
          .style("font-size", "15px")
          .style("font-family", "sans-serif")
          .text((d) => d.id)
          .clone(true)
          .lower()
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4);

        // The data selection below is very suboptimal, this is a quick hack that needs to be refactored
        /*
        bgrect.on("click", () => {
                    document.getElementById("tooltip").innerHTML = "";
                  menuBuilder();
        });
                  */
        const displaySelectionTooltip = (e, d) => {
          document.getElementById("tooltip").innerHTML = "";

          const tooltitle = document.createElement("div");

          const colorChoice = document.createElement("input");
          colorChoice.type = "color";

          // if document
          if (d.hasOwnProperty("title")) {
            tooltitle.innerHTML = `<h2>Labelling for document "${d.id}"</h2>`;

            colorChoice.addEventListener("change", () => {
              d3.select(document.getElementById(d.id))
                .select("circle")
                .attr("fill", colorChoice.value);
              d.author.forEach((auth) => {
                let nodeGroup = document.getElementById(auth.id);
                d3.select(nodeGroup)
                  .select("circle")
                  .attr("fill", colorChoice.value);
              });
              d.color = colorChoice.value;
            });

            // else if author
          } else {
            tooltitle.innerHTML = `<h4>Labelling for author "${d.id}"</h4>`;

            colorChoice.addEventListener("change", () => {
              d.color = colorChoice.value;
              d.crit.forEach((e) => {
                d3.select(document.getElementById(e))
                  .select("circle")
                  .attr("fill", colorChoice.value);
                data.forEach((f) => {
                  if (f.title === e) {
                    f.author.forEach((auth) => {
                      let nodeGroup = document.getElementById(auth.id);
                      d3.select(nodeGroup)
                        .select("circle")
                        .attr("fill", colorChoice.value);
                    });
                  }
                });
              });
            });
          }

          document.getElementById("tooltip").append(tooltitle, colorChoice);
        };

        node.style("cursor", "pointer");

        node.on("click", function (e, d) {
          displaySelectionTooltip(e, d);
        });

        simulation.nodes(data).on("tick", ticked);
        simulation.force("link").links(links);
        simulation.alpha(1).restart();
      };

      function forcedragstarted(event, d) {
        if (!event.active) simulation.alpha(1).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function forcedragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function forcedragended(event, d) {
        if (!event.active) simulation.alpha(1).restart();
        d.fx = null;
        d.fy = null;
      }

      function toggleCrit() {
        if (currentCriteria.length > 0) {
          currentCriteria = [];
        } else {
          criteriaList.forEach((d) => cartoSorter(d));
        }
      }

      iconCreator("sort-icon", toggleCrit);

      loadType();
      menuBuilder();
      cartoSorter(docData[0].title);
    })
    .catch((error) => {
      field.value = "error - invalid dataset";
      ipcRenderer.send(
        "console-logs",
        "Anthropotype error: dataset " + id + " is invalid."
      );
    });

  //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

  zoomed = (thatZoom, transTime) => {
    view.attr("transform", thatZoom);
  };

  ipcRenderer.send("console-logs", "Starting anthropotype");
};

// ========= FILOTYPE =========
const filotype = (id) => {
  var svg = d3
    .select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG")
    .style("font-family", "sans-serif");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view");

  zoom
    .scaleExtent([0.2, 20]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  var color = d3.scaleOrdinal(d3.schemeAccent);

  //======== DATA CALL & SORT =========

  pandodb.filotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      datajson.content.forEach((tweet) => {
        var tweetText = tweet.full_text;
        tweet.mentions = new Array();
        // remove mentions from tweet text
        tweet.entities.user_mentions.forEach((user) => {
          var thisMention = "@" + user.screen_name;
          tweetText = tweetText.replace(thisMention, "");
          tweet.mentions.push(user.name);
        });

        // make several lines out of each tweet
        let line = 0;
        for (let i = 0; i < tweetText.length; i += 60) {
          line++;
          let thisLine = tweetText.slice(i, i + 60);
          if (tweetText[i + 59] != " " && tweetText[i + 60] != " ") {
            thisLine = thisLine + "-";
          }
          tweet["line" + line] = thisLine;
        }
      });

      var tree = (data) => {
        var root = d3
          .stratify()
          .id((d) => d.id_str)
          .parentId((d) => d.in_reply_to_status_id_str)(data);
        root.x = 100;
        root.y = 30;
        return d3.tree().nodeSize([root.x, root.y])(root);
      };

      const root = tree(datajson.content);

      let x0 = Infinity;
      let x1 = -x0;
      root.each((d) => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });

      function elbow(d, i) {
        return (
          "M" +
          d.source.x +
          "," +
          d.source.y +
          "H" +
          d.target.x +
          "V" +
          d.target.y
        );
      }

      var link = view
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 0.2)
        .attr("class", "links")
        .selectAll("path")
        .data(root.links())
        .join("path")
        .attr("d", elbow);

      var lineFontSize = parseFloat(width / 500);

      var node = view
        .append("g")
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.x},${d.y})`);

      node
        .append("clipPath")
        .attr("id", function (d, i) {
          return "node_clip" + i;
        })
        .append("circle")
        .attr("r", 5);

      node
        .append("image")
        .attr("y", -lineFontSize * 2)
        .attr("x", -lineFontSize * 2)
        .attr("width", lineFontSize * 4)
        .attr("height", lineFontSize * 4)
        .style("cursor", "cell")
        .attr("xlink:href", (d) => d.data.user.profile_image_url_https)
        .attr("clip-path", function (d, i) {
          return "url(#node_clip" + i + ")";
        })
        .on("click", (event, d) => {
          var id = d.data.id_str;
          var targets = d.descendants();
          let polyPoints = [];
          let targetsY = d3.group(targets, (d) => d.y);

          for (let i = 0; i < targetsY.length; i++) {
            let x = d3.min(targetsY[i].values, (d) => d.x);
            let y = parseFloat(targetsY[i].key);
            polyPoints.push([x, y]);
          }

          for (let i = targetsY.length - 1; i > 0; i = i - 1) {
            let x = d3.max(targetsY[i].values, (d) => d.x) + 100;
            let y = parseFloat(targetsY[i].key);
            polyPoints.push([x, y]);
          }

          var line = d3.line().curve(d3.curveCardinalClosed)(polyPoints);

          if (document.getElementById(id)) {
            var element = document.getElementById(id);
            element.parentNode.removeChild(element);
          } else {
            var highlighted = view
              .append("path")
              .attr("d", line)
              .attr("id", id)
              .attr("stroke", color(id))
              .style("fill", "transparent");
            highlighted.lower();
          }
        });

      node
        .append("text")
        .attr("dy", -2)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize * 2)
        .text((d) => d.data.user.name)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", 1.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize / 2)
        .text((d) => d.data.id_str)
        .style("cursor", "pointer")
        .on("click", (event, d) => {
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
              d.data.user.statuses_count
          );
        });

      node
        .append("text")
        .attr("dy", lineFontSize * 2)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line1)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 3.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line2)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line3)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 6.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line4)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 8)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line5)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 9.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line6)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 11)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line7)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 12.5)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line8)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      node
        .append("text")
        .attr("dy", lineFontSize * 14)
        .attr("x", 6)
        .attr("text-anchor", "start")
        .style("font-size", lineFontSize)
        .text((d) => d.data.line9)
        .clone(true)
        .lower()
        .attr("stroke", "white");

      loadType();
    })
    .catch((error) => {
      console.log(error);
      field.value = "filotype error";
      ipcRenderer.send(
        "console-logs",
        "Filotype error: cannot start corpus " + id + "."
      );
    });

  //======== ZOOM & RESCALE ===========
  svg.call(zoom).on("dblclick.zoom", null);

  zoomed = (thatZoom, transTime) => view.attr("transform", thatZoom);

  ipcRenderer.send("console-logs", "Starting Filotype");
};

// ========= DOXATYPE =========
const doxatype = (id) => {
  var tweetList = document.createElement("div");
  tweetList.id = "tweetList";
  document.getElementById("xtype").append(tweetList);

  //======== DATA CALL & SORT =========

  pandodb.doxatype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      var totalTweets = datajson.content;

      var visTweets = [];

      const purgeList = () => {
        var child = tweetList.lastElementChild;
        while (child) {
          tweetList.removeChild(child);
          child = tweetList.lastElementChild;
        }
      };

      const displayTweets = (tweets) => {
        tweets.forEach((tweet) => {
          let thisTweet = document.createElement("div");
          thisTweet.id = tweet.id;
          thisTweet.className = "doxaTweet";
          let url = "https://twitter.com/i/web/status/" + tweet.id;
          thisTweet.innerHTML =
            "<img class='doxaHS' src=" +
            tweet.from_user_profile_image_url +
            ">" +
            "<strong>" +
            tweet.from_user_name +
            "</strong> <i style='cursor:pointer' onclick='shell.openExternal(" +
            JSON.stringify(url) +
            ")'>" +
            tweet.id +
            "</i>" +
            "<br>" +
            tweet.text +
            "<br>" +
            tweet.created_at;
          tweetList.appendChild(thisTweet);
        });
      };

      const updateVisible = () => {
        visTweets = [];
        var options = document.getElementsByClassName("toggleOptions");
        for (let i = 0; i < options.length; i++) {
          if (options[i].checked) {
            for (var cat in totalTweets) {
              if (cat === options[i].id) {
                totalTweets[cat].forEach((tweet) => visTweets.push(tweet));
              }
            }
          }
        }
        purgeList();
        displayTweets(visTweets);
      };

      var toggleList = document.createElement("FORM");
      toggleList.id = "toggleList";

      for (var cat in totalTweets) {
        var toggleOption = document.createElement("INPUT");
        toggleOption.id = cat;
        toggleOption.type = "checkbox";
        toggleOption.className = "toggleOptions";
        toggleOption.onclick = updateVisible;

        var toggleLabel = document.createElement("LABEL");
        toggleLabel.id = "cat";
        toggleLabel.innerText = "(" + totalTweets[cat].length + ") - " + cat;

        toggleList.appendChild(toggleOption);
        toggleList.appendChild(toggleLabel);
        toggleList.appendChild(document.createElement("BR"));
      }

      loadType();
      var title = document.createElement("h2");
      title.innerText = datajson.name;
      document.getElementById("tooltip").appendChild(title);
      document.getElementById("tooltip").appendChild(toggleList);
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - Cannot start corpus";
      ipcRenderer.send(
        "console-logs",
        "Doxa error: cannot start corpus " + id + "."
      );
    });

  ipcRenderer.send("console-logs", "Starting Doxatype");
};

// ========= HYPHOTYPE =========
const hyphotype = (id) => {
  //  SVG VIEW
  var svg = d3
    .select(xtype)
    .append("svg")
    .attr("id", "xtypeSVG")
    .style("cursor", "move"); // Creating the SVG DOM node

  svg.style("background-color", "#e6f3ff");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view");

  //zoom extent

  zoom
    .scaleExtent([0.2, 20]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-width * 2, -height * 2],
      [width * 3, height * 3],
    ])
    .on("zoom", ({ transform }, d) => {
      zoomed(transform);
    }); // Trigger the "zoomed" function on "zoom" behaviour

  var color = d3
    .scaleOrdinal()
    .domain([0, 1])
    .range([
      "#1d302a",
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
      "#8c5f6b",
    ]);

  var colorFill = d3
    .scaleLog() // Color is determined on a log scale
    .domain(d3.extent(d3.range(1, 11))) // Domain ranges from 1 to 15
    .interpolate((d) => d3.interpolateOranges); // Interpolate is the color spectrum

  var x = d3
    .scaleLinear() // x is a linear scale
    .domain([-width, width]) // Domain means value range on the graph onload
    .range([0, width - toolWidth]); // Range is pixel display size

  var y = d3
    .scaleLinear() // y is a linear scale
    .domain([height, -height]) // Domain is negative to allow contour display
    .range([0, height]); // Range is total height

  var xAxis = d3.axisBottom(x); // xAxis is the abscissa axis
  var xAxis2 = xAxis; // xAxis2 is its white contour for lisiblity
  var yAxis = d3.axisRight(y); // yAxis is the yordinate axis
  var yAxis2 = yAxis; // yAxis white contour for lisiblit
  var xGrid = d3.axisBottom(x).tickSize(height); // xGrid is actually axis ticks without axis
  var yGrid = d3.axisRight(y).tickSize(width); // Same but for horizontal ticks

  //======== DATA CALL & SORT =========

  pandodb.hyphotype
    .get(id)
    .then((datajson) => {
      var tooltipTop =
        "<strong>" + datajson.name.toUpperCase() + "</strong></br>";

      dataDownload(datajson);

      var links = [];

      if (datajson.hasOwnProperty("presentationStep")) {
        presentationStep = datajson.narrative;
      }

      let corpusStatus = datajson.content.corpusStatus;

      let weStatus = datajson.content.weStatus;

      let nodeData = datajson.content.nodeData;

      let networkLinks = datajson.content.networkLinks;

      let tags = datajson.content.tags;

      for (var subTag in tags) {
        let taggedNodes = 0;

        for (let tagVal in tags[subTag]) {
          taggedNodes = taggedNodes + tags[subTag][tagVal];
        }
        tags[subTag].NA = parseInt(nodeData.length - taggedNodes);
      }

      var tagDiv = "";

      for (var prop in tags) {
        tagDiv = tagDiv + '<option value="' + prop + '">' + prop + "</option>";
      }
      tagDiv = tagDiv + "</select>";

      for (let j = 0; j < nodeData.length; j++) {
        for (let i = 0; i < networkLinks.length; i++) {
          let link = {};
          if (nodeData[j].id === networkLinks[i][0]) {
            for (let f = 0; f < nodeData.length; f++) {
              if (nodeData[f].id === networkLinks[i][1]) {
                link.source = networkLinks[i][0];
                link.target = networkLinks[i][1];
                link.weight = networkLinks[i][2];
                links.push(link);
              }
            }
          }
        }
      }

      weStatus = weStatus[weStatus.length - 1];

      tooltipTop =
        tooltipTop +
        "<br> Corpus ID: " +
        corpusStatus.corpus_id +
        "<br> Corpus status: " +
        corpusStatus.status +
        "<li> Total: " +
        weStatus.total +
        "</li>" +
        "<li> Discovered: " +
        weStatus.discovered +
        "</li>" +
        "<li> Undecided: " +
        weStatus.undecided +
        "</li>" +
        "<li> Out: " +
        weStatus.out +
        "</li>" +
        "<li> In: " +
        weStatus.in +
        "</li>" +
        "</ul><br>Filtrer par tags<br><select id='tagDiv'>" +
        tagDiv +
        "<br><div id='tagList'></div>" +
        "<br><br><div id='weDetail'></div><br><br><br><div id='whois'></div><br><br><br><br><br>";

      multiThreader.postMessage({
        type: "hy",
        nodeData: nodeData,
        links: links,
        tags: tags,
        width: width,
        height: height,
      });

      multiThreader.onmessage = (hyWorkerAnswer) => {
        if (hyWorkerAnswer.data.type === "tick") {
          progBarSign(hyWorkerAnswer.data.prog);
        } // removed in export
        else if (hyWorkerAnswer.data.type === "hy") {
          nodeData = hyWorkerAnswer.data.nodeData;
          links = hyWorkerAnswer.data.links;
          contours = hyWorkerAnswer.data.contours;

          var densityContour = view
            .insert("g") // Create contour density graph
            .attr("fill", "none") // Start by making it empty/transparent
            .attr("class", "contours")
            .attr("stroke", "GoldenRod") // Separation lines color
            .attr("stroke-width", 0.5) // Line thickness
            .attr("stroke-linejoin", "round") // Join style
            .selectAll("path")
            .data(contours)
            .enter()
            .append("path")
            .attr("stroke-width", 0.5)
            .attr("fill", (d) => colorFill(d.value * 100))
            .attr("d", d3.geoPath());

          const drawAltitudeLevel = (selectedData) => {
            var thresholds = [];

            selectedData.forEach((thisContour) =>
              thresholds.push(parseInt(thisContour.value * 10000))
            );

            function addlabel(text, xy, angle) {
              angle += Math.cos(angle) < 0 ? Math.PI : 0;

              labels_g
                .append("text")
                .attr("fill", "#fff")
                .attr("stroke", "none")
                .attr("class", "labels")
                .attr("text-anchor", "middle")
                .attr("dy", "0.3em")
                .attr(
                  "transform",
                  `translate(${xy})rotate(${parseInt(angle * (180 / Math.PI))})`
                )
                .style("font-weight", "bolder")
                .text(text)
                .style("font-size", ".5px");
            }

            var labels_g = view.append("g").attr("id", "labels_g");

            for (const cont of selectedData) {
              cont.coordinates.forEach((polygon) =>
                polygon.forEach((ring, j) => {
                  const p = ring.slice(1, Infinity),
                    possibilities = d3.range(
                      cont.coordinates.length,
                      cont.coordinates.length * 5
                    ),
                    scores = possibilities.map((d) => -((p.length - 1) % d)),
                    n = possibilities[d3.leastIndex(scores)],
                    start =
                      1 +
                      (d3.leastIndex(
                        p.map((xy) => (j === 0 ? -1 : 1) * xy[1])
                      ) %
                        n),
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

                      addlabel(
                        parseInt(cont.value * 10000),
                        xy,
                        Math.atan2(dy, dx)
                      );
                    }
                  });
                })
              );
            }
          };

          drawAltitudeLevel(contours);

          var nodes = view
            .insert("g")
            .selectAll("circle")
            .data(nodeData)
            .enter()
            .append("circle")
            .style("fill", (d) => color(d.tags.USER))
            .attr("stroke", "black")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .style("cursor", "pointer")
            .attr("stroke-width", 0.2)
            .attr("r", (d) => 1 + Math.log(d.indegree + 1))
            .attr("id", (d) => d.id)
            .on("click", (event, d) => {
              var weDetail = "<h3>WE Detail</h3>";

              for (var prop in d) {
                weDetail =
                  weDetail + "<br><strong>" + prop + "</strong>: " + d[prop];
              }

              document.getElementById("weDetail").innerHTML = weDetail;
              document.getElementById("whois").innerHTML = "";

              (async function () {
                const whois = require("whois-json");

                var whoisDetails = await whois(d.name);

                var whoisResult = "<h3>Whois result</h3>";
                for (var prop in whoisDetails) {
                  whoisResult =
                    whoisResult +
                    "<br><strong>" +
                    prop +
                    "</strong>: " +
                    whoisDetails[prop];
                }

                document.getElementById("whois").innerHTML = whoisResult;
              })();
            });

          const addWeTitle = () => {
            var webEntName = view
              .selectAll(".webEntName")
              .data(nodeData)
              .enter()
              .append("text")
              .attr("class", "webEntName")
              .attr("id", (d) => d.name)
              .style("font-size", "2px")
              .attr("x", (d) => d.x)
              .attr("y", (d) => d.y)
              .attr("dy", -0.5)
              .style("font-family", "sans-serif")
              .text((d) => d.name);

            document
              .querySelectorAll(".webEntName")
              .forEach((d) => (d.__data__.dx = -d.getBBox().width / 2));
            webEntName.attr("dx", (d) => d.dx);

            nodeData.forEach(
              (d) => (d.box = document.getElementById(d.name).getBBox())
            );

            var webEntNameRect = view
              .selectAll("rect")
              .data(nodeData)
              .enter()
              .append("rect")
              .attr("class", "contrastRect")
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 0.1)
              .attr("x", (d) => d.box.x)
              .attr("y", (d) => d.box.y)
              .attr("width", (d) => d.box.width + 1)
              .attr("height", (d) => d.box.height + 0.2);

            nodes.raise();
            webEntName.raise();
          };

          addWeTitle();

          const resetContourGraph = () => {
            d3.selectAll(".contours").remove();
            d3.select("#labels_g").remove();

            view
              .insert("g") // Create contour density graph
              .attr("fill", "none") // Start by making it empty/transparent
              .attr("class", "contours")
              .attr("stroke", "GoldenRod") // Separation lines color
              .attr("stroke-width", 0.5) // Line thickness
              .attr("stroke-linejoin", "round") // Join style
              .selectAll("path")
              .data(contours)
              .enter()
              .append("path")
              .attr("stroke-width", 0.5)
              .attr("fill", (d) => colorFill(d.value * 100))
              .attr("d", d3.geoPath());

            drawAltitudeLevel(contours);

            d3.selectAll(".contours").lower();
            d3.selectAll("circle").attr("opacity", "1");
            d3.selectAll(".contrastRect").attr("opacity", "1");
            d3.selectAll(".webEntName").attr("opacity", "1");
            d3.selectAll(".labels").attr("opacity", "1");
          };

          const displayContour = () => {
            let checkTags = document.querySelectorAll("input.tagCheckbox");

            let cat = document.getElementById("tagDiv").value;

            let tags = [];

            checkTags.forEach((box) => {
              if (box.checked) {
                tags.push(box.value);
              }
            });

            d3.selectAll(".contours").remove();

            view
              .insert("g") // Create contour density graph
              .attr("fill", "none") // Start by making it empty/transparent
              .attr("class", "contours")
              .attr("id", "oldContour")
              .attr("stroke", "GoldenRod") // Separation lines color
              .attr("stroke-width", 0.5) // Line thickness
              .attr("stroke-linejoin", "round") // Join style
              .attr("opacity", 0.25)
              .selectAll("path")
              .data(contours)
              .enter()
              .append("path")
              .attr("stroke-width", 0.5)
              .attr("fill", (d) => colorFill(d.value * 100))
              .attr("d", d3.geoPath());
            d3.selectAll(".contours").lower();

            var tagNodes = [];

            tags.forEach((tag) => {
              let thisTagNodes = nodeData.filter(
                (item) => item.tags.USER[cat][0] === tag
              );
              thisTagNodes.forEach((node) => tagNodes.push(node));
            });

            var thisContour = d3
              .contourDensity()
              .size([width, height])
              .weight((d) => d.indegree)
              .x((d) => d.x)
              .y((d) => d.y)
              .bandwidth(9)
              .thresholds(d3.max(tagNodes, (d) => d.indegree))(tagNodes);

            d3.select("#labels_g").remove();

            var thisContourPath = view
              .insert("g") // Create contour density graph
              .attr("fill", "none") // Start by making it empty/transparent
              .attr("class", "contours")
              .attr("stroke", "GoldenRod") // Separation lines color
              .attr("stroke-width", 0.5) // Line thickness
              .attr("stroke-linejoin", "round") // Join style
              .selectAll("path")
              .data(thisContour)
              .enter()
              .append("path")
              .attr("stroke-width", 0.5)
              .attr("fill", (d) => colorFill(d.value * 100))
              .attr("d", d3.geoPath());

            drawAltitudeLevel(thisContour);

            d3.selectAll(".contours").lower();
            d3.select("#oldContour").lower();
            d3.selectAll("circle").attr("opacity", ".1");
            d3.selectAll(".contrastRect").attr("opacity", ".1");
            d3.selectAll(".webEntName").attr("opacity", ".1");
            tags.forEach((tag) => {
              d3.selectAll("circle")
                .filter((item) => item.tags.USER[cat][0] === tag)
                .attr("opacity", "1");
              d3.selectAll(".contrastRect")
                .filter((item) => item.tags.USER[cat][0] === tag)
                .attr("opacity", "1");
              d3.selectAll(".webEntName")
                .filter((item) => item.tags.USER[cat][0] === tag)
                .attr("opacity", "1");
            });

            d3.select("#legend").remove();

            var legend = svg.insert("g").attr("id", "legend");

            var shownTags = "";

            for (let i = 0; i < tags.length; i++) {
              shownTags = shownTags + tags[i] + " ";
            }

            var legendText = legend
              .append("text")
              .text(cat + " - " + shownTags);

            let textBound = document.querySelector("#legend").getBBox();

            legend
              .append("rect")
              .attr("id", "legend")
              .attr("fill", "white")
              .attr("stroke", "black")
              .attr("stroke-width", 0.5)
              .attr("x", width - toolWidth - parseInt(textBound.width) - 20)
              .attr("y", height - 30)
              .attr("width", parseInt(textBound.width) + 20)
              .attr("height", 30);

            legendText
              .attr("x", width - toolWidth - parseInt(textBound.width) - 15)
              .attr("y", height - 30)
              .attr("dx", 5)
              .attr("dy", 20);

            legendText.raise();
          };

          const showTags = (tag, list) => {
            let tagList = document.getElementById(list);
            tagList.innerHTML = "";
            let thisTagList = document.createElement("DIV");
            let tagsArray = [];

            for (var prop in tags) {
              if (prop === tag) {
                for (let thisTag in tags[prop]) {
                  // let criteria = prop;
                  var thisTagCheckbox = document.createElement("INPUT");
                  thisTagCheckbox.type = "checkbox";
                  thisTagCheckbox.className = "tagCheckbox";
                  //thisTagCheckbox.id = "chck"+thisTag;
                  thisTagCheckbox.value = thisTag;
                  thisTagCheckbox.addEventListener("change", (e) => {
                    displayContour();
                  });

                  var thisTagOption = document.createElement("SPAN");
                  thisTagOption.innerText = thisTag + ":" + tags[prop][thisTag];
                  thisTagOption.style.color = color(thisTag);

                  var thisTagLine = document.createElement("DIV");
                  thisTagLine.value = parseInt(tags[prop][thisTag]);
                  thisTagLine.appendChild(thisTagCheckbox);
                  thisTagLine.appendChild(thisTagOption);

                  tagsArray.push(thisTagLine);
                }
              }
            }

            tagsArray.sort((a, b) => d3.descending(a.value, b.value));
            tagsArray.forEach((d) => thisTagList.appendChild(d));
            tagList.appendChild(thisTagList);
            nodes.style("fill", (d) => color(d.tags.USER[tag][0]));
            nodes.raise();
          };

          setTimeout(() => {
            document
              .getElementById("tagDiv")
              .addEventListener("change", (e) => {
                resetContourGraph();
                showTags(e.srcElement.value, "tagList");
              });
          }, 200);

          loadType();
          document.getElementById("tooltip").innerHTML = tooltipTop;
        }
      }; // end of HY worker answer

      //    })  // end of get webentities data

      //  }) // end of start corpus
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - Cannot start corpus";
      ipcRenderer.send(
        "console-logs",
        "Hyphotype error: cannot start corpus " + id + "."
      );
    });

  //======== ZOOM & RESCALE ===========

  var gXGrid = svg.append("g").call(xGrid);

  var gYGrid = svg.append("g").call(yGrid);

  let upHeight = parseInt(height - 50);

  var gX2 = svg
    .append("g")
    .attr("transform", "translate(0," + upHeight + ")")
    .attr("fill", "white")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .call(xAxis2);

  var gY2 = svg
    .append("g")
    .attr("transform", "translate(" + 50 + ",0)")
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .call(yAxis2);

  var gX = svg
    .append("g")
    .attr("transform", "translate(0," + upHeight + ")")
    .call(xAxis);

  var gY = svg
    .append("g")
    .attr("transform", "translate(" + 50 + ",0)")
    .call(yAxis);

  d3.selectAll(".tick:not(:first-of-type) line").attr(
    "stroke",
    "rgba(100,100,100,.5)"
  );

  svg.call(zoom).on("dblclick.zoom", null);

  // ===== NARRATIVE =====

  zoomed = (thatZoom, transTime) => {
    currentZoom = thatZoom;
    view.transition().duration(transTime).attr("transform", thatZoom);
    gXGrid
      .transition()
      .duration(transTime)
      .call(xGrid.scale(thatZoom.rescaleX(x)));
    gYGrid
      .transition()
      .duration(transTime)
      .call(yGrid.scale(thatZoom.rescaleY(y)));
    gX2
      .transition()
      .duration(transTime)
      .call(xAxis2.scale(thatZoom.rescaleX(x)));
    gY2
      .transition()
      .duration(transTime)
      .call(yAxis2.scale(thatZoom.rescaleY(y)));
    gX.transition()
      .duration(transTime)
      .call(xAxis.scale(thatZoom.rescaleX(x)));
    gY.transition()
      .duration(transTime)
      .call(yAxis.scale(thatZoom.rescaleY(y)));
    d3.transition()
      .duration(transTime)
      .selectAll(".tick:not(:first-of-type) line")
      .attr("stroke", "rgba(100,100,100,.5)");
  };

  // Presentation Recorder

  ipcRenderer.send("console-logs", "Starting Hyphotype");
};

// ========== regardotype ==========
const regards = (id) => {
  // When called, draw the chronotype

  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG");

  svg
    .attr("width", width - toolWidth)
    .attr("height", height) // Attributing width and height to svg
    .attr("viewBox", [
      -(width - toolWidth) / 2,
      -height / 2,
      width - toolWidth,
      height,
    ]);

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  //console.log(id);

  zoom
    .scaleExtent([0.1, 20]) // Extent to which one can zoom in or out
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ]) // Extent to which one can go up/down/left/right
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  pandodb.regards
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      console.log(datajson);

      let chronoData = {};

      for (const key in datajson.content) {
        datajson.content[key].forEach((val) => {
          if (key != "seances" && key != "texteloi") {
            let date = val.content.date;
            if (chronoData.hasOwnProperty(date)) {
            } else {
              chronoData[date] = {};
            }
            if (chronoData[date].hasOwnProperty(key)) {
            } else {
              chronoData[date][key] = [];
            }
            chronoData[date][key].push(val);
          }
        });
      }

      const data = { name: "regards", children: [] };

      for (const key in chronoData) {
        let child = { name: key, date: key, children: [] };
        for (const prop in chronoData[key]) {
          chronoData[key][prop].forEach((d) => {
            if (d.content.hasOwnProperty("sujet")) {
              d.name =
                d.content["auteur_groupe_acronyme"] +
                " " +
                d.content.signataires +
                " | " +
                d.content.sujet +
                " | " +
                d.content.id;
            } else if (d.content.hasOwnProperty("intervenant_nom")) {
              d.name =
                d.content["intervenant_groupe"] +
                " " +
                d.content["intervenant_nom"] +
                " | " +
                d.content.id;
            } else if (d.content.hasOwnProperty("question")) {
              d.name =
                d.content["parlementaire_groupe_acronyme"] +
                " " +
                d.content.aut.depute.nom +
                " | " +
                d.content.id;
            }
          });

          chronoData[key][prop].sort((a, b) => a.content.id - b.content.id);

          child.children.push({ name: prop, children: chronoData[key][prop] });
        }
        data.children.push(child);
      }

      const tree = (data) => {
        const root = d3
          .hierarchy(data)
          .sort(
            (a, b) =>
              d3.ascending(a.data.date, b.data.date) ||
              d3.ascending(a.document_id, b.document_id)
          );
        root.dx = 20;
        root.dy = width / (root.height + 3);
        return d3.cluster().nodeSize([root.dx, root.dy])(root);
      };

      const root = tree(data);

      const link = view
        .append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .selectAll("path")
        .data(root.links())
        .join("path")
        .style("display", (d) => (d.source.depth === 0 ? "none" : "block"))
        .attr(
          "d",
          (d) => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}
      `
        );

      const node = view
        .append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

      node
        .append("circle")
        .style("display", (d) => (d.depth === 0 ? "none" : "block"))
        .attr("fill", (d) => (d.children ? "#555" : "#999"))
        .attr("r", 2.5);

      function toolBuidlder(d) {
        if (d.depth === 3) {
          var dt = d.data.content;

          if (dt.hasOwnProperty("contenu")) {
            // intervention
            tooltip.innerHTML =
              "<h3>" +
              dt.intervenant_nom +
              "</h3><h4>" +
              dt.intervenant_fonction +
              "</h4>" +
              dt.intervenant_groupe +
              "<br><span style='text-decoration: underline;'>" +
              dt.seance_lieu +
              "</span><br>" +
              dt.seance_titre +
              "<br>" +
              dt.type +
              "<br>" +
              dt.contenu;
          } else if (dt.hasOwnProperty("expose")) {
            // amendement
            tooltip.innerHTML =
              "<h3>" +
              dt.signataires +
              "</h3><h4>" +
              dt.sujet +
              "</h4>" +
              dt.auteur_groupe_acronyme +
              "<br><span style='text-decoration: underline;'>Statut: " +
              dt.sort +
              "</span><br>Texte de loi: " +
              dt.texteloi_id +
              "<br><br> <strong>Exposé des motifs:</strong>" +
              dt.expose +
              "<br><br> <strong>Contenu de l'amendement:</strong><br>" +
              dt.texte;
          } else if (dt.hasOwnProperty("question")) {
            tooltip.innerHTML =
              "<h3>" +
              dt.aut.depute.nom +
              "</h3><h4>" +
              dt.themes +
              "</h4>" +
              dt.parlementaire_groupe_acronyme +
              "<br><span style='text-decoration: underline;'>Destinataire: " +
              dt.ministere +
              "</span><br><br><strong>Question:</strong> " +
              dt.question +
              "<br><br> <strong>Réponse:</strong> " +
              dt.reponse;
          }
        }
      }

      view.style("user-select", "none");

      node
        .append("text")
        .attr("dy", "0.31em")
        .style("font-size", "12px")
        .style("font-family", "sans-serif")
        .style("cursor", (d) => (d.depth === 3 ? "pointer" : "auto"))

        .attr("x", (d) => (d.children ? -6 : 6))
        .text((d) => d.data.name)
        .on("click", (event, d) => {
          d3.selectAll("text").style("font-weight", "normal");
          let el = event.currentTarget;
          el.style.fontWeight = "bolder";
          toolBuidlder(d);
        })
        .style("display", (d) => (d.depth === 0 ? "none" : "block"))
        .filter((d) => d.children)
        .attr("text-anchor", "end")
        .clone(true)
        .lower()
        .style("display", (d) => (d.depth === 0 ? "none" : "block"))
        .attr("stroke", "white");

      let timeline = {
        x1: root.children[0].y,
        y1: root.children[0].x,
        x2: root.children[root.children.length - 1].y,
        y2: root.children[root.children.length - 1].x,
      };

      var tl = view
        .append("line")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5)
        .attr("x1", timeline.x1)
        .attr("x2", timeline.x2)
        .attr("y1", timeline.y1)
        .attr("y2", timeline.y2)
        .lower();

      loadType();

      view.attr("transform", "translate(" + -width / 3 + ",0)");
    })
    .catch((error) => {
      field.value = "error - invalid dataset";
      ipcRenderer.send(
        "console-logs",
        "Chronotype error: dataset " + id + " is invalid."
      );
    });
  let dragger = svg
    .append("rect")
    .attr("x", -width)
    .attr("y", -height)
    .attr("width", width * 2)
    .attr("height", height * 2)
    .attr("fill", "white")
    .style("cursor", "all-scroll")
    .lower();

  dragger.call(zoom).on("dblclick.zoom", null); // Zoom and deactivate doubleclick zooming
  //.on("mousedown.zoom", d=>{if(brushing){return null}})

  zoomed = (thatZoom) => {
    //thatZoom.x=0;
    //thatZoom.y=0,
    view.attr("transform", thatZoom);
  };
};

// ========== CHRONOTYPE ==========
const chronotype = (id) => {
  // When called, draw the chronotype

  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG");

  svg
    .attr("width", width - toolWidth)
    .attr("height", height) // Attributing width and height to svg
    .attr("viewBox", [
      -(width - toolWidth) / 2,
      -height / 2,
      width - toolWidth,
      height,
    ]);

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  zoom
    .scaleExtent([0.1, 20]) // Extent to which one can zoom in or out
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ]) // Extent to which one can go up/down/left/right
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  var innerRadius = height / 3.5;
  var outerRadius = height / 2.25;
  var brushing;
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

  //========== X & Y  ============
  var x = d3.scaleUtc().range([0, 2 * Math.PI]);

  var y = d3
    .scaleLinear() // Y axis scale
    .range([innerRadius, outerRadius]);

  //========= LINES & INFO ============
  var maxDocs = 0;

  var arcBars = d3
    .arc()
    .innerRadius((d) => y(d.zone))
    .outerRadius((d) => y(parseFloat(d.zone + d.value / (maxDocs + 1))))
    .startAngle((d) => x(d.date))
    .endAngle((d) => x(d.date.setMonth(d.date.getMonth() + 1)))
    .padAngle(0)
    .padRadius(innerRadius);

  var color = d3
    .scaleOrdinal() // Line colors
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
      "#a68199",
    ]);

  //======== DATA CALL & SORT =========
  pandodb.chronotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      console.log(datajson);

      var docs = datajson.content; // Second array is the documents (docs)
      // const clusters = [];
      var links = []; // Declaring links as empty array
      const nodeDocs = [];
      var currentNodes = [];
      var authors;
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
        interview: "speaker_notes",
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
        bill: "account_balance",
      };

      const dataSorter = () => {
        for (let i = 0; i < docs.length; i++) {
          let doc = docs[i].items;

          doc.forEach((d) => {
            if (d.issued) {
              if (
                d.issued.hasOwnProperty("date-parts") //&&
                //  d.issued["date-parts"][0].length === 3
              ) {
                let year = d.issued["date-parts"][0][0];
                let month = d.issued["date-parts"][0][1];
                let day = d.issued["date-parts"][0][2];

                if (month === undefined) {
                  // if month isn't registered
                  month = 1;
                }

                if (day === undefined) {
                  // if day isn't registered
                  day = 1;
                }

                d.rebuildDate = year + "-" + month + "-" + day;
                /* 
                d.date =
                  d.issued["date-parts"][0][0] +
                  "-" +
                  d.issued["date-parts"][0][1] +
                  "-" +
                  d.issued["date-parts"][0][2];
 
                d.date = parseTime(d.date);
*/
                d.date = parseTime(d.rebuildDate);

                d.category = docs[i].name;
                d.clusterDate = year + "-" + month + "-" + "15";
                d.code = d.category + "-" + d.clusterDate;
                d.type = csl_material[d.type];
                d.authors = [];

                if (d.author) {
                  for (let j = 0; j < d.author.length; j++) {
                    let element = d.author[j].given + " " + d.author[j].family;
                    d.authors.push(element);
                  }
                }

                nodeDocs.push(d);
              } else {
                d.toPurge = true;
              }
            } else {
              d.toPurge = true;
            }
          });
        }
      };

      dataSorter();

      var firstDate = d3.min(nodeDocs, (d) => d.date);
      var lastDate = d3.max(nodeDocs, (d) => d.date);

      x.domain([firstDate, lastDate]).nice();

      var midDate;
      //Dates can be negative, which can make midDate trickier than usual to find
      let d1 = firstDate.getTime();
      let d2 = lastDate.getTime();

      if ((d1 > 0 && d2 > 0) || (d1 < 0 && d2 < 0)) {
        midDate = new Date(d1 + (d2 - d1) / 2);
      } else if (d1 < 0 && d2 > 0) {
        midDate = new Date(d1 + (Math.abs(d1) + d2) / 2);
      }

      var dateAmount = [];

      let currentDate = new Date(firstDate.getTime()); // duplicate date
      let finalDate = new Date(lastDate.getTime()); // duplicate date

      currentDate.setMonth(currentDate.getMonth() - 1); //add starting offset to make sure borders are included
      finalDate.setMonth(finalDate.getMonth() + 1);

      while (currentDate < finalDate) {
        var month = currentDate.getUTCMonth();
        var year = currentDate.getFullYear();
        var thisDate =
          JSON.stringify(year) + "-" + JSON.stringify(month + 1) + "-15";
        dateAmount.push(thisDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      const clustersNest = d3.group(
        nodeDocs,
        (d) => d.category,
        (d) => d.clusterDate
      );
      const areaRad = [];
      let zoneCount = 0;

      y.domain([0, clustersNest.size + 1]);

      clustersNest.forEach((cluster) => {
        let radAreaData = {};
        radAreaData.zone = zoneCount;

        let radialVal = {};

        dateAmount.forEach(
          (d) =>
            (radialVal[d] = {
              key: d,
              date: parseTime(d),
              value: 0,
              zone: zoneCount,
            })
        );

        cluster.forEach((val, key) => {
          val.forEach((d) => (d.zone = zoneCount));

          if (radialVal[key] && val.length > 0) {
            radialVal[key].value = val.length;
          } else {
            ipcRenderer.send(
              "console-logs",
              "error generating bar at" + JSON.stringify(val)
            );
          }

          if (val.length > maxDocs) {
            maxDocs = val.length;
          }
        });

        radAreaData.radialVal = Object.values(radialVal);
        areaRad.push(radAreaData);
        zoneCount++;
      });

      // errors here, must be foreach
      /*
            nodeDocs.forEach((d) => {
                let mapcount=0
                clustersNest.forEach((clust,key)=>{
                    if (key === d.category) { 
                        d.zone = mapcount;
                    }
                    mapcount++
                })
            });
*/

      //========= CHART DISPLAY ===========
      var radialBars = view.append("g").attr("id", "radialBars");

      areaRad.forEach((corpus) => {
        radialBars
          .append("g")
          .attr("id", "radArea" + corpus.zone)
          .selectAll("path")
          .data(corpus.radialVal)
          .enter()
          .append("path")
          .attr("stroke", color(corpus.zone))
          .attr("fill", color(corpus.zone))
          .style("opacity", 0.5)
          .attr("d", arcBars);
      });

      //==========  NODE SUB-GRAPHS =======
      // Each cluster contains documents, i.e. each "circle" contains "nodes" which are force graphs
      var simulation = d3
        .forceSimulation() // starting simulation
        .alphaMin(0.1) // Each action starts at 1 and decrements "Decay" per Tick
        .alphaDecay(0.04) // "Decay" value
        .force(
          "link",
          d3
            .forceLink()
            .distance(0)
            .strength(0)
            .id((d) => d.id)
        )
        .force(
          "collision",
          d3
            .forceCollide() // nodes can collide
            .radius(1.5) // if expanded is true, they collide with a force superior to 0
            .iterations(2)
            .strength(0.1)
        )
        .force(
          "x",
          d3
            .forceX()
            .strength(0.1) // nodes are attracted to their X origin
            .x(
              (d) => d3.pointRadial(x(d.date), y(d.zone - clustersNest.size))[0]
            )
        )
        .force(
          "y",
          d3
            .forceY()
            .strength(0.1) // nodes are attracted to their X origin
            .y(
              (d) => d3.pointRadial(x(d.date), y(d.zone - clustersNest.size))[1]
            )
        );

      //Declaring node variables
      var node = view.selectAll("nodes"),
        nodetext = view.selectAll("nodetext"),
        link = view.selectAll("link");

      simulation
        .nodes(currentNodes) // Start the force graph with "docs" as data
        .on("tick", ticked); // Start the "tick" for the first time

      simulation
        .force("link") // Create the links
        .links(links); // Data for those links is "links"

      function ticked() {
        // Actual force function
        link
          .attr("x1", (d) => d.source.x) // Links coordinates
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node
          .attr("cx", (d) => d.x) // Node coordinates
          .attr("cy", (d) => d.y);

        nodetext // Nodetext (doc number) coordinates
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y);
      }

      // Circular Brush, based on Elijah Meeks https://github.com/emeeks/d3.svg.circularbrush

      var currentBrush;

      function circularbrush() {
        var _extent = [0, Math.PI * 2];
        var _arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
        var _brushData = [
          {
            startAngle: _extent[0],
            endAngle: _extent[1],
            class: "extent",
          },
          {
            startAngle: _extent[0] - 0.2,
            endAngle: _extent[0],
            class: "resize e",
          },
          {
            startAngle: _extent[1],
            endAngle: _extent[1] + 0.2,
            class: "resize w",
          },
        ];
        var _newBrushData = [];
        var d3_window = d3.select(window);
        var _origin;
        var _brushG;
        var _handleSize = 0.1;
        var _scale = d3.scaleLinear().domain(_extent).range(_extent);
        var _tolerance = 0.00001;

        function _circularbrush(_container) {
          updateBrushData();

          _brushG = _container.append("g").attr("class", "circularbrush");

          _brushG
            .selectAll("path.circularbrush")
            .data(_brushData)
            .enter()
            .insert("path", "path.resize")
            .attr("d", _arc)
            .attr("class", function (d) {
              return d.class + " circularbrush";
            });

          _brushG.select("path.extent").on("mousedown.brush", (event) => {
            resizeDown(event);
          });

          _brushG.selectAll("path.resize").on("mousedown.brush", (event) => {
            resizeDown(event);
          });

          return _circularbrush;
        }

        _circularbrush.extent = function (_value) {
          var _d = _scale.domain();
          var _r = _scale.range();

          var _actualScale = d3
            .scaleLinear()
            .domain([-_d[1], _d[0], _d[0], _d[1]])
            .range([_r[0], _r[1], _r[0], _r[1]]);

          if (!arguments.length)
            return [_actualScale(_extent[0]), _actualScale(_extent[1])];

          _extent = [_scale.invert(_value[0]), _scale.invert(_value[1])];

          return this;
        };

        _circularbrush.handleSize = function (_value) {
          if (!arguments.length) return _handleSize;

          _handleSize = _value;
          _brushData = [
            {
              startAngle: _extent[0],
              endAngle: _extent[1],
              class: "extent",
            },
            {
              startAngle: _extent[0] - _handleSize,
              endAngle: _extent[0],
              class: "resize e",
            },
            {
              startAngle: _extent[1],
              endAngle: _extent[1] + _handleSize,
              class: "resize w",
            },
          ];
          return this;
        };

        _circularbrush.innerRadius = function (_value) {
          if (!arguments.length) return _arc.innerRadius();

          _arc.innerRadius(_value);
          return this;
        };

        _circularbrush.outerRadius = function (_value) {
          if (!arguments.length) return _arc.outerRadius();

          _arc.outerRadius(_value);
          return this;
        };

        _circularbrush.range = function (_value) {
          if (!arguments.length) return _scale.range();

          _scale.range(_value);
          return this;
        };

        _circularbrush.arc = function (_value) {
          if (!arguments.length) return _arc;

          _arc = _value;
          return this;
        };

        _circularbrush.tolerance = function (_value) {
          if (!arguments.length) return _tolerance;

          _tolerance = _value;
          return this;
        };

        _circularbrush.filter = function (_array, _accessor) {
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
          } else {
            var firstHalf = _array.filter(function (d) {
              return _accessor(d) >= start && _accessor(d) <= lastPoint;
            });
            var secondHalf = _array.filter(function (d) {
              return _accessor(d) <= end && _accessor(d) >= firstPoint;
            });
            filteredArray = firstHalf.concat(secondHalf);
          }

          return filteredArray;
        };

        return _circularbrush;

        function resizeDown(event) {
          let d = event.currentTarget;
          var _mouse = d3.pointer(event);

          brushing = true;

          if (_brushData[0] === undefined) {
            _brushData[0] = d;
          }

          _originalBrushData = {
            startAngle: _brushData[0].startAngle,
            endAngle: _brushData[0].endAngle,
          };

          _origin = _mouse;

          switch (d.className.baseVal) {
            case "resize e circularbrush":
              d3_window
                .on("mousemove.brush", (event) => {
                  resizeMove(event, "e");
                })
                .on("mouseup.brush", (event) => {
                  extentUp(event);
                });
              break;

            case "resize w circularbrush":
              d3_window
                .on("mousemove.brush", (event) => {
                  resizeMove(event, "w");
                })
                .on("mouseup.brush", (event) => {
                  extentUp(event);
                });
              break;

            default:
              d3_window
                .on("mousemove.brush", (event) => {
                  resizeMove(event, "extent");
                })
                .on("mouseup.brush", (event) => {
                  extentUp(event);
                });
              break;
          }
        }

        function resizeMove(event, _resize) {
          var _mouse = d3.pointer(event, _brushG.node());

          var _current = Math.atan2(_mouse[1], _mouse[0]);
          var _start = Math.atan2(_origin[1], _origin[0]);

          switch (_resize) {
            case "e":
              var clampedAngle = Math.max(
                Math.min(
                  _originalBrushData.startAngle + (_current - _start),
                  _originalBrushData.endAngle
                ),
                _originalBrushData.endAngle - 2 * Math.PI
              );

              if (
                _originalBrushData.startAngle + (_current - _start) >
                _originalBrushData.endAngle
              ) {
                clampedAngle =
                  _originalBrushData.startAngle +
                  (_current - _start) -
                  Math.PI * 2;
              } else if (
                _originalBrushData.startAngle + (_current - _start) <
                _originalBrushData.endAngle - Math.PI * 2
              ) {
                clampedAngle =
                  _originalBrushData.startAngle +
                  (_current - _start) +
                  Math.PI * 2;
              }

              var _newStartAngle = clampedAngle;
              var _newEndAngle = _originalBrushData.endAngle;

              break;

            case "w":
              var clampedAngle = Math.min(
                Math.max(
                  _originalBrushData.endAngle + (_current - _start),
                  _originalBrushData.startAngle
                ),
                _originalBrushData.startAngle + 2 * Math.PI
              );

              if (
                _originalBrushData.endAngle + (_current - _start) <
                _originalBrushData.startAngle
              ) {
                clampedAngle =
                  _originalBrushData.endAngle +
                  (_current - _start) +
                  Math.PI * 2;
              } else if (
                _originalBrushData.endAngle + (_current - _start) >
                _originalBrushData.startAngle + Math.PI * 2
              ) {
                clampedAngle =
                  _originalBrushData.endAngle +
                  (_current - _start) -
                  Math.PI * 2;
              }

              var _newStartAngle = _originalBrushData.startAngle;
              var _newEndAngle = clampedAngle;

              break;

            default:
              var _newStartAngle =
                _originalBrushData.startAngle + (_current - _start * 1);
              var _newEndAngle =
                _originalBrushData.endAngle + (_current - _start * 1);
              break;
          }

          _newBrushData = [
            {
              startAngle: _newStartAngle,
              endAngle: _newEndAngle,
              class: "extent",
            },
            {
              startAngle: _newStartAngle - _handleSize,
              endAngle: _newStartAngle,
              class: "resize e",
            },
            {
              startAngle: _newEndAngle,
              endAngle: _newEndAngle + _handleSize,
              class: "resize w",
            },
          ];

          brushRefresh();

          if (_newStartAngle > Math.PI * 2) {
            _newStartAngle = _newStartAngle - Math.PI * 2;
          } else if (_newStartAngle < -(Math.PI * 2)) {
            _newStartAngle = _newStartAngle + Math.PI * 2;
          }

          if (_newEndAngle > Math.PI * 2) {
            _newEndAngle = _newEndAngle - Math.PI * 2;
          } else if (_newEndAngle < -(Math.PI * 2)) {
            _newEndAngle = _newEndAngle + Math.PI * 2;
          }

          _extent = [_newStartAngle, _newEndAngle];
        }

        function brushRefresh() {
          _brushG
            .selectAll("path.circularbrush")
            .data(_newBrushData)
            .attr("d", _arc);

          currentBrush = [
            x.invert(brush.extent()[0]),
            x.invert(brush.extent()[1]),
          ];

          brushLegendE
            .attr(
              "x",
              (d) => d3.pointRadial(x(currentBrush[0]), outerRadius + 10)[0]
            )
            .attr(
              "y",
              (d) => d3.pointRadial(x(currentBrush[0]), outerRadius + 10)[1]
            )
            .attr("text-anchor", () => {
              if (currentBrush[0] < midDate) {
                return "start";
              } else {
                return "end";
              }
            })
            .text(
              currentBrush[0].getDate() +
                "/" +
                parseInt(currentBrush[0].getMonth() + 1) +
                "/" +
                currentBrush[0].getFullYear()
            );

          brushLegendW
            .attr(
              "x",
              (d) => d3.pointRadial(x(currentBrush[1]), outerRadius + 10)[0]
            )
            .attr(
              "y",
              (d) => d3.pointRadial(x(currentBrush[1]), outerRadius + 10)[1]
            )
            .attr("text-anchor", () => {
              if (currentBrush[1] < midDate) {
                return "start";
              } else {
                return "end";
              }
            })
            .text(
              currentBrush[1].getDate() +
                "/" +
                parseInt(currentBrush[1].getMonth() + 1) +
                "/" +
                currentBrush[1].getFullYear()
            );
        }

        function extentUp(event) {
          // there is an update pattern issue. To be continued.

          // tooltip clearup
          while (tooltip.firstChild) {
            tooltip.removeChild(tooltip.lastChild);
          }

          _brushData = _newBrushData;

          d3_window.on("mousemove.brush", null).on("mouseup.brush", null);

          brushing = false;

          currentNodes = [];
          links = [];
          authors = new MultiSet();
          let buffLinks = [];

          function dateTest(node) {
            if (node.date > currentBrush[0] && node.date < currentBrush[1]) {
              return true;
            } else return false;
          }

          currentNodes = nodeDocs.filter((d) => dateTest(d));

          // sort Nodes by date
          currentNodes = currentNodes.sort((a, b) => a.date - b.date);

          var currentList = [];

          currentNodes.forEach((d) => {
            // add doc to current list
            currentList.push({
              title: d.title,
              id: d.id,
              zone: d.zone,
              DOI: d.DOI,
            });

            // add authors to multiset list
            d.authors.forEach((aut) => authors.add(aut));
          });

          authors.forEachMultiplicity((ct, key) => {
            if (ct > 1) {
              // if an author as authored more than 1 document
              let linkBase = [];
              currentNodes.forEach((d) => {
                //iterate on documents
                d.authors.forEach((e) => {
                  // iterate on authors
                  if (e === key) {
                    // if this doc has this author
                    linkBase.push(d);
                  }
                });
              });
              buffLinks.push(linkBase);
            }
          });

          //Create links among all
          buffLinks.forEach((bf) => {
            // for each array of articles by the same author(s)
            for (let i = 1; i < bf.length; i++) {
              links.push({
                source: bf[i - 1].id,
                target: bf[i].id,
              });
            }
          });

          var currentDocList = document.createElement("OL");

          currentList.forEach((d) => {
            let docTitle = document.createElement("LI");
            docTitle.style.color = color(d.zone);
            docTitle.id = "list-" + d.id;
            docTitle.innerText = d.title;
            docTitle.addEventListener("click", (e) => {
              ipcRenderer.invoke("openEx", "https://dx.doi.org/" + d.DOI);
            });
            docTitle.addEventListener("mouseover", (e) => {
              node.style("opacity", ".2");
              document.getElementById("node" + d.id).style.opacity = 1;
              d3.selectAll("line").style("opacity", 0.1);
              links.forEach((link) => {
                if (link.source.id === d.id) {
                  document.getElementById(
                    "link" + link.source.id + "-" + link.target.id
                  ).style.opacity = 1;
                }
              });
            });
            docTitle.addEventListener("mouseout", (e) => {
              node.style("opacity", 1);
              d3.selectAll("line").style("opacity", 1);
            });

            currentDocList.appendChild(docTitle);
          });

          tooltip.appendChild(currentDocList);

          node = node
            .data(currentNodes, (item) => item) // Select all relevant nodes
            .join("circle") // Append the nodes
            .attr("r", 1) // Node radius
            .attr("fill", (d) => color(d.zone)) // Node color
            .attr("id", (d) => "node" + d.id) // Node ID (based on code)
            .attr("stroke", (d) => color(d.zone)) // Node stroke color
            .attr("stroke-opacity", 0.6) // Node stroke color
            .attr("stroke-width", 0.1) // Node stroke width
            .style("cursor", "context-menu") // Type of cursor on node hover
            .style("opacity", 0.9) // Node opacity
            .raise() // Nodes are displayed above the rest
            .merge(node)
            .lower(); // Merge the nodes

          link = link
            .data(links, (item) => item) // Select all relevant nodes
            .join("line") // Append the nodes
            .attr("fill", "red") // Node color
            .attr("id", (d) => "link" + d.source + "-" + d.target) // Node ID (based on code)
            .style("stroke", "red") // Node stroke color
            .style("stroke-width", 0.1) // Node stroke width
            .raise() // Nodes are displayed above the rest
            .merge(link)
            .lower();

          //Node icons are nodes displayed on top of Nodes
          nodetext = nodetext
            .data(currentNodes, (item) => item) // Select all relevant nodes
            .join("text") // Append the text
            .attr("dy", 0.8) // Relative Y position to each node
            .attr("id", (d) => d.id) // ID
            .style("fill", "white") // Icon color
            .style("font-size", "2.5px") // Icon size
            .style("font-weight", "bolder") // Icon size
            .attr("text-anchor", "middle")
            .style("display", "none")
            .text((d) => {
              for (let i = 0; i < currentNodes.length; i++) {
                if (d.id === currentNodes[i].id) {
                  return JSON.stringify(i + 1);
                }
              }
            }) // Icon
            //.on("click", d => {
            // shell.openExternal("https://dx.doi.org/" + d.DOI);
            // }) // On click, open url in new tab
            .raise() // Display above nodes and the rest
            .merge(nodetext); // Merge the nodes

          nodetext.append("title").text((d) => d.title); // Hovering a node displays its title as "alt"

          simulation.nodes(currentNodes);
          simulation.force("link").links(links);
          simulation.alpha(1).restart();
        }

        function updateBrushData() {
          _brushData = [
            {
              startAngle: _extent[0],
              endAngle: _extent[1],
              class: "extent",
            },
            {
              startAngle: _extent[0] - _handleSize,
              endAngle: _extent[0],
              class: "resize e",
            },
            {
              startAngle: _extent[1],
              endAngle: _extent[1] + _handleSize,
              class: "resize w",
            },
          ];
        }
      }

      var brush = circularbrush()
        .range([0, 2 * Math.PI])
        .innerRadius(innerRadius - 5)
        .outerRadius(outerRadius + 15);

      var brushLegendE = view
        .append("g")
        .attr("id", "brushLegendE")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .append("text")
        .text("");

      var brushLegendW = view
        .append("g")
        .attr("id", "brushLegendW")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .append("text")
        .text("");

      var radialBrush = view
        .append("g")
        .attr("stroke", "gray")
        .style("opacity", 0.5)
        .attr("fill", "transparent")
        .attr("id", "brush")
        .call(brush);

      d3.selectAll("path.resize")
        .attr("fill", "gray")
        .style("opacity", 0.5)
        .style("cursor", "grab");

      d3.select("path.extent").style("cursor", "move");

      var firstDate = d3.min(nodeDocs, (d) => d.date);
      var lastDate = d3.max(nodeDocs, (d) => d.date);

      x.domain([firstDate, lastDate]).nice();

      function dateFormat() {
        if (lastDate.getYear() - firstDate.getYear() > 20) {
          return d3.utcFormat("%Y");
        } else if (lastDate.getYear() - firstDate.getYear() > 2) {
          return d3.utcFormat("%m/%Y");
        } else {
          return d3.utcFormat("%d/%m/%Y");
        }
      }

      var xticks = x.ticks(20);
      xticks.shift();

      var xAxis = (g) =>
        g
          .attr("font-family", "sans-serif")
          .attr("font-size", 8)
          .attr("text-anchor", "middle")
          .attr("id", "xAxis")
          .call((g) =>
            g
              .selectAll("g")
              .data(xticks)
              .join("g")
              .each((d, i) => (d.id = JSON.stringify(d)))
              .call((g) =>
                g
                  .append("path")
                  .attr("stroke", "#000")
                  .attr("stroke-opacity", 0.2)
                  .attr(
                    "d",
                    (d) => `
                M${d3.pointRadial(x(d), innerRadius - 10)}
                L${d3.pointRadial(x(d), outerRadius + 20)}
              `
                  )
              )
              .call((g) =>
                g
                  .append("text")
                  .attr("x", (d) => d3.pointRadial(x(d), innerRadius - 30)[0])
                  .attr("y", (d) => d3.pointRadial(x(d), innerRadius - 30)[1])
                  .text(dateFormat())
                  .clone(true)
                  .lower()
                  .attr("stroke", "white")
              )
          );

      view.append("g").call(xAxis);

      var yAxis = (g) =>
        g
          .attr("text-anchor", "middle")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("id", "yAxis")
          .call((g) =>
            g
              .selectAll("g")
              .data(y.ticks().reverse())
              .join("g")
              .attr("fill", "none")
              .call((g) =>
                g
                  .append("circle")
                  .attr("stroke", (d) => {
                    if (Number.isInteger(d) && d < clustersNest.length) {
                      return color(d);
                    } else {
                      return "rgba(0,0,0,.2)";
                    }
                  })
                  .attr("r", y)
              )
              .call((g) =>
                g
                  .append("text")
                  .attr("y", (d) => -y(d + 0.5))
                  .attr("dy", "0.35em")
                  .attr("stroke", "#fff")
                  .attr("stroke-width", 1)
                  .text((d) => {
                    if (Number.isInteger(d) && d < clustersNest.length) {
                      return clustersNest[d].key;
                    }
                  })
                  .clone(true)
                  .attr("y", (d) => y(d + 0.5))
                  .selectAll(function () {
                    return [this, this.previousSibling];
                  })
                  .clone(true)
                  .attr("fill", "currentColor")
                  .attr("stroke", "none")
              )
          );

      view.append("g").call(yAxis);

      d3.selectAll("text").style("user-select", "none");
      radialBrush.raise();
      // brushCircle.lower();
      loadType();
    })
    .catch((error) => {
      field.value = "error - invalid dataset";
      ipcRenderer.send(
        "console-logs",
        "Chronotype error: dataset " + id + " is invalid."
      );
      console.log(error);
    });
  //======== END OF DATA CALL (PROMISES) ===========

  //======== ZOOM & RESCALE ===========
  let dragger = svg
    .append("rect")
    .attr("x", -width)
    .attr("y", -height)
    .attr("width", width * 2)
    .attr("height", height * 2)
    .attr("fill", "white")
    .style("cursor", "all-scroll")
    .lower();

  dragger.call(zoom).on("dblclick.zoom", null); // Zoom and deactivate doubleclick zooming
  //.on("mousedown.zoom", d=>{if(brushing){return null}})

  zoomed = (thatZoom) => {
    //thatZoom.x=0;
    //thatZoom.y=0,
    view.attr("transform", thatZoom);
  };

  ipcRenderer.send("console-logs", "Starting chronotype"); // Starting Chronotype
}; // Close Chronotype function

// =========== GEOTYPE =========

const geotype = (id) => {
  // ========== SVG VIEW ==========
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view")
    .attr("id", "view"); // CSS viewfinder properties

  //globe properties and beginning aspect
  const projection = d3
    .geoOrthographic()
    .scale(800)
    .translate([width - toolWidth * 2, height / 2])
    .clipAngle(90)
    .precision(0.01)
    .rotate([-20, -40, 0]);

  const loftedProjection = d3
    .geoOrthographic()
    .scale(850)
    .translate([width - toolWidth * 2, height / 2])
    .clipAngle(90)
    .precision(0.01)
    .rotate([-20, -40, 0]);

  //globe, as well as surface projects
  var path = d3.geoPath().projection(projection);

  //graticule
  const graticule = d3.geoGraticule();

  var velocity = 0.02;

  zoom
    .scaleExtent([0, 50])
    .translateExtent([
      [0, 0],
      [1200, 900],
    ])
    .extent([
      [0, 0],
      [1200, 900],
    ])
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  //globe outline and background
  view
    .append("circle")
    .style("fill", "#e6f3ff")
    .style("stroke", "#333")
    .style("stroke-width", 1)
    .attr("cx", width - toolWidth * 2)
    .attr("cy", height / 2)
    .attr("r", projection.scale());

  // ===== FLYING ARCS
  var swoosh = d3
    .line()
    .curve(d3.curveNatural)
    .defined((d) => projection.invert(d));

  const flyingArc = (link) => {
    // start with multiline links

    var globeCenter = projection.invert([
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
    ]);

    if (typeof link.coordinates[0][0] === "object") {
      var returnPath = [];
      link.coordinates.forEach((subLink) => {
        let source = subLink[0];
        let target = subLink[1];
        let middle = d3.geoInterpolate(source, target)(0.5);
        returnPath.push(
          projection(source),
          loftedProjection(middle),
          projection(target)
        );
      });

      return returnPath;
    } else {
      let source = link.coordinates[0];
      let target = link.coordinates[1];
      let middle = d3.geoInterpolate(source, target)(0.5);

      return [projection(source), loftedProjection(middle), projection(target)];
    }
  };

  //versor insertion signal for interactive exports

  //Calling data
  pandodb.geotype
    .get(id)
    .then((datajson) => {
      regenPrevSteps(datajson);
      dataDownload(datajson);

      var data = [];

      for (let i = 0; i < datajson.content.length; i++) {
        datajson.content[i].items.forEach((d) => data.push(d));
      }

      var collabDir = {};
      // Affiliation collaboration compute
      data.forEach((art) => {
        if (art.hasOwnProperty("enrichment")) {
          d = art.enrichment;
          if (d.hasOwnProperty("affiliations")) {
            // check if doc has affiliations
            if (d.affiliations.length > 1) {
              // check for more than 1 aff
              d.affiliations.forEach((aff) => {
                // iterate over affils
                affname = aff.affilname;
                if (collabDir.hasOwnProperty(affname)) {
                } else {
                  // if this aff doesn't exist in dir
                  // create this entry in dir
                  collabDir[affname] = {
                    name: affname,
                    city: aff["affiliation-city"],
                    country: aff["affiliation-country"],
                    collab: {},
                  };
                }

                d.affiliations.forEach((oaff) => {
                  // then iterate on art aff
                  oaffname = oaff.affilname;
                  if (oaffname === affname) {
                  } else {
                    // if aff isn't the current aff
                    let thisCollab = collabDir[affname]["collab"];
                    if (thisCollab.hasOwnProperty(oaffname)) {
                      // check current aff's existing links
                    } else {
                      thisCollab[oaffname] = 0; // create new link if doesn't exist
                    }

                    thisCollab[oaffname]++; // increment link by 1
                  }
                });
              });
            }
          }
        }
      });

      //  console.log(collabDir);

      //dataDownload(collabDir);
      // end of Affiliation collaboration compute

      Promise.all([d3.json("json/world-countries.json")]).then((geo) => {
        var geoData = geo[0];

        const links = [];

        var brushContent;

        var linksBuffer = [];

        const dataArray = [];

        data.forEach((d) => {
          if (
            d.hasOwnProperty("enrichment") &&
            d.enrichment.hasOwnProperty("affiliations")
          ) {
            if (d.hasOwnProperty("issued")) {
              // there is clearly an issue here

              let year = d.issued["date-parts"][0][0];
              let month = d.issued["date-parts"][0][1];
              let day = d.issued["date-parts"][0][2];

              if (month === undefined) {
                // if month isn't registered
                month = 1;
              }

              if (day === undefined) {
                // if day isn't registered
                day = 1;
              }

              d.rebuildDate = year + "-" + month + "-" + day;

              d.parsedDate = parseTime(d.rebuildDate);

              d.date = year + "," + month;
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

                let thisCity = {
                  cityname: "",
                  lon: "",
                  lat: "",
                  affilId: "",
                };
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

        links.forEach((d) => {
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

        var citiesGroup = d3.group(dataArray, (d) => d.affilId);

        var cities = [];

        citiesGroup.forEach((d) => {
          let valuesBuffer = [];

          let affiliationsBuffer = [];

          for (var j = 0; j < data.length; j++) {
            if (
              data[j].hasOwnProperty("enrichment") &&
              data[j].enrichment.hasOwnProperty("affiliations")
            ) {
              for (var k = 0; k < data[j].enrichment.affiliations.length; k++) {
                if (data[j].enrichment.affiliations[k].affilId === d.key) {
                  affiliationsBuffer.push(
                    data[j].enrichment.affiliations[k].affilname
                  );
                  valuesBuffer.push(data[j]);
                }
              }
            }
          }

          cities.push({
            lon: d[0].lon,
            lat: d[0].lat,
            country: d[0]["affiliation-country"],
            city: d[0]["affiliation-city"],
            affiliations: [],
            values: valuesBuffer,
          });
        });

        for (var i = 0; i < cities.length; i++) {
          cities[i].id = i;
        } // id = item index

        const affilFinder = (city) => {
          // purge existing tooltip content
          let geoToolTip = document.getElementById("tooltip");
          while (geoToolTip.firstChild) {
            geoToolTip.removeChild(geoToolTip.firstChild);
          }

          let cityTitle = document.createElement("h2");
          cityTitle.innerText = city.city;

          let country = document.createElement("h3");
          country.innerText = city.country;

          geoToolTip.appendChild(cityTitle);
          geoToolTip.appendChild(country);

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
                      (paper) => paper.title === city.values[k].title
                    ) < 0
                  ) {
                    institution.papers.push({
                      title: city.values[k].title,
                      DOI: city.values[k].DOI,
                      OA: city.values[k].enrichment.OA,
                      visibility: city.values[k].visibility,
                    });
                  }
                }
              }
            }
            if (
              institutions.findIndex((f) => f.name === city.affiliations[j]) < 0
            ) {
              institutions.push(institution);
            }
          }

          institutions.forEach((e) => {
            var list = document.createElement("UL");
            let inst = document.createElement("SPAN");

            for (var i = 0; i < e.papers.length; i++) {
              if (e.papers[i].visibility) {
                inst.innerHTML = "<strong>" + e.name + "</strong>";
                break;
              }
            }

            for (var i = 0; i < e.papers.length; i++) {
              let url = "https://dx.doi.org/" + e.papers[i].DOI;
              let docDOM = document.createElement("LI");

              if (e.papers[i].visibility) {
                if (e.papers[i].OA) {
                  docDOM.innerHTML =
                    "<img src='././svg/OAlogo.svg' height='16px'/>&nbsp;" +
                    e.papers[i].title;
                  list.appendChild(docDOM);
                } else {
                  docDOM.innerHTML = e.papers[i].title;
                  list.appendChild(docDOM);
                }
              }

              docDOM.addEventListener("click", (e) => {
                ipcRenderer.invoke("openEx", url);
              });
            }
            document.getElementById("tooltip").appendChild(inst);
            document.getElementById("tooltip").appendChild(list);
          });
        };

        // countries
        var countryMap = view.append("g").attr("id", "countryMap");

        countryMap
          .selectAll("path")
          .data(geoData.features)
          .enter()
          .append("path")
          .style("fill", "white")
          .style("stroke", "#c6c6c6")
          .style("stroke-width", 0.5)
          .attr("id", (d) => d.id)
          .attr("d", path);

        //graticule
        countryMap
          .append("path")
          .datum(graticule)
          .style("fill", "transparent")
          .style("stroke", "white")
          .style("stroke-width", 0.7)
          .attr("d", path);

        var locGroup = view.append("g").attr("id", "cityLocations"); // Create a group for cities + links (circles + arcs)

        cities.forEach((city) =>
          city.values.forEach((paper) => (paper.visibility = true))
        ); // Make all cities visible at first
        links.forEach((link) => (link.visibility = true)); // Make all links visibile at first

        const linkLoc = () => {
          // generate links and cities

          document
            .getElementById("view")
            .removeChild(document.getElementById("cityLocations")); // remove all cities & links

          var locGroup = view.append("g").attr("id", "cityLocations"); // recreate the cities & links svg group

          cities.forEach((city) => {
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
            else {
              // else, the radius is log(article number) + 1
              city.radius = Math.log(radius) + 1.5;
            }
          });

          cities.sort((a, b) => d3.descending(a.radius, b.radius)); // Make sure smaller nodes are above bigger nodes

          var areaList = new Object();

          cities.forEach((city) => {
            city.cluster =
              JSON.stringify(parseInt(city.lon)) +
              "|" +
              JSON.stringify(parseInt(city.lat));

            if (areaList[city.cluster] === undefined) {
              areaList[city.cluster] = 1;
            } else {
              areaList[city.cluster] = areaList[city.cluster] + 1;
            }
          });

          for (var key in areaList) {
            let count = areaList[key];

            let currentCluster = [];
            if (count > 1) {
              for (let i = 0; i < cities.length; i++) {
                if (cities[i].cluster === key) {
                  currentCluster.push(i);
                }
              }
              currentCluster.forEach(
                (cityIndex) => (cities[cityIndex].smallInCluster = true)
              );
              currentCluster.sort((a, b) => d3.descending(a.radius, b.radius)); // Make sure smaller nodes are above bigger nodes
              cities[currentCluster[0]].smallInCluster = false;
            }
          }

          // =====

          var affilLinks = locGroup
            .selectAll("lines") // add the links
            .data(links)
            .enter()
            .append("path")
            .attr("class", "arc fly_arcs")
            .style("fill", "none")
            .style("stroke-width", ".1")
            .style("stroke-linecap", "round")
            .style("stroke", (d) => {
              if (d.visibility) {
                return "crimson";
              } else {
                return "transparent";
              }
            })
            .attr("d", (d) => swoosh(flyingArc(d)));

          var affilShadows = locGroup
            .selectAll("lines") // add the links
            .data(links)
            .enter()
            .append("path")
            .style("fill", "none")
            .attr("class", "arc")
            .style("stroke-width", ".15")
            .style("stroke-linecap", "round")
            .style("stroke", (d) => {
              if (d.visibility) {
                return "rgba(200,200,200,.6)";
              } else {
                return "transparent";
              }
            }) // links always exist, they just become transparent if the articles are not in the timeframe

            .attr("d", path);
          affilLinks.raise();

          var locNames = locGroup
            .selectAll("text")
            .data(cities)
            .enter()
            .append("text")

            .style("fill", "black")
            .style("font-family", "sans-serif")
            .style("user-select", "none")
            .style("display", (d) => {
              if (
                d.hasOwnProperty("smallInCluster") &&
                d.smallInCluster === true
              ) {
                return "none";
              } else {
                return "block";
              }
            })
            .style("font-size", (d) => {
              if (d.radius > 0) {
                return d.radius + 0.1 + "px";
              } else {
                return "0";
              }
            })
            .attr("transform", (d) => {
              var loc = projection([d.lon, d.lat]),
                x = loc[0];
              y = loc[1];
              return "translate(" + (x + d.radius) + "," + y + ")";
            })
            .text((d) => d.city);

          // ADDING THE CITIES

          var locations = locGroup
            .selectAll(".locations")
            .data(cities)
            .enter()
            .append("path")
            .attr("id", (d) => d.city)
            .attr("class", "locations")
            .style("fill", "rgba(0, 82, 158, 0.55)")
            .style("stroke", "none")
            .style("cursor", "help");

          locations
            .datum((d) =>
              d3
                .geoCircle()
                .center([d.lon, d.lat])
                .radius(d.radius * 0.05)()
            )
            .attr("d", path);

          locations.on("mouseover", (event, d) => {
            d3.selectAll(".arc").style("opacity", ".15");
            d3.selectAll(".locations").style("opacity", ".4");

            for (var i = 0; i < locations._groups[0].length; i++) {
              if (
                d.coordinates[0][0] ===
                locations._groups[0][i].__data__.coordinates[0][0]
              ) {
                d3.select(locations._groups[0][i]).style("opacity", "1");

                affilFinder(cities[i]);

                d3.selectAll(".arc")._groups[0].forEach((lk) => {
                  if (lk.__data__.points[0].cityname === cities[i].city) {
                    d3.select(lk).style("opacity", "1");
                  }

                  if (lk.__data__.points[1].cityname === cities[i].city) {
                    d3.select(lk).style("opacity", "1");
                  }
                });
              }
            }
          });

          locations.on("mouseout", () => {
            d3.selectAll(".arc").style("opacity", "1");
            d3.selectAll(".locations").style("opacity", "1");
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

          var accessorFunc = (d) => d;
          if (initialData[0].value != null) {
            accessorFunc = (d) => d.value;
          }
          if (typeof accessor == "function") {
            accessorFunc = accessor;
          }

          const grouped = d3.group(data, (d) => +d.parsedDate);

          //const isDate = true;
          var dateExtent,
            dateScale,
            scaleTime,
            dateRangesCount,
            dateRanges,
            scaleTime;
          //        if (isDate) {

          dateExtent = d3.extent(data.map((d) => d.parsedDate));

          console.log(dateExtent);

          dateRangesCount = Math.round(width / 5);
          dateScale = d3
            .scaleTime()
            .domain(dateExtent)
            .range([0, dateRangesCount]);
          scaleTime = d3.scaleTime().domain(dateExtent).range([0, chartWidth]);
          dateRanges = d3
            .range(dateRangesCount)
            .map((d) => [dateScale.invert(d), dateScale.invert(d + 1)]);
          //      }

          d3.selection.prototype.patternify = function (params) {
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
            selection = selection.enter().append(elementTag).merge(selection);
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

          var values = [];

          grouped.forEach((val, key) => {
            if (isNaN(key)) {
              //log amount of missing elements
            } else {
              values.push({ date: key, value: val.length });
            }
          });

          values = values.slice().sort((a, b) => d3.ascending(a.date, b.date));

          //  console.log(values);

          const min = d3.min(values, (d) => d.value);
          const max = d3.max(values, (d) => d.value);
          const maxX = values[values.length - 1].date;
          const minX = values[0].date;

          //  console.log(minX, maxX);

          var minDiff = d3.min(values, (d, i, arr) => {
            if (!i) return Infinity;
            return d.date - arr[i - 1].date;
          });

          let eachBarWidth = 1;
          /*
                     chartWidth / values.length;
 
                    if (eachBarWidth > 20) {
                        eachBarWidth = 20;
                    }
 
 
                    if (minDiff < 1) {
                        eachBarWidth = eachBarWidth * minDiff;
                    }
 
 
                    if (eachBarWidth < 1) {
                        eachBarWidth = 1;
                    }
                    */

          const scale = params.yScale
            .domain([params.minY, max])
            .range([0, chartHeight - 25]);

          const scaleY = scale
            .copy()
            .domain([max, params.minY])
            .range([0, chartHeight - 25]);

          const scaleX = d3
            .scaleLinear()
            .domain([minX, maxX])
            .range([0, chartWidth]);

          // var axis = d3.axisBottom(scaleX);
          //if (isDate) {
          var axis = d3.axisBottom(scaleTime);
          //}
          const axisY = d3
            .axisLeft(scaleY)
            .tickSize(-chartWidth - 20)
            .ticks(max == 1 ? 1 : params.yTicks)
            .tickFormat(d3.format(".2s"));

          const bars = chart
            .selectAll(".bar")
            .data(values)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("width", eachBarWidth)
            .attr("height", (d) => scale(d.value))
            .attr("fill", "steelblue")
            .attr("y", (d) => -scale(d.value) + (chartHeight - 25))
            .attr("x", (d, i) => scaleX(d.date) - eachBarWidth / 2)
            .attr("opacity", 0.9);

          const xAxisWrapper = chart
            .append("g")
            .attr("id", "brushXAxis")
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
              d3
                .brushX()
                .extent([
                  [0, 0],
                  [chartWidth, chartHeight],
                ])
                .on("start", (e) => {
                  brushStarted(e);
                })
                .on("end", (e) => {
                  brushEnded(e);
                })
                .on("brush", (e) => {
                  brushed(e);
                })
            );

          chart.selectAll(".selection").attr("fill-opacity", 0.1);

          var handle = brush
            .patternify({
              tag: "g",
              selector: "custom-handle",
              data: [
                {
                  left: true,
                },
                {
                  left: false,
                },
              ],
            })
            .attr("cursor", "ew-resize")
            .attr("pointer-events", "all");

          handle
            .patternify({
              tag: "rect",
              selector: "custom-handle-rect",
              data: (d) => [d],
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
              data: (d) => [d],
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
              data: (d) => [d],
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
              data: (d) => [d],
            })
            .attr("width", 0.7)
            .attr("height", 20)
            .attr("fill", middleHandlerStroke)
            .attr("stroke", middleHandlerStroke)
            .attr("y", -100 / 6 + 5)
            .attr("x", -middleHandlerWidth / 4 + middleHandlerWidth - 3)
            .attr("pointer-events", "none");

          handle.attr("display", "none");

          function brushStarted({ selection }) {
            if (selection) {
              startSelection = selection[0];
            }
          }

          function brushEnded(event) {
            const selection = event.selection;

            // console.log(selection);

            if (!selection) {
              handle.attr("display", "none");

              output({
                range: [minX, maxX],
              });
              return;
            }
            // if (event.sourceEvent.type === "brush") return;

            var d0 = selection.map(scaleX.invert),
              d1 = d0.map(d3.timeDay.round);

            if (d1[0] >= d1[1]) {
              d1[0] = d3.timeDay.floor(d0[0]);
              d1[1] = d3.timeDay.offset(d1[0]);
            }

            brushContent = d1;

            let paperMap = new Map();

            data.forEach((d) => {
              if (
                d.parsedDate >= brushContent[0] &&
                d.parsedDate <= brushContent[1]
              ) {
                paperMap.set(d.DOI, true);
              }
            });

            // Manage link visibility
            links.forEach((link) => {
              if (paperMap.get(link.DOI)) {
                link.visibility = true;
              } else {
                link.visibility = false;
              }
            });

            cities.forEach((city) => {
              city.values.forEach((paper) => {
                if (paperMap.get(paper.DOI)) {
                  paper.visibility = true;
                } else {
                  paper.visibility = false;
                }
              });
            });

            document.getElementById(
              "docCountDiv"
            ).innerHTML = `${paperMap.size} articles`;
            linkLoc();
            d3.select("#tooltip").html("");
          }

          function brushed(event, d) {
            const selection = event.selection;
            if (event.sourceEvent.type === "brush") return;

            if (params.freezeMin) {
              if (selection[0] < startSelection) {
                selection[1] = Math.min(selection[0], selection[1]);
              }
              if (selection[0] >= startSelection) {
                selection[1] = Math.max(selection[0], selection[1]);
              }

              selection[0] = 0;

              d3.select(this).call(event.target.move, selection);
            }

            var d0 = selection.map(scaleX.invert);
            const s = selection;

            handle.attr("display", null).attr("transform", function (d, i) {
              return "translate(" + (s[i] - 2) + "," + chartHeight / 2 + ")";
            });
            output({
              range: d0,
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
            // if (isDate) {
            node.value.range = value.range.map((d) => dateScale.invert(d));
            //}
            node.dispatchEvent(new CustomEvent("input"));
          }

          function getData(range) {
            const dataBars = bars
              .attr("fill", "steelblue")
              .filter((d) => {
                return d.key >= range[0] && d.key <= range[1];
              })
              .attr("fill", "red")
              .nodes()
              .map((d) => d.__data__)
              .map((d) => d.values)
              .reduce((a, b) => a.concat(b), []);

            return dataBars;
          }

          const returnValue = Object.assign(svg.node(), {
            value: {
              range: [minX, maxX],
              data: initialData,
            },
          });

          //  if (isDate) {
          returnValue.value.range = returnValue.value.range.map((d) =>
            dateScale.invert(d)
          );
          //  }

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

        loadType("geotype", id);
      }); // end of world-country call
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - invalid dataset";
      ipcRenderer.send(
        "console-logs",
        "Geotype error: dataset " + id + " is invalid."
      );
    });

  let v0, q0, r0;

  const clamper = (c) => {
    var globeCenter = projection.invert([
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
      document.getElementById("xtypeSVG").width.baseVal.value / 2,
    ]);
    let lon = c[0],
      lat = c[1];
    let clampLevel = 125;
    if (
      lon > globeCenter[0] - clampLevel &&
      lon < globeCenter[0] + clampLevel &&
      lat > globeCenter[1] - clampLevel &&
      lat < globeCenter[1] + clampLevel
    ) {
      return true;
    } else {
      return false;
    }
  };

  function dragstarted(event) {
    v0 = versor.cartesian(projection.invert(d3.pointer(event)));
    q0 = versor((r0 = projection.rotate()));
  }

  dragged = function (event, targetDrag, transTime) {
    if (targetDrag) {
      d3.transition()
        .duration(2000)
        .attrTween("render", () => (t) => {
          var x = d3.interpolateNumber(currentDrag[0], targetDrag[0])(t);
          var y = d3.interpolateNumber(currentDrag[1], targetDrag[1])(t);
          var z = d3.interpolateNumber(currentDrag[2], targetDrag[2])(t);

          coord = [x, y, z];

          loftedProjection.rotate(coord);
          projection.rotate(coord);
          view.selectAll("path").attr("d", path);

          d3.select("#cityLocations")
            .selectAll("text")
            .style("display", (d) => {
              //hide if behind the globe or in cluster

              if (
                d.hasOwnProperty("smallInCluster") &&
                d.smallInCluster === true
              ) {
                return "none";
              }
              var city = [d.lon, d.lat];
              //if ( d.lon>globeCenter[0]-90 && d.lon < globeCenter[0]+90 && d.lat>globeCenter[1]-90 && d.lat < globeCenter[1]+90) {
              if (clamper(city)) {
                return "block";
              } else {
                return "none";
              }
            })
            .attr("transform", (d) => {
              var loc = projection([d.lon, d.lat]),
                x = loc[0],
                y = loc[1];

              return "translate(" + (x + d.radius) + "," + y + ")";
            })
            .text((d) => d.city)
            .raise();
          view
            .selectAll(".fly_arcs")
            .attr("d", (d) => swoosh(flyingArc(d)))
            .raise();
        })
        .on("end", () => {
          currentDrag = coord;
        });
    } else {
      const v1 = versor.cartesian(
        projection.rotate(r0).invert(d3.pointer(event))
      );
      const q1 = versor.multiply(q0, versor.delta(v0, v1));
      projection.rotate(versor.rotation(q1));
      loftedProjection.rotate(versor.rotation(q1));
      currentDrag = versor.rotation(q1);

      var globeCenter = projection.invert([
        document.getElementById("xtypeSVG").width.baseVal.value / 2,
        document.getElementById("xtypeSVG").width.baseVal.value / 2,
      ]);

      view.selectAll("path").attr("d", path);

      view
        .selectAll(".fly_arcs")
        .attr("d", (d) => swoosh(flyingArc(d)))
        .raise();

      view.selectAll(".fly_arcs").style("display", (d) => {
        let disp = "block";
        d.coordinates.forEach((pt) => {
          let ptLink = [pt[0], pt[1]];
          if (clamper(ptLink)) {
          } else {
            // HIDE ARCS BY UNCOMMENTING HERE
            // disp="none"
          }
        });
        return disp;
      });

      d3.select("#cityLocations")
        .selectAll("text")
        .style("display", (d) => {
          //hide if behind the globe or in cluster

          if (d.hasOwnProperty("smallInCluster") && d.smallInCluster === true) {
            return "none";
          }

          //if ( d.lon>globeCenter[0]-90 && d.lon < globeCenter[0]+90 && d.lat>globeCenter[1]-90 && d.lat < globeCenter[1]+90) {
          var city = [d.lon, d.lat];
          if (clamper(city)) {
            return "block";
          } else {
            return "none";
          }
        })
        .attr("transform", (d) => {
          var loc = projection([d.lon, d.lat]),
            x = loc[0],
            y = loc[1];

          return "translate(" + (x + d.radius) + "," + y + ")";
        })
        .text((d) => d.city)
        .raise();
    }
  };

  view.call(
    d3
      .drag()
      .on("start", dragstarted)
      .on("drag", (event) => dragged(event))
  );

  view.style("transform-origin", "50% 50% 0");
  view.call(zoom);

  zoomed = (thatZoom, transTime) => {
    currentZoom = thatZoom;
    view
      .transition()
      .duration(transTime)
      .style("transform", "scale(" + thatZoom.k + ")");
  };

  ipcRenderer.send("console-logs", "Starting geotype");
};

// ========= GAZOUILLOTYPE =========
const gazouillotype = (id) => {
  // When called, draw the gazouillotype

  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG node

  svg
    .attr("width", width - toolWidth)
    .attr("height", height) // Attributing width and height to svg
    .style("cursor", "all-scroll");

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

  svg.call(
    zoom.on("zoom", ({ transform }, e) => {
      zoomed(transform);
    })
  );

  var brushXscale;

  //========== X & Y AXIS  ============                                // Creating two arrays of scales (graph + brush)
  var x = d3.scaleTime();
  var y = d3
    .scaleLinear()
    .range([height - brushHeight, 0])
    .domain([0, 210]);

  var xAxis = d3.axisBottom(x).tickFormat(multiFormat);

  var yAxis = d3.axisRight(y).tickFormat(d3.format(".2s"));

  var domainDates = [];
  var bufferData = [];
  var lineData = [];

  const scrapToApiFormat = (data) => {
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

  pandodb.gazouillotype
    .get(id)
    .then((datajson) => {
      // Load dataset info from pandodb

      dataDownload(datajson);

      datajson.content.tweets = []; // Prepare array to store tweets into

      let tranche = { date: "", tweets: [] }; // A tranche will be a pile on the graph
      let twDate = 0; // Date variable
      let twtAmount = 0; // Tweet amount variable
      let radius = parseFloat(width / 1200);

      fs.createReadStream(datajson.content.path) // Read the flatfile dataset provided by the user
        .pipe(csv()) // pipe buffers to csv parser
        .on("data", (data) => {
          // each line becomes an object
          scrapToApiFormat(data); // convert the object to the twitter API format
          data.date = new Date(data.created_at); // get the date
          data.stamp = Math.round(data.date.getTime() / 600000) * 600000; // make it part of a 10-min pile in milliseconds
          data.timespan = new Date(data.stamp); // turn that into a proper JS date
          twtAmount++;
          //console.log(twtAmount);
          field.value = twtAmount + " tweets loaded";
          if (data.stamp === twDate) {
            // If a pile already exists
            tranche.tweets.push(data); // add this tweet to the current pile
          } else {
            // else
            // twtAmount += tranche.tweets.length; // add the amount of the previous pile to the previous total
            datajson.content.tweets.push(tranche); // push the pile to the main array
            twDate = data.stamp; // change pile date
            tranche = { date: data.timespan, tweets: [] }; // create new pile object
            tranche.tweets.push(data); // add tweet to this new pile

            /*
            ipcRenderer.send(
              "chaeros-notification",
              twtAmount + " tweets loaded"
            ); // send new total to main display
            */
          }
        })
        .on("end", () => {
          // Once file has been totally read

          ipcRenderer.send("chaeros-notification", "rebuilding data"); // send new total to main display

          datajson.content.tweets.shift(); // Remove first empty value

          // RE-SORT PILES TO MAKE SURE THEY ARE PAST->FUTURE

          const data = datajson.content.tweets; // Reassign data
          var keywords = datajson.content.keywords;

          if (typeof keywords === "object") {
            keywords = keywords.keywords;
          }

          var requestContent = "Request content :<br><ul>";

          keywords.forEach((kw) => {
            requestContent = requestContent + "<li>" + kw + "</li>";
          });
          requestContent = requestContent + "</ul>";

          // Find out the mean retweet value to attribute color scale
          var meanRetweetsArray = [];

          data.forEach((tweetDataset) => {
            tweetDataset.tweets.forEach((d) => {
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
          var median =
            meanRetweetsArray[parseInt(meanRetweetsArray.length / 2)];

          var color = d3
            .scaleSequential(d3.interpolateBlues)
            .clamp(true)
            .domain([-median * 2, median * 10]);

          var altColor = d3
            .scaleSequential(d3.interpolateOranges)
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
          var plusDate = addDays(firstDate, 2);
          var lastDate = new Date(data[data.length - 1].date);

          domainDates.push(firstDate, lastDate);

          var pileExtent = (lastDate - firstDate) / 600000;

          data.forEach((d) => {
            d.tweets.forEach((tweet) => bufferData.push(tweet));
          });

          let circleData = [];
          for (let i = 0; i < bufferData.length; i++) {
            circleData.push(bufferData[i]);
          }

          const keywordsDisplay = () => {
            document.getElementById("tooltip").innerHTML = requestContent;
          };

          x.domain([firstDate, plusDate]).range([0, width - toolWidth]);
          xAxis.ticks(x.range()[1] / 100);
          /*
                    zoom.translateExtent([
                        [-Infinity, -Infinity],
                        [Infinity, Infinity],
                    ]);
*/
          let areaData = [];

          data.forEach((d) => {
            let point = {
              timespan: d.tweets[0].timespan,
              indexPosition: +d.tweets[0].indexPosition,
            };
            areaData.push(point);
          });

          view
            .selectAll("circle")
            .data(circleData)
            .enter()
            .append("circle")
            .style("cursor", "pointer")
            .attr("id", (d) => d.id)
            .style("fill", (d) => color(d.retweet_count))
            .attr("r", radius)
            .attr("cx", (d) => x(d.timespan))
            .attr("cy", (d) => y(d.indexPosition))
            .on("click", (event, d) => {
              d3.select("#linktosource").remove();
              lineData = [];
              lineData.push(d);
              circleData.forEach((tweet) => {
                document.getElementById(tweet.id).style.fill = color(
                  tweet.retweet_count
                );

                if (tweet.id === d.retweeted_id) {
                  lineData.push(tweet);
                }

                if (
                  d.retweeted_id.length > 1 &&
                  tweet.retweeted_id === d.retweeted_id
                ) {
                  document.getElementById(tweet.id).style.fill = "salmon";
                }
                if (tweet.from_user_id === d.from_user_id) {
                  document.getElementById(tweet.id).style.fill = altColor(
                    tweet.retweet_count
                  );
                }
              });

              if (parseInt(d.retweeted_id)) {
                // if it is a NaN, returns false
                if (document.getElementById(d.retweeted_id)) {
                  document.getElementById(d.retweeted_id).style.fill = "red";
                }

                var line = (line = d3
                  .line()
                  .x((line) => x(line.timespan))
                  .y((line) => y(line.indexPosition)));

                view
                  .append("path")
                  .datum(lineData)
                  .attr("id", "linktosource")
                  .style("stroke", "red")
                  .style("stroke-linecap", "round")
                  .style("stroke-width", radius / 3)
                  .attr("d", line);
              }

              keywords
                .reduce((res, val) => res.concat(val.split(/ AND /)), [])
                .forEach((e) => {
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

            var accessorFunc = (d) => d;
            if (initialData[0].value != null) {
              accessorFunc = (d) => d.value;
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

            dateExtent = d3.extent(grouped.map((d) => d.timespan));

            dateRangesCount = Math.round(width / 5);
            dateScale = d3
              .scaleTime()
              .domain(dateExtent)
              .range([0, dateRangesCount]);
            scaleTime = d3
              .scaleTime()
              .domain(dateExtent)
              .range([0, chartWidth]);

            dateRanges = d3
              .range(dateRangesCount)
              .map((d) => [dateScale.invert(d), dateScale.invert(d + 1)]);

            d3.selection.prototype.patternify = function (params) {
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
              selection = selection.enter().append(elementTag).merge(selection);
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

            grouped.forEach((d) => {
              d.key = d.timespan;
              d.value = d.indexPosition;
            });

            const values = grouped.map((d) => d.value);
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

            const scaleX = d3
              .scaleLinear()
              .domain([minX, maxX])
              .range([0, chartWidth]);

            var axis = d3.axisBottom(scaleX);

            if (isDate) {
              axis = d3
                .axisBottom(scaleTime)
                .tickFormat(d3.timeFormat("%d/%m/%y"));
            }

            const axisY = d3
              .axisLeft(scaleY)
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
              .attr("height", (d) => scale(d.value))
              .attr("fill", "steelblue")
              .attr("y", (d) => -scale(d.value) + (chartHeight - 25))
              .attr("x", (d, i) => scaleX(d.key) - eachBarWidth / 2)
              .attr("opacity", 0.9);

            const xAxisWrapper = chart
              .append("g")
              .attr("id", "brushXAxis")
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
                d3
                  .brushX()
                  .extent([
                    [0, 0],
                    [chartWidth, chartHeight],
                  ])
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
                    left: true,
                  },
                  {
                    left: false,
                  },
                ],
              })
              .attr("cursor", "ew-resize")
              .attr("pointer-events", "none");

            handle
              .patternify({
                tag: "rect",
                selector: "custom-handle-rect",
                data: (d) => [d],
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
                data: (d) => [d],
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
                data: (d) => [d],
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
                data: (d) => [d],
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
              if (event.selection) {
                startSelection = event.selection[0];
              }
            }

            function brushEnded() {
              if (!event.selection) {
                handle.attr("display", "none");

                output({
                  range: [minX, maxX],
                });
                return;
              }
              if (event.sourceEvent.type === "brush") return;

              var d0 = event.selection.map(scaleX.invert),
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

              grouped.forEach((pile) => {
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
              if (event.sourceEvent.type === "brush") return;

              if (params.freezeMin) {
                if (event.selection[0] < startSelection) {
                  event.selection[1] = Math.min(
                    event.selection[0],
                    event.selection[1]
                  );
                }
                if (event.selection[0] >= startSelection) {
                  event.selection[1] = Math.max(
                    event.selection[0],
                    event.selection[1]
                  );
                }

                event.selection[0] = 0;

                d3.select(this).call(event.target.move, event.selection);
              }

              var d0 = event.selection.map(scaleX.invert);
              const s = event.selection;

              handle.attr("display", null).attr("transform", function (d, i) {
                return "translate(" + (s[i] - 2) + "," + chartHeight / 2 + ")";
              });
              output({
                range: d0,
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
                node.value.range = value.range.map((d) => dateScale.invert(d));
              }
              node.dispatchEvent(new CustomEvent("input"));
            }

            function getData(range) {
              const dataBars = bars
                .attr("fill", "steelblue")
                .filter((d) => {
                  return d.key >= range[0] && d.key <= range[1];
                })
                //  .attr("fill", "red")
                .nodes()
                .map((d) => d.__data__)
                .map((d) => d.values)
                .reduce((a, b) => a.concat(b), []);

              return dataBars;
            }

            const returnValue = Object.assign(svg.node(), {
              value: {
                range: [minX, maxX],
                data: initialData,
              },
            });

            if (isDate) {
              returnValue.value.range = returnValue.value.range.map((d) =>
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
        });
    })
    .catch((error) => {
      console.log(error);
      field.value = " error";
      ipcRenderer.send(
        "console-logs",
        " error: cannot start corpus " + id + "."
      );
    }); //======== END OF DATA CALL (PROMISES) ===========

  //======== ZOOM & RESCALE ===========

  svg
    .append("rect")
    .attr("x", "0")
    .attr("y", parseInt(height - 180))
    .attr("width", width)
    .attr("height", "40px")
    .attr("fill", "rgba(255,255,255,.7)");

  svg
    .append("rect")
    .attr("x", parseInt(width - toolWidth - 65))
    .attr("y", "0")
    .attr("width", "80px")
    .attr("height", height)
    .attr("fill", "rgba(255,255,255,.7)");

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

  zoomed = (thatZoom, transTime) => {
    // if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush

    var t = thatZoom;
    currentZoom = t;

    view.transition().duration(transTime).attr("transform", t);

    gX.transition()
      .duration(transTime)
      .call(xAxis.scale(t.rescaleX(x)));
    gY.transition()
      .duration(transTime)
      .call(yAxis.scale(t.rescaleY(y)));

    let ext1 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[0])));
    let ext2 = parseInt(brushXscale(x.invert(x.range().map(t.invertX, t)[1])));

    d3.select("#selectionBrush")
      .select(".selection")
      .transition()
      .duration(transTime)
      .attr("x", ext1)
      .attr("width", parseInt(ext2 - ext1));

    d3.select("#selectionBrush")
      .select("g")
      .transition()
      .duration(transTime)
      .attr("transform", "translate(" + ext1 + ",50)");

    d3.select("#selectionBrush")
      .selectAll("g")
      .transition()
      .duration(transTime)
      .select(function () {
        return this.nextElementSibling;
      })
      .attr("transform", "translate(" + ext2 + ",50)");
  };

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
    let stepIndex = thisStep.stepIndex;

    var step = document.createElement("DIV");
    step.innerText = stepIndex;
    step.className = "presentationStep";
    step.id = "presentationStep" + parseInt(stepIndex);

    step.addEventListener("click", () => {
      moveTo(presentationStep[parseInt(stepIndex) - 1]);
    });

    presentationBox.appendChild(step);
  };

  const addPresentationStep = () => {
    let stepData = {
      zoom: currentZoom,
      tooltip: JSON.stringify(tooltip.innerHTML),
    };

    let buttons = document.querySelectorAll("div.presentationStep");
    let currentButtonId = 0;

    for (let i = 0; i < buttons.length; i++) {
      if (buttons[i].style.backgroundColor === "black") {
        currentButtonId = i;
      }
    }

    if (currentButtonId === 0) {
      presentationStep.push(stepData);
    } else {
      presentationStep.splice(currentButtonId + 1, 0, stepData);
    }

    regenerateSteps();
  };

  const regenerateSteps = () => {
    while (presentationBox.firstChild) {
      presentationBox.removeChild(presentationBox.firstChild);
    }

    for (let i = 0; i < presentationStep.length; i++) {
      presentationStep[i].stepIndex = i + 1;
      stepCreator(presentationStep[i]);
    }
  };

  regenerateSteps();

  ipcRenderer.send("console-logs", "Starting gazouillotype"); // Starting gazouillotype
}; // Close gazouillotype function

// PHARMACOTYPE IS BACK

const pharmacotype = (id) => {
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG");

  svg.attr("width", width - toolWidth).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view");

  zoom
    .scaleExtent([0.2, 20]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, e) => {
      zoomed(transform);
    });

  var x = d3.scaleTime(); // Y axis scale

  var xAxis = d3
    .axisBottom(x) // Actual Y axis
    .scale(x) // Scale is declared just above
    .ticks(5) // 20 ticks are displayed
    .tickSize(height) // Ticks are vertical lines
    .tickPadding(10 - height); // Ticks start and end out of the screen

  var y = d3.scalePoint();

  //======== DATA CALL & SORT =========

  pandodb.pharmacotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      var data = datajson.content.entries;

      var trialNames = [];

      const clinTriDateParser = (date) => {
        if (date) {
          var fullParseTime = d3.timeParse("%B %d, %Y");
          var partialParseTime = d3.timeParse("%B %Y");

          if (date.search(",") > -1) {
            return fullParseTime(date);
          } else {
            return partialParseTime(date);
          }
        }
      };

      data.forEach((d) => {
        d.id = d.Study.ProtocolSection.IdentificationModule.BriefTitle;
        trialNames.push(d.id);
        d.highlighted = 0;

        if (d.Study.ProtocolSection.DesignModule.hasOwnProperty("PhaseList")) {
          let phases = d.Study.ProtocolSection.DesignModule.PhaseList.Phase;
          let phase = phases[phases.length - 1].slice(-1);

          if (parseInt(phase)) {
            d.currentPhase = phase;
          } else {
            d.currentPhase = 0;
          }
        } else {
          d.currentPhase = 0;
        }

        d.StudyFirstSubmitDate = clinTriDateParser(
          d.Study.ProtocolSection.StatusModule.StudyFirstSubmitDate
        );

        if (
          d.Study.ProtocolSection.StatusModule.hasOwnProperty("StartDateStruct")
        ) {
          d.StartDate = clinTriDateParser(
            d.Study.ProtocolSection.StatusModule.StartDateStruct.StartDate
          );
        }

        if (
          d.Study.ProtocolSection.StatusModule.hasOwnProperty(
            "PrimaryCompletionDateStruct"
          )
        ) {
          d.PrimaryCompletionDate = clinTriDateParser(
            d.Study.ProtocolSection.StatusModule.PrimaryCompletionDateStruct
              .PrimaryCompletionDate
          );
        }

        if (
          d.Study.ProtocolSection.StatusModule.hasOwnProperty(
            "CompletionDateStruct"
          )
        ) {
          d.CompletionDate = clinTriDateParser(
            d.Study.ProtocolSection.StatusModule.CompletionDateStruct
              .CompletionDate
          );
        }
      });

      x.domain([data[0].StudyFirstSubmitDate, new Date("2025")]) // First shows a range from minus one year to plus one year
        .range([0, width - toolWidth]); // Size on screen is full height of client

      y.domain(trialNames)
        .rangeRound([0, 20 * data.length])
        .padding(1);

      const g = view
        .append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", (d, i) => `translate(0,${y(d.id)})`);

      g.append("line")
        .attr("stroke", "#aaa")
        .attr("x1", (d) => x(d.StudyFirstSubmitDate))
        .attr("x2", (d) => x(d.CompletionDate));

      g.append("circle")
        .attr("cx", (d) => x(d.StudyFirstSubmitDate))
        .attr("fill", "rgb(209, 60, 75)")
        .attr("r", 3.5);

      g.append("circle")
        .attr("cx", (d) => x(d.StartDate))
        .attr("fill", "rgb(252, 172, 99)")
        .attr("r", 3.5);

      g.append("circle")
        .attr("cx", (d) => x(d.PrimaryCompletionDate))
        .attr("fill", "rgb(169, 220, 162)")
        .attr("r", 3.5);

      g.append("circle")
        .attr("cx", (d) => x(d.CompletionDate))
        .attr("fill", "rgb(66, 136, 181)")
        .attr("r", 3.5);

      var titles = g
        .append("text")
        .attr("fill", "black")
        .style("font-size", 8)
        .attr("id", (d) => JSON.stringify(d.Rank))
        .attr("x", (d) => x(d.CompletionDate))
        .attr("dx", 8)
        .attr("dy", 3)
        .style("cursor", "pointer")
        .text((d) => d.id)
        .on("click", (event, d) => {
          let idMod = d.Study.ProtocolSection.IdentificationModule;
          let statMod = d.Study.ProtocolSection.StatusModule;
          let descMod = d.Study.ProtocolSection.DescriptionModule;
          let overSight = d.Study.ProtocolSection.OversightModule;

          d3.select("#tooltip").html(
            "<h2>" +
              idMod.BriefTitle +
              "</h2>" +
              "<h3>" +
              idMod.Organization.OrgFullName +
              " - " +
              idMod.Organization.OrgClass.toLowerCase() +
              "</h3>" +
              "<br>" +
              " <input type='button' style='cursor:pointer' onclick='shell.openExternal(" +
              JSON.stringify(
                "https://clinicaltrials.gov/ct2/show/" + idMod.NCTId
              ) +
              ")' value='Open on ClinicalTrials.gov'></input><br><br>" +
              "<strong>Full title:</strong> " +
              idMod.OfficialTitle +
              "<br>" +
              "<strong>NCTId:</strong> " +
              idMod.NCTId +
              "<br>" +
              "<strong>Org Id:</strong> " +
              idMod.OrgStudyIdInfo.OrgStudyId +
              "<br>" +
              "<br>" +
              "<h3>Status</h3>" +
              "<strong>Overall status:</strong> " +
              statMod.OverallStatus +
              "<br>" +
              "<strong>Last verified:</strong> " +
              statMod.StatusVerifiedDate +
              "<br>" +
              "<strong>Expanded access:</strong> " +
              statMod.ExpandedAccessInfo.HasExpandedAccess +
              "<br>" +
              "<strong>FDA regulated:</strong> Drug [" +
              overSight.IsFDARegulatedDrug +
              "] - Device [" +
              overSight.IsFDARegulatedDevice +
              "]<br>" +
              "<h3>Description</h3>" +
              "<strong>Brief summary:</strong> " +
              descMod.BriefSummary +
              "<br>" +
              "<br>" +
              "<strong>Detailed description:</strong> " +
              descMod.DetailedDescription +
              "<br>"
          );

          if (
            document.getElementById(JSON.stringify(d.Rank)).style.fill ===
            "black"
          ) {
            document.getElementById(JSON.stringify(d.Rank)).style.fill = "blue";
            d.highlighted = 1;
          } else {
            document.getElementById(JSON.stringify(d.Rank)).style.fill =
              "black";
            d.highlighted = 0;
          }
        });

      var titleAlignDistance = d3.max(data, (d) => x(d.CompletionDate) + 8);

      var aligned = false;

      const alignTrialTitles = () => {
        const distance = (trial) =>
          titleAlignDistance - x(trial.CompletionDate) + 8;

        if (aligned) {
          titles
            .transition()
            .delay((d, i) => i * 10)
            .attr("transform", (d) => `translate(${0},0)`);
          aligned = false;
        } else {
          titles
            .transition()
            .delay((d, i) => i * 10)
            .attr("transform", (d) => `translate(${distance(d)},0)`);
          aligned = true;
        }
      };

      const sortTrials = (criteria) => {
        var permute;

        switch (criteria) {
          case "Highlighted":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[j].highlighted - data[i].highlighted)
            );
            break;

          case "Type of organisation":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort(
                  (i, j) =>
                    data[i].Study.ProtocolSection.IdentificationModule
                      .Organization.OrgClass.length -
                    data[j].Study.ProtocolSection.IdentificationModule
                      .Organization.OrgClass.length
                )
            );
            titles.text(
              (d) =>
                d.id +
                " - " +
                d.Study.ProtocolSection.IdentificationModule.Organization
                  .OrgClass
            );
            break;

          case "Start date":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[i].StartDate - data[j].StartDate)
            );
            break;

          case "Completion date":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[i].CompletionDate - data[j].CompletionDate)
            );
            break;

          case "Phase":
            permute = d3.permute(
              trialNames,
              d3
                .range(data.length)
                .sort((i, j) => data[i].currentPhase - data[j].currentPhase)
            );
            titles.text((d) => d.id + " - Phase: " + d.currentPhase);

            break;
        }

        y.domain(permute);

        g.transition()
          .delay((d, i) => i * 10)
          .attr("transform", (d) => `translate(0,${y(d.id)})`);
      };

      var criteriaList = [
        "Highlighted",
        "Type of organisation",
        "Start date",
        "Completion date",
        "Phase",
      ];

      var sortingList = document.createElement("div");
      sortingList.id = "sortingList";
      sortingList.style =
        "left:50px;cursor:pointer;position:absolute;font-size:12px;text-align:center;margin:auto;z-index:15;top:130px;background-color:white;border: 1px solid rgb(230,230,230);display:none";

      criteriaList.forEach((crit) => {
        var thisCrit = document.createElement("div");
        thisCrit.id = crit;
        thisCrit.innerText = crit;
        thisCrit.className = "dialog-buttons";
        thisCrit.style = "width:100%;text-align:center;padding:2px;margin:2px;";
        thisCrit.addEventListener("click", (e) => sortTrials(crit));
        sortingList.appendChild(thisCrit);
      });

      document.body.appendChild(sortingList);

      const trialSorter = () => {
        if (sortingList.style.display === "none") {
          sortingList.style.display = "block";
        } else {
          sortingList.style.display = "none";
        }
      };

      iconCreator("sort-icon", trialSorter);
      iconCreator("align-icon", alignTrialTitles);

      loadType();
    })
    .catch((error) => {
      console.log(error);
      field.value = " error";
      ipcRenderer.send(
        "console-logs",
        " error: cannot start corpus " + id + "."
      );
    });

  //======== ZOOM & RESCALE ===========

  var legend = svg.append("g").attr("id", "legend");

  legend
    .append("rect")
    .attr("x", 10)
    .attr("y", height - 70)
    .attr("width", 170)
    .attr("height", 50)
    .attr("fill", "white")
    .attr("stroke", "black");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 60)
    .attr("fill", "rgb(209, 60, 75)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 60)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("FIRST SUBMIT DATE");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 50)
    .attr("fill", "rgb(252, 172, 99)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 50)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("START DATE");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 40)
    .attr("fill", "rgb(169, 220, 162)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 40)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("PRIMARY COMPLETION DATE");

  legend
    .append("circle")
    .attr("cx", 20)
    .attr("cy", height - 30)
    .attr("fill", "rgb(66, 136, 181)")
    .attr("r", 3.5);
  legend
    .append("text")
    .attr("x", 25)
    .attr("y", height - 30)
    .attr("dy", 4)
    .style("font-size", 10)
    .text("COMPLETION DATE");

  svg.call(zoom).on("dblclick.zoom", null);

  var gX = svg
    .append("g")
    .attr("class", "axis axis--x")
    .style("stroke-opacity", 0.1)
    .call(xAxis);

  zoomed = (thatZoom, transTime) => {
    view.attr("transform", thatZoom);
    gX.call(xAxis.scale(thatZoom.rescaleX(x)));
    gX.lower();
  };
  ipcRenderer.send("console-logs", "Starting Pharmacotype");
};

const fieldotype = (id) => {
  //========== SVG VIEW =============
  var svg = d3.select(xtype).append("svg").attr("id", "xtypeSVG"); // Creating the SVG DOM node
  d3.select(xtype).style("overflow", "scroll");
  svg.attr("width", width).attr("height", height); // Attributing width and height to svg

  var view = svg
    .append("g") // Appending a group to SVG
    .attr("id", "view"); // CSS viewfinder properties

  //zoom extent
  zoom
    .scaleExtent([0.2, 15]) // To which extent do we allow to zoom forward or zoom back
    .translateExtent([
      [-Infinity, -Infinity],
      [Infinity, Infinity],
    ])
    .on("zoom", ({ transform }, d) => {
      zoomed(transform);
    });

  let palette = ["#820206", "#3c5e00", "#00379d"];

  var color = d3.scaleOrdinal(palette);

  pandodb.fieldotype
    .get(id)
    .then((datajson) => {
      dataDownload(datajson);

      const data = datajson.content;

      //console.log(data);

      const keywordMap = {};
      var minYear = 9999;
      var maxYear = 0;

      var keyCountMap = { 0: 0 };
      var areaKeyCountMap = { EU: { 0: 0 }, CN: { 0: 0 }, US: { 0: 0 } };

      for (const cat in data) {
        // console.log(cat);
        data[cat].forEach((doc) => {
          let year = doc.Issued["date-parts"][0][0];
          let y = parseInt(year);
          if (y < minYear) minYear = y;
          if (y > maxYear) maxYear = y;

          if (doc.JournalKeywords === null) {
            keyCountMap[0]++;
            areaKeyCountMap[cat][0]++;
          } else {
            let jnum = JSON.stringify(doc.JournalKeywords.length);

            if (keyCountMap.hasOwnProperty(jnum)) {
              keyCountMap[jnum]++;
            } else {
              keyCountMap[jnum] = 1;
            }

            if (areaKeyCountMap[cat].hasOwnProperty(jnum)) {
              areaKeyCountMap[cat][jnum]++;
            } else {
              areaKeyCountMap[cat][jnum] = 1;
            }

            doc.JournalKeywords.forEach((kw) => {
              if (keywordMap.hasOwnProperty(kw["@abbrev"])) {
                if (keywordMap[kw["@abbrev"]].hasOwnProperty(kw["$"])) {
                } else {
                  keywordMap[kw["@abbrev"]][kw["$"]] = {};
                }
              } else {
                keywordMap[kw["@abbrev"]] = {};
                keywordMap[kw["@abbrev"]][kw["$"]] = {};
              }
              if (keywordMap[kw["@abbrev"]][kw["$"]][year]) {
              } else {
                keywordMap[kw["@abbrev"]][kw["$"]][year] = {};
              }

              if (
                keywordMap[kw["@abbrev"]][kw["$"]][year].hasOwnProperty(cat)
              ) {
              } else {
                keywordMap[kw["@abbrev"]][kw["$"]][year][cat] = {
                  num: 0,
                  count: 0,
                };
              }

              keywordMap[kw["@abbrev"]][kw["$"]][year][cat].num++;
              // Adding 1 to all to prevent 0 counts from disappearing
              keywordMap[kw["@abbrev"]][kw["$"]][year][cat].count +=
                doc.Count + 1;
            });
          }
        });
      }
      /*
      console.log(JSON.stringify(keyCountMap));
      console.log(JSON.stringify(areaKeyCountMap));
      console.log(keywordMap);
*/
      var dateDomain = [Date.parse(minYear), Date.parse(maxYear)];

      let dataArea = {};

      const fillEmpty = (cat, i, area, subj) => {
        let itemVal = {
          date: i,
          key: cat + " published",
          value: 0,
        };

        let itemCount = {
          date: i,
          key: cat + " cited",
          value: 0,
        };

        dataArea[area + "-" + subj].push(itemVal);
        dataArea[area + "-" + subj].push(itemCount);
      };

      for (const area in keywordMap) {
        for (const subj in keywordMap[area]) {
          dataArea[area + "-" + subj] = [];
          //for (const year in keywordMap[area][subj]) {
          for (let i = minYear; i <= maxYear; i++) {
            if (keywordMap[area][subj].hasOwnProperty(i)) {
              for (const cat in data) {
                if (keywordMap[area][subj][i].hasOwnProperty(cat)) {
                  let itemVal = {
                    date: i,
                    key: cat + " published",
                    value: keywordMap[area][subj][i][cat].num,
                  };

                  let itemCount = {
                    date: i,
                    key: cat + " cited",
                    value: keywordMap[area][subj][i][cat].count,
                  };

                  dataArea[area + "-" + subj].push(itemVal);
                  dataArea[area + "-" + subj].push(itemCount);
                } else {
                  fillEmpty(cat, i, area, subj);
                }
              }
            } else {
              for (const cat in data) {
                fillEmpty(cat, i, area, subj);
              }
            }
          }
        }
      }

      const graphAmount = Object.getOwnPropertyNames(dataArea).length;
      const graphHeight = 200;
      svg.attr("height", (graphHeight + 100) * graphAmount + 200);

      var graphWidth = 400;

      var x = d3.scaleUtc().domain(dateDomain).range([0, graphWidth]);

      var area = d3
        .area()
        .x((d) => x(d.data[0]))
        .y0((d) => y(d[0]))
        .y1((d) => y(d[1]));

      var order = d3.stackOrderNone;

      var graphCount = 0;

      for (const field in dataArea) {
        var keys = Array.from(d3.group(dataArea[field], (d) => d.key).keys());

        var values = Array.from(
          d3.rollup(
            dataArea[field],
            ([d]) => d.value,
            (d) => Date.parse(d.date),
            (d) => d.key
          )
        );

        var series = d3
          .stack()
          .keys(keys)
          .value(([, values], key) => values.get(key))
          .order(order)(values);

        var topScale = d3.max(series, (d) => d3.max(d, (d) => d[1]));

        yMax = 0;
        if (topScale > 20000) {
          yMax = 40000;
        } else if (topScale > 5000) {
          yMax = 20000;
        } else if (topScale > 1000) {
          yMax = 5000;
        } else {
          yMax = 1000;
        }

        var y = d3
          .scaleLinear()
          .domain([0, yMax])
          .nice()
          .range([graphHeight, 0]);

        var xAxis = (g) =>
          g.attr("transform", `translate(0,${graphHeight})`).call(
            d3
              .axisBottom(x)
              .ticks(width / 80)
              .tickSizeOuter(0)
          );

        var yAxis = (g) =>
          g
            // .attr("transform", `translate(${width - 50},0)`)
            .call(d3.axisRight(y).tickSize(graphWidth + 20))
            .call((g) => g.select(".domain").remove())
            .call((g) =>
              g
                .selectAll(".tick:not(:first-of-type) line")
                .attr("stroke-opacity", 0.5)
                .attr("stroke-dasharray", "2,2")
            )
            .call((g) =>
              g
                .select(".tick:last-of-type text")
                .clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y)
            );

        var graph = view.append("g").attr("id", field);

        graph
          .append("text")
          .attr("x", 0)
          .attr("y", -14)
          .style("font-family", "sans-serif")
          .style("font-size", "12px")
          .style("font-weight", "bold")
          .text(field.toLocaleUpperCase());

        graph
          .append("g")
          .selectAll("path")
          .data(series)
          .join("path")
          //.attr("fill", ({ key }) => color(key))
          .attr("fill", ({ key }) => {
            switch (key.substring(0, 2)) {
              case "EU":
                return "#00379d";
                break;

              case "US":
                return "#3c5e00";
                break;

              case "CN":
                return "#820206";
                break;

              default:
                return color(d.cat);
                break;
            }
          })
          .attr("opacity", ({ key }) =>
            key.substring(3, 8) === "cited" ? 0.5 : 1
          )
          .attr("d", area)
          .append("title")
          .text(({ key }) => key);

        graph.append("g").call(xAxis);

        graph.append("g").call(yAxis);

        graph.attr(
          "transform",
          "translate(0," + graphCount * (graphHeight + 100) + ")"
        );

        graphCount++;
      }

      view.attr("transform", "translate(100,100)");

      loadType();
      document.getElementById("tooltip").style.display = "none";
    })
    .catch((error) => {
      console.log(error);
      field.value = "error - invalid dataset";
      ipcRenderer.send(
        "console-logs",
        "Fieldotype error: dataset " + id + " is invalid."
      );
    });

  zoomed = (thatZoom, transTime) => {
    console.log("zooming");
    view.attr("transform", thatZoom);
  };

  ipcRenderer.send("console-logs", "Starting fieldotype");
};

//========== typesSwitch ==========
// Switch used to which type to draw/generate

const typeSwitch = (type, id) => {
  document.getElementById("field").value = "loading " + type;

  switch (type) {
    case "regards":
      regards(id);
      break;
    case "fieldotype":
      fieldotype(id);
      break;

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
    case "archotype":
      archotype(id);
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

  document.getElementById("source").innerText = "Source: " + id;
};

// MODULE EXPORT - don't remove useful for iframe export

module.exports = { typeSwitch: typeSwitch }; // Export the switch as a module
