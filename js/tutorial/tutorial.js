const {ipcRenderer} = require('electron');                       // ipcRenderer manages messages with Main Process

ipcRenderer.send("window-ids","tutorial",remote.getCurrentWindow().id);

const tutoFlux = () => {
  ipcRenderer.send('tutorial','flux');
  closeWindow();
}
