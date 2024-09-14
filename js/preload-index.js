console.log("|==== INDEX PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, message) => ipcRenderer.send(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
  coreSignal: (callback) =>
    ipcRenderer.on("coreSignal", (e, ...args) => callback(args)),
  cmdInputFromRenderer: (callback) =>
    ipcRenderer.on("cmdInputFromRenderer", (e, ...args) => callback(args)),
  themeContent: (callback) =>
    ipcRenderer.on("themeContent", (e, ...args) => callback(args)),
});

console.log("|==== INDEX PRELOAD ENDS HERE ====|");
