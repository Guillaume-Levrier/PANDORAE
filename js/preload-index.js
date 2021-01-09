// =========== DATABASE ===========
const Dexie = require("dexie");

Dexie.debug = false;

let pandodb = new Dexie("PandoraeDatabase");

let structureV1 = "id,date,name";

pandodb
  .version(1)
  .stores({
    enriched: structureV1,
    scopus: structureV1,
    csljson: structureV1,
    zotero: structureV1,
    twitter: structureV1,
    anthropotype: structureV1,
    chronotype: structureV1,
    geotype: structureV1,
    pharmacotype: structureV1,
    publicdebate: structureV1,
    gazouillotype: structureV1,
    hyphe: structureV1,
    system: structureV1
  });
pandodb
  .version(2)
  .stores({
    hyphotype: structureV1,
    enriched: structureV1,
    scopus: structureV1,
    csljson: structureV1,
    zotero: structureV1,
    twitter: structureV1,
    anthropotype: structureV1,
    chronotype: structureV1,
    geotype: structureV1,
    pharmacotype: structureV1,
    publicdebate: structureV1,
    gazouillotype: structureV1,
    hyphe: structureV1,
    system: structureV1
  });
  
  pandodb
  .version(3)
  .stores({
    filotype: structureV1,
    doxatype: structureV1,
    hyphotype: structureV1,
    enriched: structureV1,
    scopus: structureV1,
    csljson: structureV1,
    zotero: structureV1,
    twitter: structureV1,
    anthropotype: structureV1,
    chronotype: structureV1,
    geotype: structureV1,
    pharmacotype: structureV1,
    publicdebate: structureV1,
    gazouillotype: structureV1,
    hyphe: structureV1,
    system: structureV1
  });

  pandodb
  .version(4)
  .stores({
    filotype: structureV1,
    doxatype: structureV1,
    hyphotype: structureV1,
    enriched: structureV1,
    scopus: structureV1,
    csljson: structureV1,
    zotero: structureV1,
    twitter: structureV1,
    anthropotype: structureV1,
    chronotype: structureV1,
    geotype: structureV1,
    pharmacotype: structureV1,
    publicdebate: structureV1,
    gazouillotype: structureV1,
    hyphe: structureV1,
    system: structureV1,
    slider:structureV1
  });

  pandodb
  .version(5)
  .stores({
    filotype: structureV1,
    doxatype: structureV1,
    hyphotype: structureV1,
    enriched: structureV1,
    scopus: structureV1,
    csljson: structureV1,
    zotero: structureV1,
    twitter: structureV1,
    anthropotype: structureV1,
    chronotype: structureV1,
    geotype: structureV1,
    pharmacotype: structureV1,
    publicdebate: structureV1,
    gazouillotype: structureV1,
    hyphe: structureV1,
    system: structureV1,
    slider:structureV1
  });

  pandodb.open();const CMT = {"EN":{
        "menu":{
            "flux":"flux",
            "type":"type",
            "slide":"slide",
            "quit":"quit"
        },
        "global":{
            "coreLogo":["P","&nbsp;","A","&nbsp;","N","&nbsp;","D","&nbsp;","O","&nbsp;","R","&nbsp;","Æ","&nbsp;"," ","-"," ","&nbsp;","C","&nbsp;","O","&nbsp;","R","&nbsp;","E"],
            "field":{
            "starting":"starting",
            "error": "system error",
            "workerError":"multithreading disabled",
            "loading":"loading"
            }
        },"mainField":{
            "changeTheme": "change theme ",
            "invalidTheme": "invalid theme name",
            "toggleConsole": "toggle console",
            "toggleMenu": "toggle menu",
            "reload": "reload",
            "fullscreen":"fullscreen",
            "restart":"restart",
            "reloadCore":"reload core",
            "openDevtools":"open devtools",
            "unlockMenu":"unlock menu",
            "version":"version",
            "returnTutorial":"return to tutorial",
            "startTutorial":"start tutorial",
            "comNotFound":"command not found"
        },
            "console":{
                "starting":["Starting process "," using dataset "],
                "error":["SYSTEM ERROR - PANDORÆ was unable to perform this task. The dataset might be incompatible with your request."],
                "workerError":["The SharedWorker failed to start. Processes requiring multithreading will be unavailable."],
                "workerValidation":["Multithreading enabled."],
                "menu":{
                    "opening":"Opening menu",
                    "closing":"Collapsing menu"
                }
        },
        "chaeros":{ 
            "field":{

            },
            "console":{

        }},
        "flux":{
            "divs":{
                "hyphendpoint":"Enter your Hyphe endpoint below :"
            }, 
            "field":{

        },
        "console":{

        }},
        "types":{ 
        "console":{

        },
        "tooltip":{

        }
    },
    "tutorial":{
        "sections":{
            "mainTitle":"<div style='text-align:center'><div class='title' style='font-size:36px;font-weight: bold;'>Welcome to PANDORÆ</div><br><i class='material-icons arrowDown'><a class='arrowDown' onclick='smoothScrollTo(\"slide2\")'>arrow_downward</a></i></div>",
            "slide2":"<div style='text-align:center'><span class='title'>This short tutorial will guide your first steps with PANDORÆ.</span><br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"slide2bis\")'>arrow_downward</a></i></div>",
            "slide2bis":"<div style='text-align:center'><span class='title'>As you noticed, you can click on the <strong>arrows</strong> to go down or back.</span><br><br>You can also use your <strong>mouse wheel</strong> to navigate up and down.&nbsp;<br><br>            You can skip specific chapters and come back to this <strong>tutorial</strong> later.<br><br>            If you're unsure of how to proceed, you can watch the step-by-step video of this tutorial while you interact with it.<br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"slide3\")'>arrow_downward</a></i></div>",
            "slide3":"<div style='text-align:center'><span class='title'>PANDORÆ is a <strong>data retrieval & exploration tool.</strong></span><br><br>You can use it for many purposes, like building a <strong>literature review</strong>.<br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"slide4\")'>arrow_downward</a></i></div>",
            "slide4":"<div style='text-align:center'><span class='title'>PANDORÆ  allows you to perform three main kinds of operations :</span><br><br><a onclick=\"smoothScrollTo('Chapter1')\">Load & enrich data</a><br><br><a onclick=\"smoothScrollTo('Chapter2')\">Explore data</a><br><br><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Chapter1\")'>arrow_downward</a></i></div>",
            "Chapter1":"<span class='title'><strong>Chapter 1: Loading & enriching data</strong></span><br><br>PANDORÆ enables you to load data from different types of sources.<br><br>Those sources can be online databases that aggregate documents such as scientific articles.<br> <br>But you can really add <strong>any kind of document</strong>.<br><br>PANDORÆ also supports other types of data, such as those extracted from social-media or clinical trials.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"flux\")'>arrow_downward</a></i></div>",
            "flux":"<span class='title'><strong>Cascade: Available data flows</strong></span><br><br><div style='display: inline-flex'><div style='flex:auto'>   <strong>Cascade</strong> is how Flux displays its data flows. As you can see, the data flows from you to the system. Hovering a process shows to which other process it is linked.  <br>&nbsp;<br> Cascade behaves like menu : click on a process and its options will be displayed.<br>&nbsp;<br>Click <a onclick='tuto(\"flux\");'>here</a> to learn how to open Flux.<br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"flux2\")'>arrow_downward</a></i></div></div><div style='flex:auto'><svg></svg></div></div><br>&nbsp;<br>",
            "flux2":"<span class='title'><strong>Flux sections</strong></span><br><br>Flux has different types of processes. Each section has its own purpose, and relies on different services:<ul style='list-style-type: square;'><li><a onclick='smoothScrollTo(\"user\")'>User</a> lets you insert your API keys and credentials.</li><li><a onclick='smoothScrollTo(\"databases\")'>Databases requests</a> allow you to retrieve data from various online sources.</li><li><a onclick='smoothScrollTo(\"enriching\")'>Enriching</a> allows you to edit and enrich datasets.</li><li><a onclick='smoothScrollTo(\"system\")'>System</a> sends your data to PANDORAE visualisation features.</li></ul>Detail about the other sections will become available when they will be rolled out. Click on a section name to learn more about that section right now, or simply click on the arrow to continue.   <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"databases\")'>arrow_downward</a></i></div>",
            "databases":"<span class='title'><strong>Databases</strong></span><br><br><div>Online databases can handle precise requests and return articles relevant to your needs. Many services exist, but PANDORÆ currently only supports Scopus. In order to start using PANDORÆ and Scopus, you will need to retrieve an <a onclick='shell.openExternal(\"https://dev.elsevier.com/\")'>API key</a> and insert it in Flux's USER tab.<br>&nbsp;<br> <br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Enriching\")'>arrow_downward</a></i></div></div>",
            "Enriching":"<span class='title'><strong>Enriching data</strong></span><br><br><strong>Flux</strong> enables you do retrieve data from different kinds of <a onclick='smoothScrollTo(\"Bibliometric-databases\")'>databases</a>. Articles can be <a onclick='smoothScrollTo(\"enrichment\")'>enriched</a> by <strong>geolocating</strong> their affiliation and retrieving additional <strong>metadata</strong>. But you will often have to curate your data and enrich its content by hand. PANDORÆ therefore helps you send your datasets to <a onclick='smoothScrollTo(\"Zotero1\")'>Zotero</a> and download them back into the system when you're done cleaning your dataset.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"enrichment\")'>arrow_downward</a></i></div>",
            "enrichment":"<span class='title'><strong>Enrichment</strong></span><br><br>Enrichment builds upon the datasets you obtained by requesting bibliometric databases. <br>&nbsp;<br>It will give you the opportunity to retrieve the geographic coordinates of each paper's affiliation(s), which in turn will allow <a onclick='smoothScrollTo(\"geotype\")'>Geotype</a> to display those on a map. <br>&nbsp;<br>It can also retrieve Altmetric metadata, which might need an <a onclick='shell.openExternal(\"https://www.altmetric.com/\")'>API key</a>.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Zotero1\")'>arrow_downward</a></i></div>",
            "Zotero1":"<span class='title'><strong>Zotero</strong></span><br><br><strong>Zotero</strong> is an open-source software designed to manage bibliographic data and references. It supports CSL-JSON datasets.       <br>&nbsp;<br> PANDORÆ converts data retrieved from <a onclick='smoothScrollTo(\"Bibliometric-databases\")'>databases</a> to this format.     <br>&nbsp;<br> Using Zotero, you can explore, edit and curate those datasets. <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Zotero2\")'>arrow_downward</a></i></div>",
            "Zotero2":"<span class='title'><strong>Creating a Zotero account</strong></span><br><br>You can create a free zotero account at <a onclick='shell.openExternal(\"https://www.zotero.org/\")'>https://www.zotero.org/</a>. <br>&nbsp;<br> Once that is done, you will need to set up a <a onclick='shell.openExternal(\"https://www.zotero.org/groups/\")'>group library</a> and retrieve a read/write API key.<br>&nbsp;<br> <strong>But for now,</strong> you can just click <a onclick='tuto(\"zoteroImport\")'>here</a> to learn how to use Zotero with PANDORÆ with <strong>sample data</strong> instead.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"Chapter2\")'>arrow_downward</a></i></div>",
            "Chapter2":"    <span class='title'><strong>Chapter 2: Exploring data</strong></span><br><br> PANDORÆ's main purpose is to enable you to explore large and/or complex datasets. It features several different kinds     of '<strong>types</strong>', that is ways to display your data:      <li><a onclick='smoothScrollTo(\"chronotype\")'>Chronotype</a> puts different corpuse of documents on a same timeline for you to compare their size and content.</li>      <li><a onclick='smoothScrollTo(\"geotype\")'>Geotype</a> draws a globe and displays scholarly paper's affiliation cities, institutions, and who cooperates with whom.</li>           <br>      Other features are documented on the <a onclick='shell.openExternal(\"https://github.com/Guillaume-Levrier/PANDORAE/wiki\")'>wiki</a>. Please note you need to resize your window <strong>before</strong> loading a <strong>types</strong>.  <br>&nbsp;<br>    <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"chronotype\")'>arrow_downward</a></i></div>",
            "chronotype":"    <span class='title'><strong>Chronotype</strong></span><br><br>The <strong>chronotype</strong> displays one to seven Zotero collections at a time. Each collection is a vertical line. Each node on this line is a cluster of documents published      on that month. Clicking the node opens the cluster, revealing the documents. Hovering a document shows its metadata. Clicking it leads to its content, if available.  <br>&nbsp;<br>      Click <a onclick='tuto(\"chronotype');'>here</a> to try the chronotype if you already loaded the sample datasets. If not, click <a onclick='smoothScrollTo(\"Zotero2\")'>here</a> to do so.      <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"geotype\")'>arrow_downward</a></i></div>",
            "geotype":"      <span class='title'><strong>Geotype</strong></span><br><br>        The <strong>geotype</strong> displays a globe on which available affiliations are geolocated. Affiliations having cooperated on a paper listed in the dataset are linked in red.          <br>&nbsp;<br>        Click <a onclick='tuto(\"geotype');'>here</a> to try to the geotype if you already loaded the sample datasets. If not, click <a onclick='smoothScrollTo(\"Zotero2\")'>here</a> to do so.        <br>&nbsp;<br>  <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"FinalChap\")'>arrow_downward</a></i></div>",
            "FinalChap":"<div style='text-align:center'><span class='title'><strong>Final Chapter: the great escape</strong></span><br><br>      Our short journey together is about to come to an end.<br>&nbsp;<br>       It is now time for you to learn how to escape the Tutorial's constraint.       <br>&nbsp;<br>      Time to break free.      <br>&nbsp;<br><div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final2\")'>arrow_downward</a></i></div></div>",
            "final2":"<div style='text-align:center'><span class='title'><strong>USER wants to break free</strong></span><br><br>        You might have noticed when you first started PANDORÆ that your possibilities were limited. <br>&nbsp;<br>        The <i  class='material-icons'>menu</i> <strong>menu</strong> button was 'forbidden', the <i  class='material-icons'>code</i> <strong>console</strong>  button too. <br>&nbsp;<br>        Your only option was to start the tutorial. Let's change that.        <br>&nbsp;<br>  <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final3\")'>arrow_downward</a></i></div></div>",
            "final3":"<div style='text-align:center'><span class='title'><strong>Back to Flux-ture</strong></span><br><br>          PANDORÆ starts in tutorial mode when it detects that no user name has been entered. <br>&nbsp;<br>          To turn off the tutorial mode, go back to <a onclick='smoothScrollTo(\"flux\")'>Flux</a>, go to the USER section, enter a user name. Do not forget to click the 'Update User Credentials' button. <br>&nbsp;<br>          Then come back here.<br>&nbsp;<br>    <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final4\")'>arrow_downward</a></i></div></div>",
            "final4":"<div style='text-align:center'><span class='title'><strong>The main field</strong></span><br><br>            PANDORÆ communicates with you by displaying messages in the main field, on the main screen. You can also write in this field to communicate with PANDORÆ. <br>&nbsp;<br>            To select the field, push your <strong>TAB</strong> key after clicking on the main screen. You can then enter commands and push the <strong>ENTER</strong> key. <br>&nbsp;<br>      <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final5\")'>arrow_downward</a></i></div></div>",
            "final5":"<div style='text-align:center'><span class='title'><strong>Entering commands</strong></span><br><br>             If your menu is locked, you can use the &nbsp;<span class='commands'>unlock menu</span>&nbsp; command. <br>&nbsp;<br>             It also works in the console.             <br>&nbsp;<br>             You can also change PANDORÆ's theme with the &nbsp;<span class='commands'>change theme</span>&nbsp; command. <br>&nbsp;<br>             Try with &nbsp;<span class='commands'>change theme blood-dragon</span>&nbsp; for example. You can switch back with &nbsp;<span class='commands'>change theme normal</span>. <br>&nbsp;<br>                <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final6\")'>arrow_downward</a></i></div></div>",
            "final6":"<div style='text-align:center'><span class='title'><strong>Call me ...  maybe?</strong></span><br><br>            If you ever miss the tutorial, or want to check one of its chapter, you can use the             &nbsp;<span class='commands'>start tutorial</span>&nbsp; command.<br>&nbsp;<br> You will always be welcome here.<br>&nbsp;<br>                <div class='arrowDown'><i class='material-icons'><a class='arrowDown' onclick='smoothScrollTo(\"final7\")'>arrow_downward</a></i></div></div>",
            "final7":"<div style='text-align:center'><span class='title'><strong>Freedom at last</strong></span><br><br>           You will learn how to use PANDORÆ mostly by trial and error.<br>&nbsp;<br> If you're a researcher and/or developer, you might want to go have a look at its            <a onclick='shell.openExternal(\"https://github.com/Guillaume-Levrier/PANDORAE\")'>source code</a>.<br>&nbsp;<br>           A wiki of the project is available <a onclick='shell.openExternal(\"https://github.com/Guillaume-Levrier/PANDORAE/wiki\")'>here</a>.           <br>&nbsp;<br>           <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' onclick='lastScroll()'>arrow_downward</a></i></div></div>",
            "final8":"<div style='text-align:center'>This <strong>CORE</strong> is now yours. <br>&nbsp;<br>           Close the software and restart it to escape the tutorial.<br>&nbsp;<br>           Thank you for using PANDORÆ.<br><br>                    <div id='restartCount' style='font-weight: bolder'></div></div>",
            "last":"<div style='margin:auto;font-size:10px;line-height: 15px;'>PANDORÆ - version 1 <br>Guillaume Levrier</div>"
        }

        }
    
},
"FR":{
    "menu":{
        "flux":"flux",
        "type":"type",
        "quit":"quitter",
        "returnToTutorial":"retour au tutoriel"
    },

    "tutorial":{
        "sections":{
           
        }
    }
 },"中文":{
    "menu":{
        "flux":"流动",
        "type":"类型",
        "quit":"关闭",
        "returnToTutorial":"回教程"
    }
 }
}//           ______
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
const userDataPath = ipcRenderer.sendSync('remote', 'userDataPath'); // Find userData folder Path
const appPath = ipcRenderer.sendSync('remote', 'appPath');
const types = require("./js/types");
const fs = require("fs");
const d3 = require("d3");
const THREE = require("three");
const Quill = require("quill");
const { zoomIdentity } = require("d3");
var dispose = false;

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
var presentationStep = [];

var tutoSlide;

// =========== LANGUAGE SELECTION ===========
var CM = CMT["EN"];                                            // Load the EN locale at start
fs.readFile(userDataPath + "/userID/user-id.json", "utf8",     // Check if the user uses another one
      (err, data) => {
        data = JSON.parse(data);
        if (data.locale){
          CM = CMT[data.locale]
        } else {
          CM=CMT.EN
        }
      })

const populateLocale = divlist => {
   divlist.forEach(div=>{
    document.getElementById(div.id).innerText=CM.menu[div.path];
  })

}

var divlist = [
  {id:"fluxMenu",path:"flux"},
  {id:"type",path:"type"},
  {id:"slideBut",path:"slide"},
  {id:"quitBut",path:"quit"},
  {id:"tutostartmenu",path:"returnToTutorial"}
]

populateLocale(divlist)


document.getElementById("lang").childNodes.forEach(lg=>{
  lg.addEventListener("click",e=>{
    CM=CMT[lg.innerText];
    populateLocale(divlist)
    fs.readFile(userDataPath + "/userID/user-id.json", "utf8",
      (err, data) => {
        data = JSON.parse(data);
        data.locale=lg.innerText;
        data = JSON.stringify(data);
        fs.writeFile(userDataPath + "/userID/user-id.json", data, "utf8", err => {
          if (err) throw err;
        });
      })
  })
})



// =========== SHARED WORKER ===========
// Some datasets can be very large, and the data rekindling necessary before display that
// couldn't be done in Chaeros can be long. In order not to freeze the user's mainWindow,
// most of the math to be done is sent to a Shared Worker which loads the data and sends
// back to Types only what it needs to know.
if (!!window.SharedWorker) {
  // If the SharedWorker doesn't exist yet
  
  var multiThreader = new Worker('js/mul[type]threader.js'); // Create a SharedWorker named multiThreader based on that file

  //console.log(multiThreader)

  multiThreader.postMessage({type:"checkup", validation:CM.console.workerValidation});

  multiThreader.onmessage = res => {

    // If multiThreader sends a message
    if (res.data.type === "notification") {
      // And the type property of this message is "notification"
      ipcRenderer.send(res.data.dest, res.data.msg); // Send the notification to the main process for dispatch
    }

  };

  multiThreader.onerror = err => {
    // If the multiThreader reports an error
    ipcRenderer.send("audio-channel", "error");
    field.value=CM.global.field.workerError;
    ipcRenderer.send("console-logs", CM.console.workerError); // Send an error message to the console
    ipcRenderer.send("console-logs", JSON.stringify(err)); // Send the actual error content to the console
  };

}

// =========== MAIN LOGO ===========
// Main logo is a text that can be changed through the nameDisplay function
let coreLogoArchive = "";

document.getElementById("version").innerHTML = version;

let coreLogo = CM.global.coreLogo;

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
      {name:"step-icon",code:"aspect_ratio"},
      {name:"sort-icon",code:"shuffle"},
      {name:"align-icon",code:"toc"},
      {name:"tutoSlide-icon",code:"create"},
      {name:"save-icon",code:"save"},
      {name:"back-to-pres",code:"arrow_back_ios"}

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
    pulse(1, 1, 10,true);
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
document.getElementById('slideBut').addEventListener('click',e=>categoryLoader('slide'));
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
  pulse(1, 1, 10,message);
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

    // If the mainSlideSections DIV is removed, the slider detects it as sliding back to 1st slide.
    // So the cheapest solution is probably to "deep copy" the element storing the current slide,
    // remove the div, then wait for the slider to "acknowledge" that it's gone back to the 1st slide,
    // and only then replace that information with the copy we had stored in the first place.

    let currentStepBuffer = JSON.parse(JSON.stringify(currentMainPresStep))
    document.getElementById("mainSlideSections").remove();
    setTimeout(() => {
      currentMainPresStep = currentStepBuffer;
    }, 200);

    field.style.display = "none";

    Array.from(document.getElementsByClassName("purgeable")).forEach(d => {
      document.body.removeChild(document.getElementById(d.id));
      d3.select(d.id).remove();
    });
  }
};

var quillEdit;

ipcRenderer.on("backToPres", (event, message) => {
  setTimeout(() => {
    populateSlides(message.id);
    setTimeout(() => { // the DOM needs to be there
      smoothScrollTo(message.step);
      document.body.style.overflow="auto"
    }, 1500);
  }, 200);
});

const selectOption = (type, id) => {
  if (typeSelector) {
    let order = "[actionType:"+JSON.stringify(type)+","+JSON.stringify(id)+"/actionType]";
    let editor =document.getElementsByClassName("ql-editor")[0]
    editor.innerHTML=editor.innerHTML+order;
    typeSelector=false;
    toggleMenu();
  } else {

  if (toggledMenu) {toggleMenu();}

  document.getElementById("menu-icon").onclick = "";
  document.getElementById("menu-icon").addEventListener(
    "click",
    () => {
      location.reload();
    },
    { once: true }
  );
  field.value = CM.global.field.starting + type;
  currentType = {type:type,id:id}
  types.typeSwitch(type, id);
  ipcRenderer.send("audio-channel", "button2");
  pulse(1, 1, 10);
  ipcRenderer.send(
    "console-logs",
    CM.console.starting[0]+ type + CM.console.starting[1] + JSON.stringify(id)
  );
  }
};

// ========== MAIN MENU OPTIONS ========
let notLoadingMenu=true;

const categoryLoader = cat => {

if (notLoadingMenu) {

  purgeMenuItems("secMenContent");

  notLoadingMenu=false;

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
      let loadingCount=0;
      ipcRenderer.send("console-logs", "Displaying available types");
      blocks.forEach(block => {
        pandodb[block].count().then(thisBlock => {
          if (thisBlock > 0) {
            let typeContainer = document.createElement("div");
            typeContainer.style.display = "flex";
            typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
            typeContainer.id = block;
            typeContainer.className += "tabs menu-item";
            typeContainer.innerText = block;
            typeContainer.addEventListener("click",e=>{mainDisplay(block);})
            document.getElementById("secMenContent").appendChild(typeContainer);
            loadingCount+=1;
            if (loadingCount===blocks.length){notLoadingMenu=false;}
            else {notLoadingMenu=true}
          }
        });
      });
      break;
      case "slide":
      blocks=['load','edit','create'];

      blocks.forEach(thisBlock => {
        let typeContainer = document.createElement("div");
        typeContainer.style.display = "flex";
        typeContainer.style.borderBottom = "1px solid rgba(192,192,192,0.3)";
        typeContainer.id = thisBlock;
        typeContainer.className += "tabs menu-item";
        typeContainer.innerText = thisBlock;
        typeContainer.addEventListener("click",e=>{slideDisp(thisBlock);})
        document.getElementById("secMenContent").append(typeContainer);
  });
  notLoadingMenu=true;
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
          notLoadingMenu=true;
                  break;
  }
    toggleSecondaryMenu();
}
};

const listTableDatasets = table => {
  let targetType = pandodb[table];

  targetType.toArray().then(e => {
    if (e.length===0){
      pulse(10,1,1,true);
      field.value = "no dataset in " + table;
        ipcRenderer.send(
          "console-logs",
          "No dataset in " + table
        );
    } else {

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
        if (table==="slider") {
          dataset.onclick = function() {
            populateSlides(d.id);
            toggleMenu();
          };
        } else {
          dataset.onclick = function() {
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
        if (table==="slider") {
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

const saveSlides = () => {
  let name = document.getElementById("presNamer").value;
  mainPresContent[activeIndex].text=document.getElementsByClassName("ql-editor")[0].innerHTML;
  let date = new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();
  if (priorDate) {
    date =priorDate;
  }
  let id = name + date;
  pandodb.slider.put({ id: id, date: date, name: name, content: mainPresContent });
}

var typeSelector = false

const typeSelect = () => {
  toggleMenu();
  typeSelector=true;
  categoryLoader("type")
}

var mainPresContent = [];
var mainPresEdit=false;
var priorDate=false;

const slideCreator = () => {

  nameDisplay("")
  document.getElementById("version").innerHTML="";
  field.style.display="none";
  document.removeEventListener("keydown",keyShortCuts);
  document.getElementById('menu-icon').addEventListener("click", ()=>{
    document.body.style.animation = "fadeout 0.1s";
    setTimeout(() => {
      document.body.remove();
      location.reload();
    }, 100);
  })

  iconCreator("save-icon",saveSlides)

  var quillCont = document.createElement("div");
  quillCont.style.margin="15%";
  quillCont.style.width="70%";
  quillCont.style.height="400px";
  quillCont.style.backgroundColor="white";
  quillCont.style.zIndex="7";
  quillCont.style.pointerEvents="all";
  quillCont.style.position="fixed";

  var textCont = document.createElement("div")
  textCont.id = "textcontainer";
  textCont.style="background-color:rgba(0, 10, 10, .8);padding:10px;color:white;";

  quillCont.appendChild(textCont);

  document.getElementById("mainSlideSections").appendChild(quillCont);
  quillEdit = new Quill('#textcontainer', {
    modules: {
      toolbar: [
        [{ header: [1, 2,3, false] }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block','link'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
      ]},
        placeholder: '',
        theme: 'snow'
      });

      var slideToolbar = document.createElement("div");
      slideToolbar.style.float="right";
      slideToolbar.innerHTML = "<input type='field' placeholder='Presentation name' id='presNamer'>"+
                               " <input type='button' id='▲' value='▲'>"+
                               " <input type='button' id='▼' value='▼'>"+
                               " <input type='button' id='+' value='+'>"+
                               " <input type='button' id='-' value='-'>"+
                               " <input type='button' id='typeSelector' value='TYPE'>"+
                               " <input type='field' placeholder='Slide reference name' value='begin' id='slidetitle'>"

mainPresContent.push({title:"begin",text:""})

document.getElementsByClassName("ql-toolbar")[0].appendChild(slideToolbar)
document.getElementById("typeSelector").addEventListener("click",typeSelect)
document.getElementById("▲").addEventListener("click",e=>{slideSaver(-1)})
document.getElementById("▼").addEventListener("click",e=>{slideSaver(1)})
document.getElementById("+").addEventListener("click",e=>{

  let newSlideTitle="slide"+parseInt(activeIndex+1);
                                    mainPresContent.splice(activeIndex+1,0,{title:newSlideTitle,text:""});
                                    slideSaver(1)
  //                                  activeIndex+=1;
                                  })
document.getElementById("-").addEventListener("click",e=>{
                                    mainPresContent.splice(activeIndex,1);
                                    slideSaver(-1);
                                  })

      const slideSaver = delta => {

         let editor =document.getElementsByClassName("ql-editor")[0]
        let slidetitle = document.getElementById("slidetitle");
        if (activeIndex>-1) {

         // save current slide
        mainPresContent[activeIndex].title=slidetitle.value;
        mainPresContent[activeIndex].text=editor.innerHTML;
        // add delta
        activeIndex+=delta;
        // display next slide
        slidetitle.value=mainPresContent[activeIndex].title;
        editor.innerHTML=mainPresContent[activeIndex].text;
      }
      }
}

const slideDisp = (block) => {

  document.body.style.overflow="auto";

switch (block) {
  case "load":
    field.value = "loading presentations";
    listTableDatasets("slider")
    toggleTertiaryMenu();

    break;
    case "edit":
      field.value = "loading presentations";
      mainPresEdit=true;
      listTableDatasets("slider")
      toggleTertiaryMenu();
      break;
    case "create":
      slideCreator();
      toggleMenu();
    break;
}
}

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


const savePNG = () => {
  document.getElementById('icons').style.display = "none";

  document.getElementById('tooltip').style.overflow = "hidden";

  var datasetName =document.getElementById('source').innerText.slice(8);
  datasetName = datasetName.replace(/\//ig,"_");
  datasetName = datasetName.replace(/:/ig,"+");

  ipcRenderer.invoke("savePNG",{defaultPath:datasetName+".png"}).then(res=>{
    document.getElementById('icons').style.display = "block";
    document.getElementById('tooltip').style.overflow = "auto";
  })
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


    ipcRenderer.send("console-logs", "Exporting snapshot of current type to SVG.");
    ipcRenderer.invoke("saveSVG",{defaultPath:datasetName+".svg"},string).then(res=>{

    })
    

}


const exportToHTML=()=>{

 var datasetName =document.getElementById('source').innerText.slice(8);

 ipcRenderer.invoke("saveHTML",{"defaultPath":"PANDORAE-"+currentType.type+".html"}).then(res=>{

 let HTMLFILE = fs.createWriteStream(res.filePath)

 HTMLFILE.write('<!DOCTYPE html><html><meta charset="UTF-8">')
 HTMLFILE.write('<title>PANDORÆ - '+datasetName+'</title>')
 HTMLFILE.write('<div id="step-icon" class="themeCustom" ><i class="material-icons">control_camera</i></div><div><form autocomplete="off"><input class="themeCustom" spellcheck="false" type="text" maxlength="36" id="field" value=""></div><div id="xtype">')



 fs.readFile(appPath+'/svg/pandorae-app-logo.svg',"utf-8",(err,pandologo)=>{
  HTMLFILE.write(pandologo)

  var logoSettings = '<script>var logo = document.getElementById("pandoraeapplogo");logo.style.zIndex=10;logo.style.padding="5px";logo.style.width="15px";logo.style.height="15px";logo.style.cursor="pointer";logo.style.position="absolute";logo.addEventListener("click",e=>{window.open("https://guillaume-levrier.github.io/PANDORAE/")})</script>';

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

})

}


// TUTORIAL

const openTutorial = (tutoSlide) => {
  if (tutoSlide) {
  ipcRenderer.send("window-manager","openModal","tutorial",tutoSlide);
} else {
  ipcRenderer.send("window-manager","openModal","tutorial");
}
}


const mainDisplay = type => {
  field.value = "preparing " + type;
  ipcRenderer.send("console-logs", "Preparing " + type);
  displayCore();
  purgeXtype();
  toggleTertiaryMenu();
  listTableDatasets(type);
};

field.addEventListener("click", ()=>{cmdinput(field.value)});

// ========== MAIN FIELD COMMAND INPUT ========

var menuIcon = document.getElementById("menu-icon");
var consoleIcon = document.getElementById("option-icon");

const cmdinput = input => {
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
            ipcRenderer.invoke("restart",true)
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
        ipcRenderer.invoke("mainDevTools",true)
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
  ipcRenderer.send("window-manager","closeWindow","index")
};

const refreshWindow = () => {
  location.reload();
};

const reframeMainWindow = () => {
 // remote.mainWindow({ frame: true });
};

//// ========== TUTORIAL ========

const tutorialOpener = () => {
  openTutorial(tutoSlide);
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

const keyShortCuts = event => {
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


}

document.addEventListener("keydown",keyShortCuts);

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

const { Runtime, Inspector } = require("@observablehq/runtime");

const createObsCell = (
    slide,
    id,
    userName,
    notebookName,
    cellName,
    notebookVersion,
) => {
    // Create a DIV in the DOM
    let DOMSlide = document.getElementById(slide);
    var cell = document.createElement("DIV");
    cell.style.width = parseInt(window.innerWidth * 0.9) + "px";
    cell.id = "observablehq-" + id;
    DOMSlide.appendChild(cell);
    let version = "";
    if (notebookVersion) {
        version = "@" + notebookVersion;
    }

    // Create a path for the define script
    let modStorePath =
        userDataPath +
        "/flatDatasets/" +
        userName +
        "+" +
        notebookName +
        version +
        ".js?v=3";

    const adjustSize = () => {
        cell.style.height =
            window.innerHeight * 0.9 -
            DOMSlide.firstChild.firstChild.offsetHeight +
            "px"; // height is available
    };

    // Check if already accessed in the past and hence already available
    if (/* fs.existsSync(modStorePath) */ false) {
        require = require("esm")(module);
        var define = require(modStorePath);
        const inspect = Inspector.into("#observablehq-" + id);
        new Runtime().module(
            define.default,
            name => name === cellName && inspect(),
        );
        adjustSize();
        // If not, download it from the Observable API
    } else {

        fetch("https://api.observablehq.com/" + userName + "/" + notebookName + ".js?v=3")
            .then(mod => {
                // Write the file in the app's user directory
                fs.writeFile(modStorePath, mod, "utf8", err => {
                    if (err) throw err;
                    require = require("esm")(module);
                    var define = require(modStorePath);
                    const inspect = Inspector.into("#observablehq-" + id);
                    new Runtime().module(
                        define.default,
                        name => name === cellName && inspect(),
                    );
                    adjustSize();
                });
            });
    }
};

let activeIndex = 0;

let currentIndex;

let currentMainPresStep = {};

var sectionList = document.querySelectorAll("section");

const addPadding = () => {
    for (let sect of sectionList) {
        sect.style.paddingTop = "0px"; //remove all previous padding;
        sect.style.paddingTop =
            parseInt((document.body.offsetHeight - sect.clientHeight) / 2) +
            "px";
    }
};

function scroller() {
    let container = d3.select("#mainSlideSections"),
        dispatch = d3.dispatch("active", "progress"),
        sections = null,
        sectionPositions = [],
        containerStart = 0;
    currentIndex = -1;

    function scroll(els) {
        sections = els;
        d3.select(window)
            .on("scroll.scroller", position)
            .on("resize.scroller", resize);

        resize();

        var timer = d3.timer(function() {
            position();
            timer.stop();
        });
    }

    function resize() {
        sectionPositions = [];
        var startPos;
        sections.each(function(d, i) {
            var top = this.getBoundingClientRect().top;
            if (i === 0) {
                startPos = top;
            }
            sectionPositions.push(top - startPos);
        });
        containerStart =
            d3
                .select("#mainSlideSections")
                .node()
                .getBoundingClientRect().top + window.pageYOffset;
    }

    function position() {
        var pos = window.pageYOffset - containerStart; //+document.body.offsetHeight*.3;
        var sectionIndex = d3.bisect(sectionPositions, pos);
        sectionIndex = Math.min(sections.size() - 1, sectionIndex) - 1;

        if (currentIndex !== sectionIndex) {
            dispatch.call("active", this, sectionIndex);
            currentIndex = sectionIndex;
            activeIndex = currentIndex;
            try {
           
            if (activeIndex > 1) {
                document.getElementById("prevSlideArr").innerHTML =
                    "arrow_upward";
            } else {
                document.getElementById("prevSlideArr").innerHTML = "&nbsp;";
            }
            if (activeIndex >= 0 && activeIndex <= sectionList.length - 2) {
                document.getElementById("nextSlideArr").innerHTML =
                    "arrow_downward";
            } else {
                document.getElementById("nextSlideArr").innerHTML =
                    "arrow_downward";
            }
             } catch (error) {
                // it will create an error on type load
                // console.log(error)    
            }
        }

        var prevIndex = Math.max(sectionIndex - 1, 0);
        var prevTop = sectionPositions[prevIndex];
        var progress =
            (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);

        dispatch.call("progress", this, currentIndex, progress);
    }

    scroll.container = function(value) {
        if (arguments.length === 0) {
            return container;
        }
        container = value;
        return scroll;
    };

    scroll.on = function(action, callback) {
        dispatch.on(action, callback);
    };

    return scroll;
}

var previous = "";

const smoothScrollTo = target => {
    if (document.getElementById(target)){
         document
              .getElementById(target)
              .scrollIntoView({ block: "start", behavior: "smooth" })
    }
}

const display = () => {
    var scroll = scroller().container(d3.select("#mainSlideSections"));

    scroll(d3.selectAll(".slideStep"));

    scroll.on("active", index => {
        currentMainPresStep.step = sectionList[index].id;

        d3.selectAll(".slideStep").style("visibility", function(d, i) {
            if (i < index - 1 || i > index + 1) {
                return "hidden";
            } else {
                return "visible";
            }
        });

        d3.selectAll(".slideStep").style("opacity", function(d, i) {
            if (i < index - 1 || i > index + 1) {
                return 0;
            } else {
                switch (i) {
                    case index:
                        return 1;
                        break;

                    case index - 1:
                        return 0.3;
                        break;

                    case index + 1:
                        return 0.3;
                        break;
                    default:
                        return 1;
                        break;
                }
            }
        });
        d3.selectAll(".slideStep").style("filter", function(d, i) {
            switch (i) {
                case index:
                    return "blur(0px)";
                    break;

                case index - 1:
                    return "blur(4px)";
                    break;

                case index + 1:
                    return "blur(4px)";
                    break;

                default:
                    return "blur(0px)";
                    break;
            }
        });
        progress(index);
    });
};

const progress = index => {
    var sectionList = document.querySelectorAll("section");
    let progBasis = parseInt(
        (activeIndex / sectionList.length) * window.innerHeight,
    );
    let progNext = parseInt((index / sectionList.length) * window.innerHeight);

    var progProc = setInterval(incr, 15);

    function incr() {
        if (progBasis === progNext) {
            clearInterval(progProc);
        } else if (progBasis < progNext) {
            progBasis++;
            //document.getElementById("progressBar").style.height = progBasis + "px";
        } else if (progBasis > progNext) {
            progBasis--;
            //document.getElementById("progressBar").style.height = progBasis + "px";
        }
    }
};

const slideControl = event => {
    switch (event.isComposing || event.code) {
        case "ArrowDown":
        case "ArrowRight":
            event.preventDefault();
            smoothScrollTo(sectionList[currentIndex + 1].id);
            break;

        case "ArrowUp":
        case "ArrowLeft":
            event.preventDefault();
            if (sectionList[currentIndex - 1]) {
                smoothScrollTo(sectionList[currentIndex - 1].id);
            }
            break;
    }
};

const exportSlides = () => {
    pandodb.slider.get(currentMainPresStep.id).then(slides => {

        dialog.showSaveDialog({"defaultPath":slides.name+".json"}).then(fp=>{
        fs.writeFile(
            fp.filePath,        
            JSON.stringify(slides),
            "utf8",
            err => {
              if (err) {
                ipcRenderer.send("console-logs", JSON.stringify(err));
              } else {
                ipcRenderer.send("console-logs", "Exporting current slides deck");
              }
            }
          )
        })
    })

}


const populateSlides = id => {
    let mainSliSect = document.getElementById("mainSlideSections");

    currentMainPresStep.id = id;
    pandodb.slider.get(id).then(presentation => {
        let slides = presentation.content;
        let obsCellBuffer = {};

        // slide id consistency checker
        // sometimes, two slides might have the same title, which will mess up display
        // as the two divs will have the same id. This is solved using a set.

        let slideIdCheck = {};

        slides.forEach(sl => {
            if (slideIdCheck.hasOwnProperty(sl.title)){
                sl.title=sl.title+"prime"
                slideIdCheck[sl.title]=true; 
            } else {
                slideIdCheck[sl.title]=true;
            }
        });

        if (mainPresEdit) {
            slideCreator();
            priorDate = presentation.date;
            mainPresContent = slides;
            document.getElementsByClassName("ql-editor")[0].innerHTML =
                mainPresContent[0].text;
            document.getElementById("slidetitle").value =
                mainPresContent[0].title;
            document.getElementById("presNamer").value = presentation.name;
        } else {
            slides.forEach(slide => {
                // Create action buttons for types
                for (
                    let i = 0;
                    i < (slide.text.match(/\[actionType:/g) || []).length;
                    i++
                ) {
                    slide.text = slide.text.replace(
                        "[actionType:",
                        '<a style="filter:invert(1);cursor:pointer;" onclick=selectOption(',
                    );
                    slide.text = slide.text.replace(
                        "/actionType]",
                        ')><i class="material-icons">flip</i></a>',
                    );
                }
                // Load observable cells
                for (
                    let i = 0;
                    i < (slide.text.match(/\[obsCell:/g) || []).length;
                    i++
                ) {
                    let beginIndex = slide.text.search(/\[obsCell:/g);
                    let endIndex = slide.text.search(/\/obsCell]/g);
                    let cellArgsArray = slide.text
                        .slice(beginIndex + 9, endIndex)
                        .split(",");
                    slide.text = slide.text.replace(
                        slide.text.slice(beginIndex, endIndex + 9),
                        "",
                    );
                    obsCellBuffer[slide.title] = [
                        slide.title,
                        cellArgsArray[0],
                        cellArgsArray[1],
                        cellArgsArray[2],
                        cellArgsArray[3],
                    ];
                }
                // create intra-slide references
                for (
                    let i = 0;
                    i < (slide.text.match(/\[refSlider:/g) || []).length;
                    i++
                ) {
                    slide.text = slide.text.replace(
                        "[refSlider:",
                        '<a style="filter:invert(1);cursor:pointer;" onclick=smoothScrollTo(',
                    );
                    slide.text = slide.text.replace(
                        "/refSlider]",
                        ')><i class="material-icons">picture_in_picture_alt</i></a>',
                    );
                }
            });

            slides.push({});

            let controlDiv = document.createElement("DIV");
            controlDiv.id = "slideControlDiv";
            let arrowUp = document.createElement("I");
            arrowUp.className += "material-icons controlSlide";
            arrowUp.id = "prevSlideArr";
            arrowUp.onclick = function() {
                smoothScrollTo(slides[activeIndex - 2].title);
            };
            arrowUp.addEventListener("mouseover", e => {
                if (arrowUp.innerHTML.length > 1) {
                    arrowUp.style = "background-color:#141414;color:white";
                }
            });
            arrowUp.addEventListener("mouseout", e => {
                if (arrowUp.innerHTML.length > 1) {
                    arrowUp.style =
                        "background-color:transparent;color:#141414";
                }
            });

            let arrowDown = document.createElement("I");
            arrowDown.className += "material-icons controlSlide";
            arrowDown.id = "nextSlideArr";
            arrowDown.onclick = function() {
                smoothScrollTo(slides[activeIndex].title);
            };
            arrowDown.addEventListener("mouseover", e => {
                if (arrowDown.innerHTML.length > 1) {
                    arrowDown.style = "background-color:#141414;color:white";
                }
            });
            arrowDown.addEventListener("mouseout", e => {
                if (arrowDown.innerHTML.length > 1) {
                    arrowDown.style =
                        "background-color:transparent;color:#141414";
                }
            });

            controlDiv.appendChild(arrowUp);
            controlDiv.appendChild(arrowDown);
            mainSliSect.appendChild(controlDiv);

            let section = document.createElement("SECTION");
            section.id = "startPres";
            section.className += "slideStep";
            section.innerHTML = "<div style='width:100%;'><div>";
            section.style.pointerEvents = "all";

            field.style.pointerEvents = "none";

            mainSliSect.appendChild(section);

            for (let i = 0; i < slides.length - 1; i++) {
                let section = document.createElement("SECTION");
                section.style.pointerEvents = "all";
                section.className += "slideStep";
                if (slides[i].text) {
                    //stop for last slide (empty)
                    section.id = slides[i].title;
                   /* 
                    if ( false
                        // slides[i].text[slides[i].text.indexOf(">") + 1] === "<"
                    ) {
                        //hide box if text area now empty
                        section.innerHTML =
                            "<div style='display:inline-flex;align-items:center;'><div style='background-color:rgba(0, 10, 10, .8);border-radius:4px;padding:10px;margin-right:5%;color:white;display:none;width:" +
                            parseInt(window.innerWidth * 0.9) +
                            "px;'></div></div>";
                    } else {
                     */   
                        section.innerHTML =
                            "<div style='display:inline-flex;align-items:center;'><div style='background-color:rgba(0, 10, 10, .8);border-radius:4px;padding:10px;margin-right:5%;color:white;display:inline-block;width:" +
                            parseInt(window.innerWidth * 0.9) +
                            "px;'>" +
                            slides[i].text +
                            "</div></div>";
                    }
                
                mainSliSect.appendChild(section);
            }

            document
                .querySelectorAll("p")
                .forEach(p => (p.style.fontSize = "20px"));

            sectionList = document.querySelectorAll("section");

            for (let slide in obsCellBuffer) {
                let cellArg = obsCellBuffer[slide];
                createObsCell(
                    cellArg[0],
                    cellArg[1],
                    cellArg[2],
                    cellArg[3],
                    cellArg[4],
                );
            }

            mainSliSect.style.opacity = 0;

            setTimeout(() => {
                addPadding();
                display();
                mainSliSect.style.opacity = 1;
                field.value = "start presentation";
                document.addEventListener("keydown", slideControl);
                document
                    .getElementById("menu-icon")
                    .addEventListener("click", () => {
                        document.body.style.animation = "fadeout 0.1s";
                        setTimeout(() => {
                            document.body.remove();
                            location.reload();
                        }, 100);
                    });

                    iconCreator("export-icon", exportSlides);
            }, 1000);
        }
    });
    
};
/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 * @author ScieCode / http://github.com/sciecode
 */

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
//
//    Orbit - left mouse / touch: one-finger move
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - right mouse, or left mouse + ctrl/meta/shiftKey, or arrow keys / touch: two-finger move

THREE.OrbitControls = function ( object, domElement ) {

	if ( domElement === undefined ) console.warn( 'THREE.OrbitControls: The second parameter "domElement" is now mandatory.' );
	if ( domElement === document ) console.error( 'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.' );

	this.object = object;
	this.domElement = domElement;

	// Set to false to disable this control
	this.enabled = true;

	// "target" sets the location of focus, where the object orbits around
	this.target = new THREE.Vector3();

	// How far you can dolly in and out ( PerspectiveCamera only )
	this.minDistance = 0;
	this.maxDistance = Infinity;

	// How far you can zoom in and out ( OrthographicCamera only )
	this.minZoom = 0;
	this.maxZoom = Infinity;

	// How far you can orbit vertically, upper and lower limits.
	// Range is 0 to Math.PI radians.
	this.minPolarAngle = 0; // radians
	this.maxPolarAngle = Math.PI; // radians

	// How far you can orbit horizontally, upper and lower limits.
	// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
	this.minAzimuthAngle = - Infinity; // radians
	this.maxAzimuthAngle = Infinity; // radians

	// Set to true to enable damping (inertia)
	// If damping is enabled, you must call controls.update() in your animation loop
	this.enableDamping = false;
	this.dampingFactor = 0.05;

	// This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
	// Set to false to disable zooming
	this.enableZoom = false;
	this.zoomSpeed = 1.0;

	// Set to false to disable rotating
	this.enableRotate = true;
	this.rotateSpeed = 0.3;

	// Set to false to disable panning
	this.enablePan = false;
	this.panSpeed = 1.0;
	this.screenSpacePanning = false; // if true, pan in screen-space
	this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

	// Set to true to automatically rotate around the target
	// If auto-rotate is enabled, you must call controls.update() in your animation loop
	this.autoRotate = true;
	this.autoRotateSpeed = 3.0; // 30 seconds per round when fps is 60

	// Set to false to disable use of the keys
	this.enableKeys = true;

	// The four arrow keys
	this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

	// Mouse buttons
	this.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };

	// Touch fingers
	this.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

	// for reset
	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.zoom0 = this.object.zoom;

	//
	// public methods
	//

	this.getPolarAngle = function () {

		return spherical.phi;

	};

	this.getAzimuthalAngle = function () {

		return spherical.theta;

	};

	this.saveState = function () {

		scope.target0.copy( scope.target );
		scope.position0.copy( scope.object.position );
		scope.zoom0 = scope.object.zoom;

	};

	this.reset = function () {

		scope.target.copy( scope.target0 );
		scope.object.position.copy( scope.position0 );
		scope.object.zoom = scope.zoom0;

		scope.object.updateProjectionMatrix();
		scope.dispatchEvent( changeEvent );

		scope.update();

		state = STATE.NONE;

	};

	// this method is exposed, but perhaps it would be better if we can make it private...
	this.update = function () {

		var offset = new THREE.Vector3();

		// so camera.up is the orbit axis
		var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
		var quatInverse = quat.clone().inverse();

		var lastPosition = new THREE.Vector3();
		var lastQuaternion = new THREE.Quaternion();

		return function update() {

			var position = scope.object.position;

			offset.copy( position ).sub( scope.target );

			// rotate offset to "y-axis-is-up" space
			offset.applyQuaternion( quat );

			// angle from z-axis around y-axis
			spherical.setFromVector3( offset );

			if ( scope.autoRotate && state === STATE.NONE ) {

				rotateLeft( getAutoRotationAngle() );

			}

			if ( scope.enableDamping ) {

				spherical.theta += sphericalDelta.theta * scope.dampingFactor;
				spherical.phi += sphericalDelta.phi * scope.dampingFactor;

			} else {

				spherical.theta += sphericalDelta.theta;
				spherical.phi += sphericalDelta.phi;

			}

			// restrict theta to be between desired limits
			spherical.theta = Math.max( scope.minAzimuthAngle, Math.min( scope.maxAzimuthAngle, spherical.theta ) );

			// restrict phi to be between desired limits
			spherical.phi = Math.max( scope.minPolarAngle, Math.min( scope.maxPolarAngle, spherical.phi ) );

			spherical.makeSafe();


			spherical.radius *= scale;

			// restrict radius to be between desired limits
			spherical.radius = Math.max( scope.minDistance, Math.min( scope.maxDistance, spherical.radius ) );

			// move target to panned location

			if ( scope.enableDamping === true ) {

				scope.target.addScaledVector( panOffset, scope.dampingFactor );

			} else {

				scope.target.add( panOffset );

			}

			offset.setFromSpherical( spherical );

			// rotate offset back to "camera-up-vector-is-up" space
			offset.applyQuaternion( quatInverse );

			position.copy( scope.target ).add( offset );

			scope.object.lookAt( scope.target );

			if ( scope.enableDamping === true ) {

				sphericalDelta.theta *= ( 1 - scope.dampingFactor );
				sphericalDelta.phi *= ( 1 - scope.dampingFactor );

				panOffset.multiplyScalar( 1 - scope.dampingFactor );

			} else {

				sphericalDelta.set( 0, 0, 0 );

				panOffset.set( 0, 0, 0 );

			}

			scale = 1;

			// update condition is:
			// min(camera displacement, camera rotation in radians)^2 > EPS
			// using small-angle approximation cos(x/2) = 1 - x^2 / 8

			if ( zoomChanged ||
				lastPosition.distanceToSquared( scope.object.position ) > EPS ||
				8 * ( 1 - lastQuaternion.dot( scope.object.quaternion ) ) > EPS ) {

				scope.dispatchEvent( changeEvent );

				lastPosition.copy( scope.object.position );
				lastQuaternion.copy( scope.object.quaternion );
				zoomChanged = false;

				return true;

			}

			return false;

		};

	}();

	this.dispose = function () {

		scope.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
		scope.domElement.removeEventListener( 'mousedown', onMouseDown, false );
		scope.domElement.removeEventListener( 'wheel', onMouseWheel, false );

		scope.domElement.removeEventListener( 'touchstart', onTouchStart, false );
		scope.domElement.removeEventListener( 'touchend', onTouchEnd, false );
		scope.domElement.removeEventListener( 'touchmove', onTouchMove, false );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		scope.domElement.removeEventListener( 'keydown', onKeyDown, false );

		//scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

	};

	//
	// internals
	//

	var scope = this;

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start' };
	var endEvent = { type: 'end' };

	var STATE = {
		NONE: - 1,
		ROTATE: 0,
		DOLLY: 1,
		PAN: 2,
		TOUCH_ROTATE: 3,
		TOUCH_PAN: 4,
		TOUCH_DOLLY_PAN: 5,
		TOUCH_DOLLY_ROTATE: 6
	};

	var state = STATE.NONE;

	var EPS = 0.000001;

	// current position in spherical coordinates
	var spherical = new THREE.Spherical();
	var sphericalDelta = new THREE.Spherical();

	var scale = 1;
	var panOffset = new THREE.Vector3();
	var zoomChanged = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();

	var panStart = new THREE.Vector2();
	var panEnd = new THREE.Vector2();
	var panDelta = new THREE.Vector2();

	var dollyStart = new THREE.Vector2();
	var dollyEnd = new THREE.Vector2();
	var dollyDelta = new THREE.Vector2();

	function getAutoRotationAngle() {

		return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

	}

	function getZoomScale() {

		return Math.pow( 0.95, scope.zoomSpeed );

	}

	function rotateLeft( angle ) {

		sphericalDelta.theta -= angle;

	}

	function rotateUp( angle ) {

		sphericalDelta.phi -= angle;

	}

	var panLeft = function () {

		var v = new THREE.Vector3();

		return function panLeft( distance, objectMatrix ) {

			v.setFromMatrixColumn( objectMatrix, 0 ); // get X column of objectMatrix
			v.multiplyScalar( - distance );

			panOffset.add( v );

		};

	}();

	var panUp = function () {

		var v = new THREE.Vector3();

		return function panUp( distance, objectMatrix ) {

			if ( scope.screenSpacePanning === true ) {

				v.setFromMatrixColumn( objectMatrix, 1 );

			} else {

				v.setFromMatrixColumn( objectMatrix, 0 );
				v.crossVectors( scope.object.up, v );

			}

			v.multiplyScalar( distance );

			panOffset.add( v );

		};

	}();

	// deltaX and deltaY are in pixels; right and down are positive
	var pan = function () {

		var offset = new THREE.Vector3();

		return function pan( deltaX, deltaY ) {

			var element = scope.domElement;

			if ( scope.object.isPerspectiveCamera ) {

				// perspective
				var position = scope.object.position;
				offset.copy( position ).sub( scope.target );
				var targetDistance = offset.length();

				// half of the fov is center to top of screen
				targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

				// we use only clientHeight here so aspect ratio does not distort speed
				panLeft( 2 * deltaX * targetDistance / element.clientHeight, scope.object.matrix );
				panUp( 2 * deltaY * targetDistance / element.clientHeight, scope.object.matrix );

			} else if ( scope.object.isOrthographicCamera ) {

				// orthographic
				panLeft( deltaX * ( scope.object.right - scope.object.left ) / scope.object.zoom / element.clientWidth, scope.object.matrix );
				panUp( deltaY * ( scope.object.top - scope.object.bottom ) / scope.object.zoom / element.clientHeight, scope.object.matrix );

			} else {

				// camera neither orthographic nor perspective
				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );
				scope.enablePan = false;

			}

		};

	}();

	function dollyIn( dollyScale ) {

		if ( scope.object.isPerspectiveCamera ) {

			scale /= dollyScale;

		} else if ( scope.object.isOrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom * dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	function dollyOut( dollyScale ) {

		if ( scope.object.isPerspectiveCamera ) {

			scale *= dollyScale;

		} else if ( scope.object.isOrthographicCamera ) {

			scope.object.zoom = Math.max( scope.minZoom, Math.min( scope.maxZoom, scope.object.zoom / dollyScale ) );
			scope.object.updateProjectionMatrix();
			zoomChanged = true;

		} else {

			console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );
			scope.enableZoom = false;

		}

	}

	//
	// event callbacks - update the object state
	//

	function handleMouseDownRotate( event ) {

		rotateStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownDolly( event ) {

		dollyStart.set( event.clientX, event.clientY );

	}

	function handleMouseDownPan( event ) {

		panStart.set( event.clientX, event.clientY );

	}

	function handleMouseMoveRotate( event ) {

		rotateEnd.set( event.clientX, event.clientY );

		rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

		var element = scope.domElement;

		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

		rotateStart.copy( rotateEnd );

		scope.update();

	}

	function handleMouseMoveDolly( event ) {

		dollyEnd.set( event.clientX, event.clientY );

		dollyDelta.subVectors( dollyEnd, dollyStart );

		if ( dollyDelta.y > 0 ) {

			dollyIn( getZoomScale() );

		} else if ( dollyDelta.y < 0 ) {

			dollyOut( getZoomScale() );

		}

		dollyStart.copy( dollyEnd );

		scope.update();

	}

	function handleMouseMovePan( event ) {

		panEnd.set( event.clientX, event.clientY );

		panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

		scope.update();

	}

	function handleMouseUp( /*event*/ ) {

		// no-op

	}

	function handleMouseWheel( event ) {

		if ( event.deltaY < 0 ) {

			dollyOut( getZoomScale() );

		} else if ( event.deltaY > 0 ) {

			dollyIn( getZoomScale() );

		}

		scope.update();

	}

	function handleKeyDown( event ) {

		var needsUpdate = false;

		switch ( event.keyCode ) {

			case scope.keys.UP:
				pan( 0, scope.keyPanSpeed );
				needsUpdate = true;
				break;

			case scope.keys.BOTTOM:
				pan( 0, - scope.keyPanSpeed );
				needsUpdate = true;
				break;

			case scope.keys.LEFT:
				pan( scope.keyPanSpeed, 0 );
				needsUpdate = true;
				break;

			case scope.keys.RIGHT:
				pan( - scope.keyPanSpeed, 0 );
				needsUpdate = true;
				break;

		}

		if ( needsUpdate ) {

			// prevent the browser from scrolling on cursor keys
			event.preventDefault();

			scope.update();

		}


	}

	function handleTouchStartRotate( event ) {

		if ( event.touches.length == 1 ) {

			rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		} else {

			var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
			var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

			rotateStart.set( x, y );

		}

	}

	function handleTouchStartPan( event ) {

		if ( event.touches.length == 1 ) {

			panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		} else {

			var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
			var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

			panStart.set( x, y );

		}

	}

	function handleTouchStartDolly( event ) {

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyStart.set( 0, distance );

	}

	function handleTouchStartDollyPan( event ) {

		if ( scope.enableZoom ) handleTouchStartDolly( event );

		if ( scope.enablePan ) handleTouchStartPan( event );

	}

	function handleTouchStartDollyRotate( event ) {

		if ( scope.enableZoom ) handleTouchStartDolly( event );

		if ( scope.enableRotate ) handleTouchStartRotate( event );

	}

	function handleTouchMoveRotate( event ) {

		if ( event.touches.length == 1 ) {

			rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		} else {

			var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
			var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

			rotateEnd.set( x, y );

		}

		rotateDelta.subVectors( rotateEnd, rotateStart ).multiplyScalar( scope.rotateSpeed );

		var element = scope.domElement;

		rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientHeight ); // yes, height

		rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight );

		rotateStart.copy( rotateEnd );

	}

	function handleTouchMovePan( event ) {

		if ( event.touches.length == 1 ) {

			panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );

		} else {

			var x = 0.5 * ( event.touches[ 0 ].pageX + event.touches[ 1 ].pageX );
			var y = 0.5 * ( event.touches[ 0 ].pageY + event.touches[ 1 ].pageY );

			panEnd.set( x, y );

		}

		panDelta.subVectors( panEnd, panStart ).multiplyScalar( scope.panSpeed );

		pan( panDelta.x, panDelta.y );

		panStart.copy( panEnd );

	}

	function handleTouchMoveDolly( event ) {

		var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
		var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;

		var distance = Math.sqrt( dx * dx + dy * dy );

		dollyEnd.set( 0, distance );

		dollyDelta.set( 0, Math.pow( dollyEnd.y / dollyStart.y, scope.zoomSpeed ) );

		dollyIn( dollyDelta.y );

		dollyStart.copy( dollyEnd );

	}

	function handleTouchMoveDollyPan( event ) {

		if ( scope.enableZoom ) handleTouchMoveDolly( event );

		if ( scope.enablePan ) handleTouchMovePan( event );

	}

	function handleTouchMoveDollyRotate( event ) {

		if ( scope.enableZoom ) handleTouchMoveDolly( event );

		if ( scope.enableRotate ) handleTouchMoveRotate( event );

	}

	function handleTouchEnd( /*event*/ ) {

		// no-op

	}

	//
	// event handlers - FSM: listen for events and reset state
	//

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		// Prevent the browser from scrolling.

		event.preventDefault();

		// Manually set the focus since calling preventDefault above
		// prevents the browser from setting it automatically.

		scope.domElement.focus ? scope.domElement.focus() : window.focus();

		switch ( event.button ) {

			case 0:

				switch ( scope.mouseButtons.LEFT ) {

					case THREE.MOUSE.ROTATE:

						if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

							if ( scope.enablePan === false ) return;

							handleMouseDownPan( event );

							state = STATE.PAN;

						} else {

							if ( scope.enableRotate === false ) return;

							handleMouseDownRotate( event );

							state = STATE.ROTATE;

						}

						break;

					case THREE.MOUSE.PAN:

						if ( event.ctrlKey || event.metaKey || event.shiftKey ) {

							if ( scope.enableRotate === false ) return;

							handleMouseDownRotate( event );

							state = STATE.ROTATE;

						} else {

							if ( scope.enablePan === false ) return;

							handleMouseDownPan( event );

							state = STATE.PAN;

						}

						break;

					default:

						state = STATE.NONE;

				}

				break;


			case 1:

				switch ( scope.mouseButtons.MIDDLE ) {

					case THREE.MOUSE.DOLLY:

						if ( scope.enableZoom === false ) return;

						handleMouseDownDolly( event );

						state = STATE.DOLLY;

						break;


					default:

						state = STATE.NONE;

				}

				break;

			case 2:

				switch ( scope.mouseButtons.RIGHT ) {

					case THREE.MOUSE.ROTATE:

						if ( scope.enableRotate === false ) return;

						handleMouseDownRotate( event );

						state = STATE.ROTATE;

						break;

					case THREE.MOUSE.PAN:

						if ( scope.enablePan === false ) return;

						handleMouseDownPan( event );

						state = STATE.PAN;

						break;

					default:

						state = STATE.NONE;

				}

				break;

		}

		if ( state !== STATE.NONE ) {

			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'mouseup', onMouseUp, false );

			scope.dispatchEvent( startEvent );

		}

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		switch ( state ) {

			case STATE.ROTATE:

				if ( scope.enableRotate === false ) return;

				handleMouseMoveRotate( event );

				break;

			case STATE.DOLLY:

				if ( scope.enableZoom === false ) return;

				handleMouseMoveDolly( event );

				break;

			case STATE.PAN:

				if ( scope.enablePan === false ) return;

				handleMouseMovePan( event );

				break;

		}

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		handleMouseUp( event );

		document.removeEventListener( 'mousemove', onMouseMove, false );
		document.removeEventListener( 'mouseup', onMouseUp, false );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onMouseWheel( event ) {

		if ( scope.enabled === false || scope.enableZoom === false || ( state !== STATE.NONE && state !== STATE.ROTATE ) ) return;

		event.preventDefault();
		event.stopPropagation();

		scope.dispatchEvent( startEvent );

		handleMouseWheel( event );

		scope.dispatchEvent( endEvent );

	}

	function onKeyDown( event ) {

		if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

		handleKeyDown( event );

	}

	function onTouchStart( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

		switch ( event.touches.length ) {

			case 1:

				switch ( scope.touches.ONE ) {

					case THREE.TOUCH.ROTATE:

						if ( scope.enableRotate === false ) return;

						handleTouchStartRotate( event );

						state = STATE.TOUCH_ROTATE;

						break;

					case THREE.TOUCH.PAN:

						if ( scope.enablePan === false ) return;

						handleTouchStartPan( event );

						state = STATE.TOUCH_PAN;

						break;

					default:

						state = STATE.NONE;

				}

				break;

			case 2:

				switch ( scope.touches.TWO ) {

					case THREE.TOUCH.DOLLY_PAN:

						if ( scope.enableZoom === false && scope.enablePan === false ) return;

						handleTouchStartDollyPan( event );

						state = STATE.TOUCH_DOLLY_PAN;

						break;

					case THREE.TOUCH.DOLLY_ROTATE:

						if ( scope.enableZoom === false && scope.enableRotate === false ) return;

						handleTouchStartDollyRotate( event );

						state = STATE.TOUCH_DOLLY_ROTATE;

						break;

					default:

						state = STATE.NONE;

				}

				break;

			default:

				state = STATE.NONE;

		}

		if ( state !== STATE.NONE ) {

			scope.dispatchEvent( startEvent );

		}

	}

	function onTouchMove( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( state ) {

			case STATE.TOUCH_ROTATE:

				if ( scope.enableRotate === false ) return;

				handleTouchMoveRotate( event );

				scope.update();

				break;

			case STATE.TOUCH_PAN:

				if ( scope.enablePan === false ) return;

				handleTouchMovePan( event );

				scope.update();

				break;

			case STATE.TOUCH_DOLLY_PAN:

				if ( scope.enableZoom === false && scope.enablePan === false ) return;

				handleTouchMoveDollyPan( event );

				scope.update();

				break;

			case STATE.TOUCH_DOLLY_ROTATE:

				if ( scope.enableZoom === false && scope.enableRotate === false ) return;

				handleTouchMoveDollyRotate( event );

				scope.update();

				break;

			default:

				state = STATE.NONE;

		}

	}

	function onTouchEnd( event ) {

		if ( scope.enabled === false ) return;

		handleTouchEnd( event );

		scope.dispatchEvent( endEvent );

		state = STATE.NONE;

	}

	function onContextMenu( event ) {

		if ( scope.enabled === false ) return;

		event.preventDefault();

	}

	//

	scope.domElement.addEventListener( 'contextmenu', onContextMenu, false );

	

	setTimeout(() => {
		scope.domElement.addEventListener( 'mouseover', onMouseDown, false );
	}, 500);

	scope.domElement.addEventListener( 'mousedown', onMouseDown, false );

	scope.domElement.addEventListener( 'wheel', onMouseWheel, false );

	scope.domElement.addEventListener( 'touchstart', onTouchStart, false );
	scope.domElement.addEventListener( 'touchend', onTouchEnd, false );
	scope.domElement.addEventListener( 'touchmove', onTouchMove, false );

	scope.domElement.addEventListener( 'keydown', onKeyDown, false );

	// make sure element can receive keys.

	if ( scope.domElement.tabIndex === - 1 ) {

		scope.domElement.tabIndex = 0;

	}

	// force an update at start

	this.update();

};

THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;


// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls, another set of touch behavior
//
//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse, or arrow keys / touch: one-finger move

THREE.MapControls = function ( object, domElement ) {

	THREE.OrbitControls.call( this, object, domElement );

	this.mouseButtons.LEFT = THREE.MOUSE.PAN;
	this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

	this.touches.ONE = THREE.TOUCH.PAN;
	this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;

};

THREE.MapControls.prototype = Object.create( THREE.EventDispatcher.prototype );
THREE.MapControls.prototype.constructor = THREE.MapControls;