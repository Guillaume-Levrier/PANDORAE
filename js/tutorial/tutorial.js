const {ipcRenderer,shell} = require('electron');                       // ipcRenderer manages messages with Main Process

ipcRenderer.send("window-ids","tutorial",remote.getCurrentWindow().id);

ipcRenderer.on('window-close', (event,message) => {
  closeWindow();
});

ipcRenderer.on('scroll-to', (event,message) => {
  smoothScrollTo(message)
});

const tutoFlux = (step) => {
  ipcRenderer.send('tutorial','flux',step);
  closeWindow();
}