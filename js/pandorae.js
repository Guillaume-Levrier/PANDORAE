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
// ============ VERSION ===========
const msg = '      ______\n     / _____|\n    /  ∖____  Anthropos\n   / /∖  ___|     Ecosystems\n  / /  ∖ ∖__\n /_/    ∖___|           PANDORÆ\n\n';
const version ='BETA/DEV-V0.1.29';
console.log(msg+version);

// =========== NODE - NPM ===========
// Loading all relevant modules
const {remote, ipcRenderer, shell} = require('electron');
const Request = require('request');
const rpn = require('request-promise-native');
const events = require('events');
const fs = require('fs');
const d3 = require('d3');
const THREE = require('three');
const userDataPath = remote.app.getPath('userData');
const appPath = remote.app.getAppPath();
const QRCode = require('qrcode');
const Dexie = require('dexie');
const types = require('./js/type/types');
const keytar = require('keytar');                                    

// =========== DATABASE ===========
Dexie.debug = true;

let pandodb = new Dexie("PandoraeDatabase");

let structureV1 = "id,date,name";

pandodb.version(1).stores({enriched: structureV1,scopus: structureV1,csljson:structureV1,zotero: structureV1,twitter: structureV1,anthropotype: structureV1,chronotype: structureV1, geotype: structureV1,pharmacotype: structureV1,publicdebate: structureV1, gazouillotype: structureV1, hyphe: structureV1, system:structureV1});
pandodb.version(2).stores({hyphotype: structureV1,enriched: structureV1,scopus: structureV1,csljson: structureV1, zotero: structureV1, twitter: structureV1, anthropotype: structureV1,chronotype: structureV1, geotype: structureV1,pharmacotype: structureV1,publicdebate: structureV1,gazouillotype: structureV1,hyphe: structureV1,system:structureV1});

// =========== SHARED WORKER ===========
// Some datasets can be very large, and the data rekindling necessary before display that 
// couldn't be done in Chaeros can be long. In order not to freeze the user's mainWindow,
// most of the math to be done is sent to a Shared Worker which loads the data and sends
// back to Types only what it needs to know.
if (!!window.SharedWorker) {                                                      // If the SharedWorker doesn't exist yet
    var multiThreader = new SharedWorker("js/type/mul[type]threader.js");         // Create a SharedWorker named multiThreader based on that file

    multiThreader.port.onmessage = (res) => {                                     // If multiThreader sends a message
      if (res.data.type === "notification") {                                     // And the type property of this message is "notification"
        ipcRenderer.send(res.data.dest,res.data.msg);                             // Send the notification to the main process for dispatch
    }
  };

    multiThreader.onerror = (err) => {                                            // If the multiThreader reports an error
      ipcRenderer.send('console-logs',"Worker failed to start.");                 // Send an error message to the console
      ipcRenderer.send('console-logs',JSON.stringify(err));                       // Send the actual error content to the console
    };

};

// =========== MAIN LOGO ===========
// Main logo is a text that can be changed through the nameDisplay function
let coreLogoArchive = "";

document.getElementById("version").innerHTML = version;

let coreLogo = ["P","&nbsp;","A","&nbsp;","N","&nbsp;","D","&nbsp;","O","&nbsp;","R","&nbsp;","Æ","&nbsp;"," ","-"," ","&nbsp;","C","&nbsp;","O","&nbsp;","R","&nbsp;","E"];

let chaeros = ["C","H","&nbsp;","&nbsp;","&nbsp;","<div id='A-e' style='margin-left:240px;'>A</div><div id='a-E' style='margin-left:250px;'>E</div>","R","O","S"," ","-"," ","D","I","S","T","A","N","T"];

const nameDisplay = (name) => {

document.getElementById("core-logo").animate([{opacity: 1},{opacity: 0}], 700);

    let display = "";

      for (var i = 0; i < name.length; i++) {
        display = display + name[i];
      }

coreLogoArchive = name;
  document.getElementById("core-logo").innerHTML=display;
  document.getElementById("core-logo").animate([{opacity: 0},{opacity: 1}], 700);

};

nameDisplay(coreLogo);

// clicking the pandorae menu logo reloads the mainWindow. So does typing "reload" in the main field.
aelogo.addEventListener('dblclick', ()=>{location.reload()});

// =========== Global Variables ===========
var pandoratio = 0;                                         // Used in three.js transitions (from one shape to another)

var field = document.getElementById("field");               // Field is the main field

var xtypeExists = false;                                    // xtype SVG doesn't exist on document load
var coreExists = true;                                      // core does exist on document load

// =========== MENU ===========
// Menu behaviors
let toggledMenu = false;
const purgeMenuItems = (menu) => {
  let menuContent = document.getElementById(menu);
  while (menuContent.firstChild) {menuContent.removeChild(menuContent.firstChild);}
}

const toggleMenu = () => {
  field.removeEventListener("click",tutorialOpener);
  if (toggledMenu) {
    if (toggledSecondaryMenu) {toggleSecondaryMenu();toggleMenu();}
    else if (toggledTertiaryMenu) {toggleTertiaryMenu();toggleSecondaryMenu();toggleMenu();}
    else {
    document.getElementById("menu").style.left = "-150px";
    document.getElementById("menu-icon").style.left = "25px";
    document.getElementById("option-icon").style.left = "25px";
    document.getElementById("console").style.left = "0px";
    xtype.style.left = "0px";
        var menuItems = document.getElementsByClassName("menu-item");
        for (let i = 0; i < menuItems.length; i++) {menuItems[i].style.left = "-150px";}
    document.getElementById("logostate").remove();                           // Remove the status svg
    toggledMenu = false;
    }
  }
    else {

      if (xtypeExists) {
        document.body.style.animation="fadeout 0.1s";
        setTimeout(()=>{
          document.body.remove();
          remote.getCurrentWindow().reload();
        }, 100);
      }
      else {
      logostatus();
      document.getElementById("menu").style.left = "0px";
      document.getElementById("console").style.left = "150px";
      document.getElementById("menu-icon").style.left = "175px";
      document.getElementById("option-icon").style.left = "175px";
      xtype.style.left = "150px";
          var menuItems = document.getElementsByClassName("menu-item");
          for (let i = 0; i < menuItems.length; i++) {menuItems[i].style.left = "0";}
      toggledMenu = true;
      }
  }
}

let toggledSecondaryMenu = false;

const toggleSecondaryMenu = () => {
  purgeMenuItems("secMenContent");
  purgeMenuItems("thirdMenuContent");
  if (toggledSecondaryMenu) {
    if (toggledTertiaryMenu) {toggleTertiaryMenu();}
    document.getElementById("secmenu").style.left = "-150px";
    document.getElementById("console").style.left = "150px";
    document.getElementById("menu-icon").style.left = "175px";
    document.getElementById("option-icon").style.left = "175px";
    xtype.style.left = "150px";
    toggledSecondaryMenu = false;
  }
    else {
      document.getElementById("secmenu").style.left = "150px";
      document.getElementById("console").style.left = "300px";
      document.getElementById("menu-icon").style.left = "325px";
      document.getElementById("option-icon").style.left = "325px";
      xtype.style.left = "300px";
      toggledSecondaryMenu = true;
  }
}

let toggledTertiaryMenu = false;

const toggleTertiaryMenu = () => {
  purgeMenuItems("thirdMenuContent");
  if (toggledTertiaryMenu) {
    document.getElementById("thirdmenu").style.left = "-150px";
    document.getElementById("console").style.left = "300px";
    document.getElementById("menu-icon").style.left = "325px";
    document.getElementById("option-icon").style.left = "325px";
    xtype.style.left = "300px";
    toggledTertiaryMenu = false;
  }
    else {
      document.getElementById("thirdmenu").style.left = "300px";
      document.getElementById("console").style.left = "450px";
      document.getElementById("menu-icon").style.left = "475px";
      document.getElementById("option-icon").style.left = "475px";
      xtype.style.left = "450px";
      toggledTertiaryMenu = true;
  }
}

const openHelper = (helperFile,section) => {
  ipcRenderer.send('window-manager',"openHelper",helperFile,"",section);
}
const openModal = (modalFile) => {
  ipcRenderer.send('window-manager',"openModal",modalFile);
}
const toggleOptions = () => {openRegular("options");}
const toggleFlux = () => {toggleMenu();displayCore();openModal("flux");}
const toggleHelp = () => {window.open("help.html","_blank");}


// =========== MENU LOGO ===========
// The menu logo behavior. This feature isn't called by any process yet.
var logostatus = (statuserror) => {
let svg = d3.select(menu).append("svg")
                  .attr("id","logostate")
                  .attr("width","90")
                  .attr("height","90")
                  .attr("position","absolute")
                  .style("top","0");

var statuserror = false;

var lifelines = svg.append("g").attr("class", "lifeline");
lifelines.append("polyline").attr("id","networkstatus").attr("points", "26,45, 45,55, 64,45");
lifelines.append("polyline").attr("id","corestatus").attr("points", "26,48, 45,58, 64,48");
lifelines.append("polyline").attr("id","datastatus").attr("points", "26,51, 45,61, 64,51");

if (statuserror = false) {
lifelines.attr("class","lifelinerror")
    }
}

// =========== CONSOLE ===========

let toggledConsole = false;

const toggleConsole = () => {
  if (toggledConsole) {
    document.getElementById("console").style.zIndex = "-1";
    document.getElementById("console").style.display = "none";
    toggledConsole = false;
  }
  else {
    document.getElementById("console").style.zIndex = "3";
    document.getElementById("console").style.display = "block";
    toggledConsole = true;
    }
}

ipcRenderer.on('console-messages', (event,message) => {
  let log = document.getElementById("log");
  log.innerText = log.innerText+message;
  log.scrollTop = log.scrollHeight;
});

ipcRenderer.on('mainWindowReload', (event,message) => {
  remote.getCurrentWindow().reload();
  location.reload();
});


// ========== TOOLTIP ===========
const createTooltip = () => {
  let tooltip = document.createElement("div");
  tooltip.id = "tooltip";
  xtype.appendChild(tooltip);
}

const removeTooltip = () => {
  let tooltip = document.getElementById("tooltip");
  xtype.removeChild(tooltip);
}

// ========== CORE SIGNALS ===========

ipcRenderer.on('coreSignal', (event,fluxAction,fluxArgs, message) => {
    try {
      field.value = message;
      pulse(1,1,10);
    } 
    catch (err) {
      field.value = err;
    }
});

ipcRenderer.on('chaeros-notification', (event,message,action) => {
  field.value = message;
  if (action==="detransfect") {pulse(1,1,10,true);}
});

ipcRenderer.on('chaeros-failure', (event,message) => {
  field.value = message;
});

// ========== CORE ACTIONS ===========

var commandReturn = "";

const xtypeDisplay = () => {
  xtype.style.opacity = "1",
  xtype.style.zIndex = "2",
  commandReturn = "";
  createTooltip();
};

const purgeXtype = () => {
  if (document.getElementById("xtypeSVG")) {
    xtype.style.zIndex = "-2"                      // Send the XTYPE div to back
    xtype.removeChild(document.getElementById("xtypeSVG"));
    removeTooltip();
  }
};

const displayCore = () => {
  purgeXtype();
  if (coreExists === false) {reloadCore();}
  xtypeExists = false;
  coreExists = true;
}

const purgeCore = () => {
  if (coreExists) {
    d3.select("canvas").remove();
    document.body.removeChild(document.getElementById("core-logo"));
    document.body.removeChild(document.getElementById("version"));
    field.style.display = "none";

    Array.from(document.getElementsByClassName("purgeable")).forEach(d=>{
      document.body.removeChild(document.getElementById(d.id));   
      d3.select(d.id).remove();
    });

    ipcRenderer.send('console-logs',"Purging core");
  }
};

const selectOption = (type,id) => {   
  document.getElementById(id).style.backgroundColor = "rgba(220,220,220,0.3)";
  toggleMenu();

  field.addEventListener("click", ()=>{types.typeSwitch(type,id);},{once:true});
  field.style.pointerEvents = "all";
  field.style.cursor = "pointer";
  field.value = "start "+type;

  ipcRenderer.send('console-logs',"Checking dataset: " + JSON.stringify(id));
};

// ========== MAIN MENU OPTIONS ========

const categoryLoader = (cat) => {

  let blocks;

  switch (cat) {
    case "type": blocks = ['chronotype','geotype','anthropotype','gazouillotype','hyphotype'];
                  break;

/*     case "ext": blocks = ['hyphe'];
                  break; */
  }

  blocks.forEach(block=>{
    pandodb[block].toArray().then(thisBlock=>{
        if (thisBlock.length>0) {
          let typeContainer = document.createElement("div");
          typeContainer.style.display="flex";
          typeContainer.style.borderBottom= "1px solid rgba(192,192,192,0.3)";
          typeContainer.id = block;
          typeContainer.className+= "tabs menu-item";
          typeContainer.innerText = block;
          typeContainer.onclick = function (){mainDisplay(block)};
          document.getElementById("secMenContent").appendChild(typeContainer);
        }
    })
  })

 toggleSecondaryMenu();
}

const mainDisplay = (type) =>{

  const listTableDatasets = (table) => {
    let targetType = pandodb[table];

    targetType.toArray().then(e=> {

      e.forEach(d=> {

        // datasetContainer
        let datasetContainer = document.createElement("div");
        datasetContainer.style.display="flex";
        datasetContainer.style.borderBottom= "1px solid rgba(192,192,192,0.3)";
        document.getElementById("thirdMenuContent").appendChild(datasetContainer);

        // Dataset
        let dataset = document.createElement("div");
        dataset.className = "secContentTabs";
        dataset.id = d.id;
        dataset.innerHTML = "<span><strong>"+d.name+"</strong><br>"+d.date+"</span>";
        dataset.onclick = function () {selectOption(type,d.id)};
        datasetContainer.appendChild(dataset);

        // Remove dataset
        let removeDataset = document.createElement("div");
        removeDataset.className = "secContentDel";
        removeDataset.id = "del"+d.id;
        removeDataset.innerHTML = "<span><strong><i class='material-icons'>delete_forever</i></strong><br></span>";
        removeDataset.onclick = () => {
            pandodb[type].delete(d.id);
            document.getElementById("thirdMenuContent").removeChild(datasetContainer);
            field.value = "Dataset removed from "+type;
            ipcRenderer.send('console-logs',"Removed "+d.id+" from database: "+type);
          };
        datasetContainer.appendChild(removeDataset);

        }) 
      });
  }

  field.value = "preparing " + type;
  ipcRenderer.send('console-logs',"Preparing " + type);
  displayCore();
  purgeXtype();
  toggleTertiaryMenu();
  listTableDatasets(type);
}


// ========== MAIN FIELD COMMAND INPUT ========

const cmdinput = (input) => {

  input = input.toLowerCase();

  ipcRenderer.send('console-logs'," user$ "+ input);

  // Theme change 
  if (input.substring(0, 13) === "change theme ") {

    switch (input.substring(13,input.length)) {

          case "normal":
          case "blood-dragon":
          case "minitel-magis":

              document.body.style.animation="fadeout 0.5s";
              setTimeout(()=>{
                    document.body.remove();
                    selectTheme(input.substring(13,input.length));
                    remote.getCurrentWindow().reload();
              }, 450);

              break;

          default: commandReturn = "invalid theme name";
            }
  } 

  else {

  switch (input) {

    case 'test':
          //loadingType();
          break;

    case 'zoom':
          zoomThemeScreen(activeTheme)
    break;

    case 'unzoom':
          zoomThemeScreen(activeTheme)
    break;

    case 'toggle console':
            toggleConsole();
            break;


    case 'menu select type':
      toggleMenu();
      categoryLoader('type');
      break;

      case 'menu select ext':
        toggleMenu();
        categoryLoader('ext');
        break;

    case 'hypercore':
             document.body.style.animation="fadeout 0.5s";
              setTimeout(()=>{
                    document.body.remove();
                    ipcRenderer.send('change-theme','blood-dragon');
                    remote.getCurrentWindow().reload();
              }, 450);
            break;

    case 'toggle menu':
            toggleMenu();
            break;

    case 'help':
            //toggleHelp();
            break;

    case 'chronotype':
            toggleMenu();
            categoryLoader('type');
            mainDisplay('chronotype');
            break;

    case  'geotype':
        toggleMenu();
        categoryLoader('type');
        mainDisplay('geotype');
          break;

    case  'anthropotype':
        toggleMenu();
        categoryLoader('type');
        mainDisplay('anthropotype');
          break;

          case  'gazouillotype':
              toggleMenu();
              categoryLoader('type');
              mainDisplay('gazouillotype');
              break;


    case  'reload':
            document.body.style.animation="fadeout 0.5s";
            setTimeout(()=>{
              document.body.remove();
              remote.getCurrentWindow().reload();
            }, 450);
          break;

    case  'reload core':
          pandoratio = 0;
          break;

/*
    case  'link regex':
          const addRegexLink = () =>{
          let linktoadd = document.getElementById('regfield').value;
          if (linktoadd == null || linktoadd == "") { localReturn = 'no link added';}
          else {
              chronoLinksKeywords.push(linktoadd);
              localReturn = '"' + linktoadd  + '" added';
            }
          }
          commandReturn = '';
          break;
*/


    case  'transfect':
            pulse(1,1,10);
          break;

    case  'detransfect':
          pulse(1,1,10,true);
          break;

    case  'chromium console':
          commandReturn = "opening chromium console";
          remote.getCurrentWindow().openDevTools();
          ipcRenderer.send('console-logs',"Opening chromium console.");
          break;

    case  'unlock menu':
          document.getElementById("menu-icon").onclick = toggleMenu;
          document.getElementById("menu-icon").style.cursor = "pointer";
          document.getElementById("option-icon").style.cursor = "pointer";
          field.removeEventListener("click", ()=>{
              openModal("tutorial");
            })
            break;

            case 'version':
            commandReturn = version;
            break;

    case  'start tutorial':
          openModal("tutorial");
          break;
    case 'undefined':
          commandReturn = "";
          break;

    case  '':
          commandReturn = "";
          break;

    case 'command not found':
          commandReturn = "";
          break;

    default:
          commandReturn = "command not found";
          break;
        }
      }
field.value = commandReturn;

}

var pump = {};

const pulse = (status,coeff,rhythm,clear) => {

let rate = (number) => {
  status = status+=(0.1*coeff);
  let pulseValue = 0.05 + (0.05*Math.sin(number));
  pandoratio = pulseValue;
};

      if (clear){
          clearInterval(pump);
          detransfect();
      } else {
          pump = setInterval(()=>{rate(status)},rhythm);
      }

}

const detransfect = () => {
  var reach = true
      decrement = 0.0004
      floor = 0;

    function decondense() {
      if (reach == true && pandoratio > floor) {
        pandoratio -= decrement

        if (pandoratio === floor) {
          reach = false;
        }
    }
    else {
        reach = false;
        }
  }
  setInterval(decondense, 1);
}


//// ========== WINDOW MANAGEMENT ========

const closeWindow = () => { remote.getCurrentWindow().close() };

const refreshWindow = () => { remote.getCurrentWindow().reload() };

const reframeMainWindow = () => { remote.mainWindow({frame: true}) };

//// ========== TUTORIAL ========

const tutorialOpener = () => {
  openModal("tutorial");
  field.value = "";
}

fs.readFile(userDataPath +'/userID/user-id.json',                          // Read the designated datafile
                              'utf8', (err, data) => {                     // Additional options for readFile
  if (err) throw err;
  let user = JSON.parse(data);

  if (user.UserName === "Enter your name") {
    document.getElementById("menu-icon").style.cursor = "not-allowed";
    document.getElementById("option-icon").style.cursor = "not-allowed";
    document.getElementById("tutostartmenu").style.display = "block";
    field.style.pointerEvents = "all";
    field.style.cursor = "pointer";
    field.value = "start tutorial";
    field.addEventListener("click",tutorialOpener);
  } else{
      document.getElementById("menu-icon").onclick = toggleMenu;
      document.getElementById("option-icon").onclick = toggleConsole;
      document.getElementById("menu-icon").style.cursor = "pointer";
      document.getElementById("option-icon").style.cursor = "pointer";
      document.getElementById("version").innerHTML =  user.UserName.toUpperCase();
    }
});

const blinker = (item) => {

let blinking;
let blinking2;

let target = document.getElementById(item);

function blink () {
  blinking = setInterval( function(){
    target.style.backgroundColor = "#141414";
    target.style.color = "white";
        }, 500);
  blinking2 = setInterval(function(){ 
    target.style.backgroundColor = "white";
    target.style.color = "#141414"; },1000);
};

blink();

          target.addEventListener('click', function(){
          clearInterval(blinking);
          clearInterval(blinking2);
          target.style.backgroundColor = "white";
          target.style.color = "#141414";
        });


};

ipcRenderer.on('tutorial', (event,message) => {
  document.getElementById("menu-icon").onclick = toggleMenu;
  document.getElementById("menu-icon").style.cursor = "pointer";
  document.getElementById("option-icon").style.cursor = "pointer";

    switch (message) {

      case "flux":
      case "zoteroImport": 
              openHelper('tutorialHelper',message);
                       blinker("menu-icon");
                       blinker("fluxMenu");
        break;

        case "chronotype": 
        openHelper('tutorialHelper',message);
                 blinker("menu-icon");
                 blinker("type");
                 blinker("chronotype");
                 field.removeEventListener("click", openModal);
        break;

        case "geotype": 
                openHelper('tutorialHelper',message);
                blinker("menu-icon");
                blinker("geotype");
                field.removeEventListener("click", openModal);
        break;

      case "openTutorial": openModal('tutorial');
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

const selectTheme = (themeName) => {
  fs.readFile(userDataPath+"/themes/themes.json",'utf8', (err, data) => {
    var themeData=JSON.parse(data);
         for (let i = 0; i < themeData.length; i++) {
            themeData[i].selected = false;
               if (themeData[i]["theme-name"]===themeName) {
                                    themeData[i].selected = true;
                 }    
              }
   fs.writeFile(
    userDataPath+"/themes/themes.json",
    JSON.stringify(themeData),
    'utf8',
    (err) => {if (err) {ipcRenderer.send('console-logs',JSON.stringify(err))};
  });
  })
};


const loadTheme = () => {

  fs.readFile(userDataPath+"/themes/themes.json",'utf8', (err, data) => {
    var themeData=JSON.parse(data);
         for (let i = 0; i < themeData.length; i++) {
               if (themeData[i].selected===true) {

                  let theme = themeData[i];
                  activeTheme = theme;

                if (theme.hasOwnProperty("script")) { 
                  var themeScripts = require(appPath+"/themes/"+theme["theme-name"]+"/"+theme.script)();
              }

                setTimeout(()=>{      // Give the process enough time to create the relevant DOM elements
                          Array.from(document.getElementsByClassName("themeCustom")).forEach(d=>{
                            Object.assign(document.getElementById(d.id).style, theme[d.id]);
                          })

                          if (document.getElementById("coreCanvas")!=null) {
                          Object.assign(document.getElementById("coreCanvas").style, theme.coreCanvas);
                        }

                        if (theme["theme-background"]!=null){
                          document.getElementById("screenMachine").src = theme["theme-background"];
                        }

                        if (theme["theme-mask"]!=null){
                          document.getElementById("mask").src = theme["theme-mask"];
                        }

                          coreDefW = theme.coreDefW;
                          coreDefH = theme.coreDefH;
                          fullscreenable = theme.fullscreenable;
                },100);
          }
     }
  });
};

window.onload=loadTheme();

let screenZoomToggle = false;

  const zoomThemeScreen = (theme) => {
    if (screenZoomToggle) {
      d3.select("body").transition().duration(2000).style("transform","scale(1,1)");
      document.getElementById("screenMachine").play(); 
      screenZoomToggle = false;
  } else { 
    if (theme.hasOwnProperty("zoom")) {
        d3.select("body").style("transform-origin",theme.zoom["transform-origin"]);
        d3.select("body").transition().duration(2000).style("transform",theme.zoom["transform"]);
        document.getElementById("screenMachine").pause(); 
        screenZoomToggle = true;
    } else {
        field.value = "this theme doesn't support zooming";
    }
   }
  }

const killViews = () => {
  remote.BrowserView.getAllViews().forEach(view=>{
    remote.BrowserView.fromId(view.id).destroy();
  })
  document.getElementById('closeHyphe').remove();

  field.value = "";

};


// ====== KEYBOARD SHORTCUTS ======

document.addEventListener("keydown", event => {

  switch (event.isComposing || event.code) {
    case "Digit1": toggleMenu();
                   break;

    case "Digit2": toggleFlux(); 
                   toggleMenu();
                   break;
    
    case "Digit3": if (toggledMenu===false) { toggleMenu() };
                   categoryLoader('type');
                   break;
      
     case "Backquote": location.reload();
     
                  break; 

    case "Digit5": toggleConsole();
                   break;
  }
});

// ====== PROGRESS BAR ======

const progBarSign = (prog) => {
  prog = parseInt(prog);
  if (prog>100) { prog = 100 };
  document.getElementById("version").style.background = "linear-gradient(0.25turn,rgba(0,0,255,0.3) 0%,rgba(0,0,255,0.3) "+prog+"%,transparent "+(prog+0.1)+"%)";  
}

ipcRenderer.on('progressBar', (event,prog) => {progBarSign(prog)});