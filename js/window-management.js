const remote = require('electron').remote;

const closeWindow = () => {
       remote.getCurrentWindow().close();
}

const refreshWindow = () => {
       remote.getCurrentWindow().reload();
}

const reframeMainWindow = () => {
        remote.mainWindow({frame: true})
}
