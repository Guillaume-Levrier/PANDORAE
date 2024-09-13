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
const userDataPath = window.electron.sendSync("remote", "userDataPath"); // Find userData folder Path
const appPath = window.electron.sendSync("remote", "appPath");
//const types = require(appPath+"/js/types");
const fs = require("fs");
const d3 = require("d3");
const THREE = require("three");
const Quill = require("quill");
