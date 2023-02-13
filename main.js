const electron = require("electron");
const { app, BrowserView, BrowserWindow, ipcMain, shell, dialog, WebContents } =
  electron;
const fs = require("fs");
const userDataPath = app.getPath("userData");
const keytar = require("keytar"); // Load keytar to manage user API keys
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

//FileSystem
const userDataDirTree = (path, dirTree) => {
  dirTree.forEach((d) => {
    if (!fs.existsSync(path + d)) {
      fs.mkdirSync(path + d, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });
};

let userID;

const createUserId = () => {
  userID = {
    UserName: "Enter your name",
    UserMail: "Enter your e-mail (not required)",
    ZoteroID: "Enter your Zotero ID (required to use Flux features)",
    theme: "normal",
    locale: "EN",
  };

  if (!fs.existsSync(userDataPath + "/userID/user-id.json")) {
    fs.writeFileSync(
      userDataPath + "/userID/user-id.json",
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
    userDataPath + "/themes/themes.json"
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

app.on("ready", () => {
  userDataDirTree(userDataPath, [
    "/logs",
    "/userID",
    "/themes",
    "/flatDatasets",
  ]);
  createUserId();
  createThemes();
  createWindow();
  createAudioManager();

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
  }
};

ipcMain.on("userStatus", (event, req) => {
  if (req) {
    fs.readFile(
      userDataPath + "/userID/user-id.json", // Read the user data file
      "utf8",
      (err, data) => {
        // Additional options for readFile
        if (err) throw err;
        let user = JSON.parse(data);
        mainWindow.webContents.send("userStatus", user);
      }
    );
  }
});

var themeData = fs.readFileSync(
  userDataPath + "/themes/themes.json",
  "utf8",
  (err, data) => JSON.parse(data)
);

themeData = JSON.parse(themeData);

const getTheme = () => {
  var t;

  for (const theme in themeData) {
    if (themeData[theme].selected) {
      t = themeData[theme];
    }
  }

  mainWindow.webContents.send("themeContent", t);
};

const setTheme = (newTheme) => {
  //console.log(newTheme);
  //console.log(themeData);
  for (const theme in themeData) {
    themeData[theme].selected = false;
    if (theme === newTheme) {
      themeData[theme].selected = true;
    }
  }

  fs.writeFileSync(
    userDataPath + "/themes/themes.json",
    JSON.stringify(themeData),
    "utf8",
    (err) => {
      if (err) throw err;
    }
  );

  mainWindow.webContents.send("themeContent", themeData[newTheme]);
};

//const readTheme = (themeName) => {
//var themeData =

//
//});

ipcMain.on("theme", (event, req) => {
  switch (req.type) {
    case "read":
      getTheme();
      break;

    case "set":
      setTheme(req.theme);
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

ipcMain.on("keytar", (event, request) => {
  switch (request.type) {
    case "setPassword":
      keytar
        .setPassword(request.service, request.user, request.value)
        .then((password) => (event.returnValue = password));
      break;

    case "getPassword":
      keytar
        .getPassword(request.service, request.user)
        .then((password) => (event.returnValue = password));
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
    userDataPath + "/logs/log-" + date + ".txt",
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
      res = app.getPath("userData");
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

const dnsLocalServiceList = [];

ipcMain.handle("addLocalService", async (event, mess) => {
  console.log("coucou")
  console.log(mess)

});

dnsLocalServiceList.forEach((d) => {
  dns.lookupService(d.url, d.port, (err, hostname, service) => {
    if (hostname || service) {
      d.valid = true;
    } else {
      d.valid = false;
    }
  });
});

ipcMain.handle("checkflux", async (event, mess) => {
  const result = JSON.stringify({ dnslist, dnsLocalServiceList });
  return result;
});
