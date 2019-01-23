const {ipcRenderer} = require('electron');                       // ipcRenderer manages messages with Main Process

const tutoFlux = () => {
  ipcRenderer.send('tutorial','flux');
  closeWindow();
}
