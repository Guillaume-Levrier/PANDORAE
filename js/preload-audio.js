console.log("|==== AUDIO PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // send
  send: (channel, message) => ipcRenderer.send(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
});

console.log("|==== INDEX PRELOAD ENDS HERE ====|");
