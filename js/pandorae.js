//           ______
//          / _____|
//         /  ∖____  Anthropos
//        / /∖  ___|     Ecosystems
//       / /  ∖ ∖__
//      /_/    ∖___|           PANDORÆ
//
//   LICENSE : MIT

// ============ VERSION ===========
const msg = '      ______\n     / _____|\n    /  ∖____  Anthropos\n   / /∖  ___|     Ecosystems\n  / /  ∖ ∖__\n /_/    ∖___|           PANDORÆ\n\n';
const version ='ALPHA/DEV-V0.0.90';

// =========== NODE - NPM ===========
const {remote, ipcRenderer, shell} = require('electron');
const Request = require('request');
const rpn = require('request-promise-native');
const events = require('events');
const fs = require('fs');
const d3 = require('d3');
const THREE = require('three');
const userDataPath = remote.app.getPath('userData');
const QRCode = require('qrcode');
const Dexie = require('dexie');

// =========== DATABASE ===========
    Dexie.debug = true;
 
    let pandodb = new Dexie("PandoraeDatabase");

    let structureV1 = "datasetKind,datasetName,uploadDate";

    pandodb.version(1).stores({
      altmetric: structureV1,
      scopus: structureV1,
      zotero: structureV1,
      twitter: structureV1,
      anthropotype: structureV1,
      chronotype: structureV1,
      geotype: structureV1,
      pharmacotype: structureV1,
      publicdebate: structureV1,
      gazouillotype: structureV1
  });
  
  console.log(pandodb)
    
// =========== SHARED WORKER ===========
if (!!window.SharedWorker) {
var multiThreader = new SharedWorker("js/type/mul[type]threader.js");
    multiThreader.onerror = () => {console.log("Worker error")};
}

// =========== MAIN DISPLAY ===========
console.log(msg+version);
let coreLogoArchive = "";

document.getElementById("version").innerHTML = version;

let coreLogo = ["P","&nbsp;","A","&nbsp;","N","&nbsp;","D","&nbsp;","O","&nbsp;","R","&nbsp;","Æ","&nbsp;","&nbsp;"," ","-"," ","&nbsp;","C","&nbsp;","O","&nbsp;","R","&nbsp;","E"];

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

aelogo.addEventListener('dblclick', ()=>{location.reload()});

// =========== Global Variables ===========
var pandoratio = 0;                         // Used in three.js transitions (from one shape to another)
var chronoLinksKeywords = [];               // Create an array of keywords to be looked for (converted back to Regexp)

// =========== XTYPE ===========
const xtype = document.getElementById("xtype");             // xtype is a div containing each (-type) visualisation
const width = xtype.clientWidth;                            // Fetching client width
const height = xtype.clientHeight;                          // Fetching client height
var xtypeExists = false;                                    // xtype doesn't exist on document load
var coreExists = true;                                      // core does exist on document load

// =========== MENU ===========
let toggledMenu = false;
const purgeMenuItems = (menu) => {
  let menuContent = document.getElementById(menu);
  while (menuContent.firstChild) {menuContent.removeChild(menuContent.firstChild);}
}

const toggleMenu = () => {
  //while(options.length > 0) {options.pop();}
  if (toggledMenu) {
    if (toggledSecondaryMenu) {toggleSecondaryMenu();toggleMenu();}
    else if (toggledTertiaryMenu) {toggleTertiaryMenu();toggleSecondaryMenu();toggleMenu();}
    else {
    document.getElementById("menu").style.left = "-150px";
    document.getElementById("menu-icon").style.left = "25px";
    document.getElementById("option-icon").style.left = "25px";
    document.getElementById("console").style.left = "0px";
    document.getElementById("xtype").style.left = "0px";
        var menuItems = document.getElementsByClassName("menu-item");
        for (let i = 0; i < menuItems.length; i++) {menuItems[i].style.left = "-150px";}
    document.getElementById("logostate").remove();                           // Remove the status svg
    toggledMenu = false;
    }
  }
    else {

      if (xtypeExists) {
        document.body.style.animation="fadeout 0.5s";
        setTimeout(()=>{
          document.body.remove();
          remote.getCurrentWindow().reload();
        }, 450);
      }
      else {
      logostatus();
      document.getElementById("menu").style.left = "0px";
      document.getElementById("console").style.left = "150px";
      document.getElementById("menu-icon").style.left = "175px";
      document.getElementById("option-icon").style.left = "175px";
      document.getElementById("xtype").style.left = "150px";
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
    document.getElementById("xtype").style.left = "150px";
    toggledSecondaryMenu = false;
  }
    else {
      document.getElementById("secmenu").style.left = "150px";
      document.getElementById("console").style.left = "300px";
      document.getElementById("menu-icon").style.left = "325px";
      document.getElementById("option-icon").style.left = "325px";
      document.getElementById("xtype").style.left = "300px";
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
    document.getElementById("xtype").style.left = "300px";
    toggledTertiaryMenu = false;
  }
    else {
      document.getElementById("thirdmenu").style.left = "300px";
      document.getElementById("console").style.left = "450px";
      document.getElementById("menu-icon").style.left = "475px";
      document.getElementById("option-icon").style.left = "475px";
      document.getElementById("xtype").style.left = "450px";
      toggledTertiaryMenu = true;
  }
}

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

const openHelper = (helperFile) => {
  ipcRenderer.send('window-manager',"openHelper",helperFile);
}
const openModal = (modalFile) => {
  ipcRenderer.send('window-manager',"openModal",modalFile);
}
const toggleOptions = () => {openRegular("options");}
const toggleFlux = () => {toggleMenu();displayCore();openModal("flux");}
const toggleHelp = () => {window.open("help.html","_blank");}

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

// ========== TOOLTIP ===========
const createTooltip = () => {
  let tooltip = document.createElement("div");
  tooltip.id = "tooltip";
  document.getElementById("xtype").appendChild(tooltip);
}

const removeTooltip = () => {
  let tooltip = document.getElementById("tooltip");
  document.getElementById("xtype").removeChild(tooltip);
}

// =========== LINKS ===========
var links = {};
var linkedByIndex = {};
const isConnected = (a, b) => linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;

// =========== DRAG =========
function dragged(d) {
  d3.select(this)
      .attr("cx", d.zone = d3.event.x)
      .attr("x", d.zone = d3.event.x);
    }

// ========== TIME ===========
const currentTime = new Date();                           // Precise time when the page has loaded
const Past = d3.timeYear.offset(currentTime,-1);          // Precise time minus one year
const Future = d3.timeYear.offset(currentTime,1);         // Precise time plus one year

// =========== TIME MANAGEMENT ===========
//Parsing and formatting dates
const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%d/%m/%Y");

//locales
const locale = d3.timeFormatLocale({
"dateTime": "%A, le %e %B %Y, %X",
 "date": "%d/%m/%Y",
 "time": "%H:%M:%S",
 "periods": ["AM", "PM"],
 "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
 "Saturday"],
 "shortDays": ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
 "months": ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"],
 "shortMonths": ["Jan.", "Feb.", "Mar", "Avr.", "May", "June", "Jul.","Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
});

const localeFR = d3.timeFormatLocale({
  "dateTime": "%A, le %e %B %Y, %X",
   "date": "%d/%m/%Y",
   "time": "%H:%M:%S",
   "periods": ["AM", "PM"],
   "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi","samedi"],
   "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
   "months": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet","Août", "Septembre", "Octobre", "Novembre", "Décembre"],
   "shortMonths": ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.","Août", "Sept.", "Oct.", "Nov.", "Déc."]
  });

const localeEN = d3.timeFormatLocale({
"dateTime": "%A, le %e %B %Y, %X",
 "date": "%d/%m/%Y",
 "time": "%H:%M:%S",
 "periods": ["AM", "PM"],
 "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
 "Saturday"],
 "shortDays": ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
 "months": ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"],
 "shortMonths": ["Jan.", "Feb.", "Mar", "Avr.", "May", "June", "Jul.","Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
});

const localeZH = d3.timeFormatLocale({
  "dateTime": "%A, le %e %B %Y, %X",
   "date": "%d/%m/%Y",
   "time": "%H:%M:%S",
   "periods": ["AM", "PM"],
   "days": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五","星期六"],
   "shortDays": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
   "months": ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月", "九月", "十月", "十一月", "十二月"],
   "shortMonths": ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月", "九月", "十月", "十一月", "十二月"]
  });

const formatMillisecond = locale.format(".%L"),
    formatSecond = locale.format(":%S"),
    formatMinute = locale.format("%I:%M"),
    formatHour = locale.format("%H"),
    formatDay = locale.format("%d %B %Y"),
    formatWeek = locale.format("%d %b %Y"),
    formatMonth = locale.format("%B %Y"),
    formatYear = locale.format("%Y");

const multiFormat = (date) =>
      (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
      : d3.timeDay(date) < date ? formatHour
      : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
      : d3.timeYear(date) < date ? formatMonth
      : formatYear)(date);

// ========== LEGEND ===========
const legend = [{"legendtitle":"PANDORÆ","legendtitleEN":"PANDORÆ","legendtitleFR":"PANDORÆ","legendtitleZH":"PANDORÆ","Chinaname":"China","USname":"US","Francename":"France","UKname":"UK","Globalname":"Global","Europename":"Europe","ChinanameEN":"China","USnameCM":"US","FrancenameCM":"France","UKnameCM":"UK","GlobalnameCM":"Global","EuropenameCM":"Europe","ChinanameFR":"Chine","USnameZH":"美国","FrancenameZH":"法国","ChinanameZH":"中国","UKnameZH":"英国","GlobalnameZH":"全球","EuropenameZH":"欧洲"}];

d3.select("xtype").append("text").data(legend).attr("class","legende").attr("x", 65).attr("y", 35).attr("style", "font-size: 0.9em;").text("legendtitle");

// ========== CORE SIGNALS ===========

ipcRenderer.on('coreSignal', (event,fluxAction,fluxArgs, message) => {
      try{
      document.getElementById("field").value = message;
      pulse(1,1,10);
    } catch (err){
      document.getElementById("field").value = err;
    } finally{

  }
})

ipcRenderer.on('chaeros-success', (event,message,action) => {
  document.getElementById("field").value = message;
  if (action==="detransfect") {pulse(1,1,10,true);}
});

ipcRenderer.on('chaeros-failure', (event,message) => {
  document.getElementById("field").value = message;
});

ipcRenderer.on('datalist', (event,type,kind,item,path) => {
  if (item !== ".gitignore"){
  let dataset = document.createElement("div");
  dataset.className = "secContentTabs";
  dataset.id = item;
  dataset.innerHTML = item;
  dataset.onclick = function () {selectOption(type,kind,item,path)};
  document.getElementById("secMenContent").appendChild(dataset);
  }
});

// ========== CORE ACTIONS ===========

var commandReturn = "";

const xtypeDisplay = () => {
    document.getElementById("xtype").style.opacity = "1",
    document.getElementById("xtype").style.zIndex = "2",
    commandReturn = "";
    createTooltip();
};

const purgeXtype = () => {
  if (document.getElementById("xtypeSVG")) {
    document.getElementById("xtype").style.zIndex = "-2"                      // Send the XTYPE div to back
    document.getElementById("xtype").removeChild(document.getElementById("xtypeSVG"));
    //document.getElementById("xtypeSVG").remove();                             // Remove the SVG with the current type
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
    ipcRenderer.send('console-logs',"Purging core");
  }

};

var options = [];

const start = (type,options) => {


let argLength = 99;

  switch (type) {
            case '3chronotype':argLength = 1;
            if (options.length === argLength) {
              toggleMenu();
              document.getElementById("field").style.pointerEvents = "all";
              document.getElementById("field").value = "start chronotype";
              document.getElementById("field").addEventListener("click", ()=>{
                        chronotype(options[0]);
                  document.getElementById("field").removeEventListener("click", ()=>
                        chronotype(options[0]));
                  document.getElementById("field").style.pointerEvents = "none";

              }
            );
          }
          break;
            case '2anthropotype': argLength = 1;
            if (options.length === argLength) {
              toggleMenu();
              document.getElementById("field").style.pointerEvents = "all";
              document.getElementById("field").value = "start anthropotype";
              document.getElementById("field").addEventListener("click", ()=>{
                        anthropotype(options[0]);
                  document.getElementById("field").removeEventListener("click", ()=>
                        anthropotype(options[0]));
                  document.getElementById("field").style.pointerEvents = "none";

              }
            );
          }
            break;
            case '4geotype': argLength = 1;
            if (options.length === argLength) {
              toggleMenu();
              document.getElementById("field").style.pointerEvents = "all";
              document.getElementById("field").value = "start geotype";
              document.getElementById("field").addEventListener("click", ()=>{
                        geotype(options[0]);
                  document.getElementById("field").removeEventListener("click", ()=>
                        geotype(options[0]));
                  document.getElementById("field").style.pointerEvents = "none";

              }
            );
          }
          break;
            case '5pharmacotype': argLength = 1;
            if (options.length === argLength) {
              toggleMenu();
              document.getElementById("field").style.pointerEvents = "all";
              document.getElementById("field").value = "start pharmacotype";
              document.getElementById("field").addEventListener("click", ()=>{
                        pharmacotype(options[0]);
                  document.getElementById("field").removeEventListener("click", ()=>
                        pharmacotype(options[0]));
                  document.getElementById("field").style.pointerEvents = "none";

              }
            );
          }
            break;
            case '6publicdebate': argLength = 3;
            if (options.length === argLength) {
              toggleMenu();
              document.getElementById("field").style.pointerEvents = "all";
              document.getElementById("field").value = "start topotype";
              document.getElementById("field").addEventListener("click", ()=>{
                        topotype(options[0],options[1],options[2]);
                  document.getElementById("field").removeEventListener("click", ()=>
                        topotype(options[0],options[1],options[2]));
                  document.getElementById("field").style.pointerEvents = "none";

              }
            );
          }
            break;
            case '9gazouillotype': argLength = 2;
            if (options.length === argLength) {
              toggleMenu();
              document.getElementById("field").style.pointerEvents = "all";
              document.getElementById("field").value = "start gazouillotype";
              document.getElementById("field").addEventListener("click", ()=>{
                        gazouillotype(options[0],options[1]);
                        pulse(1,1,10);
                  document.getElementById("field").removeEventListener("click", ()=>
                        gazouillotype(options[0],options[1]));
                  document.getElementById("field").style.pointerEvents = "none";

              }
            );
          }
             break;
          }



};

const selectOption = (type,kind,item,path) => {
        let selected = {"type":"","kind":"","item":"","path":""};
            selected.type = type;
            selected.kind = kind;
            selected.item = item;
            selected.path = path;

        document.getElementById(item).style.backgroundColor = "darkgrey";

        toggleTertiaryMenu();

        var thirdMenu = document.getElementById("thirdMenuContent");

        const metaGen = (path,count,metaStats) => {

        var qrCanvas = document.createElement("canvas");
        QRCode.toCanvas(qrCanvas, JSON.stringify(metaStats),{width:120}, function (error) {
          if (error) console.error(error)
        })
        qrCanvas.style.padding = "10px";
        thirdMenuContent.appendChild(qrCanvas);

        var metaData = document.createElement("div");
        metaData.style['overflow-wrap']= "break-word";
        metaData.innerHTML =  "<p>"+ count + fileStats;

        let  optionPush = () => {
            options.push(path);
            toggleTertiaryMenu();
            nextOption(type,kind,item,path);
            ipcRenderer.send('console-logs',"Selecting dataset: " + JSON.stringify(selected));

            let availTabs = document.getElementsByClassName("secContentTabs");

            for (var i = 0; i < availTabs.length; i++) {
              if (availTabs[i].id === item) {
                  availTabs[i].selected = true;
              }
              if (availTabs[i].selected === false) {
              availTabs[i].remove();
            }
          }
            start(type,options);
          };

        var optionSelector = document.createElement("button");
        optionSelector.type = "submit";
        optionSelector.innerHTML = "Select dataset";
        optionSelector.className = "flux-button";
        optionSelector.style.margin = "0px 25px";
        optionSelector.addEventListener("click",optionPush);

        thirdMenuContent.appendChild(optionSelector);
        thirdMenuContent.appendChild(metaData);
        }

        const fileMetadata = (path) => {
          let count = "";
          let metaStats = {};
          fs.stat(path, (err, d) => {
            metaStats.size = d.size;
            metaStats.birthtime = d.birthtime;
            fileStats =
            "<br><br><strong>Document size</strong><br>"+ d.size +" bits" +
            "<br><br><strong>Last accessed</strong><br>"+ d.atime +
            "<br><br><strong>Last modified</strong><br>"+ d.mtime +
            "<br><br><strong>Created</strong><br>"+ d.birthtime +
            "<br><br><strong>Owned by</strong><br>"+ d.uid +
            "<br><br><strong>On device</strong><br>"+ d.dev +
            "<br><br><strong>Path</strong><br> <a target='_blank' onClick='shell.showItemInFolder("+JSON.stringify(path)+");'>"+ path +"</a>"+
            "</p>"
          });
          if (path.slice(-4)===".csv"){
          return new Promise((resolve, reject) => {
          let lineCount = 0;
          fs.createReadStream(path)
            .on("data", (buffer) => {
              let idx = -1;
              lineCount--; // Because the loop will run once for idx=-1
              do {
                idx = buffer.indexOf(10, idx+1);
                lineCount++;
              } while (idx !== -1);
            }).on("end", () => {
              resolve(lineCount);

              count = "<strong>CSV line count: </strong>" + lineCount;
              metaStats.fileType = "csv";
              metaStats.lineCount = lineCount;

              metaGen(path,count,metaStats);

            })
          })
        }
        else if (path.slice(-5)===".json"){
          return new Promise((resolve, reject) => {
          let arrayCount = 0;
          fs.createReadStream(path)
            .on("data", (buffer) => {
              arrayCount = buffer.length;
            }).on("end", () => {
              resolve(arrayCount);
              count = "<strong>JSON array object count:</strong> " + arrayCount;
              metaStats.fileType = "json";
              metaStats.lineCount = arrayCount;

              metaGen(path,count,metaStats);
            })

          })
        }
      };

        fileMetadata(path);

        ipcRenderer.send('console-logs',"Checking dataset: " + JSON.stringify(selected));

}

const nextOption = (type,kind) => {

let newKind = parseInt(kind.slice(0,1))+1;

ipcRenderer.send('datalist',{"type":type,"kind":newKind});


}

const loadType = () => {
  xtypeDisplay();
  purgeCore();
  xtypeExists = true;
  coreExists = false;
  document.getElementById("field").value = "";
  while(options.length > 0) {options.pop();}
}

const mainDisplay = (type,options) =>{


  displayCore();
  purgeXtype();
  document.getElementById("field").value = "preparing " + type;
  ipcRenderer.send('console-logs',"Preparing " + type);

    switch (type) {

      case 'chronotype':toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Chronotype Data</strong><br><br>";
                        ipcRenderer.send('datalist',{"type":"3chronotype","kind":1});
                        break;

      case 'anthropotype': toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Anthropotype Data</strong><br><br>";
                        ipcRenderer.send('datalist',{"type":"2anthropotype","kind":1});
                        break;

      case 'geotype': toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Geotype Data</strong><br><br>";
                        ipcRenderer.send('datalist',{"type":"4geotype","kind":1});
                        break;

      case 'pharmacotype':toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Clinical Trials Data</strong><br><br>";
                        ipcRenderer.send('datalist',{"type":"5pharmacotype","kind":1});
                        break;

      case 'topotype': toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Topotype Data</strong><br><br>";
                        ipcRenderer.send('datalist',{"type":"6publicdebate","kind":3});
                        break;

      case 'gazouillotype':toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Gazouilloire Data</strong><br><br>";
                        ipcRenderer.send('datalist',{"type":"9gazouillotype","kind":1});
                        break;

    }

}

const cmdinput = () => {

let commandInput = document.getElementById("field").value;
let cliInput = document.getElementById("cli-field").value;

ipcRenderer.send('console-logs'," user$ "+ commandInput + cliInput);

const loadingType = () => commandReturn = "loading " + commandInput;

switch (commandInput || cliInput) {

    case 'test':
          loadingType();
          break;

    case 'toggle console':
            toggleConsole();
            break;

    case 'toggle menu':
            toggleMenu();
            break;

    case 'help':
            toggleHelp();
            break;

    case 'chronotype':
            mainDisplay('chronotype');
            break;

    case 'pharmacotype':
            loadingType();
            displayPharmacotype();
            break;

    case  'geotype':
          loadingType();
          displayGeotype();
          break;

    case  'anthropotype':
          loadingType();
          displayAnthropotype();
          break;

    case  'sis-hyphe':
          //loadingType();
          //window.location.href = "../sis-hyphe/#/login";
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
          mainWindow.webContents.openDevTools();
          ipcRenderer.send('console-logs',"Opening chromium console.");
          break;

    case  'unlock menu':
          document.getElementById("menu-icon").onclick = toggleMenu;
          document.getElementById("menu-icon").style.cursor = "pointer";
          document.getElementById("option-icon").style.cursor = "pointer";
          document.getElementById("field").removeEventListener("click", ()=>{
              openModal("tutorial");
            })
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

document.getElementById("field").value = commandReturn;

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


// Window management

const closeWindow = () => {
       remote.getCurrentWindow().close();
}

const refreshWindow = () => {
       remote.getCurrentWindow().reload();
}

const reframeMainWindow = () => {
        remote.mainWindow({frame: true})
}

// Tutorial - Uncomment to force tutorial on boot if no user name defined

fs.readFile(userDataPath +'/userID/user-id.json',                          // Read the designated datafile
                              'utf8', (err, data) => {              // Additional options for readFile
  if (err) throw err;
  let user = JSON.parse(data);

if (false
//  user.UserName === "Enter your name"
) {
  document.getElementById("menu-icon").style.cursor = "not-allowed";
  document.getElementById("option-icon").style.cursor = "not-allowed";
  document.getElementById("field").value = "start tutorial";
  document.getElementById("field").style.pointerEvents = "all";
  document.getElementById("field").addEventListener("click", ()=>{
      openModal("tutorial");
    })
  } else{
    document.getElementById("menu-icon").onclick = toggleMenu;
    document.getElementById("menu-icon").style.cursor = "all";
    document.getElementById("option-icon").style.cursor = "all";
  }
});

const blinker = (item) => {

let blinking;
let blinking2;

function blink () {
  blinking = setInterval( function(){
          document.getElementById(item).style.backgroundColor = "#141414";
          document.getElementById(item).style.color = "white";
        }, 500);
  blinking2 = setInterval(function(){ document.getElementById(item).style.backgroundColor = "white";
        document.getElementById(item).style.color = "#141414"; },1000);
};

blink();

        document.getElementById(item).addEventListener('click', function(){
          clearInterval(blinking);
          clearInterval(blinking2);
          document.getElementById(item).style.backgroundColor = "white";
          document.getElementById(item).style.color = "#141414";
        });


};



ipcRenderer.on('tutorial', (event,message) => {
  document.getElementById("menu-icon").onclick = toggleMenu;
  document.getElementById("menu-icon").style.cursor = "all";
  document.getElementById("option-icon").style.cursor = "all";
  let blink = [{"background-color": "#141414","color":"white"},
              {"background-color": "white","color":"#141414"}];

    switch (message) {
      case "openFlux": openHelper('tutorialHelper');
                       blinker("menu-icon");
                       blinker("fluxMenu");

        break;

        case "openTutorial": openModal('tutorial');
                         break;
      default:

    }
});

ipcRenderer.on('window-close', (event,message) => {
  console.log("Closing "+message);
});


// ========= THEMES =======
const normalTheme =
{"theme-name":"normal",
 "theme-type":"basic",
 "theme-background":"img/blank.png",
 "coreCanvas": {"position": "absolute","display": "block","width": "100%","height": "100%","top": "0px","left": "0px","overflow": "hidden","margin":"auto","padding":"0","cursor": "crosshair","z-index": "3","animation": "fadein 0.7s"},
 "screenMachine": {"display": "none"},
 "vignette": {  "display": "none"},

 "core-logo":{"position": "absolute","width": "800px","top":"40%","left":"50%","font-family": "'Noto Sans', 'Noto Sans SC', sans-serif","font-weight": "700","letter-spacing": "7px","font-size": "45px","margin-left":-"400px","text-align": "center","pointer-events": "none","-webkit-user-select": "none","-khtml-user-select": "none","-moz-user-select": "none","-ms-user-select": "none","user-select": "none","z-index": "6","animation": "fadein 0.7s"},

"version":{"position": "absolute","top": "calc(45% + 20px)","left":"70%","font-size": "0.8em","font-weight": "bolder","pointer-events": "none","-webkit-user-select": "none","-khtml-user-select": "none","-moz-user-select": "none","-ms-user-select": "none","user-select": "none","z-index":"6","animation": "fadein 0.7s"},

"field":{"position": "absolute","width":"80%","top":"50%","left":"50%","margin-left":"-40%","border": "0","pointer-events": "none","font-family": "'Noto Sans', 'Noto Sans SC', sans-serif","letter-spacing": "0.15em","font-variant": "small-caps","font-size": "2.4em","height": "2.5em","text-align": "center","padding": "7px","background": "transparent","color": "#000","z-index": "6"},
"coreDefW":512,
"coreDefH":512
}

const minitelMagisTheme = 
{"theme-name":"minitel-magis",
 "theme-type":"cinemagraph",
 "theme-background":"mp4/testBG.mp4",
 "theme-mask":"img/masque.png",
 "screenMachine": {"position": "absolute","display": "block","z-index":1,"top":0,"right":0,"height":"800px"},
 "coreCanvas": {"position": "absolute","display": "block","width": "255px","height": "185px","top": "95px","left": "855px","overflow": "hidden","margin":"auto","padding":"0","cursor": "crosshair","z-index": 2,"animation": "fadein 0.7s","transform": "rotate(3deg) skewX(-2deg)"},
 "vignette": {  "width": "255px","height": "185px","top": "95px","left": "855px","box-shadow": "inset 0 0 50px rgba(0,0,0,0.65)","z-index": 2,"background-color": "rgba(60, 107, 107, 0.10)","position": "absolute","transform": "rotate(3deg) skewX(-2deg)"},

 "core-logo":{"position": "absolute","width": "200px","top":"160px","left":"1280px","font-family": "'Noto Sans', 'Noto Sans SC', sans-serif","font-weight": "700","letter-spacing": "3px","font-size": "10px","text-align": "center","pointer-events": "none","-webkit-user-select": "none","-khtml-user-select": "none","-moz-user-select": "none","-ms-user-select": "none","user-select": "none","z-index": 7,"animation": "fadein 0.7s","transform": "rotate(3deg) skewX(-2deg)"},

 "version":{"position": "absolute","top": "185px","left":"980px","font-size": "4px","font-weight": "bolder","pointer-events": "none","-webkit-user-select": "none","-khtml-user-select": "none","-moz-user-select": "none","-ms-user-select": "none","user-select": "none","z-index":7,"animation": "fadein 0.7s","transform": "rotate(3deg) skewX(-2deg)"},

 "mask":{"display": "block","position": "absolute","top": "0px","left": "0px","z-index": 3,"width": "1200px","height":"800px"},
 
 "field":{"position": "absolute","width":"80%","top":"50%","left":"50%","margin-left":"-40%","border": "0","pointer-events": "none","font-family": "'Noto Sans', 'Noto Sans SC', sans-serif","letter-spacing": "0.15em","font-variant": "small-caps","font-size": "2.4em","height": "2.5em","text-align": "center","padding": "7px","background": "transparent","color": "#000","z-index": "3","transform": "rotate(3deg) skewX(-2deg)"},
 "coreDefW":256,
"coreDefH":256,
"zoom":{"transform-origin":"top right","transform":"scale(2.3,2.3)"},

}



var coreCanvasW = window.innerWidth;
var coreCanvasH = window.innerHeight;

var coreDefW = 512;
var coreDefH = 512;

const loadTheme = (theme) => {
  Array.from(document.getElementsByClassName("screenThemeZoom")).forEach(d=>{
    Object.assign(document.getElementById(d.id).style, theme[d.id]);
  })
  Object.assign(document.getElementById("coreCanvas").style, theme.coreCanvas);

  document.getElementById("screenMachine").src = theme["theme-background"];
  document.getElementById("mask").src = theme["theme-mask"];
  


  
  

  coreDefW = theme.coreDefW;
  coreDefH = theme.coreDefH;
  
  }

let screenZoomToggle = false;

  const zoomThemeScreen = (theme) => {
    if (screenZoomToggle) {
      d3.select("body").transition().duration(2000).style("transform","scale(1,1)");
      screenZoomToggle = false;
  } else {
    d3.select("body").style("transform-origin","top right");
    d3.select("body").transition().duration(2000).style("transform","scale(2,2)");
    screenZoomToggle = true;
  }
  }