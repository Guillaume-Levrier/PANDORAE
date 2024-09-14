console.log("|==== FLUX PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, message) => window.electron.send(channel, message),
  invoke: (channel) => window.electron.invoke(channel, true),
});

console.log("|==== FLUX PRELOAD ENDS HERE ====|");
