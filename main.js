const electron = require("electron");
const { app, BrowserView, BrowserWindow, ipcMain, shell, dialog, WebContents } =
  electron;
const fs = require("fs");

//const userDataPath = app.getPath("userData");

// hack to make this truly portable
const userDataPath = app.getPath("documents");

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

const createUserId = () => {
  userID = {
    UserName: "Enter your name",
    UserMail: "Enter your e-mail (not required)",
    ZoteroID: "Enter your Zotero ID (required to use Flux features)",
    theme: { value: "normal" },
    locale: "EN",
  };

  if (!fs.existsSync(userDataPath + "/PANDORAE/userID/user-id.json")) {
    fs.writeFileSync(
      userDataPath + "/PANDORAE/userID/user-id.json",
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
    userDataPath + "/PANDORAE/themes/themes.json"
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

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
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

app.on("ready", () => {
  userDataDirTree(userDataPath, [
    "/PANDORAE/logs",
    "/PANDORAE/userID",
    "/PANDORAE/themes",
    "/PANDORAE/flatDatasets",
  ]);

  createUserId();
  createThemes();
  createWindow();
  createAudioManager();

  themeData = fs.readFileSync(
    userDataPath + "/PANDORAE/themes/themes.json",
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
    // win.webContents.openDevTools();
  }
};

var currentUser;

ipcMain.on("userStatus", (event, req) => {
  if (req) {
    fs.readFile(
      userDataPath + "/PANDORAE/userID/user-id.json", // Read the user data file
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

        mainWindow.webContents.send("userStatus", currentUser);
      }
    );
  }
});

ipcMain.on("theme", (event, req) => {
  switch (req.type) {
    case "read":
      fs.readFile(
        userDataPath + "/PANDORAE/userID/user-id.json", // Read the user data file
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
      currentUser[request.service] = {
        user: request.user,
        value: request.value,
      };
      fs.writeFile(
        userDataPath + "/PANDORAE/userID/user-id.json",
        JSON.stringify(currentUser),
        "utf8",
        (err) => {
          if (err) throw err;
          event.returnValue = request.value;
        }
      );
      /*
      keytar
        .setPassword(request.service, request.user, request.value)
        .then((password) => (event.returnValue = password));*/
      break;

    case "getPassword":
      fs.readFile(
        userDataPath + "/PANDORAE/userID/user-id.json",
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
    userDataPath + "/PANDORAE/logs/log-" + date + ".txt",
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
      res = app.getPath("documents");

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
    fs.writeFile(filePath.filePath, data, () => { });
  });
});

ipcMain.handle("savePNG", async (event, target) => {
  setTimeout(() => {
    mainWindow.capturePage().then((img) => {
      dialog.showSaveDialog(target).then((filePath) => {
        fs.writeFile(filePath.filePath, img.toPNG(), () => { });
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
  { name: "Scopus", url: "api.elsevier.com" },
  { name: "BIORXIV", url: "www.biorxiv.org" },
  { name: "Zotero", url: "api.zotero.org" },
  { name: "Clinical Trials", url: "clinicaltrials.gov" },
  { name: "Regards Citoyens", url: "nosdeputes.fr" },
  { name: "Web Of Science", url: "clarivate.com" },
  { name: "ISTEX", url: "api.istex.fr" },
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

  delete currentUser.localServices[service]

  fs.writeFile(
    userDataPath + "/PANDORAE/userID/user-id.json",
    JSON.stringify(currentUser),
    "utf8",
    (err) => {
      if (err) throw err;
    }
  );
})


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
        collection: m.serviceCollection
      };

      fs.writeFile(
        userDataPath + "/PANDORAE/userID/user-id.json",
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

ipcMain.on("openPath", async (event, path) => shell.openExternal(path));
