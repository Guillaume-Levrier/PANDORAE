const electron = require("electron");
const { app, BrowserWindow, ipcMain, shell, dialog } = electron;

const {
  writeUserIDfile,
  readUserIDfile,
} = require("./js/main-helpers/user-main");

const dns = require("dns");
const {
  readFlatFile,

  startRoutine,
} = require("./js/main-helpers/filesystem-main");
const { updatePPS } = require("./js/main-helpers/pps-main");

const fs = require("fs");
var https = require("https");
const path = require("path");
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

// ===== NETWORK =====

// Check if PANDORAE-FLUX has a access to pregistered domains
availableServicesLookup();

var currentUser;

// CHAEROS
const powerValveArgsArray = [];

ipcMain.on("dataFlux", (event, fluxAction, fluxArgs, message) => {
  mainWindow.webContents.send("coreSignal", fluxAction, fluxArgs, message);

  let powerValveAction = {};

  powerValveAction.fluxAction = fluxAction;
  powerValveAction.fluxArgs = fluxArgs;
  powerValveAction.message = message;

  powerValveArgsArray.push(powerValveAction);

  chaerosCalculator();
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

ipcMain.on("keyManager", (event, request) => {
  // This used to be managed through keytar, which raises
  // many technical issues and doesn't make the app portable
  // it was then moved to a flat file (with a notice to the user
  // that their API keys are stored as flat files).

  const data = readUserIDfile(userDataPath);

  switch (request.type) {
    case "setPassword":
      currentUser = JSON.parse(data);

      currentUser[request.service] = {
        user: request.user,
        value: request.value,
      };

      writeUserIDfile(userDataPath, currentUser);

      break;

    case "getPassword":
      const user = JSON.parse(data);

      if (user.hasOwnProperty(request.service)) {
        event.returnValue = user[request.service].value;
      } else {
        event.returnValue = 0;
      }

      break;
  }
});

ipcMain.on("chaeros-is-ready", (event, arg) => {
  let action = powerValveArgsArray[powerValveArgsArray.length - 1];
  event.sender.send(
    "chaeros-compute",
    action.fluxAction,
    action.fluxArgs,
    action.message
  );
});

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

ipcMain.on("backToPres", (event, message) => {
  mainWindow.reload();
  setTimeout(() => {
    mainWindow.webContents.send("backToPres", message);
  }, 500);
});

ipcMain.on("biorxivRetrieve", (event, message) => {
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

ipcMain.handle("restart", async (event, mess) => {
  app.relaunch();
  app.exit(0);
});

ipcMain.handle("saveDataset", async (event, target, data) => {
  dialog.showSaveDialog(target).then((filePath) => {
    fs.writeFile(filePath.filePath, data, () => {});
  });
});

ipcMain.handle("savePNG", async (event, target) => {
  setTimeout(() => {
    mainWindow.capturePage().then((img) => {
      dialog.showSaveDialog(target).then((filePath) => {
        fs.writeFile(filePath.filePath, img.toPNG(), () => {});
      });
    });
  }, 250);
});

ipcMain.handle("saveSVG", async (event, target, string) => {
  dialog.showSaveDialog(target).then((filePath) => {
    fs.writeFile(filePath.filePath, string, "utf8", (err) => {
      if (err) {
        window.electron.send("console-logs", JSON.stringify(err));
      }
    });
  });
});

ipcMain.handle("saveHTML", async (event, target) => {
  let res;
  await dialog.showSaveDialog(target).then((filePath) => {
    res = filePath;
  });

  return res;
});

ipcMain.handle("mainDevTools", async (event, target) => {
  mainWindow.webContents.openDevTools();
});

ipcMain.handle("fluxDevTools", async (event, target) => {
  BrowserWindow.fromId(windowIds.flux.id).openDevTools();
});

ipcMain.handle("openEx", async (event, target) => {
  shell.openExternal(target);
});

ipcMain.handle("removeLocalService", async (event, service) => {
  delete currentUser.localServices[service];

  writeUserIDfile(userDataPath, currentUser);
});

ipcMain.handle("addLocalService", async (event, m) => {
  const loc = m.serviceLocation.split(":");
  dns.lookupService(loc[0], loc[1], (err, hostname, service) => {
    if (hostname || service) {
      if (!currentUser.hasOwnProperty("localServices")) {
        currentUser.localServices = {};
      }

      currentUser.localServices[m.serviceName] = {
        url: loc[0],
        port: loc[1],
        type: m.serviceType,
      };

      if (m.hasOwnProperty("serviceArkViewer")) {
        currentUser.localServices[m.serviceName].arkViewer = m.serviceArkViewer;
      }

      writeUserIDfile(userDataPath, currentUser);
    }
  });
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
