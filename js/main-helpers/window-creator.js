import { activateMainListeners } from "./cablage";

const electron = require("electron");
const { app, BrowserView, BrowserWindow, ipcMain, shell, dialog, WebContents } =
  electron;

const basePath = app.getAppPath();

var windowIds = {
  flux: { id: 0, open: false },
  tutorialHelper: { id: 0, open: false },
  tutorial: { id: 0, open: false },
  chaeros: [],
  index: { id: 0, open: false },
};

let mainWindow;

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreenable: true,
    backgroundColor: "white",
    titleBarStyle: "hidden",
    frame: true,
    resizable: true,
    webPreferences: {
      //preload: basePath + "/js/preload-index.js",
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegrationInWorker: true,
      /* plugins: true, */
    },
  });

  windowIds.index.id = mainWindow.id;
  windowIds.index.open = true;

  //mainWindow.loadFile("index.html");
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.setMenu(null);

  mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));

  activateMainListeners();
};

const windowManager = (message) => {
  const type = message.type;
  const file = message.file;
  const scrollTo = message.scrollTo;
  const section = message.section;

  switch (type) {
    case "openHelper":
      openHelper(file, section);
      break;
    case "openFlux":
      openFlux();
      break;
    case "openModal":
      openModal(file, scrollTo);
      break;

    case "closeWindow":
      try {
        BrowserWindow.fromId(windowIds[file].id).close();
        windowIds[file].open = false;
      } catch (e) {
        console.log(e);
      }
      break;
  }
};

const createAudioManager = () => {
  let audioManager = new BrowserWindow({
    width: 10,
    height: 10,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      preload: basePath + "/js/preload-audio.js",
    },
  });

  audioManager.loadFile("html/audioManager.html");
  audioManager.webContents.on("did-finish-load", function () {
    // audioManager.webContents.openDevTools();
  });
  ipcMain.on("audio-channel", (event, audio) => {
    audioManager.webContents.send("audio-channel", audio);
  });

  mainWindow.on("closed", () => {
    setTimeout(() => {
      app.quit();
    }, 1000);
  });
};

const openModal = (modalFile, scrollTo) => {
  if (windowIds[modalFile].open === false) {
    let win = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      transparent: true,
      alwaysOnTop: true,
      frame: false,
      resizable: false,
      show: false,
      y: 100,
      webPreferences: {
        preload: basePath + "/js/preload-" + modalFile + ".js",
        nodeIntegrationInWorker: true,
      },
    });

    //var path = basePath + "/html/" + modalFile + ".html";
    win.loadFile("html/" + modalFile + ".html");
    win.once("ready-to-show", () => {
      win.show();
      windowIds[modalFile].id = win.id;
      windowIds[modalFile].open = true;
      if (scrollTo) {
        setTimeout(() => win.webContents.send("scroll-to", scrollTo), 1000);
      }
    });
    win.webContents.openDevTools();
  }
};
var fluxWindow;

const openFlux = () => {
  fluxWindow = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    transparent: true,
    alwaysOnTop: true,
    frame: false,
    resizable: false,
    show: false,
    y: 100,
    webPreferences: {
      preload: FLUX_PRELOAD_WEBPACK_ENTRY,
      //preload: basePath + "/js/preload-" + modalFile + ".js",
      nodeIntegrationInWorker: true,
    },
  });

  //var path = basePath + "/html/" + modalFile + ".html";
  //win.loadFile("html/" + modalFile + ".html");
  fluxWindow.loadURL(FLUX_WEBPACK_ENTRY);

  fluxWindow.once("ready-to-show", () => {
    fluxWindow.show();
    windowIds["flux"].id = fluxWindow.id;
    windowIds["flux"].open = true;
  });

  fluxWindow.webContents.openDevTools();
};
const biorXivScraper = (model, address, chaerosWinId) => {
  let biorXivWindow = new BrowserWindow({
    width: 10,
    height: 10,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      preload: basePath + "/js/retrieve-models/" + model + ".js",
    },
  });

  biorXivWindow.loadURL(address);

  biorXivWindow.webContents.on("did-finish-load", function () {
    biorXivWindow.webContents.send("id", biorXivWindow.id);

    if (chaerosWinId) {
      biorXivWindow.webContents.send("chaeros-id", chaerosWinId);
    }

    //  biorXivWindow.webContents.openDevTools();
  });
};

const chaerosCalculator = (powerValveAction) => {
  let chaerosWindow = new BrowserWindow({
    width: 10,
    height: 10,
    frame: false,
    transparent: true,
    show: false,
    webPreferences: {
      preload: basePath + "/js/preload-chaeros.js",
      nodeIntegrationInWorker: true,
      plugins: true,
    },
  });

  chaerosWindow.loadURL(CHAEROS_WEBPACK_ENTRY);

  chaerosWindow.webContents.on("did-finish-load", function () {
    chaerosWindow.webContents.send("id", chaerosWindow.id);
    chaerosWindow.webContents.openDevTools();
    chaerosWindow.webContents.send("chaerosCompute", powerValveAction);
  });
};

const openHelper = (helperFile, message) => {
  let screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width;
  let screenHeight = electron.screen.getPrimaryDisplay().workAreaSize.height;

  let win = new BrowserWindow({
    backgroundColor: "white",
    resizable: false,
    frame: true,
    width: 350,
    height: 700,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    x: screenWidth - 350,
    y: 100,
    webPreferences: {
      preload: basePath + "/js/tuto-help.js",
    },
  });

  windowIds.tutorialHelper.id = win.id;
  windowIds.tutorialHelper.open = true;

  win.once("ready-to-show", () => {
    win.webContents.send("tutorial-types", message);
    win.show();
  });
  var path = "file://" + __dirname + "/html/" + helperFile + ".html";
  win.loadURL(path);
};

async function toggleFullScreen() {
  const state = mainWindow.isFullScreen();

  mainWindow.setFullScreen(!state);

  mainWindow.reload();
}

const bioRxivManager = (message) => {
  switch (message.type) {
    case "request":
      biorXivScraper(message.model, message.address, message.winId);
      break;

    case "biorxiv-amount":
      BrowserWindow.fromId(windowIds.flux.id).webContents.send(
        "biorxivRetrieve",
        message
      );
      break;

    case "biorxiv-content":
      BrowserWindow.fromId(message.charWindId).webContents.send(
        "biorxivRetrieve",
        message
      );

      break;
  }
};

export {
  createMainWindow,
  createAudioManager,
  mainWindow,
  openModal,
  openFlux,
  openHelper,
  windowManager,
  toggleFullScreen,
  windowIds,
  bioRxivManager,
  fluxWindow,
  chaerosCalculator,
};
