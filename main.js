const electron = require("electron");
const { app, BrowserView, BrowserWindow, ipcMain, shell, dialog, WebContents } =
  electron;
const fs = require("fs");
var https = require("https");

// original
var userDataPath = app.getPath("userData");

// This is an attempt to make sure all devices, including professional ones with
// very restricted profiles can launch the app and save credentials/API keys/datasets

const dns = require("dns");

var windowIds = {
  flux: { id: 0, open: false },
  tutorialHelper: { id: 0, open: false },
  tutorial: { id: 0, open: false },
  chaeros: [],
  index: { id: 0, open: false },
};

let mainWindow;

const basePath = app.getAppPath();

let userID;

// This is useful to make Dexie (the layer over the user agent IndexedDB)
// work in a consistent manner in Electron
// (cf https://github.com/dexie/Dexie.js/issues/271#issuecomment-444773780)
app.requestSingleInstanceLock();

const createUserId = () => {
  userID = {
    UserName: "",
    UserMail: "",
    ZoteroID: "",
    theme: { value: "vega" },
    locale: "EN",
  };

  if (!fs.existsSync(userDataPath + "/PANDORAE-DATA/userID/user-id.json")) {
    fs.writeFileSync(
      userDataPath + "/PANDORAE-DATA/userID/user-id.json",
      JSON.stringify(userID),
      "utf8",
      (err) => {
        if (err) throw err;
      }
    );
  }
};

const createThemes = () => {
  // if (!fs.existsSync(userDataPath + "/themes/themes.json")) {
  fs.copyFileSync(
    basePath + "/json/themes.json",
    userDataPath + "/PANDORAE-DATA/themes/themes.json"
  );
  //}
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreenable: true,
    backgroundColor: "white",
    titleBarStyle: "hidden",
    frame: true,
    resizable: true,
    webPreferences: {
      preload: basePath + "/js/preload-index.js",
      nodeIntegrationInWorker: true,
      plugins: true,
    },
  });

  windowIds.index.id = mainWindow.id;
  windowIds.index.open = true;

  mainWindow.loadFile("index.html");

  mainWindow.setMenu(null);

  //mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => (mainWindow = null));
}

//FileSystem
const userDataDirTree = (path, dirTree) =>
  dirTree.forEach((d) => {
    if (!fs.existsSync(path + d)) {
      fs.mkdirSync(path + d, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });

var themeData;

ipcMain.on("change-udp", async (event, message) => {
  console.log("got here");
  userDataPath = dialog.showOpenDialogSync(null, {
    properties: [
      "openDirectory",
      "createDirectory",
      "promptToCreate",
      "showHiddenFiles",
    ],
  });

  userDataDirTree(userDataPath, [
    "/PANDORAE-DATA/logs",
    "/PANDORAE-DATA/userID",
    "/PANDORAE-DATA/themes",
    "/PANDORAE-DATA/flatDatasets",
  ]);

  createUserId();
  createThemes();
});

app.on("ready", () => {
  userDataDirTree(userDataPath, [
    "/PANDORAE-DATA/logs",
    "/PANDORAE-DATA/userID",
    "/PANDORAE-DATA/themes",
    "/PANDORAE-DATA/flatDatasets",
  ]);

  createUserId();
  createThemes();
  createWindow();
  createAudioManager();

  themeData = fs.readFileSync(
    userDataPath + "/PANDORAE-DATA/themes/themes.json",
    "utf8",
    (err, data) => JSON.parse(data)
  );

  //weird but ok
  themeData = JSON.parse(themeData);

  mainWindow.onbeforeunload = (e) => {
    BrowserView.getAllViews().forEach((view) => view.destroy());
  };
});

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

  console.log(message);

  win.once("ready-to-show", () => {
    win.webContents.send("tutorial-types", message);
    win.show();
  });
  var path = "file://" + __dirname + "/" + helperFile + ".html";
  win.loadURL(path);
};

const openModal = (modalFile, scrollTo) => {
  if (windowIds[modalFile].open === false) {
    let win = new BrowserWindow({
      parent: mainWindow,
      modal: true,
      transparent: true,
      alwaysOnTop: false,
      frame: false,
      resizable: false,
      show: false,
      y: 100,
      webPreferences: {
        preload: basePath + "/js/preload-" + modalFile + ".js",
        nodeIntegrationInWorker: true,
      },
    });

    var path = "file://" + __dirname + "/" + modalFile + ".html";
    win.loadURL(path);
    win.once("ready-to-show", () => {
      win.show();
      windowIds[modalFile].id = win.id;
      windowIds[modalFile].open = true;
      if (scrollTo) {
        setTimeout(() => win.webContents.send("scroll-to", scrollTo), 1000);
      }
    });
    //win.webContents.openDevTools();
  }
};

var currentUser;

ipcMain.on("userStatus", (event, req) => {
  if (req) {
    fs.readFile(
      userDataPath + "/PANDORAE-DATA/userID/user-id.json", // Read the user data file
      "utf8",
      (err, data) => {
        // Additional options for readFile
        if (err) throw err;
        currentUser = JSON.parse(data);
        if (currentUser.hasOwnProperty("localServices")) {
          for (const service in currentUser.localServices) {
            const d = currentUser.localServices[service];

            dns.lookupService(d.url, d.port, (err, hostname, service) => {
              if (hostname || service) {
                d.valid = true;
              } else {
                d.valid = false;
              }
            });
          }
        }

        if (currentUser.UserName.length > 0) {
          getPPSData();
        }

        mainWindow.webContents.send("userStatus", currentUser);
      }
    );
  }
});

ipcMain.on("theme", (event, req) => {
  switch (req.type) {
    case "read":
      fs.readFile(
        userDataPath + "/PANDORAE-DATA/userID/user-id.json", // Read the user data file
        "utf8",
        (err, data) => {
          // Additional options for readFile
          if (err) throw err;
          currentUser = JSON.parse(data);
          if (currentUser.theme) {
            mainWindow.webContents.send(
              "themeContent",
              themeData[currentUser.theme.value]
            );
          } else {
            mainWindow.webContents.send("themeContent", themeData.normal);
          }
        }
      );

      break;

    case "set":
      mainWindow.webContents.send("themeContent", themeData[req.theme]);
      break;
  }
});

ipcMain.on("win-destroy", (event, winId) => {
  BrowserWindow.fromId(winId).destroy();
});

ipcMain.on("window-manager", (event, type, file, scrollTo, section) => {
  let win = {};

  switch (type) {
    case "openHelper":
      openHelper(file, section);
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
});

//CONSOLE

let date = new Date().toJSON().replace(/:/g, "-"); // Create a timestamp
var dataLog = "PANDORÆ Log - " + date;

ipcMain.on("console-logs", (event, message) => {
  let newLine =
    "\r\n" + new Date().toLocaleTimeString("fr-FR") + " ~ " + message;
  dataLog = dataLog + newLine;
  mainWindow.webContents.send("console-messages", newLine); // send it to requester
});

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
  /*
   * This used to be managed through keytar, which raises
   * many technical issues and doesn't make the app portable
   * it was then moved to a flat file (with a notice to the user
   * that their API keys are stored as flat files).
   *
   */
  switch (request.type) {
    case "setPassword":
      fs.readFile(
        userDataPath + "/PANDORAE-DATA/userID/user-id.json",
        "utf8",
        (err, data) => {
          currentUser = JSON.parse(data);
          currentUser[request.service] = {
            user: request.user,
            value: request.value,
          };
          fs.writeFile(
            userDataPath + "/PANDORAE-DATA/userID/user-id.json",
            JSON.stringify(currentUser),
            "utf8",
            (err) => {
              if (err) throw err;
              event.returnValue = request.value;
            }
          );
        }
      );

      break;

    case "getPassword":
      fs.readFile(
        userDataPath + "/PANDORAE-DATA/userID/user-id.json",
        "utf8",
        (err, data) => {
          const user = JSON.parse(data);

          if (user.hasOwnProperty(request.service)) {
            event.returnValue = user[request.service].value;
          } else {
            event.returnValue = 0;
          }
        }
      );
      /*
      keytar
        .getPassword(request.service, request.user)
        .then((password) => (event.returnValue = password));*/
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

const chaerosCalculator = () => {
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

  chaerosWindow.loadFile("chaeros.html");

  chaerosWindow.webContents.on("did-finish-load", function () {
    chaerosWindow.webContents.send("id", chaerosWindow.id);
    //chaerosWindow.webContents.openDevTools();
  });
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

  audioManager.loadFile("audioManager.html");
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

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // Write log
  fs.writeFile(
    // Write data
    userDataPath + "/PANDORAE-DATA/logs/log-" + date + ".txt",
    dataLog,
    "utf8", // Path/name, data, format
    (err) => {
      if (err) throw err;
      setTimeout(() => {
        app.quit();
      }, 1000);
    }
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

ipcMain.on("biorxiv-retrieve", (event, message) => {
  switch (message.type) {
    case "request":
      biorXivScraper(message.model, message.address, message.winId);
      break;

    case "biorxiv-amount":
      BrowserWindow.fromId(windowIds.flux.id).webContents.send(
        "biorxiv-retrieve",
        message
      );
      break;

    case "biorxiv-content":
      BrowserWindow.fromId(message.charWindId).webContents.send(
        "biorxiv-retrieve",
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
        ipcRenderer.send("console-logs", JSON.stringify(err));
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

// Check if PANDORAE-FLUX has a access to pregistered domains

const dnslist = [
  { name: "Gallica", url: "gallica.bnf.fr" },
  { name: "Scopus", url: "api.elsevier.com" },
  { name: "BIORXIV", url: "www.biorxiv.org" },
  { name: "Zotero", url: "api.zotero.org" },
  { name: "Clinical Trials", url: "clinicaltrials.gov" },
  { name: "Regards Citoyens", url: "nosdeputes.fr" },
  { name: "Web Of Science", url: "clarivate.com" },
  { name: "ISTEX", url: "api.istex.fr" },
  {
    name: "PPS",
    url: "irit.fr",
  },
];

dnslist.forEach((d) => {
  dns.lookup(d.url, (err, address, family) => {
    if (address) {
      d.valid = true;
    } else {
      d.valid = false;
    }
  });
});

ipcMain.handle("removeLocalService", async (event, service) => {
  delete currentUser.localServices[service];

  fs.writeFile(
    userDataPath + "/PANDORAE-DATA/userID/user-id.json",
    JSON.stringify(currentUser),
    "utf8",
    (err) => {
      if (err) throw err;
    }
  );
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

      fs.writeFile(
        userDataPath + "/PANDORAE-DATA/userID/user-id.json",
        JSON.stringify(currentUser),
        "utf8",
        (err) => {
          if (err) throw err;
        }
      );
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

/// ===== Update PPS =====
// This might not be best placed in main.js?
//
// The point of this section is to keep the
// Problematic Paper Screener (PPS) data up to date
// on request (forced update).

// The automatic update has been deactivated for now.

// ppsFile should be the most recent file available
let ppsFile = "";

ipcMain.handle("getPPS", async (event, req) => ppsFile);

// ppsDate is the date of most recent pps file update
let ppsDate = 0;

ipcMain.handle("getPPSMaturity", async (event, req) => ppsDate);

// Remove expired files

const removeExpired = (files) =>
  files.forEach((file) => fs.unlink(file.path, (err) => console.log(err)));

// Get PPSData's purpose is to check that there is a flat PPS dataset
// that is not expired, and update it if it is.

const getPPSData = () => {
  // delta is 11 days in milliseconds
  const delta = 1000000000;

  // time is now (so a few ms after app instance boot)
  const time = Date.now();

  // directory path where the PPS flat dataset should be located in
  const dirPath = userDataPath + "/PANDORAE-DATA/flatDatasets/";

  // read the flat dataset (usually CSVs) directory to
  // look for PPS data.
  fs.readdir(dirPath, (err, files) => {
    var ppsFiles = [];

    // iterate over available datasets
    files.forEach((f) => {
      // check if this dataset is a PPS dataset
      if (f.indexOf("PPS") > -1 && f.indexOf(".csv") > -1) {
        const ppsDataset = {
          path: dirPath + f,
          ftime: parseInt(f.substring(4, f.length - 4)),
          f,
        };

        ppsFiles.push(ppsDataset);
      }
    });

    // Option 1 - there is no PPS data so it needs to be downloaded
    // for the first time

    if (ppsFiles.length === 0) {
      updatePPS(time);
    } else {
      // Option 2 - there is some PPS data

      // sort the dataset by most recent.
      ppsFiles = ppsFiles.sort((a, b) => b.ftime - a.ftime);

      //check if the most recent dataset has been downloaded
      // less than 11 days ago.

      if (time - ppsFiles[0].ftime < delta) {
        // The most recent file is still valid, so we can
        // remove all ppsFiles except the most recent one

        ppsDate = ppsFiles[0].ftime;
        ppsFile = ppsFiles[0].path;

        if (ppsFiles.length > 1) {
          // calling "shift" to the ppsFiles array remove the first value
          // which due to our sorting above is the most recent one.
          ppsFiles.shift();
          removeExpired(ppsFiles);
        }
      } else {
        // if that's not the case, we need to remove all older files
        // and get a new one.

        // This has been checked before, but who knows what has happened
        // with the async races in the meantime
        if (ppsFile.length > 0) {
          removeExpired(ppsFiles);
        }

        // Then update the PPS
        // There is no risk for this one to be deleted by the remove
        // expired routine since it targets precise file names and
        // not a format.
        updatePPS(time);
      }
    }
  });
};

// fullscreen main window

ipcMain.handle("toggleFullScreen", async (event, req) => {
  let state = mainWindow.isFullScreen();

  mainWindow.setFullScreen(!state);

  mainWindow.reload();
});

// Force update (or download for the first time)
ipcMain.on("forceUpdatePPS", async (event, req) => updatePPS(Date.now()));

const updatePPS = (time) => {
  ppsFile = userDataPath + `/PANDORAE-DATA/flatDatasets/PPS-${time}.csv`;

  mainWindow.webContents.send("pulsar", false);
  mainWindow.webContents.send("chaeros-notification", "UPDATING PPS DATASET");

  const file = fs.createWriteStream(ppsFile);

  const options = {
    hostname: "dbrech.irit.fr",
    port: 443,
    path: "/pls/apex/f?p=9999:300::IR[allproblematicpapers]_CSV",
    method: "GET",
  };

  const req = https.request(options, (res) => {
    res.pipe(file);

    mainWindow.webContents.send("chaeros-notification", "WRITING FILE");

    file.on("finish", () => {
      file.close();

      // This will cleanup the former files.
      getPPSData();

      mainWindow.webContents.send(
        "chaeros-notification",
        "PPS DATASET UPDATED"
      );

      mainWindow.webContents.send("pulsar", true);
    });
  });

  req.on("error", (e) => {
    mainWindow.webContents.send("chaeros-notification", "PPS UPDATE ERROR");
    mainWindow.webContents.send("pulsar", true);
    console.error(e.message);
  });

  req.end();
};

// ===== end of PPS routines =====
