const electron = require("electron");
const { BrowserWindow, ipcMain, shell, app } = electron;
const userDataPath = app.getPath("userData");
const appPath = app.getAppPath();

import { databaseOperation, requestDatabase } from "../db";
import { feedChaerosData, startChaerosProcess } from "./chaeros-main";
import { addLineToConsole } from "./console-main";
import {
  changeUDP,
  exportDataset,
  readFlatFile,
  savePNG,
  saveSVG,
} from "./filesystem-main";
import {
  addLocalService,
  getAvailableFlux,
  removeLocalService,
} from "./network-main";
import { manageTheme } from "./theme-main";
import { getUserDetails, getUserStatus, manageUserKeys } from "./user-main";
import {
  bioRxivManager,
  mainWindow,
  toggleFullScreen,
  windowIds,
  windowManager,
} from "./window-creator";

//
// MAIN WINDOW LISTENERS
//
// This is organized by section.

const activateMainListeners = () => {
  ipcMain.on("get-preload-path", (e) => {
    e.returnValue = WINDOW_PRELOAD_WEBPACK_ENTRY;
  });

  // ==== APP ====
  ipcMain.on("remote", async (event, req) => {
    let res;
    switch (req) {
      case "userDataPath":
        res = userDataPath;

        break;

      case "appPath":
        res = appPath;
        break;
    }
    event.returnValue = res;
  });

  // ==== USER ====

  // get user status (who user is)
  ipcMain.on("userStatus", (event, req) => getUserStatus(req));

  // change user data path (don't do it)
  ipcMain.on("change-udp", async (event, message) => changeUDP());

  // either load theme or set a new one
  ipcMain.on("theme", (event, req) => manageTheme(req));

  ipcMain.on("keyManager", (event, request) => manageUserKeys(event, request));

  // ==== DB ====

  ipcMain.on("database", (event, req) =>
    requestDatabase(event, req.operation, req.parameters)
  );

  // ==== WINDOW MANAGEMENT ====

  //destroy a window
  ipcMain.on("win-destroy", (event) => event.sender.destroy());

  // open or close a window
  ipcMain.on("windowManager", (event, message) => windowManager(message));

  // fullscreen
  ipcMain.handle("toggleFullScreen", async (event, req) => toggleFullScreen());

  ipcMain.handle("mainDevTools", async (event, target) => {
    mainWindow.webContents.openDevTools();
  });

  ipcMain.handle("fluxDevTools", async (event, target) => {
    BrowserWindow.fromId(windowIds.flux.id).openDevTools();
  });

  ipcMain.on("getUserDetails", (event, req) => getUserDetails(event));

  // ==== CONSOLE ====
  ipcMain.on("console-logs", (event, message) => addLineToConsole(message));

  // ==== NETWORK ====

  ipcMain.handle("addLocalService", async (event, message) =>
    addLocalService(message)
  );

  ipcMain.handle("removeLocalService", async (event, service) =>
    removeLocalService(service)
  );

  ipcMain.on("openEx", (event, target) => shell.openExternal(target));

  ipcMain.handle("checkflux", async (event, mess) => getAvailableFlux());

  ipcMain.on("forceUpdatePPS", async (event, req) => updatePPS(Date.now()));

  // ==== FILE SAVING/MANAGEMENT ====

  ipcMain.handle("savePNG", async (event, target) => savePNG(target));

  ipcMain.handle("saveSVG", async (event, target, string) =>
    saveSVG(target, string)
  );

  ipcMain.on("saveDataset", (event, details) => exportDataset(details));

  ipcMain.on(
    "read-file",
    async (event, filepath) =>
      (event.returnValue = dialog.showSaveDialog(filepath))
  );

  ipcMain.on("openPath", async (event, path) => {
    shell.openPath(path);
    shell.openExternal(path);
  });

  ipcMain.on("readFile", async (event, req) => readFlatFile(event, req));

  // ==== CHAEROS ====

  // get the order to start a chaeros process
  // open a chaeros window
  // store arguments guiding process for when chaeros is ready
  ipcMain.on("dataFlux", (event, data) =>
    startChaerosProcess(data.fluxAction, data.fluxArgs, data.message)
  );

  // when chaeros is ready
  // feed it the arguments we kept from the original order
  ipcMain.on("chaeros-is-ready", (event, arg) => feedChaerosData(event));

  // biorxiv scraping needs its own windows
  ipcMain.on("biorxivRetrieve", (event, message) => bioRxivManager(message));

  // ===== CHANNELLING =====
  // simply playing post office and
  // sending message from one renderer process
  // to another

  // Tutorial
  ipcMain.on("tutorial", (event, message) => {
    mainWindow.webContents.send("tutorial", message);
  });

  ipcMain.on("mainWindowReload", (event, message) => {
    mainWindow.webContents.send("mainWindowReload", message);
  });

  // ProgressBar
  ipcMain.on("progress", (event, message) => {
    let ratio = parseInt(message);
    mainWindow.webContents.send("progressBar", ratio);
  });

  ipcMain.on("cmdInputFromRenderer", (event, theme) => {
    mainWindow.webContents.send("cmdInputFromRenderer", theme);
  });

  ipcMain.on("chaeros-failure", (event, message) => {
    mainWindow.webContents.send("chaeros-failure", message);
  });

  ipcMain.on("chaeros-notification", (event, message, options) => {
    mainWindow.webContents.send("chaeros-notification", message, options);
  });

  ipcMain.on("pulsar", (event, message) => {
    mainWindow.webContents.send("pulsar", message);
  });
};

export { activateMainListeners };
