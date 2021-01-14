//           ______
//          / _____|
//         /  ∖____  Anthropos
//        / /∖  ___|     Ecosystems
//       / /  ∖ ∖__
//      /_/    ∖___|           PANDORÆ
//
//   LICENSE : MIT
//
// pandorae.js is the main JS file managing what happens in the mainWindow. It communicates with the Main process
// and with other windows through the Main process (by ipc channels). Visualisations (types) are loaded in the Main window
// through the "type" module, which computes heavier operations in a dedicated SharedWorker.
//

// =========== NODE - NPM ===========
// Loading all relevant modules
const { ipcRenderer, shell } = require("electron");
const userDataPath = ipcRenderer.sendSync("remote", "userDataPath"); // Find userData folder Path
const appPath = ipcRenderer.sendSync("remote", "appPath");
//const types = require(appPath+"/js/types");
const fs = require("fs");
const d3 = require("d3");
const THREE = require("three");
const Quill = require("quill");
const { zoomIdentity } = require("d3");
var dispose = false;
var CM = CMT["EN"]; // Load the EN locale first
var typeSelector = false;

// ============ VERSION ===========
const msg =
  "      ______\n     / _____|\n    /  ∖____  Anthropos\n   / /∖  ___|     Ecosystems\n  / /  ∖ ∖__\n /_/    ∖___|           PANDORÆ";

var version = "";

fs.readFile(appPath + "/package.json", "utf8", (err, data) => {
  if (err) throw err;
  let package = JSON.parse(data);
  let version = package.version;
  console.log(msg + " - " + version + "\n\n");
});

// for export purposes
var currentType; // Once a type is started, know which one
var presentationStep = [];

var tutoSlide;
var field;
var pandoratio = 0; // Used in three.js transitions (from one shape to another)
var xtypeExists = false; // xtype SVG doesn't exist on document load
var coreExists = true; // core does exist on document load
var xtype;
var activeTheme;
var fullscreenable;

var coreCanvasW = window.innerWidth;
var coreCanvasH = window.innerHeight;

var coreDefW = 512;
var coreDefH = 512;

// =========== SHARED WORKER ===========
// Some datasets can be very large, and the data rekindling necessary before display that
// couldn't be done in Chaeros can be long. In order not to freeze the user's mainWindow,
// most of the math to be done is sent to a Shared Worker which loads the data and sends
// back to Types only what it needs to know.
if (!!window.SharedWorker) {
  // If the SharedWorker doesn't exist yet

  var multiThreader = new Worker("js/mul[type]threader.js"); // Create a SharedWorker named multiThreader based on that file

  //console.log(multiThreader)

  multiThreader.postMessage({
    type: "checkup",
    validation: "MULTITHREADING ENABLED",
  });

  multiThreader.onmessage = (res) => {
    // If multiThreader sends a message
    if (res.data.type === "notification") {
      // And the type property of this message is "notification"
      ipcRenderer.send(res.data.dest, res.data.msg); // Send the notification to the main process for dispatch
    }
  };

  multiThreader.onerror = (err) => {
    // If the multiThreader reports an error
    ipcRenderer.send("audio-channel", "error");
    field.value = CM.global.field.workerError;
    ipcRenderer.send("console-logs", "ERROR - MULTITHREADING DISABLED"); // Send an error message to the console
    ipcRenderer.send("console-logs", JSON.stringify(err)); // Send the actual error content to the console
  };
}

// ========== CORE ACTIONS ===========

var commandReturn = "";

const xtypeDisplay = () => {
  (xtype.style.opacity = "1"), (xtype.style.zIndex = "6"), (commandReturn = "");
  createTooltip();
};

const purgeXtype = () => {
  if (document.getElementById("xtypeSVG")) {
    xtype.style.zIndex = "-2"; // Send the XTYPE div to back
    xtype.removeChild(document.getElementById("xtypeSVG"));
    removeTooltip();
  }
};

const displayCore = () => {
  purgeXtype();
  if (coreExists === false) {
    reloadCore();
  }
  xtypeExists = false;
  coreExists = true;
};

const purgeCore = () => {
  if (coreExists) {
    d3.select("canvas").remove();
    document.body.removeChild(document.getElementById("core-logo"));
    document.body.removeChild(document.getElementById("version"));

    // If the mainSlideSections DIV is removed, the slider detects it as sliding back to 1st slide.
    // So the cheapest solution is probably to "deep copy" the element storing the current slide,
    // remove the div, then wait for the slider to "acknowledge" that it's gone back to the 1st slide,
    // and only then replace that information with the copy we had stored in the first place.

    let currentStepBuffer = JSON.parse(JSON.stringify(currentMainPresStep));
    document.getElementById("mainSlideSections").remove();
    setTimeout(() => {
      currentMainPresStep = currentStepBuffer;
    }, 200);

    field.style.display = "none";

    Array.from(document.getElementsByClassName("purgeable")).forEach((d) => {
      document.body.removeChild(document.getElementById(d.id));
      d3.select(d.id).remove();
    });
  }
};

// ========== TOOLTIP ===========
const createTooltip = () => {
  let tooltip = document.createElement("div");
  tooltip.id = "tooltip";
  xtype.appendChild(tooltip);
};

const removeTooltip = () => {
  let tooltip = document.getElementById("tooltip");
  xtype.removeChild(tooltip);
};

// =========== Icons ===========

const iconTypes = [
  { name: "menu-icon", code: "menu" },
  { name: "option-icon", code: "code" },
  { name: "export-icon", code: "save_alt" },
  { name: "step-icon", code: "aspect_ratio" },
  { name: "sort-icon", code: "shuffle" },
  { name: "align-icon", code: "toc" },
  { name: "tutoSlide-icon", code: "create" },
  { name: "save-icon", code: "save" },
  { name: "back-to-pres", code: "arrow_back_ios" },
];

const iconCreator = (target, action) => {
  iconTypes.forEach((icon) => {
    if (target === icon.name) {
      var thisIcon = document.createElement("i");
      thisIcon.innerHTML = icon.code;
      thisIcon.id = icon.name;
      thisIcon.className = "material-icons";
      thisIcon.style = "display:flex;";
      thisIcon.onclick = action;

      var thisIconDiv = document.createElement("div");
      thisIconDiv.className = "themeCustom";
      thisIconDiv.style =
        "margin-bottom:10px;background-color:white;border: 1px solid rgb(230,230,230);cursor:pointer;";
      thisIconDiv.appendChild(thisIcon);
      document.getElementById("icons").appendChild(thisIconDiv);
    }
  });
};

// ====== PROGRESS BAR ======

const progBarSign = (prog) => {
  prog = parseInt(prog);
  if (prog > 100) {
    prog = 100;
  }
  document.getElementById("version").style.backgroundImage =
    "linear-gradient(0.25turn,rgba(0,0,255,0.3) 0%,rgba(0,0,255,0.3) " +
    prog +
    "%,transparent " +
    (prog + 0.1) +
    "%)";
};

ipcRenderer.on("progressBar", (event, prog) => {
  progBarSign(prog);
});

let menu, consoleDiv, iconDiv;
let toggledMenu = false;

const purgeMenuItems = (menu) => {
  let menuContent = document.getElementById(menu);
  while (menuContent.firstChild) {
    menuContent.removeChild(menuContent.firstChild);
  }
};

const toggleMenu = () => {
  field.removeEventListener("click", tutorialOpener);
  if (toggledMenu) {
    ipcRenderer.send("console-logs", CM.console.menu.closing);
    if (toggledSecondaryMenu) {
      toggleSecondaryMenu();
      toggleMenu();
    } else if (toggledTertiaryMenu) {
      toggleTertiaryMenu();
      toggleSecondaryMenu();
      toggleMenu();
    } else {
      menu.style.left = "-150px";
      iconDiv.style.left = "25px";
      consoleDiv.style.left = "0px";
      xtype.style.left = "0px";
      var menuItems = document.getElementsByClassName("menu-item");
      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].style.left = "-150px";
      }
      document.getElementById("logostate").remove(); // Remove the status svg
      toggledMenu = false;
    }
  } else {
    ipcRenderer.send("console-logs", CM.console.menu.opening);
    logostatus();
    menu.style.left = "0px";
    consoleDiv.style.left = "150px";
    iconDiv.style.left = "175px";
    xtype.style.left = "150px";
    var menuItems = document.getElementsByClassName("menu-item");
    for (let i = 0; i < menuItems.length; i++) {
      menuItems[i].style.left = "0";
      toggledMenu = true;
    }
  }
};

let toggledSecondaryMenu = false;

const toggleSecondaryMenu = () => {
  purgeMenuItems("thirdMenuContent");
  if (toggledSecondaryMenu) {
    if (toggledTertiaryMenu) {
      toggleTertiaryMenu();
    }
    document.getElementById("secmenu").style.left = "-150px";
    consoleDiv.style.left = "150px";
    iconDiv.style.left = "175px";

    xtype.style.left = "150px";
    toggledSecondaryMenu = false;
  } else {
    document.getElementById("secmenu").style.left = "150px";
    consoleDiv.style.left = "300px";
    iconDiv.style.left = "325px";
    xtype.style.left = "300px";
    toggledSecondaryMenu = true;
  }
};

let toggledTertiaryMenu = false;

const toggleTertiaryMenu = () => {
  purgeMenuItems("thirdMenuContent");

  if (toggledTertiaryMenu) {
    pulse(1, 1, 10, true);
    document.getElementById("thirdmenu").style.left = "-150px";
    consoleDiv.style.left = "300px";
    iconDiv.style.left = "325px";
    xtype.style.left = "300px";
    toggledTertiaryMenu = false;
  } else {
    document.getElementById("thirdmenu").style.left = "300px";
    consoleDiv.style.left = "450px";
    iconDiv.style.left = "475px";
    xtype.style.left = "450px";
    toggledTertiaryMenu = true;
    pulse(1, 1, 10);
  }
};

const openHelper = (helperFile, section) => {
  ipcRenderer.send("console-logs", "Opening helper window");
  ipcRenderer.send("window-manager", "openHelper", helperFile, "", section);
};
const openModal = (modalFile) => {
  ipcRenderer.send("window-manager", "openModal", modalFile);
};
const toggleFlux = () => {
  ipcRenderer.send("console-logs", "Opening Flux");
  toggleMenu();
  displayCore();
  openModal("flux");
};

const tutorialOpener = () => {
  openTutorial(tutoSlide);
  field.value = "";
};

// =========== MENU LOGO ===========
// The menu logo behavior. This feature isn't called by any process yet.
var logostatus = (statuserror) => {
  let svg = d3
    .select(menu)
    .append("svg")
    .attr("id", "logostate")
    .attr("width", "90")
    .attr("height", "90")
    .attr("position", "absolute")
    .style("top", "0");

  var statuserror = false;

  var lifelines = svg.append("g").attr("class", "lifeline");
  lifelines
    .append("polyline")
    .attr("id", "networkstatus")
    .attr("points", "26,45, 45,55, 64,45");
  lifelines
    .append("polyline")
    .attr("id", "corestatus")
    .attr("points", "26,48, 45,58, 64,48");
  lifelines
    .append("polyline")
    .attr("id", "datastatus")
    .attr("points", "26,51, 45,61, 64,51");

  if ((statuserror = false)) {
    lifelines.attr("class", "lifelinerror");
  }
};

// =========== CONSOLE ===========

let toggledConsole = false;

const toggleConsole = () => {
  if (toggledConsole) {
    ipcRenderer.send("console-logs", "Hiding console");
    consoleDiv.style.zIndex = "-1";
    consoleDiv.style.display = "none";
    toggledConsole = false;
  } else {
    ipcRenderer.send("console-logs", "Displaying console");
    consoleDiv.style.zIndex = "7";
    consoleDiv.style.display = "block";
    toggledConsole = true;
  }
};

var pump = {};

const pulse = (status, coeff, rhythm, clear) => {
  let rate = (number) => {
    status = status += 0.1 * coeff;
    let pulseValue = 0.05 + 0.05 * Math.sin(number);
    pandoratio = pulseValue;
  };

  if (clear) {
    clearInterval(pump);
    detransfect();
  } else {
    pump = setInterval(() => {
      rate(status);
    }, rhythm);
  }
};

const detransfect = () => {
  var reach = true;
  decrement = 0.0004;
  floor = 0;

  function decondense() {
    if (reach == true && pandoratio > floor) {
      pandoratio -= decrement;

      if (pandoratio === floor) {
        reach = false;
      }
    } else {
      reach = false;
    }
  }
  setInterval(decondense, 1);
};

// TUTORIAL

const openTutorial = (tutoSlide) => {
  if (tutoSlide) {
    ipcRenderer.send("window-manager", "openModal", "tutorial", tutoSlide);
  } else {
    ipcRenderer.send("window-manager", "openModal", "tutorial");
  }
};

const mainDisplay = (type) => {
  field.value = "preparing " + type;
  ipcRenderer.send("console-logs", "Preparing " + type);
  displayCore();
  purgeXtype();
  toggleTertiaryMenu();
  listTableDatasets(type);
};

const nameDisplay = (name) => {
  document
    .getElementById("core-logo")
    .animate([{ opacity: 1 }, { opacity: 0 }], 700);

  let display = "";

  for (var i = 0; i < name.length; i++) {
    display = display + name[i];
  }

  coreLogoArchive = name;
  document.getElementById("core-logo").innerHTML = display;
  document
    .getElementById("core-logo")
    .animate([{ opacity: 0 }, { opacity: 1 }], 700);
};

var logContent = "";
let log;

const addToLog = (message) => {
  logContent += message;
  log.innerText = logContent;
  log.scrollTop = log.scrollHeight;
};

// ========== CORE SIGNALS ===========

ipcRenderer.on("coreSignal", (event, fluxAction, fluxArgs, message) => {
  try {
    field.value = message;
  } catch (err) {
    field.value = err;
  }
});

ipcRenderer.on("chaeros-notification", (event, message, options) => {
  field.value = message;
  if (message === "return to tutorial") {
    tutoSlide = options;
  }
});

ipcRenderer.on("chaeros-failure", (event, message) => {
  field.value = message;
  ipcRenderer.send("audio-channel", "error");
});

ipcRenderer.on("pulsar", (event, message) => {
  pulse(1, 1, 10, message);
});

var quillEdit;

ipcRenderer.on("backToPres", (event, message) => {
  setTimeout(() => {
    populateSlides(message.id);
    setTimeout(() => {
      // the DOM needs to be there
      smoothScrollTo(message.step);
      document.body.style.overflow = "auto";
    }, 1500);
  }, 200);
});

const selectOption = (type, id) => {
  if (typeSelector) {
    let order =
      "[actionType:" +
      JSON.stringify(type) +
      "," +
      JSON.stringify(id) +
      "/actionType]";
    let editor = document.getElementsByClassName("ql-editor")[0];
    editor.innerHTML = editor.innerHTML + order;
    typeSelector = false;
    toggleMenu();
  } else {
    if (toggledMenu) {
      toggleMenu();
    }

    document.getElementById("menu-icon").onclick = "";
    document.getElementById("menu-icon").addEventListener(
      "click",
      () => {
        location.reload();
      },
      { once: true }
    );
    field.value = CM.global.field.starting + type;
    currentType = { type: type, id: id };
    //types.typeSwitch(type, id);
    typeSwitch(type, id);
    ipcRenderer.send("audio-channel", "button2");
    pulse(1, 1, 10);
    ipcRenderer.send(
      "console-logs",
      CM.console.starting[0] +
        type +
        CM.console.starting[1] +
        JSON.stringify(id)
    );
  }
};

const savePNG = () => {
  document.getElementById("icons").style.display = "none";

  document.getElementById("tooltip").style.overflow = "hidden";

  var datasetName = document.getElementById("source").innerText.slice(8);
  datasetName = datasetName.replace(/\//gi, "_");
  datasetName = datasetName.replace(/:/gi, "+");

  ipcRenderer
    .invoke("savePNG", { defaultPath: datasetName + ".png" })
    .then((res) => {
      document.getElementById("icons").style.display = "block";
      document.getElementById("tooltip").style.overflow = "auto";
    });
};

const serialize = (svg) => {
  const xmlns = "http://www.w3.org/2000/xmlns/";
  const xlinkns = "http://www.w3.org/1999/xlink";
  const svgns = "http://www.w3.org/2000/svg";

  svg = svg.cloneNode(true);
  const fragment = window.location.href + "#";
  const walker = document.createTreeWalker(
    svg,
    NodeFilter.SHOW_ELEMENT,
    null,
    false
  );
  while (walker.nextNode()) {
    for (const attr of walker.currentNode.attributes) {
      if (attr.value.includes(fragment)) {
        attr.value = attr.value.replace(fragment, "#");
      }
    }
  }

  svg.setAttributeNS(xmlns, "xmlns", svgns);
  svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
  const serializer = new window.XMLSerializer();
  const string = serializer.serializeToString(svg);
  var datasetName = document.getElementById("source").innerText.slice(8);
  datasetName = datasetName.replace(/\//gi, "_");
  datasetName = datasetName.replace(/:/gi, "+");

  ipcRenderer.send(
    "console-logs",
    "Exporting snapshot of current type to SVG."
  );
  ipcRenderer
    .invoke("saveSVG", { defaultPath: datasetName + ".svg" }, string)
    .then((res) => {});
};

const exportToHTML = () => {
  var datasetName = document.getElementById("source").innerText.slice(8);

  ipcRenderer
    .invoke("saveHTML", {
      defaultPath: "PANDORAE-" + currentType.type + ".html",
    })
    .then((res) => {
      let HTMLFILE = fs.createWriteStream(res.filePath);

      HTMLFILE.write('<!DOCTYPE html><html><meta charset="UTF-8">');
      HTMLFILE.write("<title>PANDORÆ - " + datasetName + "</title>");
      HTMLFILE.write(
        '<div id="step-icon" class="themeCustom" ><i class="material-icons">control_camera</i></div><div><form autocomplete="off"><input class="themeCustom" spellcheck="false" type="text" maxlength="36" id="field" value=""></div><div id="xtype">'
      );

      fs.readFile(
        appPath + "/svg/pandorae-app-logo.svg",
        "utf-8",
        (err, pandologo) => {
          HTMLFILE.write(pandologo);

          var logoSettings =
            '<script>var logo = document.getElementById("pandoraeapplogo");logo.style.zIndex=10;logo.style.padding="5px";logo.style.width="15px";logo.style.height="15px";logo.style.cursor="pointer";logo.style.position="absolute";logo.addEventListener("click",e=>{window.open("https://guillaume-levrier.github.io/PANDORAE/")})</script>';

          HTMLFILE.write(logoSettings);

          HTMLFILE.write('<div id="source"></div></div>');

          fs.readFile(appPath + "/css/pandorae.css", "utf-8", (err, css) => {
            HTMLFILE.write("<style>" + css + "</style>");
            HTMLFILE.write(
              '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">'
            );
            HTMLFILE.write(
              '<link href="https://fonts.googleapis.com/css?family=Noto+Serif&display=swap" rel="stylesheet">'
            );

            pandodb[currentType.type].get(currentType.id).then((dataset) => {
              HTMLFILE.write(
                "<script> var datajson=" + JSON.stringify(dataset) + "</script>"
              );

              fs.readFile(
                appPath + "/node_modules/d3/dist/d3.min.js",
                "utf-8",
                (err, d3) => {
                  HTMLFILE.write("<script>" + d3 + "</script>");

                  fs.readFile(
                    appPath + "/js/types.js",
                    "utf-8",
                    (err, typesJS) => {
                      HTMLFILE.write("<script>");
                      //HTMLFILE.write('var presentationStep='+JSON.parse(presentationStep)+";")
                      HTMLFILE.write(
                        'let tooltip = document.createElement("div");tooltip.id = "tooltip";document.getElementById("xtype").appendChild(tooltip);'
                      );

                      //slicing out module import & export
                      typesJS = typesJS.slice(
                        typesJS.indexOf("//END NODE MODULES"),
                        typesJS.indexOf("// MODULE EXPORT")
                      );

                      var blocks = [
                        "chronotype",
                        "geotype",
                        "anthropotype",
                        "gazouillotype",
                        "hyphotype",
                        "doxatype",
                        "filotype",
                        "pharmacotype",
                      ];

                      blocks.forEach((block) => {
                        // remove indexedDB data retrieval
                        typesJS = typesJS.replace(
                          "pandodb." + block + ".get(id).then(datajson => {",
                          "try {"
                        );
                        typesJS = typesJS.replace(
                          ").catch(error => {",
                          "\ncatch (error) { field.value = 'error - invalid dataset'; console.log(error)} //"
                        );
                        // remove loadType function
                        typesJS = typesJS.replace("loadType()", "");
                        typesJS = typesJS.replace(
                          "dataDownload(",
                          "localDownload("
                        );
                      });

                      // remove ipcRenderer communication channels
                      while (typesJS.indexOf("ipcRenderer.send(") > -1) {
                        typesJS = typesJS.replace(
                          "ipcRenderer.send(",
                          "console.log("
                        );
                      }

                      while (typesJS.indexOf("shell.openExternal") > -1) {
                        typesJS = typesJS.replace(
                          "shell.openExternal",
                          "window.open"
                        );
                      }

                      // remove worker accesses
                      while (
                        typesJS.indexOf("multiThreader.port.postMessage") > -1
                      ) {
                        typesJS = typesJS.replace(
                          "multiThreader.port.postMessage",
                          "//"
                        );
                      }

                      switch (currentType.type) {
                        case "gazouillotype": // won't work for now because the data files are flat files
                          typesJS = typesJS.replace(
                            "multiThreader.port.onmessage = workerAnswer => {",
                            'd3.forceSimulation(circleData).force("x", d3.forceX()).force("y", d3.forceY()).stop(); var gzWorkerAnswer = { type: "gz", msg: circleData }; '
                          );
                          typesJS = typesJS.replace(
                            "}; //======== END OF GZ WORKER ANWSER ===========",
                            ""
                          );

                          break;

                        case "hyphotype":
                          typesJS = typesJS.replace(
                            'if (hyWorkerAnswer.data.type==="tick") {progBarSign(hyWorkerAnswer.data.prog)} else',
                            ""
                          );

                          let step1 =
                            'nodeData.forEach(node => {for (let tag in tags) {if (node.tags.hasOwnProperty("USER")) {} else {node.tags.USER = {};}if (node.tags.USER.hasOwnProperty(tag)) {} else {node.tags.USER[tag] = ["NA"];}}});';

                          let step2 =
                            'var simulation = d3.forceSimulation(nodeData).force("link",d3.forceLink(links).id(d => d.id).distance(0).strength(1)).force("charge", d3.forceManyBody().strength(-600)).force("center", d3.forceCenter(width /2, height / 2)).stop();';

                          let step3 =
                            "for (var i = 0,n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i <= n; ++i) { simulation.tick();let prog = (i/n)*100;};";

                          let step4 =
                            "var contours = d3.contourDensity().size([width, height]).weight(d => d.indegree).x(d => d.x).y(d => d.y).bandwidth(9).thresholds(d3.max(nodeData,d=>d.indegree))(nodeData);";

                          let step5 =
                            'var hyWorkerAnswer={data:{}};hyWorkerAnswer.data={ type: "hy", nodeData: nodeData, links: links, contours:contours };';

                          var workerOperations =
                            step1 + step2 + step3 + step4 + step5;

                          typesJS = typesJS.replace(
                            " multiThreader.port.onmessage = hyWorkerAnswer => {",
                            workerOperations
                          );
                          typesJS = typesJS.replace(
                            "} // end of HY worker answer",
                            ""
                          );

                          break;

                        case "geotype":
                          fs.readFile(
                            appPath + "/node_modules/versor/src/versor.js",
                            "utf-8",
                            (err, versor) => {
                              versor = versor.replace(
                                "export default versor;",
                                ""
                              );

                              typesJS = typesJS.replace(
                                "//versor insertion signal for interactive exports",
                                versor
                              );
                              typesJS = typesJS.replace(
                                "<img src='././svg/OAlogo.svg' height='16px'/>",
                                "[OA]"
                              );

                              fs.readFile(
                                appPath + "/json/world-countries.json",
                                "utf-8",
                                (err, world) => {
                                  typesJS = typesJS.replace(
                                    'Promise.all([d3.json("json/world-countries.json")]).then(geo => {',
                                    "var geo=[" + world + "];"
                                  );
                                  typesJS = typesJS.replace(
                                    "});// end of world-country call",
                                    ""
                                  );

                                  HTMLFILE.write(typesJS);
                                  HTMLFILE.write(
                                    "typeSwitch(" +
                                      JSON.stringify(currentType.type) +
                                      "," +
                                      JSON.stringify(currentType.id) +
                                      ");"
                                  );
                                  HTMLFILE.write(
                                    'document.getElementById("field").style.zIndex = "-10";'
                                  );
                                  HTMLFILE.write(
                                    'document.getElementById("xtype").style.opacity = "1";'
                                  );
                                  HTMLFILE.write(
                                    'document.getElementById("xtype").style.zIndex = "3";'
                                  );
                                  HTMLFILE.write("</script>");
                                  HTMLFILE.end();
                                }
                              );
                            }
                          );
                          break;
                      }

                      if (currentType.type != "geotype") {
                        HTMLFILE.write(typesJS);
                        HTMLFILE.write(
                          "typeSwitch(" +
                            JSON.stringify(currentType.type) +
                            "," +
                            JSON.stringify(currentType.id) +
                            ");"
                        );
                        HTMLFILE.write(
                          'document.getElementById("field").style.zIndex = "-10";'
                        );
                        HTMLFILE.write(
                          'document.getElementById("xtype").style.opacity = "1";'
                        );
                        HTMLFILE.write(
                          'document.getElementById("xtype").style.zIndex = "3";'
                        );
                        HTMLFILE.write("</script>");
                        HTMLFILE.end();
                      }
                    }
                  );
                }
              );
            });
          });
        }
      );
    });
};

var menuIcon, consoleIcon;

const blinker = (item) => {
  let blinking;
  let blinking2;

  let target = document.getElementById(item);

  function blink() {
    blinking = setInterval(function () {
      target.style.backgroundColor = "#141414";
      target.style.color = "white";
    }, 500);
    blinking2 = setInterval(function () {
      target.style.backgroundColor = "white";
      target.style.color = "#141414";
    }, 1000);
  }

  blink();

  target.addEventListener("click", function () {
    clearInterval(blinking);
    clearInterval(blinking2);
    target.style.backgroundColor = "white";
    target.style.color = "#141414";
  });
};

const selectTheme = (themeName) => {
  ipcRenderer.send("theme", { type: "set", theme: themeName });
};

const requestTheme = () => {
  ipcRenderer.send("theme", { type: "read" });
};

ipcRenderer.on("themeContent", (event, theme) => loadTheme(theme));

const loadTheme = (theme) => {
  switch (theme.script) {
    case "normal":
      normalCore();
      break;
    case "vega":
      vega();

      break;

    default:
      break;
  }

  setTimeout(() => {
    // Give the process enough time to create the relevant DOM elements
    Array.from(document.getElementsByClassName("themeCustom")).forEach((d) => {
      if (document.getElementById(d.id)) {
        Object.assign(document.getElementById(d.id).style, theme[d.id]);
      }
    });

    if (document.getElementById("coreCanvas") != null) {
      Object.assign(
        document.getElementById("coreCanvas").style,
        theme.coreCanvas
      );
    }

    if (theme["theme-background"] != null) {
      document.getElementById("screenMachine").src = theme["theme-background"];
    }

    if (theme["theme-mask"] != null) {
      document.getElementById("mask").src = theme["theme-mask"];
    }

    coreDefW = theme.coreDefW;
    coreDefH = theme.coreDefH;
    fullscreenable = theme.fullscreenable;
  }, 100);
};

// ====== KEYBOARD SHORTCUTS ======

const keyShortCuts = (event) => {
  switch (event.isComposing || event.code) {
    case "Digit1":
      if (coreExists) {
        toggleMenu();
      }
      break;

    case "Digit2":
      toggleFlux();
      toggleMenu();
      break;

    case "Digit3":
      if (coreExists) {
        if (toggledMenu === false) {
          toggleMenu();
        }
        categoryLoader("type");
      }
      break;

    case "Backquote":
      location.reload();

      break;

    case "Digit4":
      toggleConsole();
      break;

    case "Digit5":
      if (xtypeExists) {
        if (toggledMenu === false) {
          toggleMenu();
        }
        categoryLoader("export");
      }

      break;
  }
};

let notLoadingMenu = true;

const categoryLoader = (cat) => {
  if (notLoadingMenu) {
    purgeMenuItems("secMenContent");

    notLoadingMenu = false;

    let blocks;

    switch (cat) {
      case "type":
        blocks = [
          "chronotype",
          "geotype",
          "anthropotype",
          "gazouillotype",
          "hyphotype",
          "doxatype",
          "filotype",
          "pharmacotype",
        ];
        let loadingCount = 0;
        ipcRenderer.send("console-logs", "Displaying available types");
        blocks.forEach((block) => {
          pandodb[block].count().then((thisBlock) => {
            if (thisBlock > 0) {
              let typeContainer = document.createElement("div");
              typeContainer.style.display = "flex";
              typeContainer.style.borderBottom =
                "1px solid rgba(192,192,192,0.3)";
              typeContainer.id = block;
              typeContainer.className += "tabs menu-item";
              typeContainer.innerText = block;
              typeContainer.addEventListener("click", (e) => {
                mainDisplay(block);
              });
              document
                .getElementById("secMenContent")
                .appendChild(typeContainer);
              loadingCount += 1;
              if (loadingCount === blocks.length) {
                notLoadingMenu = false;
              } else {
                notLoadingMenu = true;
              }
            }
          });
        });
        break;
      case "slide":
        blocks = ["load", "edit", "create"];

        blocks.forEach((thisBlock) => {
          let typeContainer = document.createElement("div");
          typeContainer.style.display = "flex";
          typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
          typeContainer.id = thisBlock;
          typeContainer.className += "tabs menu-item";
          typeContainer.innerText = thisBlock;
          typeContainer.addEventListener("click", (e) => {
            slideDisp(thisBlock);
          });
          document.getElementById("secMenContent").append(typeContainer);
        });
        notLoadingMenu = true;
        break;
      case "export":
        blocks = ["interactive", "svg", "png", "description"];
        ipcRenderer.send("console-logs", "Displaying available export formats");
        blocks.forEach((thisBlock) => {
          let typeContainer = document.createElement("div");
          typeContainer.style.display = "flex";
          typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
          typeContainer.id = thisBlock;
          typeContainer.className += "tabs menu-item";
          typeContainer.innerText = thisBlock;
          typeContainer.addEventListener("click", (e) => saveAs(thisBlock));
          document.getElementById("secMenContent").append(typeContainer);
        });
        notLoadingMenu = true;
        break;
    }
    toggleSecondaryMenu();
  }
};

const listTableDatasets = (table) => {
  let targetType = pandodb[table];

  targetType.toArray().then((e) => {
    if (e.length === 0) {
      pulse(10, 1, 1, true);
      field.value = "no dataset in " + table;
      ipcRenderer.send("console-logs", "No dataset in " + table);
    } else {
      e.forEach((d) => {
        // datasetContainer
        let datasetContainer = document.createElement("div");
        datasetContainer.style.display = "flex";
        datasetContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
        document
          .getElementById("thirdMenuContent")
          .appendChild(datasetContainer);

        // Dataset
        let dataset = document.createElement("div");
        dataset.className = "secContentTabs";
        dataset.id = d.id;
        dataset.innerHTML =
          "<span><strong>" + d.name + "</strong><br>" + d.date + "</span>";
        if (table === "slider") {
          dataset.onclick = function () {
            populateSlides(d.id);
            toggleMenu();
          };
        } else {
          dataset.onclick = function () {
            selectOption(table, d.id);
          };
        }

        datasetContainer.appendChild(dataset);

        // Remove dataset
        let removeDataset = document.createElement("div");
        removeDataset.className = "secContentDel";
        removeDataset.id = "del" + d.id;
        removeDataset.innerHTML =
          "<span><strong><i class='material-icons'>delete_forever</i></strong><br></span>";
        if (table === "slider") {
          removeDataset.onclick = () => {
            pandodb.slider.delete(d.id);
            document
              .getElementById("thirdMenuContent")
              .removeChild(datasetContainer);
            field.value = "dataset removed from slider";
            ipcRenderer.send(
              "console-logs",
              "Removed " + d.id + " from slider database"
            );
          };
        } else {
          removeDataset.onclick = () => {
            pandodb[table].delete(d.id);
            document
              .getElementById("thirdMenuContent")
              .removeChild(datasetContainer);
            field.value = "dataset removed from " + table;
            ipcRenderer.send(
              "console-logs",
              "Removed " + d.id + " from database: " + table
            );
          };
        }
        datasetContainer.appendChild(removeDataset);
      });
    }
  });
};

const cmdinput = (input) => {
  input = input.toLowerCase();

  ipcRenderer.send("console-logs", " user$ " + input);

  // Theme change
  if (input.substring(0, 13) === CM.mainField.changeTheme) {
    switch (input.substring(13, input.length)) {
      case "normal":
      case "blood-dragon":
      case "vega":
        //case "minitel-magis":
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          document.body.remove();
          selectTheme(input.substring(13, input.length));
          location.reload();
        }, 450);

        break;

      default:
        commandReturn = CM.mainField.invalidTheme;
    }
  } else {
    switch (input) {
      case "test":
        //loadingType();
        break;

      case "zoom":
        zoomThemeScreen(activeTheme);
        break;

      case "unzoom":
        zoomThemeScreen(activeTheme);
        break;

      case CM.mainField.toggleConsole:
        toggleConsole();
        break;

      case "hypercore":
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          document.body.remove();
          ipcRenderer.send("change-theme", "blood-dragon");
          location.reload();
        }, 450);
        break;

      case CM.mainField.toggleMenu:
        toggleMenu();
        break;

      case "help":
        //toggleHelp();
        break;

      case "chronotype":
        toggleMenu();
        categoryLoader("type");
        mainDisplay("chronotype");
        break;

      case "geotype":
        toggleMenu();
        categoryLoader("type");
        mainDisplay("geotype");
        break;

      case "anthropotype":
        toggleMenu();
        categoryLoader("type");
        mainDisplay("anthropotype");
        break;

      case "gazouillotype":
        toggleMenu();
        categoryLoader("type");
        mainDisplay("gazouillotype");
        break;

      case CM.mainField.reload:
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          document.body.remove();
          location.reload();
        }, 450);
        break;

      case CM.mainField.restart:
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          ipcRenderer.invoke("restart", true);
        }, 450);
        break;

      case CM.mainField.reloadCore:
        pandoratio = 0;
        break;

      case "transfect":
        pulse(1, 1, 10);
        break;

      case "detransfect":
        pulse(1, 1, 10, true);
        break;

      case CM.mainField.openDevtools:
        commandReturn = "opening devtools";
        ipcRenderer.invoke("mainDevTools", true);
        ipcRenderer.send("console-logs", "opening devtools");
        break;

      case CM.mainField.unlockMenu:
        menuIcon.onclick = toggleMenu;
        menuIcon.style.cursor = "pointer";
        consoleIcon.style.cursor = "pointer";
        field.removeEventListener("click", () => {
          openTutorial(tutoSlide);
        });
        break;

      case CM.mainField.version:
        commandReturn = version;
        break;

      case CM.mainField.returnTutorial:
        openTutorial(tutoSlide);
        break;
      case CM.mainField.startTutorial:
        openTutorial();
        break;

      case "undefined":
        commandReturn = "";
        break;

      case "":
        commandReturn = "";
        break;

      case CM.mainField.comNotFound:
        commandReturn = "";
        break;

      default:
        commandReturn = CM.mainField.comNotFound;
        break;
    }
  }
  field.value = commandReturn;
  document.getElementById("cli-field").value = commandReturn;
};

// POST MAIN WORLD CREATION

window.addEventListener("DOMContentLoaded", (event) => {
  iconDiv = document.getElementById("icons");
  xtype = document.getElementById("xtype"); // xtype is a div containing each (-type) visualisation

  // =========== LANGUAGE SELECTION ===========
  var CM = CMT["EN"]; // Load the EN locale at start
  fs.readFile(
    userDataPath + "/userID/user-id.json",
    "utf8", // Check if the user uses another one
    (err, data) => {
      data = JSON.parse(data);
      if (data.locale) {
        CM = CMT[data.locale];
      } else {
        CM = CMT.EN;
      }
    }
  );

  const populateLocale = (divlist) => {
    divlist.forEach((div) => {
      document.getElementById(div.id).innerText = CM.menu[div.path];
    });
  };

  var divlist = [
    { id: "fluxMenu", path: "flux" },
    { id: "type", path: "type" },
    { id: "slideBut", path: "slide" },
    { id: "quitBut", path: "quit" },
    { id: "tutostartmenu", path: "returnToTutorial" },
  ];

  populateLocale(divlist);

  document.getElementById("lang").childNodes.forEach((lg) => {
    lg.addEventListener("click", (e) => {
      CM = CMT[lg.innerText];
      populateLocale(divlist);
      fs.readFile(
        userDataPath + "/userID/user-id.json",
        "utf8",
        (err, data) => {
          data = JSON.parse(data);
          data.locale = lg.innerText;
          data = JSON.stringify(data);
          fs.writeFile(
            userDataPath + "/userID/user-id.json",
            data,
            "utf8",
            (err) => {
              if (err) throw err;
            }
          );
        }
      );
    });
  });

  // =========== MAIN LOGO ===========
  // Main logo is a text that can be changed through the nameDisplay function
  let coreLogoArchive = "";

  document.getElementById("version").innerHTML = version;

  let coreLogo = CM.global.coreLogo;

  nameDisplay(coreLogo);

  // clicking the pandorae menu logo reloads the mainWindow. So does typing "reload" in the main field.
  aelogo.addEventListener("dblclick", () => {
    location.reload();
  });

  field = document.getElementById("field"); // Field is the main field

  // =========== MENU ===========
  // menu elements

  menu = document.getElementById("menu");
  consoleDiv = document.getElementById("console");

  iconCreator("menu-icon", toggleMenu);
  // Menu behaviors

  // =========== MENU BUTTONS ===========

  document.addEventListener("keydown", (e) => {
    if (e.code == 13) {
      e.preventDefault();
      if (field.value.length > 0) {
        cmdinput(field.value);
      } else if (
        field.value.length === 0 &&
        document.getElementById("cli-field").value.length > 0
      ) {
        cmdinput(document.getElementById("cli-field").value);
      }

      return false;
    }
  });

  document
    .getElementById("fluxMenu")
    .addEventListener("click", (e) => toggleFlux());
  document
    .getElementById("type")
    .addEventListener("click", (e) => categoryLoader("type"));
  document
    .getElementById("slideBut")
    .addEventListener("click", (e) => categoryLoader("slide"));
  document.getElementById("tutostartmenu").addEventListener("click", (e) => {
    toggleMenu();
    tutorialOpener();
  });
  document
    .getElementById("quitBut")
    .addEventListener("click", (e) => closeWindow());

  iconCreator("option-icon", toggleConsole);

  log = document.getElementById("log");

  ipcRenderer.on("console-messages", (event, message) => addToLog(message));

  ipcRenderer.on("mainWindowReload", (event, message) => {
    location.reload();
  });

  // ========== MAIN MENU OPTIONS ========

  const saveSlides = () => {
    let name = document.getElementById("presNamer").value;
    mainPresContent[activeIndex].text = document.getElementsByClassName(
      "ql-editor"
    )[0].innerHTML;
    let date =
      new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();
    if (priorDate) {
      date = priorDate;
    }
    let id = name + date;
    pandodb.slider.put({
      id: id,
      date: date,
      name: name,
      content: mainPresContent,
    });
  };

  const typeSelect = () => {
    toggleMenu();
    typeSelector = true;
    categoryLoader("type");
  };

  var mainPresContent = [];
  var mainPresEdit = false;
  var priorDate = false;

  const slideCreator = () => {
    nameDisplay("");
    document.getElementById("version").innerHTML = "";
    field.style.display = "none";
    document.removeEventListener("keydown", keyShortCuts);
    document.getElementById("menu-icon").addEventListener("click", () => {
      document.body.style.animation = "fadeout 0.1s";
      setTimeout(() => {
        document.body.remove();
        location.reload();
      }, 100);
    });

    iconCreator("save-icon", saveSlides);

    var quillCont = document.createElement("div");
    quillCont.style.margin = "15%";
    quillCont.style.width = "70%";
    quillCont.style.height = "400px";
    quillCont.style.backgroundColor = "white";
    quillCont.style.zIndex = "7";
    quillCont.style.pointerEvents = "all";
    quillCont.style.position = "fixed";

    var textCont = document.createElement("div");
    textCont.id = "textcontainer";
    textCont.style =
      "background-color:rgba(0, 10, 10, .8);padding:10px;color:white;";

    quillCont.appendChild(textCont);

    document.getElementById("mainSlideSections").appendChild(quillCont);
    quillEdit = new Quill("#textcontainer", {
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          ["image", "code-block", "link"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
        ],
      },
      placeholder: "",
      theme: "snow",
    });

    var slideToolbar = document.createElement("div");
    slideToolbar.style.float = "right";
    slideToolbar.innerHTML =
      "<input type='field' placeholder='Presentation name' id='presNamer'>" +
      " <input type='button' id='▲' value='▲'>" +
      " <input type='button' id='▼' value='▼'>" +
      " <input type='button' id='+' value='+'>" +
      " <input type='button' id='-' value='-'>" +
      " <input type='button' id='typeSelector' value='TYPE'>" +
      " <input type='field' placeholder='Slide reference name' value='begin' id='slidetitle'>";

    mainPresContent.push({ title: "begin", text: "" });

    document.getElementsByClassName("ql-toolbar")[0].appendChild(slideToolbar);
    document
      .getElementById("typeSelector")
      .addEventListener("click", typeSelect);
    document.getElementById("▲").addEventListener("click", (e) => {
      slideSaver(-1);
    });
    document.getElementById("▼").addEventListener("click", (e) => {
      slideSaver(1);
    });
    document.getElementById("+").addEventListener("click", (e) => {
      let newSlideTitle = "slide" + parseInt(activeIndex + 1);
      mainPresContent.splice(activeIndex + 1, 0, {
        title: newSlideTitle,
        text: "",
      });
      slideSaver(1);
      //                                  activeIndex+=1;
    });
    document.getElementById("-").addEventListener("click", (e) => {
      mainPresContent.splice(activeIndex, 1);
      slideSaver(-1);
    });

    const slideSaver = (delta) => {
      let editor = document.getElementsByClassName("ql-editor")[0];
      let slidetitle = document.getElementById("slidetitle");
      if (activeIndex > -1) {
        // save current slide
        mainPresContent[activeIndex].title = slidetitle.value;
        mainPresContent[activeIndex].text = editor.innerHTML;
        // add delta
        activeIndex += delta;
        // display next slide
        slidetitle.value = mainPresContent[activeIndex].title;
        editor.innerHTML = mainPresContent[activeIndex].text;
      }
    };
  };

  const slideDisp = (block) => {
    document.body.style.overflow = "auto";

    switch (block) {
      case "load":
        field.value = "loading presentations";
        listTableDatasets("slider");
        toggleTertiaryMenu();

        break;
      case "edit":
        field.value = "loading presentations";
        mainPresEdit = true;
        listTableDatasets("slider");
        toggleTertiaryMenu();
        break;
      case "create":
        slideCreator();
        toggleMenu();
        break;
    }
  };

  const saveAs = (format) => {
    toggleMenu();

    setTimeout(() => {
      switch (format) {
        case "svg":
          serialize(document.getElementById("xtypeSVG"));
          break;

        case "png":
          savePNG();
          break;

        case "interactive":
          exportToHTML();
          break;

        case "description":
          saveToolTip();
          break;

        default:
          break;
      }
    }, 500);
  };

  /*
const saveToolTip = () => {

  let tooltip = document.getElementById("tooltip");
  tooltip.style.overflow = "hidden";
  var datasetName =document.getElementById('source').innerText.slice(8);
  datasetName = datasetName.replace(/\//ig,"_");
  datasetName = datasetName.replace(/:/ig,"+");

  remote.getCurrentWindow().capturePage({x:parseInt(tooltip.offsetLeft),y:parseInt(tooltip.offsetTop),width:parseInt(tooltip.offsetWidth),height:parseInt(tooltip.offsetHeight)}).then(img=>{
    fs.writeFile(
      ipcRenderer.sendSync('dialogue',{"defaultPath":datasetName+".png"})      
      ,img.toPNG(),()=>{
      tooltip.style.overflow = "auto";
    })
  })

}
*/

  field.addEventListener("click", (event) => {
    cmdinput(field.value);
  });

  field.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      cmdinput(field.value);
      e.preventDefault();
    }
  });

  // ========== MAIN FIELD COMMAND INPUT ========

  menuIcon = document.getElementById("menu-icon");
  consoleIcon = document.getElementById("option-icon");

  //// ========== WINDOW MANAGEMENT ========

  const closeWindow = () => {
    ipcRenderer.send("window-manager", "closeWindow", "index");
  };

  const refreshWindow = () => {
    location.reload();
  };

  const reframeMainWindow = () => {
    // remote.mainWindow({ frame: true });
  };

  //// ========== TUTORIAL ========

  ipcRenderer.send("userStatus", true);

  ipcRenderer.on("userStatus", (event, user) => kickStart(user));

  const kickStart = (user) => {
    if (user.UserName === "Enter your name") {
      menuIcon.style.cursor = "not-allowed";
      consoleIcon.style.cursor = "not-allowed";
      document.getElementById("tutostartmenu").style.display = "block";
      field.style.pointerEvents = "all";
      field.style.cursor = "pointer";
      field.value = "start tutorial";
    } else {
      document.getElementById("menu-icon").onclick = toggleMenu;
      document.getElementById("option-icon").onclick = toggleConsole;
      document.getElementById("menu-icon").style.cursor = "pointer";
      document.getElementById("option-icon").style.cursor = "pointer";
      document.getElementById("version").innerHTML =
        user.UserName.toUpperCase() + " | " + version;
    }
  };
  ipcRenderer.on("tutorial", (event, message) => {
    menuIcon.onclick = toggleMenu;
    menuIcon.style.cursor = "pointer";
    consoleIcon.style.cursor = "pointer";

    tutoSlide = "message";

    switch (message) {
      case "flux":
      case "zoteroImport":
        openHelper("tutorialHelper", message);
        blinker("menu-icon");
        blinker("fluxMenu");
        break;

      case "chronotype":
        openHelper("tutorialHelper", message);
        blinker("menu-icon");
        blinker("type");
        blinker("chronotype");
        field.removeEventListener("click", openModal);
        break;

      case "geotype":
        openHelper("tutorialHelper", message);
        blinker("menu-icon");
        blinker("type");
        field.removeEventListener("click", openModal);
        break;

      case "anthropotype":
        openHelper("tutorialHelper", message);
        blinker("menu-icon");
        blinker("type");
        field.removeEventListener("click", openModal);
        break;

      case "openTutorial":
        openTutorial(tutoSlide);
        break;
    }
  });

  // ========= THEMES =======

  let screenZoomToggle = false;

  const zoomThemeScreen = (theme) => {
    if (screenZoomToggle) {
      d3.select("body")
        .transition()
        .duration(2000)
        .style("transform", "scale(1,1)");
      document.getElementById("screenMachine").play();
      screenZoomToggle = false;
    } else {
      if (theme.hasOwnProperty("zoom")) {
        d3.select("body").style(
          "transform-origin",
          theme.zoom["transform-origin"]
        );
        d3.select("body")
          .transition()
          .duration(2000)
          .style("transform", theme.zoom["transform"]);
        document.getElementById("screenMachine").pause();
        screenZoomToggle = true;
      } else {
        field.value = "this theme doesn't support zooming";
      }
    }
  };

  document.addEventListener("keydown", keyShortCuts);

  requestTheme();

  ipcRenderer.on("cmdInputFromRenderer", (event, command) => {
    cmdinput(command);
  });
});
