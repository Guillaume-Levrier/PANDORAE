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

const msg =
  "      ______\n     / _____|\n    /  ∖____  Anthropos\n   / /∖  ___|     Ecosystems\n  / /  ∖ ∖__\n /_/    ∖___|           PANDORÆ";

import { CMT } from "../locales";

var dispose = false;

var CM = CMT["EN"]; // Load the EN locale first

var typeSelector = false;

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

var keylock = 0;

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
      window.electron.send(res.data.dest, res.data.msg); // Send the notification to the main process for dispatch
    }
  };

  multiThreader.onerror = (err) => {
    // If the multiThreader reports an error
    window.electron.send("audio-channel", "error");
    field.value = CM.global.field.workerError;
    window.electron.send("console-logs", "ERROR - MULTITHREADING DISABLED"); // Send an error message to the console
    window.electron.send("console-logs", JSON.stringify(err)); // Send the actual error content to the console
  };
}

const mainDisplay = (type) => {
  field.value = "preparing " + type;
  window.electron.send("console-logs", "Preparing " + type);
  displayCore();
  purgeXtype();
  toggleTertiaryMenu();
  listTableDatasets(type);
};

var logContent = "";
let log;

var mainPresContent = [];
var mainPresEdit = false;
var priorDate = false;

const initializeMainScreen = () => {
  const iconDiv = document.getElementById("icons");
  const xtype = document.getElementById("xtype"); // xtype is a div containing each (-type) visualisation

  // =========== LANGUAGE SELECTION ===========
  var CM = CMT["EN"]; // Load the EN locale at start

  fs.readFile(
    userDataPath + "/PANDORAE-DATA/userID/user-id.json",
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
        userDataPath + "/PANDORAE-DATA/userID/user-id.json",
        "utf8",
        (err, data) => {
          data = JSON.parse(data);
          data.locale = lg.innerText;
          data = JSON.stringify(data);
          fs.writeFile(
            userDataPath + "/PANDORAE-DATA/userID/user-id.json",
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

  iconCreator("menu-icon", toggleMenu, "Toggle menu");
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

  iconCreator("option-icon", toggleConsole, "Toggle console");

  log = document.getElementById("log");

  ipcRenderer.on("console-messages", (event, message) => addToLog(message));

  ipcRenderer.on("mainWindowReload", (event, message) => {
    location.reload();
  });

  // ========== MAIN MENU OPTIONS ========

  field.addEventListener("focusin", () => (keylock = 1));
  field.addEventListener("focusout", () => (keylock = 0));

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
    window.electron.send("window-manager", "closeWindow", "index");
  };

  const refreshWindow = () => {
    location.reload();
  };

  const reframeMainWindow = () => {
    // remote.mainWindow({ frame: true });
  };

  //// ========== TUTORIAL ========

  window.electron.send("userStatus", true);

  ipcRenderer.on("userStatus", (event, user) => kickStart(user));

  const kickStart = (user) => {
    if (user.UserName === "") {
      menuIcon.style.cursor = "not-allowed";
      consoleIcon.style.cursor = "not-allowed";
      //document.getElementById("tutostartmenu").style.display = "block";
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
      case "istexRequest":
      case "sendToZotero":
      case "zoteroImport":
      case "reImportToSystem":
        openHelper("tutorialHelper", message);
        blinker("menu-icon");
        blinker("fluxMenu");
        break;

      case "openTutorial":
        openTutorial(tutoSlide);
        break;
    }
  });

  document.addEventListener("keydown", keyShortCuts);

  requestTheme();

  ipcRenderer.on("cmdInputFromRenderer", (event, command) => {
    cmdinput(command);
  });
};

export { initializeMainScreen };
