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
const { remote, ipcRenderer, shell } = require("electron");
const fs = require("fs");
const d3 = require("d3");
const THREE = require("three");
const userDataPath = remote.app.getPath("userData");
const appPath = remote.app.getAppPath();
const types = require("./js/types");
const { dialog } = require('electron').remote;

// ============ VERSION ===========
const msg =
  "      ______\n     / _____|\n    /  ∖____  Anthropos\n   / /∖  ___|     Ecosystems\n  / /  ∖ ∖__\n /_/    ∖___|           PANDORÆ";

var version = '';

fs.readFile(appPath+"/package.json","utf8", (err, data) => {
  if (err) throw err;
   let package = JSON.parse(data);
     let version = package.version;
     console.log(msg + " - " + version + "\n\n");
})

// for export purposes
var currentType;           // Once a type is started, know which one
var presentationStep = new Array;

// =========== SHARED WORKER ===========
// Some datasets can be very large, and the data rekindling necessary before display that
// couldn't be done in Chaeros can be long. In order not to freeze the user's mainWindow,
// most of the math to be done is sent to a Shared Worker which loads the data and sends
// back to Types only what it needs to know.
if (!!window.SharedWorker) {
  // If the SharedWorker doesn't exist yet
  var multiThreader = new SharedWorker("js/mul[type]threader.js"); // Create a SharedWorker named multiThreader based on that file

  multiThreader.port.onmessage = res => {
  
    // If multiThreader sends a message
    if (res.data.type === "notification") {
      // And the type property of this message is "notification"
      ipcRenderer.send(res.data.dest, res.data.msg); // Send the notification to the main process for dispatch
    }
  };

  multiThreader.onerror = err => {
    // If the multiThreader reports an error
    ipcRenderer.send("audio-channel", "error");
    ipcRenderer.send("console-logs", "Worker failed to start."); // Send an error message to the console
    ipcRenderer.send("console-logs", JSON.stringify(err)); // Send the actual error content to the console
  };
}

// =========== MAIN LOGO ===========
// Main logo is a text that can be changed through the nameDisplay function
let coreLogoArchive = "";

document.getElementById("version").innerHTML = version;

let coreLogo = [
  "P",
  "&nbsp;",
  "A",
  "&nbsp;",
  "N",
  "&nbsp;",
  "D",
  "&nbsp;",
  "O",
  "&nbsp;",
  "R",
  "&nbsp;",
  "Æ",
  "&nbsp;",
  " ",
  "-",
  " ",
  "&nbsp;",
  "C",
  "&nbsp;",
  "O",
  "&nbsp;",
  "R",
  "&nbsp;",
  "E"
];

const nameDisplay = name => {
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

nameDisplay(coreLogo);

// clicking the pandorae menu logo reloads the mainWindow. So does typing "reload" in the main field.
aelogo.addEventListener("dblclick", () => {
  location.reload();
});

// =========== Global Variables ===========
var pandoratio = 0; // Used in three.js transitions (from one shape to another)
var field = document.getElementById("field"); // Field is the main field
var xtypeExists = false; // xtype SVG doesn't exist on document load
var coreExists = true; // core does exist on document load


// =========== Icons ===========

const iconTypes = [
      {name:"menu-icon",code:"menu"},
      {name:"option-icon",code:"code"},
      {name:"export-icon",code:"save_alt"},
      {name:"step-icon",code:"control_camera"},
      {name:"sort-icon",code:"shuffle"},
      {name:"align-icon",code:"toc"},
      {name:"slide-icon",code:"create"}
    ]

const iconCreator = (target,action) => {
  iconTypes.forEach(icon=>{
    if (target===icon.name) {

  var thisIcon = document.createElement("i")
      thisIcon.innerHTML = icon.code;
      thisIcon.id=icon.name
      thisIcon.className ="material-icons"
      thisIcon.style ="display:flex;"
      thisIcon.onclick = action; 

  var thisIconDiv = document.createElement("div")
      thisIconDiv.className = "themeCustom"
     thisIconDiv.style = "margin-bottom:10px;background-color:white;border: 1px solid rgb(230,230,230);cursor:pointer;";
      thisIconDiv.appendChild(thisIcon)
      document.getElementById("icons").appendChild(thisIconDiv)
      
    }
  })
}

let iconDiv = document.getElementById("icons");



// =========== MENU ===========
// menu elements 

let menu = document.getElementById("menu");
let consoleDiv =document.getElementById("console")

// Menu behaviors
let toggledMenu = false;
const purgeMenuItems = menu => {
  let menuContent = document.getElementById(menu);
  while (menuContent.firstChild) {
    menuContent.removeChild(menuContent.firstChild);
  }
};

const toggleMenu = () => {
  field.removeEventListener("click", tutorialOpener);
  if (toggledMenu) {
    ipcRenderer.send("console-logs", "Collapsing menu");
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
    ipcRenderer.send("console-logs", "Opening menu");
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

iconCreator("menu-icon",toggleMenu);

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
  }
};

const openHelper = (helperFile, section) => {
  ipcRenderer.send("console-logs", "Opening helper window");
  ipcRenderer.send("window-manager", "openHelper", helperFile, "", section);
};
const openModal = modalFile => {
  ipcRenderer.send("window-manager", "openModal", modalFile);
};
const toggleFlux = () => {
  ipcRenderer.send("console-logs", "Opening Flux");
  toggleMenu();
  displayCore();
  openModal("flux");
};

// =========== MENU BUTTONS ===========

document.addEventListener("keydown",e=>{
  if(e.keyCode == 13) {
    e.preventDefault();
    if (field.value.length>0){
    cmdinput(field.value);
  } else if (field.value.length===0 && document.getElementById('cli-field').value.length>0) {
    cmdinput(document.getElementById('cli-field').value);
  }
  
    return false
  }
});

document.getElementById('fluxMenu').addEventListener('click',e=>toggleFlux());
document.getElementById('type').addEventListener('click',e=>categoryLoader('type'));
document.getElementById('tutostartmenu').addEventListener('click',e=>{toggleMenu();tutorialOpener();});
document.getElementById('quitBut').addEventListener('click',e=>closeWindow());



// =========== MENU LOGO ===========
// The menu logo behavior. This feature isn't called by any process yet.
var logostatus = statuserror => {
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

iconCreator("option-icon",toggleConsole);


var logContent = "";
let log = document.getElementById("log");

const addToLog = (message) => {
  logContent += message;
  log.innerText = logContent
  log.scrollTop = log.scrollHeight;
}

ipcRenderer.on("console-messages", (event, message) => addToLog(message));

ipcRenderer.on("mainWindowReload", (event, message) => {
  remote.getCurrentWindow().reload();
  location.reload();
});

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

// ========== CORE SIGNALS ===========

ipcRenderer.on("coreSignal", (event, fluxAction, fluxArgs, message) => {
  try {
    field.value = message;
    pulse(1, 1, 10);
  } catch (err) {
    field.value = err;
  }
});

ipcRenderer.on("chaeros-notification", (event, message, options) => {
  //pulse(1, 1, 10,true);
  field.value = message;
  if (message === "return to tutorial") {
    slide = options;
  }
});

ipcRenderer.on("chaeros-failure", (event, message) => {
  field.value = message;
  ipcRenderer.send("audio-channel", "error");
});

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
    field.style.display = "none";

    Array.from(document.getElementsByClassName("purgeable")).forEach(d => {
      document.body.removeChild(document.getElementById(d.id));
      d3.select(d.id).remove();
    });

    ipcRenderer.send("console-logs", "Purging core");
  }
};

const selectOption = (type, id) => {
  pulse(1, 1, 10);
  document.getElementById(id).style.backgroundColor = "rgba(220,220,220,0.3)";

  toggleMenu();
  document.getElementById("menu-icon").onclick = "";
  document.getElementById("menu-icon").addEventListener(
    "click",
    () => {
      location.reload();
    },
    { once: true }
  );
  field.value = "starting " + type;
  currentType = {type:type,id:id}
  types.typeSwitch(type, id);
  ipcRenderer.send("audio-channel", "button2");

  ipcRenderer.send(
    "console-logs",
    "Starting with dataset: " + JSON.stringify(id)
  );
};

// ========== MAIN MENU OPTIONS ========

const categoryLoader = cat => {

  purgeMenuItems("secMenContent");

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
        "pharmacotype"
      ];
      ipcRenderer.send("console-logs", "Displaying available types");
      blocks.forEach(block => {
        pandodb[block].toArray().then(thisBlock => {
          if (thisBlock.length > 0) {
            let typeContainer = document.createElement("div");
            typeContainer.style.display = "flex";
            typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
            typeContainer.id = block;
            typeContainer.className += "tabs menu-item";
            typeContainer.innerText = block;
            typeContainer.onclick = function() {
              mainDisplay(block);
            };
            document.getElementById("secMenContent").appendChild(typeContainer);
          }
        });
      });
      break;

         case "export": 
         blocks = [
           'interactive',
           'svg',
           'png',
           'description'
          ];
          ipcRenderer.send("console-logs", "Displaying available export formats");
          blocks.forEach(thisBlock => {
                let typeContainer = document.createElement("div");
                typeContainer.style.display = "flex";
                typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
                typeContainer.id = thisBlock;
                typeContainer.className += "tabs menu-item";
                typeContainer.innerText = thisBlock;
                typeContainer.addEventListener("click",e=>saveAs(thisBlock))
                document.getElementById("secMenContent").append(typeContainer);    
          });

                  break; 
  }

 toggleSecondaryMenu();
};

const saveAs = (format) =>{
  toggleMenu();


setTimeout(() => {
  switch (format) {
    case 'svg':
     
        serialize(document.getElementById("xtypeSVG"))
      break;
    
    case 'png': savePNG()
      break;

      case 'interactive': exportToHTML()
      break;
  
    case 'description': saveToolTip()
      break;
  
    default:
      break;
  }
}, 500);
}

const saveToolTip = () => {

  let tooltip = document.getElementById("tooltip");
  tooltip.style.overflow = "hidden";
  var datasetName =document.getElementById('source').innerText.slice(8);
  datasetName = datasetName.replace(/\//ig,"_");
  datasetName = datasetName.replace(/:/ig,"+");


  remote.getCurrentWindow().capturePage({x:parseInt(tooltip.offsetLeft),y:parseInt(tooltip.offsetTop),width:parseInt(tooltip.offsetWidth),height:parseInt(tooltip.offsetHeight)}).then(img=>{
    fs.writeFile(dialog.showSaveDialog({"defaultPath":datasetName+".png"}),img.toPNG(),()=>{
      tooltip.style.overflow = "auto";
    })
  })

}

const savePNG = () => {
  document.getElementById('icons').style.display = "none";

  document.getElementById('tooltip').style.overflow = "hidden";


  var datasetName =document.getElementById('source').innerText.slice(8);
  datasetName = datasetName.replace(/\//ig,"_");
  datasetName = datasetName.replace(/:/ig,"+");
  setTimeout(() => {
    remote.getCurrentWindow().capturePage().then(img=>{
      fs.writeFile(dialog.showSaveDialog({"defaultPath":datasetName+".png"}),img.toPNG(),()=>{
        
        document.getElementById('icons').style.display = "block";
          document.getElementById('tooltip').style.overflow = "auto"; 
      
      })
    })
  }, 250);
  
 
}


const serialize = (svg) => {
  const xmlns = "http://www.w3.org/2000/xmlns/";
  const xlinkns = "http://www.w3.org/1999/xlink";
  const svgns = "http://www.w3.org/2000/svg";
 
    svg = svg.cloneNode(true);
    const fragment = window.location.href + "#";
    const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT, null, false);
    while (walker.nextNode()) {
      for (const attr of walker.currentNode.attributes) {
        if (attr.value.includes(fragment)) {
          attr.value = attr.value.replace(fragment, "#");
        }
      }
    }

    svg.setAttributeNS(xmlns, "xmlns", svgns);
    svg.setAttributeNS(xmlns, "xmlns:xlink", xlinkns);
    const serializer = new window.XMLSerializer;
    const string = serializer.serializeToString(svg);
    var datasetName =document.getElementById('source').innerText.slice(8);
    datasetName = datasetName.replace(/\//ig,"_");
    datasetName = datasetName.replace(/:/ig,"+");

    
    ipcRenderer.send("console-logs", "Exporting snapshot of current type to SVG in the user's 'Pictures' folder.");
    fs.writeFile(
      dialog.showSaveDialog({"defaultPath":datasetName+".svg"}),
      string,
      "utf8",
      err => {
        if (err) {
          ipcRenderer.send("console-logs", JSON.stringify(err));
        }
        
      }
    );
  
}


const exportToHTML=()=>{

 var datasetName =document.getElementById('source').innerText.slice(8);

var thisPath = dialog.showSaveDialog({"defaultPath":"PANDORAE-"+currentType.type+".html"})

 let HTMLFILE = fs.createWriteStream(thisPath)

 HTMLFILE.write('<!DOCTYPE html><html><meta charset="UTF-8">')
 HTMLFILE.write('<title>PANDORÆ - '+datasetName+'</title>')
 HTMLFILE.write('<div id="step-icon" class="themeCustom" ><i class="material-icons">control_camera</i></div><div><form autocomplete="off"><input class="themeCustom" spellcheck="false" type="text" maxlength="36" id="field" value=""></div><div id="xtype">')



 fs.readFile(appPath+'/svg/pandorae-app-logo.svg',"utf-8",(err,pandologo)=>{
  HTMLFILE.write(pandologo)

  var logoSettings = '<script>var logo = document.getElementById("pandoraeapplogo");logo.style.zIndex=10;logo.style.padding="25px";logo.style.width="50px";logo.style.height="50px";logo.style.cursor="pointer";logo.style.position="absolute";logo.addEventListener("click",e=>{window.open("https://guillaume-levrier.github.io/PANDORAE/")})</script>';

  HTMLFILE.write(logoSettings)
 
  HTMLFILE.write('<div id="source"></div></div>');

fs.readFile(appPath+'/css/pandorae.css',"utf-8",(err,css)=>{
  HTMLFILE.write('<style>'+css+'</style>')
  HTMLFILE.write('<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">')
  HTMLFILE.write('<link href="https://fonts.googleapis.com/css?family=Noto+Serif&display=swap" rel="stylesheet">')

pandodb[currentType.type].get(currentType.id).then(dataset=>{
  HTMLFILE.write('<script> var datajson='+JSON.stringify(dataset)+'</script>')

fs.readFile(appPath+'/node_modules/d3/dist/d3.min.js',"utf-8",(err,d3)=>{
  HTMLFILE.write('<script>'+d3+'</script>')

fs.readFile(appPath+'/js/types.js',"utf-8",(err,typesJS)=>{
  HTMLFILE.write('<script>')
  //HTMLFILE.write('var presentationStep='+JSON.parse(presentationStep)+";")
  HTMLFILE.write('let tooltip = document.createElement("div");tooltip.id = "tooltip";document.getElementById("xtype").appendChild(tooltip);')

  //slicing out module import & export
  typesJS = typesJS.slice(typesJS.indexOf("//END NODE MODULES"),typesJS.indexOf("// MODULE EXPORT"))
  
  var blocks = [
    "chronotype",
    "geotype",
    "anthropotype",
    "gazouillotype",
    "hyphotype",
    "doxatype",
    "filotype",
    "pharmacotype"
  ];

  blocks.forEach(block=> {
    // remove indexedDB data retrieval
    typesJS = typesJS.replace("pandodb."+block+".get(id).then(datajson => {","try {")
    typesJS = typesJS.replace(").catch(error => {","\ncatch (error) { field.value = 'error - invalid dataset'; console.log(error)} //")
    // remove loadType function
    typesJS = typesJS.replace("loadType()","")
    typesJS = typesJS.replace("dataDownload(","localDownload(")
    
})
  
// remove ipcRenderer communication channels
while (typesJS.indexOf("ipcRenderer.send(")>(-1)) {
  typesJS = typesJS.replace("ipcRenderer.send(","console.log(")
}

while (typesJS.indexOf("shell.openExternal")>(-1)) {
  typesJS = typesJS.replace("shell.openExternal","window.open")
}

// remove worker accesses
while (typesJS.indexOf("multiThreader.port.postMessage")>(-1)) {
  typesJS = typesJS.replace("multiThreader.port.postMessage","//")

}




  switch (currentType.type) {
    case "gazouillotype":   // won't work for now because the data files are flat files
    
      typesJS = typesJS.replace('multiThreader.port.onmessage = workerAnswer => {','d3.forceSimulation(circleData).force("x", d3.forceX()).force("y", d3.forceY()).stop(); var gzWorkerAnswer = { type: "gz", msg: circleData }; ')
      typesJS = typesJS.replace("}; //======== END OF GZ WORKER ANWSER ===========","")

      break;

      case "hyphotype": 

      typesJS = typesJS.replace('if (hyWorkerAnswer.data.type==="tick") {progBarSign(hyWorkerAnswer.data.prog)} else',"")


      let step1 = 'nodeData.forEach(node => {for (let tag in tags) {if (node.tags.hasOwnProperty("USER")) {} else {node.tags.USER = {};}if (node.tags.USER.hasOwnProperty(tag)) {} else {node.tags.USER[tag] = ["NA"];}}});';

      let step2 = 'var simulation = d3.forceSimulation(nodeData).force("link",d3.forceLink(links).id(d => d.id).distance(0).strength(1)).force("charge", d3.forceManyBody().strength(-600)).force("center", d3.forceCenter(width /2, height / 2)).stop();';

      let step3='for (var i = 0,n = Math.ceil(Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay())); i <= n; ++i) { simulation.tick();let prog = (i/n)*100;};';

      let step4 = 'var contours = d3.contourDensity().size([width, height]).weight(d => d.indegree).x(d => d.x).y(d => d.y).bandwidth(9).thresholds(d3.max(nodeData,d=>d.indegree))(nodeData);';

      let step5 ='var hyWorkerAnswer={data:{}};hyWorkerAnswer.data={ type: "hy", nodeData: nodeData, links: links, contours:contours };'

      var workerOperations = step1+step2+step3+step4+step5;

      typesJS = typesJS.replace(" multiThreader.port.onmessage = hyWorkerAnswer => {",workerOperations)
      typesJS = typesJS.replace("} // end of HY worker answer","")

      break;

      case "geotype": 

      fs.readFile(appPath+'/node_modules/versor/src/versor.js',"utf-8",(err,versor)=>{

        versor = versor.replace("export default versor;","")

        typesJS = typesJS.replace('//versor insertion signal for interactive exports',versor)
        typesJS = typesJS.replace("<img src='././svg/OAlogo.svg' height='16px'/>","[OA]")
        

    fs.readFile(appPath+'/json/world-countries.json',"utf-8",(err,world)=>{

      typesJS = typesJS.replace('Promise.all([d3.json("json/world-countries.json")]).then(geo => {','var geo=['+world+'];')
      typesJS = typesJS.replace( "});// end of world-country call",'')
     
    HTMLFILE.write(typesJS)
    HTMLFILE.write("typeSwitch("+JSON.stringify(currentType.type)+","+JSON.stringify(currentType.id)+");")
    HTMLFILE.write('document.getElementById("field").style.zIndex = "-10";')
    HTMLFILE.write('document.getElementById("xtype").style.opacity = "1";')
    HTMLFILE.write('document.getElementById("xtype").style.zIndex = "3";')
    HTMLFILE.write('</script>')
    HTMLFILE.end()
      })
    })
      break;

  }

  if (currentType.type!= "geotype") {
  
    HTMLFILE.write(typesJS)
    HTMLFILE.write("typeSwitch("+JSON.stringify(currentType.type)+","+JSON.stringify(currentType.id)+");")
    HTMLFILE.write('document.getElementById("field").style.zIndex = "-10";')
    HTMLFILE.write('document.getElementById("xtype").style.opacity = "1";')
    HTMLFILE.write('document.getElementById("xtype").style.zIndex = "3";')
    HTMLFILE.write('</script>')
    HTMLFILE.end()
  }

  })

       })
     })
   })
  })
}


// TUTORIAL

const openTutorial = (slide) => {
  if (slide) {
  ipcRenderer.send("window-manager","openModal","tutorial",slide);
} else {
  ipcRenderer.send("window-manager","openModal","tutorial");
}
}


const mainDisplay = type => {
  const listTableDatasets = table => {
    let targetType = pandodb[table];

    targetType.toArray().then(e => {
      e.forEach(d => {
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
        dataset.onclick = function() {
          selectOption(type, d.id);
        };
        datasetContainer.appendChild(dataset);

        // Remove dataset
        let removeDataset = document.createElement("div");
        removeDataset.className = "secContentDel";
        removeDataset.id = "del" + d.id;
        removeDataset.innerHTML =
          "<span><strong><i class='material-icons'>delete_forever</i></strong><br></span>";
        removeDataset.onclick = () => {
          pandodb[type].delete(d.id);
          document
            .getElementById("thirdMenuContent")
            .removeChild(datasetContainer);
          field.value = "Dataset removed from " + type;
          ipcRenderer.send(
            "console-logs",
            "Removed " + d.id + " from database: " + type
          );
        };
        datasetContainer.appendChild(removeDataset);
      });
    });
  };

  field.value = "preparing " + type;
  ipcRenderer.send("console-logs", "Preparing " + type);
  displayCore();
  purgeXtype();
  toggleTertiaryMenu();
  listTableDatasets(type);
};

field.addEventListener("click", ()=>{cmdinput(field.value)});

// ========== MAIN FIELD COMMAND INPUT ========

const cmdinput = input => {
  input = input.toLowerCase();

  ipcRenderer.send("console-logs", " user$ " + input);

  // Theme change
  if (input.substring(0, 13) === "change theme ") {
    switch (input.substring(13, input.length)) {
      case "normal":
      case "blood-dragon":
      case "minitel-magis":
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          document.body.remove();
          selectTheme(input.substring(13, input.length));
          remote.getCurrentWindow().reload();
        }, 450);

        break;

      default:
        commandReturn = "invalid theme name";
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

      case "toggle console":
        toggleConsole();
        break;

      case "menu select type":
        toggleMenu();
        categoryLoader("type");
        break;

      case "menu select ext":
        toggleMenu();
        categoryLoader("ext");
        break;

      case "hypercore":
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          document.body.remove();
          ipcRenderer.send("change-theme", "blood-dragon");
          remote.getCurrentWindow().reload();
        }, 450);
        break;

      case "toggle menu":
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

      case "reload":
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          document.body.remove();
          remote.getCurrentWindow().reload();
        }, 450);
        break;

        case "fullscreen":
          if(remote.getCurrentWindow().isFullScreen()){
            remote.getCurrentWindow().setFullScreen(false);
          } else {
            remote.getCurrentWindow().setFullScreen(true);
          }
            break;

        case "restart":
          document.body.style.animation = "fadeout 0.5s";
          setTimeout(() => {
            remote.app.relaunch();
            remote.app.exit(0);
          }, 450);
          break;

      case "reload core":
        pandoratio = 0;
        break;

      case "transfect":
        pulse(1, 1, 10);
        break;

      case "detransfect":
        pulse(1, 1, 10, true);
        break;

      case "open devtools":
        commandReturn = "opening devtools";
        remote.getCurrentWindow().openDevTools();
        ipcRenderer.send("console-logs", "opening devtools");
        break;

      case "unlock menu":
        menuIcon.onclick = toggleMenu;
        menuIcon.style.cursor = "pointer";
        consoleIcon.style.cursor = "pointer";
        field.removeEventListener("click", () => {
          openTutorial(slide);
        });
        break;

      case "version":
        commandReturn = version;
        break;

      case "return to tutorial":
          openTutorial(slide);
          break;
      case "start tutorial":
        openTutorial();
        break;
      case "undefined":
        commandReturn = "";
        break;

      case "":
        commandReturn = "";
        break;

      case "command not found":
        commandReturn = "";
        break;

      default:
        commandReturn = "command not found";
        break;
    }
  }
  field.value = commandReturn;
  document.getElementById("cli-field").value = commandReturn;
};

var pump = {};

const pulse = (status, coeff, rhythm, clear) => {
  let rate = number => {
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

//// ========== WINDOW MANAGEMENT ========

const closeWindow = () => {
  remote.getCurrentWindow().close();
};

const refreshWindow = () => {
  remote.getCurrentWindow().reload();
};

const reframeMainWindow = () => {
  remote.mainWindow({ frame: true });
};

//// ========== TUTORIAL ========

const tutorialOpener = () => {
  openTutorial(slide);
  field.value = "";
};

fs.readFile(
  userDataPath + "/userID/user-id.json", // Read the designated datafile
  "utf8",
  (err, data) => {
    // Additional options for readFile
    if (err) throw err;
    let user = JSON.parse(data);

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
     
        fs.readFile(appPath+"/package.json","utf8", (err, data) => {
          if (err) throw err;
           let package = JSON.parse(data);
             let version = package.version;
             document.getElementById("version").innerHTML = user.UserName.toUpperCase()+" | "+version;
        })
        
    }
  }
);

const blinker = item => {
  let blinking;
  let blinking2;

  let target = document.getElementById(item);

  function blink() {
    blinking = setInterval(function() {
      target.style.backgroundColor = "#141414";
      target.style.color = "white";
    }, 500);
    blinking2 = setInterval(function() {
      target.style.backgroundColor = "white";
      target.style.color = "#141414";
    }, 1000);
  }

  blink();

  target.addEventListener("click", function() {
    clearInterval(blinking);
    clearInterval(blinking2);
    target.style.backgroundColor = "white";
    target.style.color = "#141414";
  });
};



ipcRenderer.on("tutorial", (event, message) => {
  menuIcon.onclick = toggleMenu;
  menuIcon.style.cursor = "pointer";
  consoleIcon.style.cursor = "pointer";

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
      openTutorial(slide);
      break;
  }
});

// ========= THEMES =======

var activeTheme;
var fullscreenable;

var coreCanvasW = window.innerWidth;
var coreCanvasH = window.innerHeight;

var coreDefW = 512;
var coreDefH = 512;

const selectTheme = themeName => {
  fs.readFile(userDataPath + "/themes/themes.json", "utf8", (err, data) => {
    var themeData = JSON.parse(data);
    for (let i = 0; i < themeData.length; i++) {
      themeData[i].selected = false;
      if (themeData[i]["theme-name"] === themeName) {
        themeData[i].selected = true;
      }
    }
    fs.writeFile(
      userDataPath + "/themes/themes.json",
      JSON.stringify(themeData),
      "utf8",
      err => {
        if (err) {
          ipcRenderer.send("console-logs", JSON.stringify(err));
        }
      }
    );
  });
};

const loadTheme = () => {
  fs.readFile(userDataPath + "/themes/themes.json", "utf8", (err, data) => {
    var themeData = JSON.parse(data);
    for (let i = 0; i < themeData.length; i++) {
      if (themeData[i].selected === true) {
        let theme = themeData[i];
        activeTheme = theme;

        if (theme.hasOwnProperty("script")) {
          var themeScripts = require(appPath +
            "/themes/" +
            theme["theme-name"] +
            "/" +
            theme.script)();
        }

        setTimeout(() => {
          // Give the process enough time to create the relevant DOM elements
          Array.from(document.getElementsByClassName("themeCustom")).forEach(
            d => {
              if (document.getElementById(d.id)){
               Object.assign(document.getElementById(d.id).style, theme[d.id]);
              }
            }
          );

          if (document.getElementById("coreCanvas") != null) {
            Object.assign(
              document.getElementById("coreCanvas").style,
              theme.coreCanvas
            );
          }

          if (theme["theme-background"] != null) {
            document.getElementById("screenMachine").src =
              theme["theme-background"];
          }

          if (theme["theme-mask"] != null) {
            document.getElementById("mask").src = theme["theme-mask"];
          }

          coreDefW = theme.coreDefW;
          coreDefH = theme.coreDefH;
          fullscreenable = theme.fullscreenable;
        }, 100);
      }
    }
  });
};

window.onload = loadTheme();

let screenZoomToggle = false;

const zoomThemeScreen = theme => {
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


// ====== KEYBOARD SHORTCUTS ======

document.addEventListener("keydown", event => {
  switch (event.isComposing || event.code) {
    case "Digit1":
      if (coreExists){
      toggleMenu();
    }
      break;

    case "Digit2":
      toggleFlux();
      toggleMenu();
      break;

    case "Digit3":
        if (coreExists){
  
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
      if(xtypeExists){
        if (toggledMenu === false) {
          toggleMenu();
        }
      categoryLoader("export");
      }
    
      break;
  }
});

// ====== PROGRESS BAR ======

const progBarSign = prog => {
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


// changethemer

ipcRenderer.on("cmdInputFromRenderer", (event, command) => {
  cmdinput(command)
})


