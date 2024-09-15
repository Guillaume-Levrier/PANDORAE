// ==== ELECTRON IMPORTS ====
const electron = require("electron");
const { app, BrowserWindow, ipcMain, shell, dialog } = electron;

///
const {
  writeUserIDfile,
  readUserIDfile,
} = require("./js/main-helpers/user-main");

const {
  readFlatFile,
  startRoutine,
} = require("./js/main-helpers/filesystem-main");
const { updatePPS } = require("./js/main-helpers/pps-main");

const fs = require("fs");

const { mainWindow } = require("./js/main-helpers/window-creator");
const { availableServicesLookup } = require("./js/main-helpers/network-main");
const { writeLogFlatFile } = require("./js/main-helpers/console-main");

// original
const userDataPath = app.getPath("userData");

var windowIds = {
  flux: { id: 0, open: false },
  tutorialHelper: { id: 0, open: false },
  tutorial: { id: 0, open: false },
  chaeros: [],
  index: { id: 0, open: false },
};

// ====== BASIC APP BEHAVIOR =======

// allow only one instance (more than one will create DB access issues)
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

// Create main app window on app start
app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

// Get everything ready
app.whenReady().then(() => startRoutine());

// When all windows are closed.
// Log everything
// Then close the app
const closingRoutine = () => {
  // Write log (this is write sync)
  writeLogFlatFile();
  app.quit();
};

app.on("window-all-closed", () => closingRoutine());

// allow for manual restarting
ipcMain.handle("restart", async (event, mess) => {
  app.relaunch();
  app.exit(0);
});

// ===== NETWORK =====

// Check if PANDORAE-FLUX has a access to pregistered domains
availableServicesLookup();

var currentUser;

ipcMain.on("backToPres", (event, message) => {
  mainWindow.reload();
  setTimeout(() => {
    mainWindow.webContents.send("backToPres", message);
  }, 500);
});

// Remote -> sendSync

ipcMain.on("remote", async (event, req) => {
  let res;
  switch (req) {
    case "userDataPath":
      res = userDataPath;

      break;

    case "appPath":
      res = app.getAppPath();
      break;
  }
  event.returnValue = res;
});

ipcMain.on("read-file", async (event, filepath) => {
  event.returnValue = dialog.showSaveDialog(filepath);
});

ipcMain.handle("saveDataset", async (event, target, data) => {
  dialog.showSaveDialog(target).then((filePath) => {
    fs.writeFile(filePath.filePath, data, () => {});
  });
});

ipcMain.handle("openEx", async (event, target) => {
  shell.openExternal(target);
});

ipcMain.handle("removeLocalService", async (event, service) => {
  delete currentUser.localServices[service];

  writeUserIDfile(userDataPath, currentUser);
});

ipcMain.handle("checkflux", async (event, mess) => {
  const dnsLocalServiceList = currentUser.localServices;

  const result = JSON.stringify({ dnslist, dnsLocalServiceList });

  return result;
});

ipcMain.on("openPath", async (event, path) => {
  shell.openPath(path);
  shell.openExternal(path);
});

// Force update (or download for the first time)
ipcMain.on("forceUpdatePPS", async (event, req) => updatePPS(Date.now()));

// ===== end of PPS routines =====

// ==== read files ====

ipcMain.on("readFile", async (event, req) => readFlatFile(event, req));
