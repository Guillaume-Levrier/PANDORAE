const { ipcRenderer } = require("electron");

var selfWinId = 0;
var charWinId = 0;

ipcRenderer.on("id", (event, id) => {
  selfWinId = id;
});

ipcRenderer.on("chaeros-id", (event, id) => {
  charWinId = id;
});

window.addEventListener("load", (e) => {
  var doiEls = document.getElementsByClassName("highwire-cite-metadata-doi");
  var DOIs = [];

  for (const d of doiEls) {
    DOIs.push(d.innerText);
  }

  let sendInterval = setInterval(() => {
    if (selfWinId > 0 && charWinId > 0) {
      // make sure that this chaeros process ID is known

      try {
        window.electron.send("biorxivRetrieve", {
          type: "biorxiv-content",
          content: DOIs,
          charWindId: charWinId,
        });
      } catch (err) {
        console.log(err);
        window.electron.send("console-logs", err);
        window.electron.send("chaeros-failure", JSON.stringify(err));
      } finally {
        setTimeout(() => {
          window.electron.send("win-destroy", selfWinId);
        }, 200);
        clearInterval(sendInterval);
      }
    }
  }, 50);
});
