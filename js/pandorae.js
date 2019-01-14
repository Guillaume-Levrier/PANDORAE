//           ______
//          / _____|
//         /  ∖____  Anthropos
//        / /∖  ___|     Ecosystems
//       / /  ∖ ∖__
//      /_/    ∖___|           PANDORÆ
//
//   LICENSE : GPLv3

// ============ VERSION ===========
const msg = '      ______\n     / _____|\n    /  ∖____  Anthropos\n   / /∖  ___|     Ecosystems\n  / /  ∖ ∖__\n /_/    ∖___|           PANDORÆ\n\n';
const version ='ALPHA/DEV-V0.0.89';

// =========== NODE - NPM ===========
const {remote, ipcRenderer} = require('electron');
const Request = require('request');
const rpn = require('request-promise-native');
const events = require('events');
const fs = require('fs');
const d3 = require("d3");
const THREE = require('three');
const userDataPath = remote.app.getPath('userData');

// =========== MAIN DISPLAY ===========
console.log(msg+version);
let coreLogoArchive = "";

document.getElementById("version").innerHTML = version;

let coreLogo = ["P","&nbsp;","A","&nbsp;","N","&nbsp;","D","&nbsp;","O","&nbsp;","R","&nbsp;","<div id='A-e' style='margin-left:410px;'>A</div><div id='a-E' style='margin-left:420px;'>E</div>","&nbsp;","&nbsp;"," ","-"," ","&nbsp;","C","&nbsp;","O","&nbsp;","R","&nbsp;","E"];

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
  while(options.length > 0) {options.pop();}
}

const toggleMenu = () => {
  while(options.length > 0) {options.pop();}
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

let toggledSecondaryMenu = false;

const toggleSecondaryMenu = () => {
  purgeMenuItems("secMenContent");
  if (toggledSecondaryMenu) {
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

const openRegular = (regularFile) => {
  let win = new remote.BrowserWindow({
    parent: remote.getCurrentWindow(),
    backgroundColor: 'white',
    resizable: false,
    width: 350,
    height: 700
  })
  win.once('ready-to-show', () => {
  win.show()
})
  var path = 'file://' + __dirname + '/'+ regularFile +'.html';
  win.loadURL(path);
}

const openModal = (modalFile) => {
  let win = new remote.BrowserWindow({
    parent: remote.getCurrentWindow(),
    backgroundColor: 'white',
    modal: true,
    frame: false,
    resizable: false
  })
  var path = 'file://' + __dirname + '/'+ modalFile +'.html';
  win.loadURL(path);
}

const toggleOptions = () => {openRegular("options");}
const toggleFlux = () => {toggleMenu();displayCore();openModal("flux");}
const toggleSettings = () => {openModal("settings");}
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
      console.log(fluxArgs);
      pulse(1,1,10);
    } catch (err){
      document.getElementById("field").value = err;
      console.log(err);
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
  if (xtypeExists) {
    document.getElementById("xtype").style.zIndex = "-2"                      // Send the XTYPE div to back
    document.getElementById("xtypeSVG").remove();                             // Remove the SVG with the current type
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

const selectOption = (type,kind,item,path) => {
        let selected = {"type":"","kind":"","item":"","path":""};
            selected.type = type;
            selected.kind = kind;
            selected.item = item;
            selected.path = path;
            options.push(path);
        document.getElementById(item).style.backgroundColor = "darkgrey";
        ipcRenderer.send('console-logs',"Selecting dataset: " + JSON.stringify(selected));
}

const loadType = () => {
  toggleMenu();
  xtypeDisplay();
  purgeCore();
  xtypeExists = true;
  coreExists = false;
  document.getElementById("field").value = "";
}

const mainDisplay = (type,options) =>{

  displayCore();

  document.getElementById("field").value = "preparing " + type;
  ipcRenderer.send('console-logs',"Preparing " + type);

    switch (type) {

      case 'chronotype':toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Chronotype Data</strong><br><br>Select a bibliography and links and then click <strong><a onclick='chronotype(options[0],options[1])'>Start</a></strong>";
                        ipcRenderer.send('datalist',{"type":"chronotype","kind":"biblio"});
                        ipcRenderer.send('datalist',{"type":"chronotype","kind":"links"});
                        break;

      case 'anthropotype': toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Anthropotype Data</strong><br><br>Select humans, institutions and links and then click <strong><a onclick='anthropotype(options[0],options[1],options[2])'>Start</a></strong>";
                        ipcRenderer.send('datalist',{"type":"anthropotype","kind":"humans"});
                        ipcRenderer.send('datalist',{"type":"anthropotype","kind":"affiliations"});
                        ipcRenderer.send('datalist',{"type":"anthropotype","kind":"links"});
                        break;

      case 'geotype': toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Geotype Data</strong><br><br>Select locations and then click <strong><a onclick='geotype(options[0])'>Start</a></strong>";
                        ipcRenderer.send('datalist',{"type":"geotype","kind":"locations"});
                        break;

      case 'pharmacotype':toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Clinical Trials Data</strong><br><br>Select trials and then click <strong><a onclick='pharmacotype(options[0])'>Start</a></strong>";
                        ipcRenderer.send('datalist',{"type":"pharmacotype","kind":"trials"});
                        break;

      case 'topotype': toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Topotype Data</strong><br><br>Select (lexi) public debate, matching data and community keywords and then click <strong><a onclick='topotype(options[0],options[1],options[2])'>Start</a></strong>";
                        ipcRenderer.send('datalist',{"type":"publicdebate","kind":"pubdeb"});
                        ipcRenderer.send('datalist',{"type":"publicdebate","kind":"links"});
                        break;

      case 'gazouillotype':toggleSecondaryMenu();
                        document.getElementById('secMenTopTab').innerHTML = "<strong>Select Gazouilloire Data</strong><br><br>Select a dataset and then click <strong><a onclick='gazouillotype(options[0],options[1])'>Start</a></strong>";
                        ipcRenderer.send('datalist',{"type":"gazouillotype","kind":"datasets"});
                        ipcRenderer.send('datalist',{"type":"gazouillotype","kind":"query"});
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
          location.reload();
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

    case  'detransfect':
          pulse(0,10,false);
          break;

    case  'chromium console':
          commandReturn = "opening chromium console";
          mainWindow.webContents.openDevTools();
          ipcRenderer.send('console-logs',"Opening chromium console.");
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
