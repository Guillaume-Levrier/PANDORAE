const { ipcRenderer } = require("electron"); // ipcRenderer manages messages with Main Process

ipcRenderer.send("window-ids", "tutorial", remote.getCurrentWindow().id, true);

ipcRenderer.on("window-close", (event, message) => {
  ipcRenderer.send(
    "window-ids",
    "tutorial",
    remote.getCurrentWindow().id,
    false
  );
  closeWindow();
});

ipcRenderer.on("scroll-to", (event, message) => {
  smoothScrollTo(message);
});

const tuto = step => {
  ipcRenderer.send(
    "window-ids",
    "tutorial",
    remote.getCurrentWindow().id,
    false
  );
  ipcRenderer.send("tutorial", step);
  closeWindow();
};
