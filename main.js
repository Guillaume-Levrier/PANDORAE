// ==== ELECTRON IMPORTS ====
const electron = require("electron");
const { app, ipcMain } = electron;
const { startRoutine } = require("./js/main-helpers/filesystem-main");
const { mainWindow } = require("./js/main-helpers/window-creator");
const { availableServicesLookup } = require("./js/main-helpers/network-main");
const { writeLogFlatFile } = require("./js/main-helpers/console-main");

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
