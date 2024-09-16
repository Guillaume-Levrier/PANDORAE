//========== CHÆEROS ==========
//When Flux actions are too heavy to be quasi-instantaneous, powerValve sends a message to the main process. This
//message is both the function to be executed, and an object containing its arguments. Once recieved, the main process
//creates a new invisible (never shown) window which calls the chaeros module, and executes one of the functions below,
//depending on what has been called by powerValve and transmitted by the main process. While executing, the chaeros
//module sends messages to the main process informing of the state of the function's execution, which is in turn
//redispatched to the index's "coreCanvas" and "field" (the main field), which subsequently impacts the core animation
//and the field's value.

const { ipcRenderer } = require("electron"); // Load ipc to communicate with main process
const userDataPath = window.electron.sendSync("remote", "userDataPath"); // Find userData folder Path
const appPath = window.electron.sendSync("remote", "appPath");
const bottleneck = require("bottleneck"); // Load bottleneck to manage API request limits
const fs = require("fs"); // Load filesystem to manage flatfiles
const MultiSet = require("mnemonist/multi-set"); // Load Mnemonist to manage other data structures
const d3 = require("d3");
const csv = require("csv-parser");
const { promises } = require("dns");

var winId = 0;
var currentDoc = {};

var geolocationActive = false;
var altmetricActive = false;
