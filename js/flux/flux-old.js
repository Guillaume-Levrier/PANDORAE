//========== REQUIRED MODULES ==========
const { ipcRenderer, shell } = require("electron"); // ipcRenderer manages messages with Main Process
const userDataPath = window.electron.sendSync("remote", "userDataPath"); // Find userData folder Path
const tg = require("@hownetworks/tracegraph");
const fs = require("fs"); // FileSystem reads/writes files and directories
const d3 = require("d3");
const { distance, closest } = require("fastest-levenshtein");
const csv = require("csv-parser");

var CM = CMT["EN"];

var ISSNarr = [];

const date = () =>
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();
