const { ipcRenderer } = require("electron"); // ipcRenderer manages messages with Main Process

ipcRenderer.on("scroll-to", (event, message) => {
  smoothScrollTo(message);
});

const tuto = step => {
  ipcRenderer.send("tutorial", step);
};
