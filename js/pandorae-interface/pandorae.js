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
  "      ______\n     / _____|\n    /  ∖____   PANDORÆ \n   / /∖  ___|     \n  / /  ∖ ∖__\n /_/    ∖___|           ";

console.log(msg);

import { CMT } from "../locales/locales";
import { addToLog, cmdinput, toggleConsole } from "./console";
import { iconCreator } from "./icon";
import { keyShortCuts } from "./keyboard-shortcuts";
import { activateMenu } from "./locale-select";
import { toggleMenu } from "./menu";
import { nameDisplay } from "./pulse";
import { requestTheme } from "./themes";
import { requestStatus } from "./kickstart";

var CM = CMT["EN"]; // Load the EN locale first

// for export purposes

var presentationStep = [];

var tutoSlide;
var field;

// =========== SHARED WORKER ===========
// Some datasets can be very large, and the data rekindling necessary before display that
// couldn't be done in Chaeros can be long. In order not to freeze the user's mainWindow,
// most of the math to be done is sent to a Shared Worker which loads the data and sends
// back to Types only what it needs to know.
if (!window.SharedWorker) {
  // If the SharedWorker doesn't exist yet

  var multiThreader = new Worker("js/mul[type]threader.js"); // Create a SharedWorker named multiThreader based on that file

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

const initializeMainScreen = () => {
  // =========== MAIN LOGO ===========
  // Main logo is a text that can be changed through the nameDisplay function

  // Version right now
  document.getElementById("version").innerHTML = "VERSION vX.x.x";

  nameDisplay(CM.global.coreLogo);

  // clicking the pandorae menu logo reloads the mainWindow. So does typing "reload" in the main field.
  aelogo.addEventListener("dblclick", () => location.reload());

  const field = document.getElementById("field"); // Field is the main field

  // =========== MENU ===========
  // menu elements
  activateMenu();

  // MENU ICONS
  iconCreator("menu-icon", toggleMenu, "Toggle menu");

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

  // ====== CONSOLE ======

  // create icons
  iconCreator("option-icon", toggleConsole, "Toggle console");

  // enter command on click
  field.addEventListener("click", (event) => cmdinput(field.value));

  // enter command on enter keydown
  field.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      cmdinput(field.value);
      e.preventDefault();
    }
  });

  // ========== EVENTS FROM MAIN =========
  // log to console

  window.electron.consoleMessages((message) => addToLog(message));

  // force reload from main
  window.electron.mainWindowReload(() => location.reload());

  // ========== KEYBOARD INTERACTIONS =========

  document.addEventListener("keydown", keyShortCuts);

  //  ========== LOAD SELECTED THEME =========

  requestTheme();

  // =========== KICKSTART ===========
  requestStatus();
};

export { initializeMainScreen };
