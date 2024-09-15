console.log("|==== FLUX PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

const userDataPath = ipcRenderer.sendSync("remote", "userDataPath");
const appPath = ipcRenderer.sendSync("remote", "appPath");
contextBridge.exposeInMainWorld("electron", {
  send: (channel, message) => ipcRenderer.send(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
  userDataPath,
  appPath,
  forcedPPSupdateFinished: (callback) =>
    ipcRenderer.on("forcedPPSupdateFinished", (e, ...args) =>
      callback(args[0])
    ),
  biorxivRetrieve: (callback) =>
    ipcRenderer.on("biorxivRetrieve", (e, ...args) => callback(args[0])),
});

console.log("|==== FLUX PRELOAD ENDS HERE ====|");
