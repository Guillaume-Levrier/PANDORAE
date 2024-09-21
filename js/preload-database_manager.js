console.log("|==== DATABASE MANAGER PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // send
  send: (channel, message) => ipcRenderer.send(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
  // receive
  database: (callback) =>
    ipcRenderer.on("database", (e, args) => callback(e, args)),
});

console.log("|==== DATABASE MANAGER ENDS HERE ====|");
