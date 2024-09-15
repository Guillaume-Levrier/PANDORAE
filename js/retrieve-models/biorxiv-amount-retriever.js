const { ipcRenderer } = require("electron");

var winId = 0;

//window.addEventListener('DOMContentLoaded', (event) => {
ipcRenderer.on("id", (event, id) => {
  winId = id;
});
// })

window.addEventListener("load", (e) => {
  let resAmount = document.getElementById("page-title").innerText;
  window.electron.send("biorxivRetrieve", {
    type: "biorxiv-amount",
    content: resAmount,
  });
  setTimeout(() => {
    window.electron.send("win-destroy", winId);
  }, 200);
});
