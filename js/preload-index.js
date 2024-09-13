const { contextBridge, ipcRenderer } = require("electron");

console.log("hello there");

contextBridge.exposeInMainWorld("electron", {
  getPreloadPath: () => ipcRenderer.sendSync("get-preload-path"),
});

contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  // we can also expose variables, not just functions
});
