const electron = require("electron");
const { app, BrowserView, BrowserWindow, ipcMain, shell, dialog, WebContents } =
  electron;

import { changeUDP } from "./filesystem-main";
import { manageTheme } from "./theme-main";
import { getUserStatus } from "./user-main";
import { toggleFullScreen, windowManager } from "./window-creator";

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

  // ==== WINDOW MANAGEMENT ====

  //destroy a window
  ipcMain.on("win-destroy", (event, winId) =>
    BrowserWindow.fromId(winId).destroy()
  );

  // open or close a window
  ipcMain.on("windowManager", (event, message) => windowManager(message));

  // fullscreen
  ipcMain.handle("toggleFullScreen", async (event, req) => toggleFullScreen());

  // ==== CONSOLE ====
  ipcMain.on("console-logs", (event, message) => addLineToConsole);
};

export { activateMainListeners };
