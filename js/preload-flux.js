console.log("|==== FLUX PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, message) => ipcRenderer.send(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
  forcedPPSupdateFinished: (callback) =>
    ipcRenderer.on("forcedPPSupdateFinished", (e, ...args) =>
      callback(args[0])
    ),
});

console.log("|==== FLUX PRELOAD ENDS HERE ====|");
