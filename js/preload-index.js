// =========== DATABASE ===========
const Dexie = require("dexie");

Dexie.debug = false;

let pandodb = new Dexie("PandoraeDatabase");

let structureV1 = "id,date,name";

pandodb.version(1).stores({
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
});
pandodb.version(2).stores({
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
});

pandodb.version(3).stores({
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
});

pandodb.version(4).stores({
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
  slider: structureV1,
});

pandodb.version(5).stores({
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
  slider: structureV1,
});

pandodb.version(6).stores({
  fieldotype: structureV1,
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
  slider: structureV1,
});

pandodb.version(7).stores({
  fieldotype: structureV1,
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
  slider: structureV1,
  regards: structureV1,
});

pandodb.version(8).stores({
  fieldotype: structureV1,
  filotype: structureV1,
  doxatype: structureV1,
  hyphotype: structureV1,
  enriched: structureV1,
  scopus: structureV1,
  webofscience: structureV1,
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
  slider: structureV1,
  regards: structureV1,
});

pandodb.open();
const CMT = {
  EN: {
    menu: {
      flux: "flux",
      type: "type",
      slide: "slide",
      quit: "quit",
    },
    global: {
      coreLogo: [
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
        "E",
      ],
      field: {
        starting: "starting",
        error: "system error",
        workerError: "multithreading disabled",
        loading: "loading",
      },
    },
    mainField: {
      changeTheme: "change theme ",
      invalidTheme: "invalid theme name",
      toggleConsole: "toggle console",
      toggleMenu: "toggle menu",
      reload: "reload",
      fullscreen: "fullscreen",
      restart: "restart",
      reloadCore: "reload core",
      openDevtools: "open devtools",
      unlockMenu: "unlock menu",
      version: "version",
      returnTutorial: "return to tutorial",
      startTutorial: "start tutorial",
      comNotFound: "command not found",
    },
    console: {
      starting: ["Starting process ", " using dataset "],
      error: [
        "SYSTEM ERROR - PANDORÆ was unable to perform this task. The dataset might be incompatible with your request.",
      ],
      workerError: [
        "The SharedWorker failed to start. Processes requiring multithreading will be unavailable.",
      ],
      workerValidation: ["Multithreading enabled."],
      menu: {
        opening: "Opening menu",
        closing: "Collapsing menu",
      },
    },
    chaeros: {
      field: {},
      console: {},
    },
    flux: {
      divs: {
        hyphendpoint: "Enter your Hyphe endpoint below :",
      },
      field: {},
      console: {},
    },
    types: {
      console: {},
      tooltip: {},
    },
    tutorial: {
      sections: {
        mainTitle:
          "<div style='text-align:center'><div class='title' style='font-size:36px;font-weight: bold;'>Welcome to PANDORÆ</div><br><i class='material-icons arrowDown'><a class='arrowDown' data-action='scroll' data-target='slide2'>arrow_downward</a></i></div>",
        slide2:
          "<div style='text-align:center'><span class='title'>This short tutorial will guide your first steps with PANDORÆ.</span><br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide2bis'>arrow_downward</a></i></div>",
        slide2bis:
          "<div style='text-align:center'><span class='title'>As you noticed, you can click on the <strong>arrows</strong> to go down or back.</span><br><br>You can also use your <strong>mouse wheel</strong> to navigate up and down.&nbsp;<br><br>            You can skip specific chapters and come back to this <strong>tutorial</strong> later.<br><br>            If you're unsure of how to proceed, you can watch the step-by-step video of this tutorial while you interact with it.<br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide3'>arrow_downward</a></i></div>",
        slide3:
          "<div style='text-align:center'><span class='title'>PANDORÆ is a <strong>data retrieval & exploration tool.</strong></span><br><br>You can use it for many purposes, like building a <strong>literature review</strong>.<br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='slide4'>arrow_downward</a></i></div>",
        slide4:
          "<div style='text-align:center'><span class='title'>PANDORÆ  allows you to perform three main kinds of operations :</span><br><br><a data-action='scroll' data-target='Chapter1'>Load & enrich data</a><br><br><a data-action='scroll' data-target='Chapter2'>Explore data</a><br><br><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Chapter1'>arrow_downward</a></i></div>",
        Chapter1:
          "<span class='title'><strong>Chapter 1: Loading & enriching data</strong></span><br><br>PANDORÆ enables you to load data from different types of sources.<br><br>Those sources can be online databases that aggregate documents such as scientific articles.<br> <br>But you can really add <strong>any kind of document</strong>.<br><br>PANDORÆ also supports other types of data, such as those extracted from social-media or clinical trials.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='flux'>arrow_downward</a></i></div>",
        flux:
          "<span class='title'><strong>Cascade: Available data flows</strong></span><br><br><div style='display: inline-flex'><div style='flex:auto'>   <strong>Cascade</strong> is how Flux displays its data flows. As you can see, the data flows from you to the system. Hovering a process shows to which other process it is linked.  <br>&nbsp;<br> Cascade behaves like menu : click on a process and its options will be displayed.<br>&nbsp;<br>Click <a data-action='tuto' data-target='flux'>here</a> to learn how to open Flux.<br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='flux2'>arrow_downward</a></i></div></div><div style='flex:auto'><svg></svg></div></div><br>&nbsp;<br>",
        flux2:
          "<span class='title'><strong>Flux sections</strong></span><br><br>Flux has different types of processes. Each section has its own purpose, and relies on different services:<ul style='list-style-type: square;'><li><a data-action='scroll' data-target='user'>User</a> lets you insert your API keys and credentials.</li><li><a data-action='scroll' data-target='databases'>Databases requests</a> allow you to retrieve data from various online sources.</li><li><a data-action='scroll' data-target='enriching'>Enriching</a> allows you to edit and enrich datasets.</li><li><a data-action='scroll' data-target='system'>System</a> sends your data to PANDORAE visualisation features.</li></ul>Detail about the other sections will become available when they will be rolled out. Click on a section name to learn more about that section right now, or simply click on the arrow to continue.   <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='databases'>arrow_downward</a></i></div>",
        databases:
          "<span class='title'><strong>Databases</strong></span><br><br><div>Online databases can handle precise requests and return articles relevant to your needs. Many services exist, but PANDORÆ currently only supports Scopus. In order to start using PANDORÆ and Scopus, you will need to retrieve an <a data-action='openEx' data-target='https://dev.elsevier.com/'>API key</a> and insert it in Flux's USER tab.<br>&nbsp;<br> <br>&nbsp;<br> <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Enriching'>arrow_downward</a></i></div></div>",
        Enriching:
          "<span class='title'><strong>Enriching data</strong></span><br><br><strong>Flux</strong> enables you do retrieve data from different kinds of <a data-action='scroll' data-target='Bibliometric-databases'>databases</a>. Articles can be <a data-action='scroll' data-target='enrichment'>enriched</a> by <strong>geolocating</strong> their affiliation and retrieving additional <strong>metadata</strong>. But you will often have to curate your data and enrich its content by hand. PANDORÆ therefore helps you send your datasets to <a data-action='scroll' data-target='Zotero1'>Zotero</a> and download them back into the system when you're done cleaning your dataset.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='enrichment'>arrow_downward</a></i></div>",
        enrichment:
          "<span class='title'><strong>Enrichment</strong></span><br><br>Enrichment builds upon the datasets you obtained by requesting bibliometric databases. <br>&nbsp;<br>It will give you the opportunity to retrieve the geographic coordinates of each paper's affiliation(s), which in turn will allow <a data-action='scroll' data-target='geotype'>Geotype</a> to display those on a map. <br>&nbsp;<br>It can also retrieve Altmetric metadata, which might need an <a data-action='openEx' data-target='https://www.altmetric.com/'>API key</a>.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Zotero1'>arrow_downward</a></i></div>",
        Zotero1:
          "<span class='title'><strong>Zotero</strong></span><br><br><strong>Zotero</strong> is an open-source software designed to manage bibliographic data and references. It supports CSL-JSON datasets.       <br>&nbsp;<br> PANDORÆ converts data retrieved from <a data-action='scroll' data-target='Bibliometric-databases'>databases</a> to this format.     <br>&nbsp;<br> Using Zotero, you can explore, edit and curate those datasets. <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Zotero2'>arrow_downward</a></i></div>",
        Zotero2:
          "<span class='title'><strong>Creating a Zotero account</strong></span><br><br>You can create a free zotero account at <a data-action='openEx' data-target='https://www.zotero.org/'>https://www.zotero.org/</a>. <br>&nbsp;<br> Once that is done, you will need to set up a <a data-action='openEx' data-target='https://www.zotero.org/groups/'>group library</a> and retrieve a read/write API key.<br>&nbsp;<br> <strong>But for now,</strong> you can just click <a data-action='tuto' data-target='zoteroImport'>here</a> to learn how to use Zotero with PANDORÆ with <strong>sample data</strong> instead.<br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='Chapter2'>arrow_downward</a></i></div>",
        Chapter2:
          "    <span class='title'><strong>Chapter 2: Exploring data</strong></span><br><br> PANDORÆ's main purpose is to enable you to explore large and/or complex datasets. It features several different kinds of '<strong>types</strong>', that is ways to display your data:      <li><a data-action='scroll' data-target='chronotype'>Chronotype</a> puts different corpuse of documents on a same timeline for you to compare their size and content.</li>      <li><a data-action='scroll' data-target='geotype'>Geotype</a> draws a globe and displays scholarly paper's affiliation cities, institutions, and who cooperates with whom.</li>           <br>      Other features are documented on the <a data-action='openEx' data-target='https://github.com/Guillaume-Levrier/PANDORAE/wiki'>wiki</a>. Please note you need to resize your window <strong>before</strong> loading a <strong>types</strong>.  <br>&nbsp;<br>    <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='chronotype'>arrow_downward</a></i></div>",
        chronotype:
          "    <span class='title'><strong>Chronotype</strong></span><br><br>The <strong>chronotype</strong> displays one to seven Zotero collections at a time. Each collection is a vertical line. Each node on this line is a cluster of documents published      on that month. Clicking the node opens the cluster, revealing the documents. Hovering a document shows its metadata. Clicking it leads to its content, if available.  <br>&nbsp;<br>      Click <a data-action='tuto' data-target='chronotype');'>here</a> to try the chronotype if you already loaded the sample datasets. If not, click <a data-action='scroll' data-target='Zotero2'>here</a> to do so.      <br>&nbsp;<br><div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='geotype'>arrow_downward</a></i></div>",
        geotype:
          "      <span class='title'><strong>Geotype</strong></span><br><br>        The <strong>geotype</strong> displays a globe on which available affiliations are geolocated. Affiliations having cooperated on a paper listed in the dataset are linked in red.          <br>&nbsp;<br>        Click <a data-action='tuto' data-target='geotype');'>here</a> to try to the geotype if you already loaded the sample datasets. If not, click <a data-action='scroll' data-target='Zotero2'>here</a> to do so.        <br>&nbsp;<br>  <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='FinalChap'>arrow_downward</a></i></div>",
        FinalChap:
          "<div style='text-align:center'><span class='title'><strong>Final Chapter: the great escape</strong></span><br><br>      Our short journey together is about to come to an end.<br>&nbsp;<br>       It is now time for you to learn how to escape the Tutorial's constraint.       <br>&nbsp;<br>      Time to break free.      <br>&nbsp;<br><div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final2'>arrow_downward</a></i></div></div>",
        final2:
          "<div style='text-align:center'><span class='title'><strong>USER wants to break free</strong></span><br><br>        You might have noticed when you first started PANDORÆ that your possibilities were limited. <br>&nbsp;<br>        The <i  class='material-icons'>menu</i> <strong>menu</strong> button was 'forbidden', the <i  class='material-icons'>code</i> <strong>console</strong>  button too. <br>&nbsp;<br>        Your only option was to start the tutorial. Let's change that.        <br>&nbsp;<br>  <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final3'>arrow_downward</a></i></div></div>",
        final3:
          "<div style='text-align:center'><span class='title'><strong>Back to Flux-ture</strong></span><br><br>          PANDORÆ starts in tutorial mode when it detects that no user name has been entered. <br>&nbsp;<br>          To turn off the tutorial mode, go back to <a data-action='scroll' data-target='flux'>Flux</a>, go to the USER section, enter a user name. Do not forget to click the 'Update User Credentials' button. <br>&nbsp;<br>          Then come back here.<br>&nbsp;<br>    <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final4'>arrow_downward</a></i></div></div>",
        final4:
          "<div style='text-align:center'><span class='title'><strong>The main field</strong></span><br><br>            PANDORÆ communicates with you by displaying messages in the main field, on the main screen. You can also write in this field to communicate with PANDORÆ. <br>&nbsp;<br>            To select the field, push your <strong>TAB</strong> key after clicking on the main screen. You can then enter commands and push the <strong>ENTER</strong> key. <br>&nbsp;<br>      <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final5'>arrow_downward</a></i></div></div>",
        final5:
          "<div style='text-align:center'><span class='title'><strong>Entering commands</strong></span><br><br>             If your menu is locked, you can use the &nbsp;<span class='commands'>unlock menu</span>&nbsp; command. <br>&nbsp;<br>             It also works in the console.             <br>&nbsp;<br>             You can also change PANDORÆ's theme with the &nbsp;<span class='commands'>change theme</span>&nbsp; command. <br>&nbsp;<br>             Try with &nbsp;<span class='commands'>change theme blood-dragon</span>&nbsp; for example. You can switch back with &nbsp;<span class='commands'>change theme normal</span>. <br>&nbsp;<br>                <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final6'>arrow_downward</a></i></div></div>",
        final6:
          "<div style='text-align:center'><span class='title'><strong>Call me ...  maybe?</strong></span><br><br>            If you ever miss the tutorial, or want to check one of its chapter, you can use the             &nbsp;<span class='commands'>start tutorial</span>&nbsp; command.<br>&nbsp;<br> You will always be welcome here.<br>&nbsp;<br>                <div class='arrowDown'><i class='material-icons'><a class='arrowDown' data-action='scroll' data-target='final7'>arrow_downward</a></i></div></div>",
        final7:
          "<div style='text-align:center'><span class='title'><strong>Freedom at last</strong></span><br><br>           You will learn how to use PANDORÆ mostly by trial and error.<br>&nbsp;<br> If you're a researcher and/or developer, you might want to go have a look at its            <a data-action='openEx' data-target='https://github.com/Guillaume-Levrier/PANDORAE'>source code</a>.<br>&nbsp;<br>           A wiki of the project is available <a data-action='openEx' data-target='https://github.com/Guillaume-Levrier/PANDORAE/wiki'>here</a>.           <br>&nbsp;<br>           <div class='arrowDown'>    <i class='material-icons'><a class='arrowDown' data-action='lastScroll()'>arrow_downward</a></i></div></div>",
        final8:
          "<div style='text-align:center'>This <strong>CORE</strong> is now yours. <br>&nbsp;<br>           Close the software and restart it to escape the tutorial.<br>&nbsp;<br>           Thank you for using PANDORÆ.<br><br>                    <div id='restartCount' style='font-weight: bolder'></div></div>",
        last:
          "<div style='margin:auto;font-size:10px;line-height: 15px;'>PANDORÆ - version 1 <br>Guillaume Levrier</div>",
      },
    },
  },
  FR: {
    menu: {
      flux: "flux",
      type: "type",
      quit: "quitter",
      returnToTutorial: "retour au tutoriel",
    },

    tutorial: {
      sections: {},
    },
  },
  中文: {
    menu: {
      flux: "流动",
      type: "类型",
      quit: "关闭",
      returnToTutorial: "回教程",
    },
  },
};
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

var version = "1.0.03";

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

var mainPresContent = [];
var mainPresEdit = false;
var priorDate = false;

const typeSelect = () => {
  toggleMenu();
  typeSelector = true;
  categoryLoader("type");
};

const saveSlides = () => {
  let name = document.getElementById("presNamer").value;
  mainPresContent[activeIndex].text =
    document.getElementsByClassName("ql-editor")[0].innerHTML;
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
  document.getElementById("typeSelector").addEventListener("click", typeSelect);
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
                        "regards",
                        "chronotype",
                        "geotype",
                        "anthropotype",
                        "gazouillotype",
                        "hyphotype",
                        "doxatype",
                        "filotype",
                        "pharmacotype",
                        "fieldotype",
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

                      // issue here, openEx has been moved to the main process
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

    case "blood-dragon":
      bloodDragon();

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
          "regards",
          "chronotype",
          "geotype",
          "anthropotype",
          "gazouillotype",
          "hyphotype",
          "doxatype",
          "filotype",
          "pharmacotype",
          "fieldotype",
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

      case "regards":
        toggleMenu();
        categoryLoader("type");
        mainDisplay("regards");
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
//const { min } = require("d3-array");
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
// Slider script
const { Runtime, Inspector } = require("@observablehq/runtime");

const createObsCell = (
  slide,
  id,
  userName,
  notebookName,
  cellName,
  notebookVersion
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
      (name) => name === cellName && inspect()
    );
    adjustSize();
    // If not, download it from the Observable API
  } else {
    fetch(
      "https://api.observablehq.com/" +
        userName +
        "/" +
        notebookName +
        ".js?v=3"
    ).then((mod) => {
      // Write the file in the app's user directory
      fs.writeFile(modStorePath, mod, "utf8", (err) => {
        if (err) throw err;
        require = require("esm")(module);
        var define = require(modStorePath);
        const inspect = Inspector.into("#observablehq-" + id);
        new Runtime().module(
          define.default,
          (name) => name === cellName && inspect()
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
      parseInt((document.body.offsetHeight - sect.clientHeight) / 2) + "px";
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

    var timer = d3.timer(function () {
      position();
      timer.stop();
    });
  }

  function resize() {
    sectionPositions = [];
    var startPos;
    sections.each(function (d, i) {
      var top = this.getBoundingClientRect().top;
      if (i === 0) {
        startPos = top;
      }
      sectionPositions.push(top - startPos);
    });
    containerStart =
      d3.select("#mainSlideSections").node().getBoundingClientRect().top +
      window.pageYOffset;
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
          document.getElementById("prevSlideArr").innerHTML = "arrow_upward";
        } else {
          document.getElementById("prevSlideArr").innerHTML = "&nbsp;";
        }
        if (activeIndex >= 0 && activeIndex <= sectionList.length - 2) {
          document.getElementById("nextSlideArr").innerHTML = "arrow_downward";
        } else {
          document.getElementById("nextSlideArr").innerHTML = "arrow_downward";
        }
      } catch (error) {
        // it will create an error on type load
        // console.log(error)
      }
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);

    dispatch.call("progress", this, currentIndex, progress);
  }

  scroll.container = function (value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  scroll.on = function (action, callback) {
    dispatch.on(action, callback);
  };

  return scroll;
}

var previous = "";

const smoothScrollTo = (target) => {
  if (document.getElementById(target)) {
    document
      .getElementById(target)
      .scrollIntoView({ block: "start", behavior: "smooth" });
  }
};

const display = () => {
  var scroll = scroller().container(d3.select("#mainSlideSections"));

  scroll(d3.selectAll(".slideStep"));

  scroll.on("active", (index) => {
    currentMainPresStep.step = sectionList[index].id;

    d3.selectAll(".slideStep").style("visibility", function (d, i) {
      if (i < index - 1 || i > index + 1) {
        return "hidden";
      } else {
        return "visible";
      }
    });

    d3.selectAll(".slideStep").style("opacity", function (d, i) {
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
    d3.selectAll(".slideStep").style("filter", function (d, i) {
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

const progress = (index) => {
  var sectionList = document.querySelectorAll("section");
  let progBasis = parseInt(
    (activeIndex / sectionList.length) * window.innerHeight
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

const slideControl = (event) => {
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
  pandodb.slider.get(currentMainPresStep.id).then((slides) => {
    dialog.showSaveDialog({ defaultPath: slides.name + ".json" }).then((fp) => {
      fs.writeFile(fp.filePath, JSON.stringify(slides), "utf8", (err) => {
        if (err) {
          ipcRenderer.send("console-logs", JSON.stringify(err));
        } else {
          ipcRenderer.send("console-logs", "Exporting current slides deck");
        }
      });
    });
  });
};

const populateSlides = (id) => {
  let mainSliSect = document.getElementById("mainSlideSections");

  currentMainPresStep.id = id;
  pandodb.slider.get(id).then((presentation) => {
    let slides = presentation.content;
    let obsCellBuffer = {};

    // slide id consistency checker
    // sometimes, two slides might have the same title, which will mess up display
    // as the two divs will have the same id. This is solved using a set.

    let slideIdCheck = {};

    slides.forEach((sl) => {
      if (slideIdCheck.hasOwnProperty(sl.title)) {
        sl.title = sl.title + "prime";
        slideIdCheck[sl.title] = true;
      } else {
        slideIdCheck[sl.title] = true;
      }
    });

    const actionIndex = {};

    if (mainPresEdit) {
      slideCreator();
      priorDate = presentation.date;
      mainPresContent = slides;
      document.getElementsByClassName("ql-editor")[0].innerHTML =
        mainPresContent[0].text;
      document.getElementById("slidetitle").value = mainPresContent[0].title;
      document.getElementById("presNamer").value = presentation.name;
    } else {
      slides.forEach((slide) => {
        actionIndex[slide.title] = [];
        // Create action buttons for types
        for (
          let i = 0;
          i < (slide.text.match(/\[actionType:/g) || []).length;
          i++
        ) {
          let actionTarget = { id: i };
          let args = slide.text.substring(
            slide.text.indexOf('[actionType:"') + 13,
            slide.text.indexOf("/actionType]") - 1
          );
          actionTarget.type = args.substring(0, args.indexOf(",") - 1);
          actionTarget.target = args.substring(args.indexOf(",") + 2);

          slide.text =
            slide.text.substring(0, slide.text.indexOf('[actionType:"')) +
            '"<a style="filter: invert(1); cursor: pointer; " class="actionType" id="' +
            slide.title +
            "|||" +
            i +
            "\"><i class='material-icons'>flip</i></a>" +
            +slide.text.substring(slide.text.indexOf("actionType]") + 10);
          actionIndex[slide.title].push(actionTarget);
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
            ""
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
            '<a style="filter:invert(1);cursor:pointer;" onclick=smoothScrollTo('
          );
          slide.text = slide.text.replace(
            "/refSlider]",
            ')><i class="material-icons">picture_in_picture_alt</i></a>'
          );
        }
      });

      slides.push({});

      let controlDiv = document.createElement("DIV");
      controlDiv.id = "slideControlDiv";
      let arrowUp = document.createElement("I");
      arrowUp.className += "material-icons controlSlide";
      arrowUp.id = "prevSlideArr";
      arrowUp.onclick = function () {
        smoothScrollTo(slides[activeIndex - 2].title);
      };
      arrowUp.addEventListener("mouseover", (e) => {
        if (arrowUp.innerHTML.length > 1) {
          arrowUp.style = "background-color:#141414;color:white";
        }
      });
      arrowUp.addEventListener("mouseout", (e) => {
        if (arrowUp.innerHTML.length > 1) {
          arrowUp.style = "background-color:transparent;color:#141414";
        }
      });

      let arrowDown = document.createElement("I");
      arrowDown.className += "material-icons controlSlide";
      arrowDown.id = "nextSlideArr";
      arrowDown.addEventListener("click", (e) => {
        smoothScrollTo(slides[activeIndex].title);
      });
      arrowDown.addEventListener("mouseover", (e) => {
        if (arrowDown.innerHTML.length > 1) {
          arrowDown.style = "background-color:#141414;color:white";
        }
      });
      arrowDown.addEventListener("mouseout", (e) => {
        if (arrowDown.innerHTML.length > 1) {
          arrowDown.style = "background-color:transparent;color:#141414";
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
        .forEach((p) => (p.style.fontSize = "20px"));

      sectionList = document.querySelectorAll("section");

      for (let slide in obsCellBuffer) {
        let cellArg = obsCellBuffer[slide];
        createObsCell(
          cellArg[0],
          cellArg[1],
          cellArg[2],
          cellArg[3],
          cellArg[4]
        );
      }

      for (let slide in actionIndex) {
        for (let i = 0; i < actionIndex[slide].length; i++) {
          document
            .getElementById(slide + "|||" + i)
            .addEventListener("click", (e) => {
              selectOption(
                actionIndex[slide][i].type,
                actionIndex[slide][i].target
              );
            });
        }
      }

      mainSliSect.style.opacity = 0;

      setTimeout(() => {
        addPadding();
        display();
        mainSliSect.style.opacity = 1;
        field.value = "start presentation";
        document.addEventListener("keydown", slideControl);
        document.getElementById("menu-icon").addEventListener("click", () => {
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

THREE.OrbitControls = function (object, domElement) {
  if (domElement === undefined)
    console.warn(
      'THREE.OrbitControls: The second parameter "domElement" is now mandatory.'
    );
  if (domElement === document)
    console.error(
      'THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.'
    );

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
  this.minAzimuthAngle = -Infinity; // radians
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
  this.keyPanSpeed = 7.0; // pixels moved per arrow key push

  // Set to true to automatically rotate around the target
  // If auto-rotate is enabled, you must call controls.update() in your animation loop
  this.autoRotate = true;
  this.autoRotateSpeed = 3.0; // 30 seconds per round when fps is 60

  // Set to false to disable use of the keys
  this.enableKeys = true;

  // The four arrow keys
  this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

  // Mouse buttons
  this.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: THREE.MOUSE.PAN,
  };

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
    scope.target0.copy(scope.target);
    scope.position0.copy(scope.object.position);
    scope.zoom0 = scope.object.zoom;
  };

  this.reset = function () {
    scope.target.copy(scope.target0);
    scope.object.position.copy(scope.position0);
    scope.object.zoom = scope.zoom0;

    scope.object.updateProjectionMatrix();
    scope.dispatchEvent(changeEvent);

    scope.update();

    state = STATE.NONE;
  };

  // this method is exposed, but perhaps it would be better if we can make it private...
  this.update = (function () {
    var offset = new THREE.Vector3();

    // so camera.up is the orbit axis
    var quat = new THREE.Quaternion().setFromUnitVectors(
      object.up,
      new THREE.Vector3(0, 1, 0)
    );
    var quatInverse = quat.clone().invert();

    var lastPosition = new THREE.Vector3();
    var lastQuaternion = new THREE.Quaternion();

    return function update() {
      var position = scope.object.position;

      offset.copy(position).sub(scope.target);

      // rotate offset to "y-axis-is-up" space
      offset.applyQuaternion(quat);

      // angle from z-axis around y-axis
      spherical.setFromVector3(offset);

      if (scope.autoRotate && state === STATE.NONE) {
        rotateLeft(getAutoRotationAngle());
      }

      if (scope.enableDamping) {
        spherical.theta += sphericalDelta.theta * scope.dampingFactor;
        spherical.phi += sphericalDelta.phi * scope.dampingFactor;
      } else {
        spherical.theta += sphericalDelta.theta;
        spherical.phi += sphericalDelta.phi;
      }

      // restrict theta to be between desired limits
      spherical.theta = Math.max(
        scope.minAzimuthAngle,
        Math.min(scope.maxAzimuthAngle, spherical.theta)
      );

      // restrict phi to be between desired limits
      spherical.phi = Math.max(
        scope.minPolarAngle,
        Math.min(scope.maxPolarAngle, spherical.phi)
      );

      spherical.makeSafe();

      spherical.radius *= scale;

      // restrict radius to be between desired limits
      spherical.radius = Math.max(
        scope.minDistance,
        Math.min(scope.maxDistance, spherical.radius)
      );

      // move target to panned location

      if (scope.enableDamping === true) {
        scope.target.addScaledVector(panOffset, scope.dampingFactor);
      } else {
        scope.target.add(panOffset);
      }

      offset.setFromSpherical(spherical);

      // rotate offset back to "camera-up-vector-is-up" space
      offset.applyQuaternion(quatInverse);

      position.copy(scope.target).add(offset);

      scope.object.lookAt(scope.target);

      if (scope.enableDamping === true) {
        sphericalDelta.theta *= 1 - scope.dampingFactor;
        sphericalDelta.phi *= 1 - scope.dampingFactor;

        panOffset.multiplyScalar(1 - scope.dampingFactor);
      } else {
        sphericalDelta.set(0, 0, 0);

        panOffset.set(0, 0, 0);
      }

      scale = 1;

      // update condition is:
      // min(camera displacement, camera rotation in radians)^2 > EPS
      // using small-angle approximation cos(x/2) = 1 - x^2 / 8

      if (
        zoomChanged ||
        lastPosition.distanceToSquared(scope.object.position) > EPS ||
        8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS
      ) {
        scope.dispatchEvent(changeEvent);

        lastPosition.copy(scope.object.position);
        lastQuaternion.copy(scope.object.quaternion);
        zoomChanged = false;

        return true;
      }

      return false;
    };
  })();

  this.dispose = function () {
    scope.domElement.removeEventListener("contextmenu", onContextMenu, false);
    scope.domElement.removeEventListener("mousedown", onMouseDown, false);
    scope.domElement.removeEventListener("wheel", onMouseWheel, false);

    scope.domElement.removeEventListener("touchstart", onTouchStart, false);
    scope.domElement.removeEventListener("touchend", onTouchEnd, false);
    scope.domElement.removeEventListener("touchmove", onTouchMove, false);

    document.removeEventListener("mousemove", onMouseMove, false);
    document.removeEventListener("mouseup", onMouseUp, false);

    scope.domElement.removeEventListener("keydown", onKeyDown, false);

    //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?
  };

  //
  // internals
  //

  var scope = this;

  var changeEvent = { type: "change" };
  var startEvent = { type: "start" };
  var endEvent = { type: "end" };

  var STATE = {
    NONE: -1,
    ROTATE: 0,
    DOLLY: 1,
    PAN: 2,
    TOUCH_ROTATE: 3,
    TOUCH_PAN: 4,
    TOUCH_DOLLY_PAN: 5,
    TOUCH_DOLLY_ROTATE: 6,
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
    return ((2 * Math.PI) / 60 / 60) * scope.autoRotateSpeed;
  }

  function getZoomScale() {
    return Math.pow(0.95, scope.zoomSpeed);
  }

  function rotateLeft(angle) {
    sphericalDelta.theta -= angle;
  }

  function rotateUp(angle) {
    sphericalDelta.phi -= angle;
  }

  var panLeft = (function () {
    var v = new THREE.Vector3();

    return function panLeft(distance, objectMatrix) {
      v.setFromMatrixColumn(objectMatrix, 0); // get X column of objectMatrix
      v.multiplyScalar(-distance);

      panOffset.add(v);
    };
  })();

  var panUp = (function () {
    var v = new THREE.Vector3();

    return function panUp(distance, objectMatrix) {
      if (scope.screenSpacePanning === true) {
        v.setFromMatrixColumn(objectMatrix, 1);
      } else {
        v.setFromMatrixColumn(objectMatrix, 0);
        v.crossVectors(scope.object.up, v);
      }

      v.multiplyScalar(distance);

      panOffset.add(v);
    };
  })();

  // deltaX and deltaY are in pixels; right and down are positive
  var pan = (function () {
    var offset = new THREE.Vector3();

    return function pan(deltaX, deltaY) {
      var element = scope.domElement;

      if (scope.object.isPerspectiveCamera) {
        // perspective
        var position = scope.object.position;
        offset.copy(position).sub(scope.target);
        var targetDistance = offset.length();

        // half of the fov is center to top of screen
        targetDistance *= Math.tan(((scope.object.fov / 2) * Math.PI) / 180.0);

        // we use only clientHeight here so aspect ratio does not distort speed
        panLeft(
          (2 * deltaX * targetDistance) / element.clientHeight,
          scope.object.matrix
        );
        panUp(
          (2 * deltaY * targetDistance) / element.clientHeight,
          scope.object.matrix
        );
      } else if (scope.object.isOrthographicCamera) {
        // orthographic
        panLeft(
          (deltaX * (scope.object.right - scope.object.left)) /
            scope.object.zoom /
            element.clientWidth,
          scope.object.matrix
        );
        panUp(
          (deltaY * (scope.object.top - scope.object.bottom)) /
            scope.object.zoom /
            element.clientHeight,
          scope.object.matrix
        );
      } else {
        // camera neither orthographic nor perspective
        console.warn(
          "WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."
        );
        scope.enablePan = false;
      }
    };
  })();

  function dollyIn(dollyScale) {
    if (scope.object.isPerspectiveCamera) {
      scale /= dollyScale;
    } else if (scope.object.isOrthographicCamera) {
      scope.object.zoom = Math.max(
        scope.minZoom,
        Math.min(scope.maxZoom, scope.object.zoom * dollyScale)
      );
      scope.object.updateProjectionMatrix();
      zoomChanged = true;
    } else {
      console.warn(
        "WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."
      );
      scope.enableZoom = false;
    }
  }

  function dollyOut(dollyScale) {
    if (scope.object.isPerspectiveCamera) {
      scale *= dollyScale;
    } else if (scope.object.isOrthographicCamera) {
      scope.object.zoom = Math.max(
        scope.minZoom,
        Math.min(scope.maxZoom, scope.object.zoom / dollyScale)
      );
      scope.object.updateProjectionMatrix();
      zoomChanged = true;
    } else {
      console.warn(
        "WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."
      );
      scope.enableZoom = false;
    }
  }

  //
  // event callbacks - update the object state
  //

  function handleMouseDownRotate(event) {
    rotateStart.set(event.clientX, event.clientY);
  }

  function handleMouseDownDolly(event) {
    dollyStart.set(event.clientX, event.clientY);
  }

  function handleMouseDownPan(event) {
    panStart.set(event.clientX, event.clientY);
  }

  function handleMouseMoveRotate(event) {
    rotateEnd.set(event.clientX, event.clientY);

    rotateDelta
      .subVectors(rotateEnd, rotateStart)
      .multiplyScalar(scope.rotateSpeed);

    var element = scope.domElement;

    rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height

    rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);

    rotateStart.copy(rotateEnd);

    scope.update();
  }

  function handleMouseMoveDolly(event) {
    dollyEnd.set(event.clientX, event.clientY);

    dollyDelta.subVectors(dollyEnd, dollyStart);

    if (dollyDelta.y > 0) {
      dollyIn(getZoomScale());
    } else if (dollyDelta.y < 0) {
      dollyOut(getZoomScale());
    }

    dollyStart.copy(dollyEnd);

    scope.update();
  }

  function handleMouseMovePan(event) {
    panEnd.set(event.clientX, event.clientY);

    panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);

    pan(panDelta.x, panDelta.y);

    panStart.copy(panEnd);

    scope.update();
  }

  function handleMouseUp(/*event*/) {
    // no-op
  }

  function handleMouseWheel(event) {
    if (event.deltaY < 0) {
      dollyOut(getZoomScale());
    } else if (event.deltaY > 0) {
      dollyIn(getZoomScale());
    }

    scope.update();
  }

  function handleKeyDown(event) {
    var needsUpdate = false;

    switch (event.keyCode) {
      case scope.keys.UP:
        pan(0, scope.keyPanSpeed);
        needsUpdate = true;
        break;

      case scope.keys.BOTTOM:
        pan(0, -scope.keyPanSpeed);
        needsUpdate = true;
        break;

      case scope.keys.LEFT:
        pan(scope.keyPanSpeed, 0);
        needsUpdate = true;
        break;

      case scope.keys.RIGHT:
        pan(-scope.keyPanSpeed, 0);
        needsUpdate = true;
        break;
    }

    if (needsUpdate) {
      // prevent the browser from scrolling on cursor keys
      event.preventDefault();

      scope.update();
    }
  }

  function handleTouchStartRotate(event) {
    if (event.touches.length == 1) {
      rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);
    } else {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

      rotateStart.set(x, y);
    }
  }

  function handleTouchStartPan(event) {
    if (event.touches.length == 1) {
      panStart.set(event.touches[0].pageX, event.touches[0].pageY);
    } else {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

      panStart.set(x, y);
    }
  }

  function handleTouchStartDolly(event) {
    var dx = event.touches[0].pageX - event.touches[1].pageX;
    var dy = event.touches[0].pageY - event.touches[1].pageY;

    var distance = Math.sqrt(dx * dx + dy * dy);

    dollyStart.set(0, distance);
  }

  function handleTouchStartDollyPan(event) {
    if (scope.enableZoom) handleTouchStartDolly(event);

    if (scope.enablePan) handleTouchStartPan(event);
  }

  function handleTouchStartDollyRotate(event) {
    if (scope.enableZoom) handleTouchStartDolly(event);

    if (scope.enableRotate) handleTouchStartRotate(event);
  }

  function handleTouchMoveRotate(event) {
    if (event.touches.length == 1) {
      rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);
    } else {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

      rotateEnd.set(x, y);
    }

    rotateDelta
      .subVectors(rotateEnd, rotateStart)
      .multiplyScalar(scope.rotateSpeed);

    var element = scope.domElement;

    rotateLeft((2 * Math.PI * rotateDelta.x) / element.clientHeight); // yes, height

    rotateUp((2 * Math.PI * rotateDelta.y) / element.clientHeight);

    rotateStart.copy(rotateEnd);
  }

  function handleTouchMovePan(event) {
    if (event.touches.length == 1) {
      panEnd.set(event.touches[0].pageX, event.touches[0].pageY);
    } else {
      var x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
      var y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

      panEnd.set(x, y);
    }

    panDelta.subVectors(panEnd, panStart).multiplyScalar(scope.panSpeed);

    pan(panDelta.x, panDelta.y);

    panStart.copy(panEnd);
  }

  function handleTouchMoveDolly(event) {
    var dx = event.touches[0].pageX - event.touches[1].pageX;
    var dy = event.touches[0].pageY - event.touches[1].pageY;

    var distance = Math.sqrt(dx * dx + dy * dy);

    dollyEnd.set(0, distance);

    dollyDelta.set(0, Math.pow(dollyEnd.y / dollyStart.y, scope.zoomSpeed));

    dollyIn(dollyDelta.y);

    dollyStart.copy(dollyEnd);
  }

  function handleTouchMoveDollyPan(event) {
    if (scope.enableZoom) handleTouchMoveDolly(event);

    if (scope.enablePan) handleTouchMovePan(event);
  }

  function handleTouchMoveDollyRotate(event) {
    if (scope.enableZoom) handleTouchMoveDolly(event);

    if (scope.enableRotate) handleTouchMoveRotate(event);
  }

  function handleTouchEnd(/*event*/) {
    // no-op
  }

  //
  // event handlers - FSM: listen for events and reset state
  //

  function onMouseDown(event) {
    if (scope.enabled === false) return;

    // Prevent the browser from scrolling.

    event.preventDefault();

    // Manually set the focus since calling preventDefault above
    // prevents the browser from setting it automatically.

    scope.domElement.focus ? scope.domElement.focus() : window.focus();

    switch (event.button) {
      case 0:
        switch (scope.mouseButtons.LEFT) {
          case THREE.MOUSE.ROTATE:
            if (event.ctrlKey || event.metaKey || event.shiftKey) {
              if (scope.enablePan === false) return;

              handleMouseDownPan(event);

              state = STATE.PAN;
            } else {
              if (scope.enableRotate === false) return;

              handleMouseDownRotate(event);

              state = STATE.ROTATE;
            }

            break;

          case THREE.MOUSE.PAN:
            if (event.ctrlKey || event.metaKey || event.shiftKey) {
              if (scope.enableRotate === false) return;

              handleMouseDownRotate(event);

              state = STATE.ROTATE;
            } else {
              if (scope.enablePan === false) return;

              handleMouseDownPan(event);

              state = STATE.PAN;
            }

            break;

          default:
            state = STATE.NONE;
        }

        break;

      case 1:
        switch (scope.mouseButtons.MIDDLE) {
          case THREE.MOUSE.DOLLY:
            if (scope.enableZoom === false) return;

            handleMouseDownDolly(event);

            state = STATE.DOLLY;

            break;

          default:
            state = STATE.NONE;
        }

        break;

      case 2:
        switch (scope.mouseButtons.RIGHT) {
          case THREE.MOUSE.ROTATE:
            if (scope.enableRotate === false) return;

            handleMouseDownRotate(event);

            state = STATE.ROTATE;

            break;

          case THREE.MOUSE.PAN:
            if (scope.enablePan === false) return;

            handleMouseDownPan(event);

            state = STATE.PAN;

            break;

          default:
            state = STATE.NONE;
        }

        break;
    }

    if (state !== STATE.NONE) {
      document.addEventListener("mousemove", onMouseMove, false);
      document.addEventListener("mouseup", onMouseUp, false);

      scope.dispatchEvent(startEvent);
    }
  }

  function onMouseMove(event) {
    if (scope.enabled === false) return;

    event.preventDefault();

    switch (state) {
      case STATE.ROTATE:
        if (scope.enableRotate === false) return;

        handleMouseMoveRotate(event);

        break;

      case STATE.DOLLY:
        if (scope.enableZoom === false) return;

        handleMouseMoveDolly(event);

        break;

      case STATE.PAN:
        if (scope.enablePan === false) return;

        handleMouseMovePan(event);

        break;
    }
  }

  function onMouseUp(event) {
    if (scope.enabled === false) return;

    handleMouseUp(event);

    document.removeEventListener("mousemove", onMouseMove, false);
    document.removeEventListener("mouseup", onMouseUp, false);

    scope.dispatchEvent(endEvent);

    state = STATE.NONE;
  }

  function onMouseWheel(event) {
    if (
      scope.enabled === false ||
      scope.enableZoom === false ||
      (state !== STATE.NONE && state !== STATE.ROTATE)
    )
      return;

    event.preventDefault();
    event.stopPropagation();

    scope.dispatchEvent(startEvent);

    handleMouseWheel(event);

    scope.dispatchEvent(endEvent);
  }

  function onKeyDown(event) {
    if (
      scope.enabled === false ||
      scope.enableKeys === false ||
      scope.enablePan === false
    )
      return;

    handleKeyDown(event);
  }

  function onTouchStart(event) {
    if (scope.enabled === false) return;

    event.preventDefault();

    switch (event.touches.length) {
      case 1:
        switch (scope.touches.ONE) {
          case THREE.TOUCH.ROTATE:
            if (scope.enableRotate === false) return;

            handleTouchStartRotate(event);

            state = STATE.TOUCH_ROTATE;

            break;

          case THREE.TOUCH.PAN:
            if (scope.enablePan === false) return;

            handleTouchStartPan(event);

            state = STATE.TOUCH_PAN;

            break;

          default:
            state = STATE.NONE;
        }

        break;

      case 2:
        switch (scope.touches.TWO) {
          case THREE.TOUCH.DOLLY_PAN:
            if (scope.enableZoom === false && scope.enablePan === false) return;

            handleTouchStartDollyPan(event);

            state = STATE.TOUCH_DOLLY_PAN;

            break;

          case THREE.TOUCH.DOLLY_ROTATE:
            if (scope.enableZoom === false && scope.enableRotate === false)
              return;

            handleTouchStartDollyRotate(event);

            state = STATE.TOUCH_DOLLY_ROTATE;

            break;

          default:
            state = STATE.NONE;
        }

        break;

      default:
        state = STATE.NONE;
    }

    if (state !== STATE.NONE) {
      scope.dispatchEvent(startEvent);
    }
  }

  function onTouchMove(event) {
    if (scope.enabled === false) return;

    event.preventDefault();
    event.stopPropagation();

    switch (state) {
      case STATE.TOUCH_ROTATE:
        if (scope.enableRotate === false) return;

        handleTouchMoveRotate(event);

        scope.update();

        break;

      case STATE.TOUCH_PAN:
        if (scope.enablePan === false) return;

        handleTouchMovePan(event);

        scope.update();

        break;

      case STATE.TOUCH_DOLLY_PAN:
        if (scope.enableZoom === false && scope.enablePan === false) return;

        handleTouchMoveDollyPan(event);

        scope.update();

        break;

      case STATE.TOUCH_DOLLY_ROTATE:
        if (scope.enableZoom === false && scope.enableRotate === false) return;

        handleTouchMoveDollyRotate(event);

        scope.update();

        break;

      default:
        state = STATE.NONE;
    }
  }

  function onTouchEnd(event) {
    if (scope.enabled === false) return;

    handleTouchEnd(event);

    scope.dispatchEvent(endEvent);

    state = STATE.NONE;
  }

  function onContextMenu(event) {
    if (scope.enabled === false) return;

    event.preventDefault();
  }

  //

  scope.domElement.addEventListener("contextmenu", onContextMenu, false);

  setTimeout(() => {
    scope.domElement.addEventListener("mouseover", onMouseDown, false);
  }, 500);

  scope.domElement.addEventListener("mousedown", onMouseDown, false);

  scope.domElement.addEventListener("wheel", onMouseWheel, false);

  scope.domElement.addEventListener("touchstart", onTouchStart, false);
  scope.domElement.addEventListener("touchend", onTouchEnd, false);
  scope.domElement.addEventListener("touchmove", onTouchMove, false);

  scope.domElement.addEventListener("keydown", onKeyDown, false);

  // make sure element can receive keys.

  if (scope.domElement.tabIndex === -1) {
    scope.domElement.tabIndex = 0;
  }

  // force an update at start

  this.update();
};

THREE.OrbitControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

// This set of controls performs orbiting, dollying (zooming), and panning.
// Unlike TrackballControls, it maintains the "up" direction object.up (+Y by default).
// This is very similar to OrbitControls, another set of touch behavior
//
//    Orbit - right mouse, or left mouse + ctrl/meta/shiftKey / touch: two-finger rotate
//    Zoom - middle mouse, or mousewheel / touch: two-finger spread or squish
//    Pan - left mouse, or arrow keys / touch: one-finger move

THREE.MapControls = function (object, domElement) {
  THREE.OrbitControls.call(this, object, domElement);

  this.mouseButtons.LEFT = THREE.MOUSE.PAN;
  this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;

  this.touches.ONE = THREE.TOUCH.PAN;
  this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
};

THREE.MapControls.prototype = Object.create(THREE.EventDispatcher.prototype);
THREE.MapControls.prototype.constructor = THREE.MapControls;
const normalCore = () => {
  const {
    DepthOfFieldEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
  } = require("postprocessing");

  var composer;

  const depthOfFieldEffect = new DepthOfFieldEffect(camera, {
    focusDistance: 0.998,
    focalLength: 0.0025,
    bokehScale: 4.0,
  });

  const effectPass = new EffectPass(camera, depthOfFieldEffect);

  effectPass.renderToScreen = true;

  const clock = new THREE.Clock();

  // SHADERLOADER
  var ShaderLoader = function () {
    ShaderLoader.get = function (id) {
      return ShaderLoader.shaders[id];
    };
  };

  ShaderLoader.prototype = {
    loadShaders: function (shaders, baseUrl, callback) {
      ShaderLoader.shaders = shaders;

      this.baseUrl = baseUrl || "./";
      this.callback = callback;
      this.batchLoad(this, "onShadersReady");
    },

    batchLoad: function (scope, callback) {
      var queue = 0;
      for (var name in ShaderLoader.shaders) {
        queue++;
        var req = new XMLHttpRequest();
        req.onload = loadHandler(name, req);
        req.open("get", scope.baseUrl + name + ".glsl", true);
        req.send();
      }

      function loadHandler(name, req) {
        return function () {
          ShaderLoader.shaders[name] = req.responseText;
          if (--queue <= 0) scope[callback]();
        };
      }
    },

    onShadersReady: function () {
      if (this.callback) this.callback();
    },
  };

  // FBO

  // For more on FBO, check Nicoptere's article here http://barradeau.com/blog/?p=621

  var FBO = (function (exports) {
    var scene, orthoCamera, rtt;
    exports.init = function (
      width,
      height,
      renderer,
      simulationMaterial,
      renderMaterial
    ) {
      renderer.domElement.id = "coreCanvas";

      var gl = renderer.getContext();

      //1 we need FLOAT Textures to store positions
      //https://github.com/KhronosGroup/WebGL/blob/master/sdk/tests/conformance/extensions/oes-texture-float.html
      // This is not needed anymore because it is native in WebGL2
      // if (!gl.getExtension("OES_texture_float")){
      //     throw new Error( "float textures not supported" );
      //}

      //2 we need to access textures from within the vertex shader
      //https://github.com/KhronosGroup/WebGL/blob/90ceaac0c4546b1aad634a6a5c4d2dfae9f4d124/conformance-suites/1.0.0/extra/webgl-info.html
      if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0) {
        throw new Error("vertex shader cannot read textures");
      }

      //3 rtt setup
      scene = new THREE.Scene();
      orthoCamera = new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        1 / Math.pow(2, 53),
        1
      );

      //4 create a target texture
      var options = {
        minFilter: THREE.NearestFilter, //important as we want to sample square pixels
        magFilter: THREE.NearestFilter, //
        format: THREE.RGBAFormat,
        type: THREE.FloatType, //important as we need precise coordinates (not ints)
      };

      rtt = new THREE.WebGLRenderTarget(width, height, options);

      //5 the simulation:
      //create a bi-unit quadrilateral and uses the simulation material to update the Float Texture
      var geom = new THREE.BufferGeometry();
      geom.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array([
            -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
          ]),
          3
        )
      );
      geom.setAttribute(
        "uv",
        new THREE.BufferAttribute(
          new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]),
          2
        )
      );
      scene.add(new THREE.Mesh(geom, simulationMaterial));

      var cell = new THREE.Group();

      var cellGeometry = new THREE.SphereGeometry(300, 512, 512);
      var cellMaterial = new THREE.MeshPhongMaterial({
        color: 0x156289,
        transparent: true,
        opacity: 0.7,
        emissive: 0x072534,
        side: THREE.DoubleSide,
        flatShading: true,
      });
      var sphere = new THREE.Mesh(cellGeometry, cellMaterial);
      cell.add(sphere);

      scene.add(cell);

      //6 the particles:
      //create a vertex buffer of size width * height with normalized coordinates
      var l = width * height;
      var vertices = new Float32Array(l * 3);
      for (var i = 0; i < l; i++) {
        var i3 = i * 3;
        vertices[i3] = (i % width) / width;
        vertices[i3 + 1] = i / width / height;
      }

      //create the particles geometry
      var geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      //the rendermaterial is used to render the particles
      particles = new THREE.Points(geometry, renderMaterial);

      exports.particles = particles;
      exports.renderer = renderer;
    };

    //7 update loop
    exports.update = function (dispose) {
      if (dispose) {
        renderer.dispose();
        particles = null;
      } else {
        //1 update the simulation and render the result in a target texture

        exports.renderer.setRenderTarget(rtt);

        renderer.clear();

        exports.renderer.render(scene, orthoCamera);

        exports.renderer.setRenderTarget(null);

        //2 use the result of the swap as the new position for the particles' renderer
        exports.particles.material.uniforms.positions.value = rtt.texture;
      }
    };
    return exports;
  })({});

  // MORPH

  var scene, camera, renderer, controls;
  var simulationShader, automatic;
  var zoomFactor = 1;

  const reloadCore = () => {
    var sl = new ShaderLoader();
    sl.loadShaders(
      {
        simulation_vs: "",
        simulation_fs: "",
        render_vs: "",
        render_fs: "",
      },
      "./themes/normal/glsl/morph/",
      init
    );
  };

  window.onload = reloadCore();

  function init() {
    var w = coreCanvasW;
    var h = coreCanvasH;

    renderer = new THREE.WebGLRenderer({ logarithmicDepthBuffer: true });
    renderer.setSize(w, h);
    renderer.setClearColor(0xffffff, 1);
    renderer.className += "themeCustom";

    document.body.insertBefore(
      renderer.domElement,
      document.getElementById("signal")
    );

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, w / h, 1, 1000);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.z = 450;
    controls.minDistance = 0;
    controls.maxDistance = 4500;

    camera.zoom = zoomFactor;

    var textureSize = Math.pow(
      2,
      Math.round(
        Math.log(parseInt(document.body.offsetWidth / 1.6)) / Math.log(2)
      )
    );

    var width = textureSize;
    var height = textureSize;

    //first model
    var dataA = getSphere(width * height, 128);

    var textureA = new THREE.DataTexture(
      dataA,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType,
      THREE.DEFAULT_MAPPING,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping
    );
    textureA.needsUpdate = true;

    //second model
    var dataB = getSphere(width * height, 128);

    var textureB = new THREE.DataTexture(
      dataB,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType,
      THREE.DEFAULT_MAPPING,
      THREE.RepeatWrapping,
      THREE.RepeatWrapping
    );
    textureB.needsUpdate = true;

    simulationShader = new THREE.ShaderMaterial({
      uniforms: {
        textureA: { type: "t", value: textureA },
        textureB: { type: "t", value: textureB },
        timer: { type: "f", value: 0 },
        fastParticle: { type: "f", value: 0 },
        frequency: { type: "f", value: 0.01 },
        amplitude: { type: "f", value: 96 },
        maxDistanceA: { type: "f", value: 85 },
        maxDistanceB: { type: "f", value: 150 },
      },
      vertexShader: ShaderLoader.get("simulation_vs"),
      fragmentShader: ShaderLoader.get("simulation_fs"),
    });

    var renderShader = new THREE.ShaderMaterial({
      uniforms: {
        positions: { type: "t", value: null },
        pointSize: { type: "f", value: 3 },
        big: {
          type: "v3",
          value: new THREE.Vector3(170, 170, 170).multiplyScalar(1 / 0xff),
        },
        small: {
          type: "v3",
          value: new THREE.Vector3(80, 80, 80).multiplyScalar(1 / 0xff),
        },
      },
      vertexShader: ShaderLoader.get("render_vs"),
      fragmentShader: ShaderLoader.get("render_fs"),
      transparent: true,
      side: THREE.DoubleSide,
      //             blending:THREE.AdditiveBlending
    });

    FBO.init(width, height, renderer, simulationShader, renderShader);
    scene.add(FBO.particles);

    composer = new EffectComposer(renderer);

    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(effectPass);

    window.addEventListener("resize", onResize);
    // onResize();
    update();
  }

  //returns a Float32Array buffer of spherical 3D points
  function getPoint(v, size) {
    v.x = Math.random() * 2 - 1;
    v.y = Math.random() * 2 - 1;
    v.z = Math.random() * 2 - 1;
    if (v.length() > 1) return getPoint(v, size);
    return v.normalize().multiplyScalar(size);
  }
  function getSphere(count, size) {
    var len = count * 4;
    var data = new Float32Array(len);
    var p = new THREE.Vector3();
    for (var i = 0; i < len; i += 4) {
      getPoint(p, size);
      data[i] = p.x;
      data[i + 1] = p.y;
      data[i + 2] = p.z;
      data[i + 3] = 255;
    }
    return data;
  }

  function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    document.body.style.animation = "fadeout 0.45s";
    setTimeout(() => {
      document.body.style.opacity = 0;
      location.reload();
    }, 400);
  }

  function update() {
    if (dispose) {
      window.removeEventListener("resize", onResize, false);

      simulationShader.dispose();
      FBO.update(true);
    } else {
      requestAnimationFrame(update);

      //update params
      simulationShader.uniforms.timer.value = parseFloat(pandoratio);
      simulationShader.uniforms.fastParticle.value += 0.02 + pandoratio * 2;
      FBO.particles.rotation.x =
        ((Math.cos(Date.now() * 0.001) * Math.PI) / 180) * 2;
      FBO.particles.rotation.y -= (Math.PI / 180) * 0.1;

      //update simulation
      FBO.update();
      //render the particles at the new location
      //renderer.render( scene, camera );
      composer.render(clock.getDelta());
    }
  }
};

//module.exports = () => {normalCore();};
//Vega PANDORAE Theme JS

const vega = () => {

    let canvas = document.createElement("CANVAS");
    canvas.id ="vega";
    canvas.className +="purgeable themeCustom";
    canvas.style.width = window.innerWidth+"px";
    canvas.style.height = window.innerHeight+"px";
    
    document.body.insertBefore(canvas,document.getElementById("signal"));

    var ctx = canvas.getContext('2d');
    var scale = window.devicePixelRatio;
    canvas.width = window.innerWidth*scale;
    canvas.height = window.innerHeight*scale;
    ctx.scale(scale, scale);
    
    var etalon = window.innerHeight/2;

    function circleDrawer(rayon) {
        ctx.save()
        var midX = canvas.offsetWidth/2;
        var midY = canvas.offsetHeight/2;
        ctx.fillstyle="#141414"
        ctx.arc(midX,midY,rayon,0,2*Math.PI);
        let pas = window.innerHeight/20;
        let clipHeight = 7000/rayon;
        let region = new Path2D();
        for (let i = 0; i < canvas.offsetHeight; i=i+(pas*2)) {
            region.rect(0,i-clipHeight/2,window.innerWidth,clipHeight);
        } 
        ctx.clip(region, "evenodd");
        ctx.fill();
        for (let i = 0; i < canvas.offsetHeight; i=i+(pas*2)) {
            ctx.fillRect(0,i-1,window.innerWidth,2); 
        } 
        ctx.restore()
    }
    for (let i = .1; i < .9; i=i+.1) {circleDrawer(etalon*(i))};
}

// module.exports = () => {vega();};//Blood Dragon PANDORAE Theme JS
//The mount Fuji SVG file is loaded separately
// 1 - D3 SUN
// The sun is a D3 SVG circle with SVG glow filters, masks and random CSS flickering.
const sun = () => {
  let svg = d3
    .select("body")
    .append("svg")
    .attr("id", "sun")
    .attr("class", "purgeable")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight)
    .style("position", "absolute")
    .style("z-index", "0")
    .style("top", "0px")
    .style(
      "animation",
      "flicker var(--animation-time) ease alternate infinite"
    );

  //Make it glow randomly, cf https://css-tricks.com/random-numbers-css/
  function setProperty(duration) {
    document
      .getElementById("sun")
      .style.setProperty("--animation-time", duration + "s");
  }

  function changeAnimationTime() {
    const animationDuration = Math.random();
    if (document.getElementById("sun") != null) {
      setProperty(animationDuration);
    }
  }

  setInterval(changeAnimationTime, Math.random() * 1000);

  const defs = svg.append("defs");
  const linearGradient = defs
    .append("linearGradient")
    .attr("id", "linear-gradient");

  // Create the linear gradient, used to colour the circle
  linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%");

  linearGradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#FF5505");

  linearGradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#33FAFF");

  let data = [Array(1).keys()];

  // Create the Mask rectangles, i.e. the parts of the circle made invisible (glow included).

  var mask = svg.append("defs").append("mask").attr("id", "sunMask");

  mask
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight / 3)
    .style("fill", "white")
    .style("opacity", 0.9);

  let maskOffset = window.innerHeight / 3;

  for (let i = 2; i < 15; i++) {
    mask
      .append("rect")
      .attr("x", 0)
      .attr("y", maskOffset)
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight / i / 8)
      .style("fill", "white")
      .style("opacity", 0.9);
    maskOffset += window.innerHeight / i / 6;
  }

  var g = svg.append("g"); // Create a SVG group to host the sun

  //add ripple effect to the glow
  //when the sun opacity goes down
  //so does this dark transparent rectangle
  //which makes the background canvas shine

  g.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .style("fill", "rgba(0,0,0,0.3)")
    .attr("width", window.innerWidth)
    .attr("height", window.innerHeight);

  g.selectAll("circle") // The sun is  a D3 SVG circle
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", window.innerWidth / 2) // Center it horizontally
    .attr("cy", window.innerHeight / 3) // Place it top-center vertically
    .attr("r", window.innerWidth / 5) // Radius is a fifth of the window width
    .attr("mask", "url(#sunMask)") // Add the masking (lines on which the circle disappears)
    .style("fill", "url(#linear-gradient)") // Add the gradient
    .style("filter", "url(#glow)"); // Add the glow

  //Bremer Glow - cf http://bl.ocks.org/nbremer/d3189be2788ad3ca825f665df36eed09
  var filter = defs.append("filter").attr("id", "glow");

  filter
    .append("feGaussianBlur")
    .attr("stdDeviation", "20")
    .attr("result", "coloredBlur");

  var feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode").attr("in", "coloredBlur");
  feMerge.append("feMergeNode").attr("in", "SourceGraphic");
};

// 2 - VORONOI
/** By ge1doot https://codepen.io/ge1doot/pen/PaMdZE
 * Ported from "Sketch of Voronoi"
 * http://alumican.net/#/c/cells
 * Dead Code Preservation: http://wa.zozuar.org/code.php?c=iNy0
 * Fortune's algorithm - Wikipedia, the free encyclopedia
 * @see http://en.wikipedia.org/wiki/Fortune's_algorithm
 * C++ reference https://www.cs.hmc.edu/~mbrubeck/voronoi.html
 */

// Not much difference from the original version
// Pointer effects have been disabled for performance enhancement
// a tiny bit of glow has been added, and colors were changed

const voronoiBackground = () => {
  let canvas = document.createElement("CANVAS");
  canvas.id = "spaceVoronoi";
  canvas.className += "purgeable";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  document.body.insertBefore(canvas, document.getElementById("signal"));

  canvas = {
    init() {
      this.elem = document.getElementById("spaceVoronoi");
      this.resize();
      window.addEventListener("resize", () => this.resize(), false);
      return this.elem.getContext("2d", { lowLatency: true, alpha: true });
    },
    resize() {
      this.width = this.elem.width = this.elem.offsetWidth;
      this.height = this.elem.height = this.elem.offsetHeight;
      //pointer.mag = Math.min(this.width, this.height) * 0.05;
    },
  };
  const pointer = {
    x: 0.0,
    y: 0.0,
    ox: 0.0,
    oy: 0.0,
    mag: 0.0,
    ms2: 0.0,
    move(e, touch) {
      e.preventDefault();
      const pointer = touch ? e.targetTouches[0] : e;
      this.x = pointer.clientX;
      this.y = pointer.clientY;
    },
    save() {
      const mvx = this.x - this.ox;
      const mvy = this.y - this.oy;
      this.ms2 = Math.sqrt(mvx * mvx + mvy * mvy);
      this.ox = this.x;
      this.oy = this.y;
    },
    init(canvas) {
      //canvas.elem.addEventListener("mousemove", e => this.move(e, false), false);
      //canvas.elem.addEventListener("touchmove", e => this.move(e, true), false);
    },
  };
  const ctx = canvas.init();
  //pointer.init(canvas);
  ////////////////////////////////////////////////////
  let seed = 1;
  const random = (_) => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  class Point {
    constructor() {
      this.x = 0.0;
      this.y = 0.0;
      this.vx = 0.0;
      this.vy = 0.0;
    }
    init() {
      const angle = random() * 2 * Math.PI;
      this.x = canvas.width * 0.5 + (random() - 0.5) * 10;
      this.y = canvas.height * 0.5 + (random() - 0.5) * 10;
      this.vx = 2.5 * Math.cos(angle);
      this.vy = 2.5 * Math.sin(angle);
    }
    move() {
      if (
        this.x < 0 ||
        this.x > canvas.width ||
        this.y < 0 ||
        this.y > canvas.height
      ) {
        this.init();
        return;
      }
      const dx = this.x - pointer.x;
      const dy = this.y - pointer.y;
      const dist2 = dx * dx + dy * dy;
      const angle = Math.atan2(dy, dx);
      const power = (pointer.mag / dist2) * pointer.ms2;
      this.vx += power * Math.cos(angle);
      this.vy += power * Math.sin(angle);
      this.x += this.vx;
      this.y += this.vy;
    }
  }
  class Arc {
    constructor(p, prev, next) {
      this.p = p;
      this.next = next;
      this.prev = prev;
      this.v0 = null;
      this.v1 = null;
      this.left = null;
      this.right = null;
      this.endP = null;
      this.endX = 0.0;
    }
  }
  ////////////////////////////////////////////////////
  const N = 200;
  const points = [];
  // init
  for (let i = 0; i < N; ++i) {
    const p = new Point();
    p.init();
    points[i] = p;
  }
  const intersection = (p0, p1, l, res) => {
    let p = p0,
      ll = l * l;
    if (p0.x === p1.x) res.y = (p0.y + p1.y) / 2;
    else if (p1.x === l) res.y = p1.y;
    else if (p0.x === l) {
      res.y = p0.y;
      p = p1;
    } else {
      const z0 = 0.5 / (p0.x - l);
      const z1 = 0.5 / (p1.x - l);
      const a = z0 - z1;
      const b = -2 * (p0.y * z0 - p1.y * z1);
      const c =
        (p0.y * p0.y + p0.x * p0.x - ll) * z0 -
        (p1.y * p1.y + p1.x * p1.x - ll) * z1;
      res.y = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
    }
    res.x =
      (p.x * p.x + (p.y - res.y) * (p.y - res.y) - ll) / (2 * p.x - 2 * l);
    return res;
  };
  const fortune = () => {
    let o = new Point();
    let root = null;
    let a = null;
    let b = null;
    let c = null;
    let d = null;
    let next = null;
    let eventX = 0;
    let w = points[0].x;
    for (let i = 1; i < N; i++) {
      const p = points[i];
      const x = p.x;
      if (x < w) {
        let j = i;
        while (j > 0 && points[j - 1].x > x) {
          points[j] = points[j - 1];
          j--;
        }
        points[j] = p;
      } else w = x;
    }
    const x0 = points[0].x;
    let i = 0;
    let p = points[0];
    let x = p.x;
    for (;;) {
      if (a !== null) {
        let circle = false;
        if (a.prev !== null && a.next !== null) {
          const aa = a.prev.p;
          const bb = a.p;
          const cc = a.next.p;
          let A = bb.x - aa.x;
          let B = bb.y - aa.y;
          const C = cc.x - aa.x;
          const D = cc.y - aa.y;
          if (A * D - C * B <= 0) {
            const E = A * (aa.x + bb.x) + B * (aa.y + bb.y);
            const F = C * (aa.x + cc.x) + D * (aa.y + cc.y);
            const G = 2 * (A * (cc.y - bb.y) - B * (cc.x - bb.x));
            if (G !== 0) {
              o.x = (D * E - B * F) / G;
              o.y = (A * F - C * E) / G;
              A = aa.x - o.x;
              B = aa.y - o.y;
              eventX = o.x + Math.sqrt(A * A + B * B);
              if (eventX >= w) circle = true;
            }
          }
        }
        if (a.right !== null) a.right.left = a.left;
        if (a.left !== null) a.left.right = a.right;
        if (a === next) next = a.right;
        if (circle === true) {
          a.endX = eventX;
          if (a.endP !== null) {
            a.endP.x = o.x;
            a.endP.y = o.y;
          } else {
            a.endP = o;
            o = new Point();
          }
          d = next;
          if (d === null) {
            next = a;
          } else
            for (;;) {
              if (d.endX >= eventX) {
                a.left = d.left;
                if (d.left !== null) d.left.right = a;
                if (next === d) next = a;
                a.right = d;
                d.left = a;
                break;
              }
              if (d.right === null) {
                d.right = a;
                a.left = d;
                a.right = null;
                break;
              }
              d = d.right;
            }
        }
        if (b !== null) {
          a = b;
          b = null;
          continue;
        }
        if (c !== null) {
          a = c;
          c = null;
          continue;
        }
        a = null;
      }
      if (next !== null && next.endX <= x) {
        a = next;
        next = a.right;
        if (next !== null) next.left = null;
        a.right = null;
        if (a.prev !== null) {
          a.prev.next = a.next;
          a.prev.v1 = a.endP;
        }
        if (a.next !== null) {
          a.next.prev = a.prev;
          a.next.v0 = a.endP;
        }
        ctx.moveTo(a.v0.x, a.v0.y);
        ctx.lineTo(a.endP.x, a.endP.y);
        ctx.lineTo(a.v1.x, a.v1.y);
        d = a;
        w = a.endX;
        if (a.prev !== null) {
          b = a.prev;
          a = a.next;
        } else {
          a = a.next;
          b = null;
        }
      } else {
        if (p === null) break;
        if (root === null) {
          root = new Arc(p, null, null);
        } else {
          let z = new Point();
          a = root.next;
          if (a !== null) {
            while (a.next !== null) {
              a = a.next;
              if (a.p.y >= p.y) break;
            }
            intersection(a.prev.p, a.p, p.x, z);
            if (z.y <= p.y) {
              while (a.next !== null) {
                a = a.next;
                intersection(a.prev.p, a.p, p.x, z);
                if (z.y >= p.y) {
                  a = a.prev;
                  break;
                }
              }
            } else {
              a = a.prev;
              while (a.prev !== null) {
                a = a.prev;
                intersection(a.p, a.next.p, p.x, z);
                if (z.y <= p.y) {
                  a = a.next;
                  break;
                }
              }
            }
          } else a = root;
          if (a.next !== null) {
            b = new Arc(a.p, a, a.next);
            a.next.prev = b;
            a.next = b;
          } else {
            b = new Arc(a.p, a, null);
            a.next = b;
          }
          a.next.v1 = a.v1;
          z.y = p.y;
          z.x =
            (a.p.x * a.p.x + (a.p.y - p.y) * (a.p.y - p.y) - p.x * p.x) /
            (2 * a.p.x - 2 * p.x);
          b = new Arc(p, a, a.next);
          a.next.prev = b;
          a.next = b;
          a = a.next;
          a.prev.v1 = z;
          a.next.v0 = z;
          a.v0 = z;
          a.v1 = z;
          b = a.next;
          a = a.prev;
          c = null;
          w = p.x;
        }
        i++;
        if (i >= N) {
          p = null;
          x = 999999;
        } else {
          p = points[i];
          x = p.x;
        }
      }
    }
  };
  //////////////////////////////////////////////////////
  const run = () => {
    requestAnimationFrame(run);
    ctx.fillStyle = "rgb(37,37,70)";

    ctx.strokeStyle = "#f257ef";
    ctx.filter = "drop-shadow(0px 0px 3px rgb(255,0,255))";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const point of points) point.move();
    ctx.beginPath();
    fortune();
    ctx.stroke();

    pointer.save();
  };
  run();
};

// 3 - CityScape
// based on ge1doot's All Gone (No Escape III) https://codepen.io/ge1doot/details/xmWyrM
// Increased speed, number of plates generated (1->3), and different camera perspective
// base64 remains the same but is generated by the function instead
// Color has been changed to fit the theme.
// SetTimeout function lets the thread load the image to make it available for decoding.

const cityScape = () => {
  ////////////////////////////////////////////////////////////////

  let imageURI =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAAAAADRE4smAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE82lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAxLTA1VDE4OjMxOjM1KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGU2YzBmYjEtYTVjOS02MzQ0LTg0YzQtNzhiNTFlNTkyY2FmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhlNmMwZmIxLWE1YzktNjM0NC04NGM0LTc4YjUxZTU5MmNhZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhlNmMwZmIxLWE1YzktNjM0NC04NGM0LTc4YjUxZTU5MmNhZiI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OGU2YzBmYjEtYTVjOS02MzQ0LTg0YzQtNzhiNTFlNTkyY2FmIiBzdEV2dDp3aGVuPSIyMDE5LTAxLTA1VDE4OjMxOjM1KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ayrgZQAAPSVJREFUeNrtne2TJEd54PlPksXYgEJ3RkaWsb0Wum2Uu6pGiwWLubWgtJbZRegcWhUzElqJLlqHWLGLBAuLeNmdu4jBBrHQ2DG2hW8mjG57FQ11FyZiCPvLRejLfXTcHzBfL9+qKjMrMyurKqsqq7ue7q7Kepme7n5+9TxPPvlS7wBrKfP5nBZu+vwpJ3Q5MZ1yN11HUURX6SZekFXU7DO8Y420/tw8lRGAjQRgtACjBRgtwGgBRgswAjAC0B8A8QVeOv05b4wuoH8A4h5/zhGA/gHoU/9eAnD//feDP7kfrcD9aAO8mxbfTbfun4D7/wQtJ/eDe8mBwQPQl/6pv/ERgDAMwaMhWoEQbYD30eJddCucgPBTaDkJwUMhOXXgAPR2/c/IAgEwGzYA5KzhAsDr/y6MM2V67pX0AIBtDDB4AMAIgAoAg0zocpLt8BuAuII8F4ZxHOJFPAKwLgDUsQD33XffCMAmAhCOLkADAH9sfQEIewHg7bffJktWIlvsgC8ASNpdVwDCEQAlAIpawFoCEPYKgL8uQFkNHDYAi8Xi+YW8D38THAQuKgIQhmsdA+jyAGtnAcgXqZMHcASA6AJEr9AjAO8zJIIGB8Di1UUmyALkD3b902ogLqITRgB0BmC4AJTG/6MFkAEA6wsAu/LpI/2ud+GLvx8L4GUMoGkLsJBhWYDsu/ZoAfwHINtjA8DjW0QQAHSVbuIFWbE9ogB+471kj1MAaAyQWwAWAZAvRsq5BegSgNzoi7X/3vMAZV5B4QIkNXoGQMn135cFGAIA6YaSAJDv9BqAhWgBgOj/8XY/tYABAMCVxd0MgD8YrgUQvugYA4hJUZXST5YCsFUbAAUSbQMgftERgHIAcA6wrSCwewAkT+dfDNBnHoDbBhIAZgswHADkUHe4AEypqDffL25OlZvSn6a/jHQUye9MMgJOKgHwwgLcZFJJ//66AFhB3FuAD4VSJjAl4AEVAOjgVhkAT3sBQDHXNVwATuVyb01hvwEuniGSHzpzr+ACQEqAygVg/ZcAgAnwAABFrnOTLcDUPggEKQEKAIj+ywBI97cLQE6BUvAnl/ddw7uE/VflUzKd7DAJw7S00zQGkBqDuN4iHgHwKAGAElAEgOq/FADiBfoFQKX/oQMA0GsKBVV+WNYtUO7g972bKvaRMJyqE0Fpa+CkCADTfzkAtjagNQCU+ucBKKipPQBcuQDQBgCkDvAfhVTwJFO2DECqfzMAr2JBR7Zf1UrrAKj1bwRg7j0ARNqxAEJj0ARIBKQAZPovAQBrPno1J0AmYbt1ADT6NwMwVwAwxac7cgE66SwGOHQjpQBcoQAgAqi+r0gAXGkdAJ3+SwCYjwA4AYC6gByAzl2AVv9lAMx7AwB/JbVys73NE0GbAoBe/6UAfKUAAM6ZdhADdAbArUyq6v3RR+nLHwBM17889qkuADddWIARgK4BuOkMgFbzAFJj0OgCXAEgLAyJIM8AKJERgPoAfO1rIwCb5AIKAKhcwGgBNsgCDCMGsAFgWkVYnjft9DECsA4AVLAAH1YlgkYXMGwAxhhgBGCMASoBwLIClgC8NAKw2QCMFqDcDQwIAC4vWAOAFrqF2wHwW2pNjwCMAIwuoDoAZX0CU/l6oU/gJgBwZJD/N3ALYNkpdASgCgFDACA0ARCWuABepCBwhaSbwaG+AKC0Ad4D8JgJgOzYCIANABoCJj4D8Ji+N1Bm+0cAbAFQE1A6NKwhAAkWHQD4jm8XLoDPn37l5iuvsNeV+GaMNHodrbD+092vxGr99wYAuIHfAL0NuIm+IViBFYQrSN/VUwCUBJQODm0dgNNoxSn2egaAeP3Hav1XByB0BMDqxuAAUBFQOjy8PwDySj9exGImUEwNVAIgbAbAE/SmUU9cU40IKQJQpTVwWj4gpBkAR/9HEQT2CIA5BpC07Q6AsJkFmHHLpgCcOnVXJv0AMJlsGgDECzQAIJnNtQRUBkDq8dGLBSiZJGr9ANhxA8B8XVzARgLwLk8ACIIHRgD6AKBBczADAKxcugDPAdiOtvHw4O3tEgD2qIwADMgFWAWBzgFYAPBMNg3sxluAEYAhAqCMIVb1XMC7fc8DtOECnlkM2wW4AcCDWsBkEvkMgNgzwCMAlFLTAkx7dQHRVk8uQALgqy9IglQrbrJdZHd2jJ41VABYJrBPAKItPwC48sJlSZBqxU22i+zOjtGzPAEAKXVoLiCy6Q/wcvQyAuDll1925wIWUhBY1L+vAMzLAbCfI0yc2LmvPEAfMcCJe0+cOJEDcLWofw6ATOX1AeD7BDqZLlY5PW1lAKTm4OnAAQBg77RVJnCBLQC3rdK/5wAkSXMAOu8P4A0Asqj0vxEATKdrCoBoI9UWgIsBLg8PAFMeYLWpFiCPAUoAkGVjATh16t6NBGBhDUCu7WYAEFfkphqYlLqAVQUXMN1IFwBGAAblAubRHAGAvpm7GKBrAMi5TgDYY20Be44swHRavNPTaAE8BmA1cxgD1Fb/4GMAMQ8ABgTAvLwtYKwFVLUASgKcAkBUTk73KBUMYe3rf90sgIqATQAgCB4g4giAstkgPLYACgI2AQDHLmBIAAiZQCUBm+MCxhhASYCnALBq4N7eBjUGPR89jwB4/vnnnQIgWwCZAPcAOKkFfI4C8LnPeQdAe5NE2VqA3d3dJhZAIsBTAMDMWX8Ax6nguvr3JQaQCdgEAPq2AFtbflkAgQBPAfCpFnDrV4d4nmg2VzRa/X2+Za//fgB4ZlFGgNQnUNNWPGwApvV9gAMA8P3jfaoFSAQYAbiYHvUJADgsC4DfpU8LsCixAUYALj/FDnsEABwWAPRt/LMAGQFmAC5/Bh1/6qmn6NIHAOCwAEjfxyUAP97713/d20sAwJ0lkroWICUg1Ao5fPZTqHT2LFmc7RAAXSJob1gA5G+UAgB4AECtCSIIAMAKgCvnrpTZgLCEgMv/JasYdNknMK0GzuRxAoMCgH8ndwDsIQCAHQCLZxaVe4iIwUEcPxeGMd6I47h7AGZiHmBvWACIb+UMADwMwAqARRkANgRcjnu1AAIAe8MCAHQDAGgAQDkBuQXoH4BkWABMZLmbviUCgK7STbygxXwv1TBbpfou7KAAJAYA6vQREghgwYAPACTDAmDSHQCgAQBWBMQ9tgUgoXXepDcAaon+LVsAAGi7hT/T0AZwMYBNENhCNTATAsDe3kAAuI2lOwCSBgAASwC6tQB7s9JTfAbA9JatAJDUDAL1BMTkiaRKNXAEQND/7Q4BsJkfoBIBBQCsLcA3X3vNGQCv5PLNb34TryIinQHQTG4PBADgFIAp9hig1Rhgz08AllJpmRJwb3sAcFIA4EpJKthIALL4MV5kADz77LOWADz7bBh++tPNAHhxm65yQQDg1QUsL+JjFyrIpzuRl+TCS59+qSgIABwh0iVbFwCwkxIAAFhYv1U5AMzwWgAQRfjsZgCwf8b/zySJMqHHBitLJHS5pFv4VQ+AKlPEVCKgfhBIXQBw3xooVQPjeuLE1isl253kwpdTiSKyiBJuRQ+km7aSjsin5UYWoEBA0xgA4DjAcXNwD3mAOiLoaKkGIIp4DFIAKuqfB6B6h5ASAhxYAOcAzAUALlaQC3WlMQAKAiJ8pS8ZBkkGwLLq9c8DoG8MWjSIA+olgpwAsEsB2N2Vdu8OwALI/uKUJPhCn6IlLoCTJ/EzQrtx9eAUAOykbG0VA9TpElZCQM8u4BYF4NYtGYzhAcDVDrN64HuWgESD5OjTtBoYVQsAeQDmjgBgBMwE+UIYzmYhXsw8AKDrPoFxYxeAjbsoUXRAw/8o3yVt20juAubOACAEzNQWwLoa6CQVrKgGZkc6rQbGbbwpF/8nXPxfMQJIAZg7BACk+m+QB2gZgHnHeYA2CCgYfLqznguYOwUAzBy0BobNAdAEgcwL7HYZA8SuYwKi6wIAwA8AZqA5APTGwU4AUMYdLBoRQxW1yp0EgbF7ACIRgLR5oH8AZoqMUFUA2K3D+50gIv1CTmoBsWsAIsKArH8PAJipMkIV+wSGrDNgsz6BDQHIv5KTamDsHAA+6x95A8BMlRGqCECq/4YAmGOArgFwS0AaBXKbfgAwU2eEKgGQ6b9/ABaLD6IXXCyuagHg8qSshFbFnW4JKPQHiEBLAMycSJVEEKd/Ny6gbhDoHAB3BEQiAJHYIaT/amDBBlSxAOi011JhxYYxwE88sQDOAIhEAIT43ycAgAiAHQEzFvnvuKsF/MSPGMAZAHn8L6SDJABWqSjegT/WJgBABMCKgF4BIBc7t+ItALuu85X2Ylee6Q4ALv5n6SBQBGDFi0795JgOgCQhz9kbb9yXPmdsX0K6FuL2ijfuQ7vfoEsU/t3HCd1kXdhmWPNojQhAy64A+BsDAGfO0Ezg7AwngwCAj/9pOggUAPjFSpRPaPVPJk03ApArPSkCkHDLmbI6IFgAGxvQggVQ5wFor+A08AsgPANhCOFnW2wOjp3pP/f+XCogW66Kkv3946tuAQAiAAkiIFHew4UDAP0jJwBY3DLGEgBmAZSXt2gBitbBrQXIHH4kpH8EAN5SAPBBzfXfPgAgB4A0XpYR0BEAaWvgLG9ee5o8lbJYfA+9WBE9F9IqOy3dWdxy1igIQCH+lwBYrfQmYNU9AIC3AKkXmJkAuDy77AQAm5lCh2YBqJz7UBSd+1Oq/3Pn2AuXMQCrlZ6AlRKAlQEAkCifCgASQ12AB6AkDiDxYncAwKHFAER2z0XR7ovUHuzushcu+wkAEAEwE9A3AHFeCyhYANM1r6whtApApAZgtdITsNIAsGoZAHAX7uCXC93SAoC+hRMAZhVSwS/MZs/NwMNISQumVjHbNwO+AYDkQ2YApGte3mCb/QEA2gbAZAHYv88+0nsA+COAAXisxa69jgEAZgAUWT/VsR4BAN4BcHWhtwAs7V8M7fImAfHSbx4Ert4PVoBpDpUAWaDVDQLAi4MDIKvJkN6hkbqH6IwcdAKAoVPoXNEpFNUBry6ieMEqcHI1kKwWispdegpf/2uxGpgKVl7Ee/yIKDZvC5DWWN4v7funYlsAHW58G5fpUrpu5m3LjOQJOssDrB8AbiyARtvdAOAqFWwCYAgxwMogXQCg+OGMSdwRgPYAyPcAMRNITiJxwlciIAJQrxbAuYARAO8AyB26DQDFPMB3dXmANKZL7FxADU+wI0sHAJg+7foCUCsT6BcAfPcwBzZlQwC4XB8ATt7BRo3iMl0KwnYpjowAeGMBqrcG8gCMFmD4AJw1dQhRAfD22+SFV90AgNNC3gAQEHk4CP4sCB4LgieCosiaCXTiOBVcEwDFZb6nr1z2A8DN2x4BULAAAZT0ban/IDC3I1duC9ACsDICAP5Qd/2r+wT2AYAqisDBx6vTMFwuoykNRXAZyZRbLtlkKfgujrBkdNJM7JmiFgUAIJgYCAiCigQ0aAyqkQiq0SuYBwDy06cUVHTzJr9qAgBQX6vgzJQ0Bk2FVqMpt0zFCgD8VWYlw/6p0qQOIZJOg4riDABQFwDuLxXfmT/mEwBzNwBkBNQHQD6uMe6ifqW3pMcaAqDvHMoNDQOqgSHAct4LrwCYEwDCpgCkBDgBoJQAxQ+end0jANBvAJ7WnPf0NMJzCU2fJhKGZDXllk/bAMAIcANAGQGqH1w4uxcAIBykBZjPpxG67kODBVjaAMDiPzcAlBCg/MH5s5vmAUAxmJNjAHwyKRvaAjTiGwDzCOs9NLgAQgCqEwDwSW7Gu+vinMuEAPXMP9UBMBOgvuC4s2sDwDDICzwADIP0zBXNADALUGHuqz4AMDfwkOpfyKqBePZsQCqAYJrqllUKRQCeVABg9QPYAFAgIJ84XChzE4qTs9PJxetNNu7eAsDytgAPAEB1gYjZALL8MsDKXpKltQtwDIBMgAUA+Gy0PBkEMXpgSVU/FABAXwDMUS2AEqACgBHQMQASAXEGAnqBrBzz+9HZzQCoGwTCSkJcQCZ+ADCPptQLKDOBy2zrk4ZZcGf4RaRkulyW6ikdGSQQIAAANQBAGQD8aB8A6CUAFWVKr/66eQBmAWxrAYHV0DCeACMAWMfsWg/AfUjxIAcAE9AuALA6AF3EAP4CQAmwAIAnoBoAnAUgOPgGAA7/2cobAKYoCphOOwGAEGADAEeALQBU7mXrwN0th3QAwCib6maRroYIAOjQAhCdPmwDQE6AJQABsQCB1ILYIgCwFgBduICvy9IRAFNLQVq1ACAjoAAAVXp2cYsWIJDWcVsAQAaAsxggG9H9ApKbbUjrANhYAHTaw9DQI6goeX2fLwM52aMIAh1FAUoAcENvtFqc5SY9u3iHq/Jf5b/yNdZSnGcCiwBwY/rbIsAbAOwsQCqPZ8LKp09/5jOnwelctEGgm4qACgDoGgBhvueWCPAFAKSXKgCoGgQUXQK1ADQmwCkAGhcgzfnfDgG6WsADD4QhfnUGQF0XwKeCud2pykkiCBQBaEpAEQBYBACJNQBFC1C4+V8rBLSdB6gAwI8MrYHyjnIATmJhACgsQFMCCgBA2MwCFABQ3P6xMQFhGH4Br2kq2DcAziwrAJDmA+RqYGYheEMBlHmA2CUAsCkAsgtQ3gC0IQGp/n0FAAZhcPKzAUsNsgxxoAOAtffq2gLS7qEntcMHXAIAlQBUcQESAOo7wDYkINV/2wB8gLQB1QHgehUASD5AyANAenHnAGjyAM4BgEUA8kSQdS2AywRevtwGATvhzZudWQBQAwAYLu1dAG3vxXmA3OwXXIA+CHQJAHQNwOXLJgLqA7DTDQCzuhYAxQDJSzBJEkifbJWgS13YgQFI6DpOEgID2lRZAEMQaAsA6+7B9wnD/T4iMgggIscYAESjUeb/66eCL182EuB9LWBWGgMU7p86/Z+JqRqYJE4BQF8rxADcFeJvGN6Ft2jxUVp8CG99shEAVVPBXC3g8giAQv86AIxBoBaAJETAJD9Ha/R8A2/R4l/Q4hxvhZ9F/6PiyKB0uVph20+eC0MXMe6u0TkAlzcUgOSnSfLdJHlJd5NlEQCLPoFZqJDm/tEafaE/D20BwGd1BkDmAi6vEwCz2XTWCgCQWYASkfIA6TokwlYGQc6gNgBWoogBLq8TADi6UyqmKwDkacYF9bYLALv0zRagXwAM3QFg52LVI6gsFQxEF0D6A0C230sA0pkARgAqA3Dx4je+cfHiRQJAVkaKRuuLFy5cSAEAqQUwAPBx+UApAGkGAEYRG+qd5QHQckE2Wf0Pr/LxBQDcAOmsw4WJA+gsYSMAdgBAyNcCWBlwXcLsAOAVUBkASACA6RQAIgCK2QCw5r8/AtAlAAAYYwA5eHmgEgAwAwBqAGCJIBGAQ6OMANQCQDMwhB3SWQBF/FoBADgCMGwA1KlgpwAoXcAIQJcA6GsBuraAhxwBwLUFDBaAYDotVKiF7bDqQEiXAFiMDTQAIDcG5fmG9AxSTnQJPHwLRrakCT20wZa/JDuQ5hPyXGTvkaD9qwSr+VYuPgNQGN/rOwCAawxiyV+NCwB6AJKckk0H4ITHAJQmguoDkDgBgJMiAGMM0BQAyGKALKlsUxbNexLrks48AL9qaAFGALwHgO75qooA3DT4qzYAGIgL8BsAsa2HT/joypkL4HoE0c3fF5OCXC0AgHcp23DkWgA3QURhbthiLWAEYCJv9QRArngVAXTnsWoA0CYg/vamYx6gaL4nvMWdTJLpvx8d/e+jo58eHX39iMj/LTYHuwZAUru4mwHwQeWEwQ0AuDECUABgktQFgI4s/w9YsoKmzCtWqX8A9AAcc9khZHQBEgCTpA4AZxtYAKXOJWsgAADe6RiA0QJMeP3XBuAsEaros5kAdoABwJ1UG4AiAWYATJ0BRwAEACZJPQDkGOBs8aqnzcGnDBbgjNggnG/9oQxAgYARgEZybZJcS5Jr165NyGpyDQGw89OdnS8fHT1/tLOzc3T0HXwUHWOr/37t2nlnQWC2+VsCAB/Kt04VAJCToFwQmH4I+X4BGhkBQPIDagHiyQ/oaootwO5RTC3AAbMALFODV99Ikos9xgDF+Z9LAVgUbnA/AlAAYJKkAByZASi+w1nLnsAlAISuAOCag/OhYUoZAcBtOROs1kkc/wAP7Zqiwr8fxbtx/OzR0fZRHMdHR3ESk2FfdOUWgFzRJzUwOABAKwqtH+WyIQBMkdEnLyqTuFMLoNS6OhNYE4Bz59Dz3AiAsRYgpAKOzLWA1gBIc8EwDO/Od340B0BOAcq1gCIAQi0AwofkdxgBoACIucBuAfgIR8BdRSi4xqDaAEwQABO9IK2rD2wMAGJjQMcAhCU1NQGA/J0YAJkL0ADwGGnfmkzoHzzEdRFNLUAKwCbHAKJ0DUBopf/6AKCr/0FEgBmAw4yADXQBeDxoPjJ0WgaAsS3ANQChEwAgIqAEgIyATYwBRJkmFqODXQIQ2gNQJwZYrZDybyAC1EFgCkBKwGbWAqZcDDCddg1AaKH/pkHgDRwHGAFgBIwAKOYHmLbXHGwkQBwZpMwD8LOEKVLBJA2IAYB3TSbFPxYAoMURgD4AUBLw0dAlACAjQAsAKY8A9AKAAoHC6OCaALBOjyAjQA8A3sj1P9lgAF5/7fXXv/r667PXiXQCgISAYn6A+gDQsYFpo6ABALSV63+TARB7BQsATPFWKwDwvYJV80O4AGBSAkBOACqMAOQATLNTzADY9RuXtXzWZoYg0NQFILkbewEjACkBeDUC4A0ApLeICwuACTADQFRPFyMAngDwKHAGALYBJQBg5VMzsHkATLsEgJOzpbNEOwNAIEANAFL/5GgEYJ0AEP4xR8AIwPABsOkSNhG7Bn44J2B0AVUAyB9OAJizeTnR6qz5vqmOAeAIGINARWtgawAQvVUGYO4OgEwyAnyrBl4Spn8GZ6YRcDfxi7k/wHT/udk/TtPJovsHYGeH3kqFEeDUAuQE+JYI6gUAptX2AajkArD608mb3QOQEuBbKviSPF91R93CIX489BCZT36C7xkkTRAxlR6wWwDm7gFgBPjWGDQUACQIWgdgDsJjLmOAjADfmoN9BGCqeRgag+zEOgZICagJAOsPULhrGCbAtw4hvQEwYQBMagEAWwNgyRHwLscAYAJ86xLmJQDLXgAgslxytUG+P4A8P4AOANpzcKL5sIQArzqFjgBk8hoSXv8cAJniPwazTqEEAPnm0TCitxnEFgDkFiD/CJgAr7qF9wXAI5NHppOHJx+dTh7BxTOPPPLoI488/ogtAI1jAKB0AcvljgIA7srnAECXeg0A4LfSoWGeDAxRAfB4RxZg8tCkrgWoCwAwAQCQ/osACKZfAGBlAOD8+fPg0iV4Cb1EAA6/NfFqaJgKANABANEkwgPEnmRF9Hg6Qk8EwLRVAIABgOUSFAFY1QPALGWDQ9HxdMkVL6fEIO2JRbI8GBQAeQxAisGUWIApfEIJACwmgoSby1YAgBZUMQDSfwEAeYonGYB06JgIABsdrB8gPAJALvu/OvvnkgVoG4Bczir0L+YBMAArMwA5ATIAeH6AvcVin8leJvvK+QHkKWJ6BqCbWkA2MJBZgE/CaRULwLsAFxaA6V8AYFUGQEaA7AJW4A2k7P26AGikHwAS3Ez0becWYMosQJRagE9G06e7AEBdDRTqf0xW5QCkBBQAwBYAaX5BrUAZAJZBYB8AJIACABLHFiBLBXMW4LEqAATIC5DnyUoAqPMAWP+yBVjZAMAIGDQAwAAAyAGYugTgw/TBVh0CoE4EketfAuC/2gGAiwoAiLItXUBxmrhuY4AiAdnvLN493B0AAdZ4ZgGmeQwQtAyAOhNI7b8EwMoSAEJADkAz6QkA0DUAUuWnDIBTJXmAhgAw/49bg3MAViUAiARw7UNUkO0fBgBfkcZgTvmBmOzuOtN06YwAfI+QgNvKM4FP4N1L6fRTgasgUAVAGv9VAUAmIGsaQltv7tMYYB9t7osLuA/p/QLYiyqR2+wnBuBlyjd9hqIFAC4B4AgQUsG4Wr8MVGLIAwQNAMjif6FDyKoEAB0BaGN/nyz2RwDMAOQEFHoELUvfQEoFWxKgAiCv/1UDQEMA0T1NBO2nXcK8BsDYLbwtF8BNEzulk8Y2BMCSAAUAqvq/Xv88AGoC3ABwaC1tAyBYgNCtBYCpGZ8EwcNB8GdB8FgQPEFcwEFBJBcAoXh4Dz05qQCAukvYykaUBLiqBXgIQOgcAC4kFC3AAXahBwd5RXq/8BZCHduSgMYAQAihhgDohAChFlDSHNwBAEI1MAz/c1cA2IiYZLEjwBoAvfpFBIoEuAkCfQQgdGgA3ANgR4AZAGAGgP/nKgJc1gK8AQBmADjVfwsAWBHgHgCOAK4W0BEANzsAADIA3OrfFQC/RsIwQKX/xUUNagIUzcHWAITCT6IgIKsF7O2xtgCuBSDHdWgAwA+Q+D/8FPQCgDeycFABwMG+AECRgPnb6EGfCgC4wcFF/cfiNbFdJAC6rQV4A0ArUhsApO9f6wEQLUCRAFsAjAYAyj2FGQFfh13XAjYRAKixALu7CIDd3V1coovdygBktYCKAKQEpNFBuQuwbA5eZwCk1sAmQSADYD/XfU0LUBsARsAIQAOpDkBm/FUAdGsBGAEjAJ1aACMAOgtQ7BUsAkCbg8ErRQCAEQBMwEUBgN1S4T5g/t6bA4C00ZUFSEUCIEYPCkBMtljkz15I/mGX/teLMGbVQO4gXkcx7RGEyldHAMoBeHDChYA8AOW33mxiAd7G307hAlIAdigAoDoAq5i2BaQAaF3AniJZVROAwyHXAjICJmItwJoAYxD4s1u3blVwATEWggFZIcEaJSu8oCukehhfRAUA4lV6TDgxwmfE8dW4IwvQHgBnjh8/Pp3iF1ocPw6P50sm58+fP66TMCzsejATSN5mcvz4/ROyjZdo6z8dP/7w8eNnyYnRg3/5+OOPn8vkcSzoD9Gh42iTvaN4TZHfk/yq6aJSEEgsACtpXAAN8qgFkA7SMk4BdGsBftwaAHN2M125R1AuSZJwWwvhZumLBd1e0CHSuEi+3ILcRoVs46FzD5Lxc5DMqH/uR4vFHwHwMMBnRYslruH/fA9X8/Gvh/M7pAPRYoG22ZtjF0DyAOQsnAf4VQ7AXp0gsLw/iNwQIB2MaFsACQJ/KMjrmeT7fI4BmgGQbmsBCAKs++DUZDEJAgxA8AUEAO0QEhAADpBSf4EXv2YdPvZJ9xEEwMHBgryDGQCdBSgODVQDYNchpABHlLcFDDsI7MQCBMHVycIAQG4Bsr4hZJvsPfh1LQuQuoCzJRZAC8DXLpsAoATs1XcBkZ8A3MUtlQBcQcIDcIVomeylh8i3+xYSCMj25MqV68gOXEIW4Pr165Pgr75x/ToD4Pr16PryIEl++cbeL5GwX48SkOBtuhd9ALSNl2R7d/eXv7xjbQGQ/ksA+KlFn0BBrsHBNQaBJiICUCrydA74Pjq4K+CpidwnEEkULMXRVJQAo+zukoVdDHC23ALMqwLA9RRgLmCxt/fXaWyaVlHQ8gd7ez/b3f2x8PH6cQEOAZBdAJBigiIAxPCjBSEgdQGLq8gx0CCwAEDuAqjk7YCsFlAtBpjPWwbAwgWAzQZgQvtM43xAWgvAAEANACyK+DX53WJWC9ACwKJsiy+y1B2oBgDfV4jOD2D8/loDuTkATBas0zwiwD0A5t7hVgCAKgCAEYBFtRhgskgBwPdZdw6AxgWsGQCHHgaBi8VTQAGDKgjMdj2Itt4DAEsE4VywDgAI9lIAoDETyCTGZ5JFDQCAPQBgBKAiANLku84BYBagGQDAFgAwAlC1GugcgO/t7sUx0fr3qAWIM0Gna8ocADIjtzUEqAAAfQHgXR6ARH92LkCUHIBtJNH28k5BtqnQUkxLqRQB2N2NUwsQcxYgTjV9mxbQ2yzZGysBADYAgBGAGgDw+wQAvnNjO7qhAECQWNzEANCrehe/qAXgzUABAFAAYNvOCxQBABUB8KdLmC8A4GpgWwDIFmC5RE8quMADsL1UShkAYASgbiqY6xBi4QJMACD53u4d4gJwCS2wC8DnIWcRx8RjEIm3hfK2AMC2Oij8gAmAwhdcji7gqWoA4I5BTWOAIgCMEYXSDQBsa2oFvMYvnue3TmZyHgmZ2WIEoBoApGOYAwCI1nfpxZ9bgIoAbOuqhWoLoPyCBd2PLsAEAO0Y6IsF0EWCqmhQ9wU3GgAW/dkHgaxjqHsAaloAHQFSQLjUigUApusjSbqcIqZ9AMrGBk6KYwPdWYBctrmiULYGoFyHhVoAj8UIgBqACXQHQCEG2E1rAdtcLUAhlgAornaQqZeU4fdR+QcCAEAFgDsXcNP7GMAMwAQ2BIBdyfKaB0C42JsAULyIl1y8uAQvQfh9fOyHHeYBbnqfCDICMIGVAFDkAdJlTC5+tCZaj/1wAVYAEIbQihw5POzYBSQNpRkAE9gmAI6DwHYAyNMO6xIDVHABE80EEdvfuXHDNhVstgB3KmcCywC4ldYC/todAJSAAgCVbhvnDwDnz6PnSbwqB0AzPNytBXAHwN/KiaC/rQtAKgwAQsC6AGDvArQTRGgtgCoILLUArlxA1UxgFQDAcgQAtlALcBgD6BuDHLgAQoAqBhBvGMEBwDl+JzHAeyMvpBIAWHvGPMDBQXzgCABzc7ALAMCyVwDc9wm0TYBKEuGnJQBIfUYLkAaBUh6gBgAt9gcABQLKAMBFdwC4rwY2AoDoHxD9WwCwHXcTBLbZI4g7vOwRgDf9cAFU/4Do3waA7dg6ERTXTwS10CdQCcD6WIAqbWBFE4AAiLYtAUAqNlkAJ20BzXoFX0OrLQMA/9QzAKANMbkApQJE/YNoWwOAIRugtAB37jQHoMm4AM3hfKbpw8OiA9lEALYV+rcFIDbFABqzb3YB7kYG6ScZPLniABDtxxoAYHIB2wYCmP5BNQBKawEVg0CHYwN19xoAWPHpSzYQQwcgTwTRwaJ2AGxz+tcDQOdx3RFKXPfgPTEPgLuFl1UDb27fVHQKzeSzVQC4WwDAOHy8AMCqZwDe50cVAKS1AOsgsGkmcLm9VHQLNxsAq/kBTCdk2wkGIEEPXCbKx4+NdAGCF8BtATdK2wJu5G0Bce22ABkAG/1bzRAyFAAMofEWlbLjToVOEFrJAjTrDyABABoCsLsL4a4egGwucWb+/QFgK/KlMcAhADapYBEAO/3rAVjZAqCyACtPLUCnwrcNLvcLks8QnJViciAmawTAfkwm4orphMExnpMLz+9LJ/mlEkNapuMESVP8ssL0IEZRACC+j+gfKgKQLgcEwDHy3EqXbPuYdDzfRVV0CckXtpdv3Xnrzp23eLlEhS/F5EBM1kjjb2EA3sJLupudGpMnFaG8vLREqyXdagMA6Y0YANQFAAQAWG8Aqso2AQDP0DbDAKzQk5d89ja8QueX1QJy2cqLbGJwIksyRdwymxmzXP/fpZC+piFAAkB+qyIAYASAB2A7BQBpZVUAQBTBO3xNfcMI5gIgWWypZgisCADED6zGG1YzSWsASI9hAOQ6woYDsF0FgNv4cecOXr2yv0SXPCrgIHCJVX/7F3fu/DM6lF7sT6Rv3AgAqxmj8QWdkEWJHB6q9noCQF9S1QLcuUMtwJt3UgtAAeAswHZEg8AOAbByAcBiYIgnACgu1pYsACJAC4AYA7A7hmgBwBaAVBi2t1n9sgQAqYtiixYAX/n0NRQAOnIR9J1TAApSDQBmAeoC8CNdcw+5jnUmAlZyAWpZRwAs368SAGyaOALA3pW9AwTAHg/AvyAL8G//tg8PEQCHh3jYVSUAtO19K2gBgFq+Z5EoHgFoAEDBAngGgPluM2sGQP13rgYAnSjyCpkkVKgGIuXjV3yIq4Fo4QsAH18TANoTSwDmLgD4u3n1GKA2AKboEowAVAaAv6PDqyQRS2/UlC9281MF4boD/h1rDLKqBdgDACr2FwAbBoDRWVAlHfzGWNmSHM4LWx5LoUuYqUvpCEAaDu7/xtQZcHAACF1jDJ3KNxAAF+I7AOpu4VRmYARgzQEA4APFITKaoaUjAM0AWCwWW+S5oFtfpCv6EoSdxZ9sPFxfyHTDdaaJGwHoDIAzx45xZ6CN/PAx8l6/e+zd6ZFCt5djdHk/d4JwHp1wegTAZwCO8QAcUwBwLFWzHoBjhQ0ml61kBKCfGODYh/hOa1uKjU9w+x5TAfA57oRTx4rvYH/n6REAVwBwFoBe5Wz1E7ZVMBfCftFAOO3rSrukxvqJckYA1g8A8UKP0SIeLcAmVQNHC9BrEChcxj+RrvnsmKOLfQRgBGAEwE1roCDFlqE7+G6RcrdwTvb3/xHJwcFBHMRBQBZEtvT9AYKgqA77oWHiH7GFSkYAagAw/+ffFPRfAECUAyZGAFIMyEATFQDQFgA4AtAqABIBd+jdYhUAIKu+T56LA/L8H1jriwVTf4BcwBw9sZDSIl8F9Gbm+PkIXS3Ia4VWpQDA3gBoNlWsh+q3capI/xYxAHl+Uczy/0Ty+nI1kK4uFSIFf2MAhwAkyVAAGFiHkBEA5whAaLIAfCpHYQF0kluAzQFAmJ7BFwDmz+DRwVi+OJ8/qwoIZABi9BgBWBsLMC+VggXgCBhdwCYC4JYAQSGkpR4twMvFWsDzah2mtYARgO4AcEpAEQDWiwNqa34jAH0DUJ0AmhhYshcRpgKkBLJgK5BAcm+EhBxgMMDaogQgf8ceE0HDBqAyAfUBKN4Lp8rg35i9/Bsd7AkAcG5DwFZjAojKP4+Uv6wFAHBpAbh33HgAoA0A89w3Cz8t+mEDC8k0TvQfuAbAHCV4BYBAgRcAwAYAEAKCCgQ8RfTvCwCwPwCe+xn1Pl7o3xIACJQ/Ln9zmFIClvWDQJMHqA4AHAHI9W8LgObXlVWtpoHq/NtlAACsdpDcIwJQ1rXXTWsgh8HGAAAbAwDjbkQHAPkZzXME2dYCNhAA6AAAuxjAbAFUkvc1IrrtFYAXGgCQflD2k3sVBMJWAJB6BFkAoBzDlQPQsguAsAyAF9YUANg9ALERAGHonlcA3FxHAGBbAOiDwPjb9gC8+OJXXnzxKhYGgDr07wSAmw0A4H9rDgDm+7zQf2cWICYuAIsFAEjuAbyuf8jJm0hEAEg3wjYAeEHQd3UAvoqFdQBBJQYA7B0A/ofesgBAXxO3DgJjEgMElhaAElA6i3B6nACgHgMe4ztVmG6zZALghaYAKK0CMwc9AiD+AltdABAHlQEA/Nwe4r3y0o7D7QCQFVH8J7T+ugEgvUtPfwCYfg4lDbAxAHFQDYA8CLSyAIqbR7sB4GYrAKQuAAxKmgAQZ9VAyxigUAtQ32BGcBEtAHBzBKAqAMogMLbJA5gtgNkFNAKA3zjM7y5aKB7S+w4ccjv+pWwaCv6Xyz7V7+GGFbBBAMRBZQAA6xtoGQQ2AoC7J8O2awD4Pmpyl7Uk6anXbNcuIOYzgfbVQLHKb7AAgN03uTYANNB5fnv+RecAiC2VLKKakwICYN6LbHXvAnIAatcCDBZgEADMYZSF1OsNgLk5uI1agPkj+2QBWE8USnbdGGBrIyyAsRZwHonLGKADAND/eW9u2BoB0JiAXgGoXg3sIAjkfpwhANCUgLoA3NNSfwBNYxBuCkLLF9vPBHYBAMv+AvzKawFsz2+T3R/Z3v4EKYD0RE0BAEtNK27+UACginO9p0MAqtQCBgIA+BRAWhRmqd2me36brD4CwCfYGWBbWfg4LbgEoFp05QIA+2qgdS2gaSq4IxeQAZBq1QMAVp0D0EY10GcAzKOW+gZg1QIAbdUCWmwO3lL/bBwA3I7qqeC7Ux32YgH4tQyAVR67dwDa7w+wqQCs2gGgZFxAO9VAFQBpj6BeAejdBegBWK36sAC1awEdARCG4YYAsGoJAHfVwKZBoDUAoSiduYCs0AcAlZXfvQWoAkAjC7CJAKx8B8BBLaApAE7EUwBW7QHgyAUYewTZdQkbAdACsPISAEEKFkCGZTgAtCANAaj94dsC4BA/Dw/59eLqAj2voifzxAYAHmIyAmAHwKpVAKrPD6AEgF+rAIDlv+8IgBqAVcsA1AgCGwNAuoQtpI5hXgDQTq/OJgCsVmtnAdLPqwQAxLBPAOZ9igqARqbLsQWABgDyILAxAABuAADKEWDpuPR07RkA0DUAJ06cUAIAYH8AwFZky2MArGsB0CUA+lQw4GazBEqHqmsM8jgILPYKHI4FSFsDoRmAijEAyQRqXIAtAJe4n813AAgB/DS/nNrjF1LhPwgDoNK3O6TiNAhMN6oYvLYBOEflwpNUBgEAQB8YfdZzqTyZSZwX+Q/yJD37ydYBsOsSBn0CYHh5AIPEmh6ftr2AugGgXOlXM2kfAOEHHDgAMXANwKNuASAxgMVVX9YW4DIIFA0AHAYA6Kt97GMfU02IpL4LJ9v1sdYBMMYAEF/9wdLibXIAgoB8GNFqgFVbAAyjFkCywcV7PcTl+YKK5v/w8LlD93kACztiBCC/tWg6RsRFLUBTDayUj9GaWLDaB5RT8Cm6Aqsz6Z5VuoetXnPXHGDsKm4FgOMYQA2A+Y9NF9hmAVB/suXKABwdHdUDoI4FCLoCoFKv4PWwAF+iEtcA4KgrAAIbAAJleFPeIWSTAeA/QFwDgKMWEkEKAJRKrxgE2gGwtWExgABA3BUApRYALi2u/zIAoOgCRgBKxwYyAloHoDwIdAIA4ADQzBE0AiB+DUrAUAAoiQFGANIUAPrq/20hfYoFW5JOEnmHEELACEC3AORadQwA2K7cI+hLg7QA6QcK9L2CjZ1C1xSAxauLTJAFyB9ztswsAAuS1gkAeWDIJgJgZQPWwgIoXIDlTKHWAByKos+J2kiHAGT9gvIrP7cDaPsaUbzGAhTeTPH5PQUADAuANmWrvgUYARg4ADQGyC0Ad+Wnj9QCrB8AjmOANgH4fC2pNkRI+aPh/eR3Yz9gHQDoHp1aRgBsAGirF8GCswDBAv1IC/ZIBVmAoGoMcOuWMDGafP2nP2lE9eaFC4Au8gBDBKCCBZgHTQAAvgCwUscAIwAFAOgeGQC067NCtToTIwDocPAHAJ1DnkjrSH8RWj7UPQCrEYA2LMA7UwKUAID+AWBzbaXPQnGB59xekHvPA3oH+oTNwj0CYOcCGAGqIBBYAGAnVOfXacEpAHTSdRUAbJ6pFgG4hUUoHN7y2wUoY4DMC+i6khtjgL4BADUB4G4f3wUA6u76eR4we7ZqAdCG6gPxBHgHAGGAqPof8OUOiYoXNi5gEwB43sIC8HmAPAgEIgHKDpgafUSlMzy1AwB0CkBXLkChNYcAgOfKAODatL7E7wMaAkqUzwEQjAB4AAAmwOgCRAC2QFmYYTE8PEoV13EMwAEAKsQAYL0BQF9P+sW2yB68lCYrurTFTRFZ2vxeagEqETAC0BoAggdniR22lD7HGf6fF35o6dsXvqzCBVQgwASA/q8sXcCKTsq9giMAIgaqscPVG4O4nLDsAuwJGAHowwKoRo8bPhf5I+tqYDUCzAAEIwBNAAD2AIDYaAECIHz7sCACAPYE3G5gAYp9AgutgenYQOVdJzYBAGDrAkCJC0B/ZgYgFACwJeA2dAwAyEYHpgMF2cJDANpNBKkIMFoAMwDvzH9v+buy6VNCAQA7Am5bxADkXfKuJuxNuVpAizIsALgh3/xGPiiTjcuUc/xWAIB3Fq5+qv30+ueNwcmUAAv9NwCAxQAjAGYAgAIAJQGmRM8hKJr/dOYk5gAUBFQGQB4crEwGiABoXUDCYgASCW6EC4hjrhBz9btsQHYOgIoAIwB2E0UyF5DbgGoAFGYHMAOgiAG4GQIKAMgIbBIA8hlKAmpME5f3CxOrgSkB1QAoTg9SFQB+ighiw0UAxJvQbDgARQKqAJCHAUoXwAioHgO4tABFAISrf+MBKBDQqF8KBiC1ABSHkxUBUE0QxgGQFwsxgFoSUx5gBEBBgFMACAFVAFDOEOgUAIUb6BQA1YfckYQ/gl5klT2dAyARYAzyzEkgXCUIw3sgnxRCBNgBQN5/qRpg1CIAaXtpdwC0P71kdQDUff5ACQHaRAK4h7MAeDW1BmAJ3APw92+++aY0G2qPAKy8BEDZ56+kP8hKn0oCAgBpXcAMANH9EpQCYMgDaABgQaAfAKw6AUCdCBIP6DPFth1CNC4AhL/7+6nxh3YE3MaKWHL6dwoAdgEJXkLSLtQrAB7PMOwYAJocTN87DN9l+Nd/eRuA20j7S9AJAMo+U90A4P8U02UASC6i4ADYjgiIAAATAU8Q/YPlEqw7AB3NMV7LBXAEGAAQggClBUAnhR/90zAgjzD/Oz0BX6D656//igCYf6mEnyiyVwC6upbrBIE8AXoAQH0AtAR8UaV/lwAIEwerGoOaA+CZUW8GAGjWLRxwLkAUNQFq/Y8AeAzAmZoAIAKOFQeuqfWvAqCkT2ApANoeQQMG4AJ+XQCfP30anE5fj1IPf1+MXT44HaeHnAEQGl1AqAdAQcBLGv2PAFQA4DRZZXKfAEALFiA0HqcERMCOAJ3+qwFg/FkXIwBtAaA+hxAQATsCLAGwuWmg6fo3AuCgMcgxBmo27InB6g0biNnEhyUAWPzrDgGACgDkLgHrCAD9kUstAFvHQLiboG0twHBOZGnC3ACgZyBL/RoAaDcPUBkbJwCEoV0iaN0BgH4BcFjm+/czAKTfG4h7Q7dSAkBlF9G5C9ABkKd+8XG2gN1mAi0I6B2AUEoOix8s9B8AffzvDIAjUaT/JByrTEB1ABSbDdoCBI0UAJAP1s8EtucCdJaVjQ/wCYBDRzHAYrX6uXLmw2oA0DUhQGMBFPoHho/qUQwAZADo3r4BOHQBgMawNqny8drjtrH+tTea0t8Sg63YWnFC+wAs8ubfktZAq2qgOwAOmwMQdgTASq1/HgD5g3oDADAAIHUH6hqAw6YZwLAzAFZK/dtagGzTAoBlUwAK1TsJAFIsdAnrwwU0vmFE2BoAin1g3hEAS0cACO+gGbvYbwzgIQC4Iqi2AGYpcQFVACjYgMb6HwGoBEBYEwAbCzApnDDJ5DZ+0g7BSwcAFDRNZoqn08Ub33JIADA5ce+JEyeqtsI4B6CeBZhMyP/BACALQAGoGwdofyBylIsBtH8/NADcJgE7sADv0wMAOABqErB5ALjFoAyAkiCwoQXA2s8AUBBggYLpT0QXsC4xAK3kdATA3EEtYGK0AJMcAOAegI0KAhsDEBYAmM/btgCcCzADAEYAugdgPp+3kgeoA4BybhcDAIZE0Dq4ANAFAPO6ADxhwMGUCi4CkM7oqrnyNxKAWu3uoCUAyl0A8AkAsEEAWP5lKxaAU3mEpHBClMlt8oyWdGsZyVIfgGpx47rVAuzpaccCAPAX/OifNixAWQygBIAGk+tuASr9vQKAeVMLUCp1AAC1EkGc9OYC0P/uEoCK79AQANvkYAsWoA4AcB0AKOkUIHYJS7t/iTuGaAHaASD2AYBaIJgu/1IAOAQGYgEcSHoHaaEjZexDDFARgHLzL478YwAUhg4NygLYSzqtZj67pm4HLsVsx5AA0GMAKgAAVD2C1gqAK2R15QopXcl2rC8AksrLAACxCwD8cwEZAAuywt1B8TPbMXwAyqN/SwDiMgDwxs7OzpeRypTz2JINWs8Xjiu2y/sEEuE+4+98k96rY/gAuA4Cy2t/tgCA5gAo5zyuAUDxa44AVMIA1AJA/S59WIAWAPAmCOwkEdQKAEx/DAB6UACg2HtMAoD+QT8uoH0AzH3VOk0Fg5oAgKYApArWWABrAFoLAlmpDRdQ1luxw/4AoB4Af4xEeJ8/JtKHBfAeANhIWrYAoCYAZ5EIQeBZIvYA6H1+vRhgbQGAfgIg9wC2cAE7rgBI54lPAWC3j5Zz+esCAGzTBYC6AGARACANB7EBAHfVQNojH+gBgE0BcBsEQpcEKAEoGzWumLpbD0BpY5AaANo6ogdAVQ2sbQEEFwDhFEX8y7xxjzX0ubYAC5IY6AMA2NACBFoAgB4AeRogDQB8YxAPQJkoLEDaA8gGAKzh3AJMk6Nkyem/nRigRwBgIwCCKgBY5IoAPwikAQDFqL8eAJABkCo+/dHWCQDYwAUEegAqpAtUhqJHCyDUApgLkHtzrBUAsDYAQXUARJ3rjYAAgBQE1h0catMaCOFxLLogEP4e7cDZQRAYdwcArOkCgooApN5fcPhiJKCNAUAFC9CkObikGujAAlgBADq1ACkBFS1AYAIAKAFQaVvelwMQ92IBBAAgTG8eywAgN/Vt2QKgL49enQIAawAQVAeg2D8oa/lJnT/ZFdN/G9eMARwCAIjFX743swAdAIDpjzu2AJSASi4gqAmApuXHMQCuXUA25KcLAHpwAZSAtgFQdBDLpgQNUwDYq28LcFtoC+jQAsS9xADKOS3NLsAMgK4GoEkFawAAvVkAREA/AKBvTmKAHgCAbQMQGgEIFS4g7isIxK0B/dQC4t5cQJGAJi6g3ACIjUFKAADoqxoIoBgDgHWvBioJaMECVAOgDwsgdAnoemBI3GsMUCDAMQBhCQBhoT+ALgZobVxAwsttnAOmxWVSlJYAiHu1ACIBjl1AOQAFC1AfgGFagN5dgEjAYAEQT5P/yvAmgL8nAQFAM2F5CoD5lxL+uBSA2A8AYI8uQAZA1yGknlQDgLmAfJNKvukaAJL/8wEA2DMAXB5A1yWsNQuQa7gJAFm7RvrHbCNerfJVcYcnLoAjoNQF4AV7ZcXQCIC2S1h6UNslDFR3AY0sQIkLUG+aLEC5qG6b2wsA0NYC4AUHQBjSl6EaaAIgdg1AmzFACwAob5vcDwCwNQBM3cRKu490GgM0AEDtAkoF1AIgqCxVAXDmAkBJPyHnAPRkAeK6LqAjAAJ3ADRrDLI5ogbA6xggBr4DEDhzAXWag5UxQH5AHCoQVgJgtYZSBsD/B+q82xLAGCkiAAAAAElFTkSuQmCCiVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAAAAADRE4smAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE82lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDE5LTAxLTA1VDE4OjMxOjM1KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAxOS0wMS0wNVQxODozMjoxMSswMTowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OGU2YzBmYjEtYTVjOS02MzQ0LTg0YzQtNzhiNTFlNTkyY2FmIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjhlNmMwZmIxLWE1YzktNjM0NC04NGM0LTc4YjUxZTU5MmNhZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhlNmMwZmIx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";

  var baseImg = d3
    .select("body")
    .append("img")
    .attr("id", "heightmap")
    .attr("src", imageURI)
    .style("display", "none");

  baseImg.className += "purgeable";

  let canvas = document.createElement("canvas");
  canvas.id = "allgone-noescape3";
  canvas.className += "purgeable";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = "absolute";
  canvas.style.top = "0px";
  canvas.style.left = "0px";
  canvas.style.zIndex = 3;

  let mask = document.createElement("img");
  mask.id = "mask";
  mask.className += "themeCustom";
  mask.className += " purgeable";

  setTimeout(() => {
    document.body.insertBefore(canvas, document.getElementById("signal"));
    document.body.insertBefore(
      mask,
      document.getElementById("allgone-noescape3")
    );

    canvas = {
      init() {
        this.elem = document.getElementById("allgone-noescape3");
        const gl = this.elem.getContext("webgl", { alpha: true });
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(
          vertexShader,
          `
                uniform mat4 camProj, camView;
                attribute vec3 aPosition, aNormal;
                varying vec3 vColor;
                const vec3 lightDir = vec3(0, 1, 0);
                const vec3 lightColor = 1.0 * vec3(0.35, 0.33, 0.05);
                void main(void) {
                    vec3 normal = mat3(camView) * aNormal;
                    vec4 pos = camView * vec4(aPosition, 1.0);
                    vColor = (lightColor * dot(normal, lightDir) + 0.3 * aPosition.y - 0.8);
                    vColor = mix(vColor, vec3(-5.2 * pos.y, -3.5 * pos.y, -7.8 * pos.y), 0.01);
                    gl_Position = camProj * pos; 
                }
            `
        );
        gl.shaderSource(
          fragmentShader,
          `
                precision highp float;
                varying vec3 vColor;
                void main(void) {
                    gl_FragColor = vec4(vColor, 1.0);
                }
            `
        );
        gl.compileShader(vertexShader);
        gl.compileShader(fragmentShader);
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        gl.useProgram(this.program);
        return gl;
      },
      resize() {
        this.width = this.elem.width = this.elem.offsetWidth;
        this.height = this.elem.height = this.elem.offsetHeight;
        camera.proj.perspective(60, this.width / this.height).load();
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      },
    };
    ////////////////////////////////////////////////////////////////
    const Mat4 = class {
      constructor(program, uName) {
        this.u = gl.getUniformLocation(program, uName);
        this.data = new Float32Array([
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          0,
          1,
        ]);
      }
      identity() {
        const d = this.data;
        d[0] = 1;
        d[1] = 0;
        d[2] = 0;
        d[3] = 0;
        d[4] = 0;
        d[5] = 1;
        d[6] = 0;
        d[7] = 0;
        d[8] = 0;
        d[9] = 0;
        d[10] = 1;
        d[11] = 0;
        d[12] = 0;
        d[13] = 0;
        d[14] = 0;
        d[15] = 1;
        return this;
      }
      translate(x, y, z) {
        const d = this.data;
        d[12] = d[0] * x + d[4] * y + d[8] * z + d[12];
        d[13] = d[1] * x + d[5] * y + d[9] * z + d[13];
        d[14] = d[2] * x + d[6] * y + d[10] * z + d[14];
        d[15] = d[3] * x + d[7] * y + d[11] * z + d[15];
        return this;
      }
      rotateX(angle) {
        const d = this.data;
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const a10 = d[4];
        const a11 = d[5];
        const a12 = d[6];
        const a13 = d[7];
        const a20 = d[8];
        const a21 = d[9];
        const a22 = d[10];
        const a23 = d[11];
        d[4] = a10 * c + a20 * s;
        d[5] = a11 * c + a21 * s;
        d[6] = a12 * c + a22 * s;
        d[7] = a13 * c + a23 * s;
        d[8] = a10 * -s + a20 * c;
        d[9] = a11 * -s + a21 * c;
        d[10] = a12 * -s + a22 * c;
        d[11] = a13 * -s + a23 * c;
        return this;
      }
      rotateY(angle) {
        const d = this.data;
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const a00 = d[0];
        const a01 = d[1];
        const a02 = d[2];
        const a03 = d[3];
        const a20 = d[8];
        const a21 = d[9];
        const a22 = d[10];
        const a23 = d[11];
        d[0] = a00 * c + a20 * -s;
        d[1] = a01 * c + a21 * -s;
        d[2] = a02 * c + a22 * -s;
        d[3] = a03 * c + a23 * -s;
        d[8] = a00 * s + a20 * c;
        d[9] = a01 * s + a21 * c;
        d[10] = a02 * s + a22 * c;
        d[11] = a03 * s + a23 * c;
        return this;
      }
      perspective(fov, aspect) {
        const d = this.data;
        const near = 0.02;
        const far = 100;
        const top = near * Math.tan((fov * Math.PI) / 360);
        const right = top * aspect;
        const left = -right;
        const bottom = -top;
        d[0] = (2 * near) / (right - left);
        d[1] = 0;
        d[2] = 0;
        d[3] = 0;
        d[4] = 0;
        d[5] = (2 * near) / (top - bottom);
        d[6] = 0;
        d[7] = 0;
        d[8] = (right + left) / (right - left);
        d[9] = (top + bottom) / (top - bottom);
        d[10] = -(far + near) / (far - near);
        d[11] = -1;
        d[12] = 0;
        d[13] = 0;
        d[14] = -(2 * far * near) / (far - near);
        d[15] = 0;
        return this;
      }
      load() {
        gl.uniformMatrix4fv(this.u, gl.FALSE, this.data);
        return this;
      }
    };
    ////////////////////////////////////////////////////////////////
    const gl = canvas.init();
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    const camera = {
      proj: new Mat4(canvas.program, "camProj").load(),
      view: new Mat4(canvas.program, "camView").load(),
    };
    canvas.resize();
    window.addEventListener("resize", () => canvas.resize(), false);
    ////////////////////////////////////////////////////////////////
    const decodeHeightMap = () => {
      const width = 512;
      const height = 512;
      const img = document.getElementById("heightmap");
      const cmap = document.createElement("canvas");
      cmap.width = width;
      cmap.height = height;
      const cty = cmap.getContext("2d");
      cty.drawImage(img, 0, 0);
      const hmap = cty.getImageData(0, 0, width, height).data;
      const readPixel = (x, y) => hmap[(y * width + x) * 4];
      const freePixel = (x, y) => hmap[(y * width + x) * 4 + 3] !== 0;
      const Rect = class {
        constructor(x, y, w, h) {
          this.x = x;
          this.y = y;
          this.w = w;
          this.h = h;
          this.c = readPixel(x, y);
        }
        draw() {
          for (let x = this.x; x < this.x + this.w; x++) {
            for (let y = this.y; y < this.y + this.h; y++) {
              hmap[(y * width + x) * 4 + 3] = 0;
            }
          }
          if (this.c > 32)
            iV = concat(
              vertices,
              cube(
                (this.x - width * 0.5) * 0.1,
                (this.y - height * 0.5) * 0.1,
                this.w * 0.1,
                this.c * 0.025,
                this.h * 0.1
              ),
              iV
            );
        }
        grow() {
          let w = this.w;
          let h = this.h;
          let s = true;
          do {
            w++;
            h++;
            s =
              this.sameColorV(this.x, this.y, w, h) &&
              this.sameColorH(this.x, this.y, w, h);
          } while (s);
          w--;
          h--;
          const c1 = readPixel(this.x, this.y + h);
          if (this.c === c1 && freePixel(this.x, this.y + h) === true) {
            do {
              h++;
              s = this.sameColorV(this.x, this.y, w, h);
            } while (s);
            h--;
          } else {
            const c1 = readPixel(this.x + w, this.y);
            if (this.c === c1 && freePixel(this.x + w, this.y) === true) {
              do {
                w++;
                s = this.sameColorH(this.x, this.y, w, h);
              } while (s);
              w--;
            }
          }
          this.w = w;
          this.h = h;
        }
        sameColorV(x0, y0, w, h) {
          const c0 = readPixel(x0, y0);
          for (let x = x0; x < x0 + w; x++) {
            const c = readPixel(x, y0 + h - 1);
            if (c !== c0 || freePixel(x, y0 + h - 1) === false) return false;
          }
          return true;
        }
        sameColorH(x0, y0, w, h) {
          const c0 = readPixel(x0, y0);
          for (let y = y0; y < y0 + h; y++) {
            const c = readPixel(x0 + w - 1, y);
            if (c !== c0 || freePixel(x0 + w - 1, y) === false) return false;
          }
          return true;
        }
      };
      const vertices = new Float32Array(2000000);
      let iV = 0;
      const cube = (x, z, l, h, w) => [
        x,
        h,
        z,
        0,
        1,
        0,
        x,
        h,
        z + w,
        0,
        1,
        0,
        x + l,
        h,
        z + w,
        0,
        1,
        0,
        x,
        h,
        z,
        0,
        1,
        0,
        x + l,
        h,
        z + w,
        0,
        1,
        0,
        x + l,
        h,
        z,
        0,
        1,
        0,
        x,
        0,
        z,
        -1,
        0,
        0,
        x,
        0,
        z + w,
        -1,
        0,
        0,
        x,
        h,
        z + w,
        -1,
        0,
        0,
        x,
        0,
        z,
        -1,
        0,
        0,
        x,
        h,
        z + w,
        -1,
        0,
        0,
        x,
        h,
        z,
        -1,
        0,
        0,
        x + l,
        0,
        z,
        1,
        0,
        0,
        x + l,
        h,
        z,
        1,
        0,
        0,
        x + l,
        h,
        z + w,
        1,
        0,
        0,
        x + l,
        0,
        z,
        1,
        0,
        0,
        x + l,
        h,
        z + w,
        1,
        0,
        0,
        x + l,
        0,
        z + w,
        1,
        0,
        0,
        x,
        0,
        z,
        0,
        0,
        -1,
        x,
        h,
        z,
        0,
        0,
        -1,
        x + l,
        h,
        z,
        0,
        0,
        -1,
        x,
        0,
        z,
        0,
        0,
        -1,
        x + l,
        h,
        z,
        0,
        0,
        -1,
        x + l,
        0,
        z,
        0,
        0,
        -1,
        x,
        0,
        z + w,
        0,
        0,
        1,
        x + l,
        0,
        z + w,
        0,
        0,
        1,
        x + l,
        h,
        z + w,
        0,
        0,
        1,
        x,
        0,
        z + w,
        0,
        0,
        1,
        x + l,
        h,
        z + w,
        0,
        0,
        1,
        x,
        h,
        z + w,
        0,
        0,
        1,
      ];
      const attribute = (program, name, data, size, stride, offset) => {
        if (data !== null) {
          const buffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        }
        const index = gl.getAttribLocation(program, name);
        gl.enableVertexAttribArray(index);
        gl.vertexAttribPointer(index, size, gl.FLOAT, false, stride, offset);
      };
      const concat = (a1, a2, index) => {
        for (let i = 0, l = a2.length; i < l; i++) {
          a1[index++] = a2[i];
        }
        return index;
      };
      let nr = 0;
      const heap = [[0, 0]];
      do {
        const c = heap.shift();
        if (freePixel(c[0], c[1]) === true) {
          const r = new Rect(c[0], c[1], 1, 1);
          r.grow();
          r.draw();
          if (r.y + r.h < height && freePixel(r.x, r.y + r.h) === true)
            heap.push([r.x, r.y + r.h]);
          if (r.x + r.w < width && freePixel(r.x + r.w, r.y) === true)
            heap.push([r.x + r.w, r.y]);
        }
      } while (heap.length);
      attribute(canvas.program, "aPosition", vertices, 3, 24, 0);
      attribute(canvas.program, "aNormal", null, 3, 24, 12);
      return iV / 6;
    };
    let numElements = decodeHeightMap();
    ////////////////////////////////////////////////////////////////
    let ry = 51.2,
      time = 0,
      dt = 0.02;
    let rx = 0.5 * Math.PI * Math.floor(Math.random() * 4);
    const run = (newTime) => {
      requestAnimationFrame(run);
      let d = 0.3 * (newTime - time);
      if (d > 0.6) d = 0.6;
      dt += (d - dt) * 0.2;
      time = newTime;
      ry += dt;
      let cameraHorizon = 0.05;
      camera.view
        .identity()
        .rotateX(cameraHorizon)
        .translate(0.15, -13, ry % 51.2)
        .rotateY(rx)
        .load();
      gl.drawArrays(gl.TRIANGLES, 0, numElements);
      camera.view
        .identity()
        .rotateX(cameraHorizon)
        .translate(0.15, -13, -51.2 + (ry % 51.2))
        .rotateY(rx)
        .load();
      gl.drawArrays(gl.TRIANGLES, 0, numElements);
      camera.view
        .identity()
        .rotateX(cameraHorizon)
        .translate(0.15, -13, -102.4 + (ry % 51.2))
        .rotateY(rx)
        .load();
      gl.drawArrays(gl.TRIANGLES, 0, numElements);
      camera.view
        .identity()
        .rotateX(cameraHorizon)
        .translate(0.15, -13, -153.6 + (ry % 51.2))
        .rotateY(rx)
        .load();
      gl.drawArrays(gl.TRIANGLES, 0, numElements);
    };
    requestAnimationFrame(run);
  }, 10);
};

const bloodDragon = () => {
  sun();
  cityScape();
  voronoiBackground();
};

//module.exports = () => {sun();cityScape();voronoiBackground();};
