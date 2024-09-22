// =========== CONSOLE ===========

import { CM } from "../locales/locales";
import { displayCore, purgeXtype } from "./core";
import { toggledTertiaryMenu, toggleMenu, toggleTertiaryMenu } from "./menu";
import { resetPandoratio } from "./pulse";
import { selectTheme } from "./themes";
import { listTableDatasets, resetCategoryStyle } from "./type-loader";

let toggledConsole = false;

const log = document.getElementById("log");
const menu = document.getElementById("menu");
const consoleDiv = document.getElementById("console");
const menuIcon = document.getElementById("menu-icon");

var commandReturn = "";
var logContent = "";

const toggleConsole = () => {
  if (toggledConsole) {
    window.electron.send("console-logs", "Hiding console");
    consoleDiv.style.zIndex = "-1";
    consoleDiv.style.display = "none";
    toggledConsole = false;
  } else {
    window.electron.send("console-logs", "Displaying console");
    consoleDiv.style.zIndex = "7";
    consoleDiv.style.display = "block";
    toggledConsole = true;
  }
};

const addToLog = (message) => {
  logContent += message;
  log.innerText = logContent;
  log.scrollTop = log.scrollHeight;
};

var previousType = 0;

const mainDisplay = (datasets, type) => {
  field.value = `preparing ${CM.types.names[type].toLowerCase()} exploration`;
  window.electron.send("console-logs", "Preparing " + type);
  displayCore();
  purgeXtype();
  if (toggledTertiaryMenu) {
    toggleTertiaryMenu();
    if (type != previousType) {
      setTimeout(() => {
        toggleTertiaryMenu();
        listTableDatasets(datasets, type);
        previousType = type;
      }, 200);
    } else {
      resetCategoryStyle();
    }
  } else {
    toggleTertiaryMenu();
    listTableDatasets(datasets, type);
    previousType = type;
  }
};

const cmdinput = (input) => {
  input = input.toLowerCase();

  window.electron.send("console-logs", " user$ " + input);

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

      /*       case "zoom":
        zoomThemeScreen(activeTheme);
        break;

      case "unzoom":
        zoomThemeScreen(activeTheme);
        break; */

      case CM.mainField.toggleConsole:
        toggleConsole();
        break;

      case "hypercore":
        document.body.style.animation = "fadeout 0.5s";
        setTimeout(() => {
          document.body.remove();
          window.electron.send("change-theme", "blood-dragon");
          location.reload();
        }, 450);
        break;

      case CM.mainField.toggleMenu:
        toggleMenu();
        break;

      case "help":
        //toggleHelp();
        break;

      case "gazouillotype":
      case "webArchive":
      case "anthropotype":
      case "geotype":
      case "chronotype":
        toggleMenu();
        categoryLoader("type");
        mainDisplay(input);

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
          window.electron.invoke("restart", true);
        }, 450);
        break;

      case CM.mainField.reloadCore:
        resetPandoratio();
        break;

      case "transfect":
        pulse(1, 1, 10);
        break;

      case "detransfect":
        pulse(1, 1, 10, true);
        break;

      case CM.mainField.openDevtools:
        commandReturn = "opening devtools";
        window.electron.invoke("mainDevTools", true);
        window.electron.send("console-logs", "opening devtools");
        break;

      case CM.mainField.unlockMenu:
        menuIcon.onclick = toggleMenu;
        menuIcon.style.cursor = "pointer";
        consoleIcon.style.cursor = "pointer";
        field.removeEventListener("click", () => openTutorial(tutoSlide));
        break;

      case CM.mainField.version:
        commandReturn = version;
        break;

      case CM.mainField.fullscreen:
        window.electron.invoke("toggleFullScreen", true);
        commandReturn = "";
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
  setTimeout(() => (field.value = ""), 1500);
  document.getElementById("cli-field").value = commandReturn;
};

//ipcRenderer.on("cmdInputFromRenderer", (event, command) => cmdinput(command));

window.electron.cmdInputFromRenderer((data) => cmdinput(command));

export { toggleConsole, addToLog, mainDisplay, cmdinput };
