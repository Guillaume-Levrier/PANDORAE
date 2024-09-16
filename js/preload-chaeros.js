console.log("|==== CHAEROS PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, message) => ipcRenderer.send(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
  chaerosCompute: (callback) =>
    ipcRenderer.on("forcedPPSupdateFinished", (e, ...args) => callback(args)),
});

console.log("|==== CHAEROS PRELOAD ENDS HERE ====|");
