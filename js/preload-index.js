console.log("|==== INDEX PRELOAD STARTS HERE ====|");

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // send
  send: (channel, message) => ipcRenderer.send(channel, message),
  invoke: (channel) => ipcRenderer.invoke(channel, true),
  // receive
  coreSignal: (callback) =>
    ipcRenderer.on("coreSignal", (e, ...args) => callback(args)),
  cmdInputFromRenderer: (callback) =>
    ipcRenderer.on("cmdInputFromRenderer", (e, ...args) => callback(args)),
  themeContent: (callback) =>
    ipcRenderer.on("themeContent", (e, ...args) => callback(args[0])),
  consoleMessages: (callback) =>
    ipcRenderer.on("consoleMessages", (e, ...args) => callback(args[0])),
  mainWindowReload: (callback) =>
    ipcRenderer.on("mainWindowReload", (e, ...args) => callback()),
  userStatus: (callback) =>
    ipcRenderer.on("userStatus", (e, ...args) => callback(args[0])),
  tutorial: (callback) =>
    ipcRenderer.on("tutorial", (e, ...args) => callback(args[0])),
  backToPres: (callback) =>
    ipcRenderer.on("backToPres", (e, ...args) => callback(args[0])),
  databaseReply: (callback) =>
    ipcRenderer.on("databaseReply", (e, ...args) => callback(args[0])),
});

console.log("|==== INDEX PRELOAD ENDS HERE ====|");
