const electron = require("electron");
const { app, BrowserView, BrowserWindow, ipcMain, shell, dialog, WebContents } =
  electron;

import { feedChaerosData, startChaerosProcess } from "./chaeros-main";
import { addLineToConsole } from "./console-main";
import { changeUDP, savePNG, saveSVG } from "./filesystem-main";
import { addLocalService } from "./network-main";
import { manageTheme } from "./theme-main";
import { getUserStatus, manageUserKeys } from "./user-main";
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

  // ==== USER ====

  // get user status (who user is)
  ipcMain.on("userStatus", (event, req) => getUserStatus(req));

  // change user data path (don't do it)
  ipcMain.on("change-udp", async (event, message) => changeUDP());

  // either load theme or set a new one
  ipcMain.on("theme", (event, req) => manageTheme(req));

  ipcMain.on("keyManager", (event, request) => manageUserKeys(event, request));

  // ==== WINDOW MANAGEMENT ====

  //destroy a window
  ipcMain.on("win-destroy", (event, winId) =>
    BrowserWindow.fromId(winId).destroy()
  );

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

  // ==== CONSOLE ====
  ipcMain.on("console-logs", (event, message) => addLineToConsole(message));

  // ==== NETWORK ====

  ipcMain.handle("addLocalService", async (event, message) =>
    addLocalService(message)
  );

  // ==== FILE SAVING ====

  ipcMain.handle("savePNG", async (event, target) => savePNG(target));

  ipcMain.handle("saveSVG", async (event, target, string) =>
    saveSVG(target, string)
  );

  // ==== CHAEROS ====

  // get the order to start a chaeros process
  // open a chaeros window
  // store arguments guiding process for when chaeros is ready
  ipcMain.on("dataFlux", (event, fluxAction, fluxArgs, message) =>
    startChaerosProcess(fluxAction, fluxArgs, message)
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
