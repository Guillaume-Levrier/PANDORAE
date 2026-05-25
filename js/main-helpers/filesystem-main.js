import { createUserId } from "./user-main";
import {
  createAudioManager,
  createDatabaseManager,
  createMainWindow,
  mainWindow,
} from "./window-creator";

const electron = require("electron");
const fs = require("fs");
const { dialog, app, session } = electron;

const basePath = app.getAppPath();
const userDataPath = app.getPath("userData");

//FileSystem
const userDataDirTree = (path, dirTree) =>
  dirTree.forEach((d) => {
    if (!fs.existsSync(path + d)) {
      fs.mkdirSync(path + d, { recursive: true }, (err) => {
        if (err) throw err;
      });
    }
  });

const readFlatFile = (path) =>
  fs.readFile(
    path, // Read the user data file
    "utf8",
    (err, data) => data,
  );

const changeUDP = () => {
  const userDataPath = dialog.showOpenDialogSync(null, {
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
    // flat datasets for geotype will need to be modularized
    // this will comme with THREE geotype rebuild
    "/PANDORAE-DATA/flatDatasets",
  ]);

  createUserId(userDataPath);
  createThemes();
};

const startRoutine = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    // this breaks zotero interactions

    if (details.hasOwnProperty("url")) {
      if (details.url.indexOf("zotero") === -1) {
        details.responseHeaders["Access-Control-Allow-Origin"] = ["*"];
      }
    }

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        // "Access-Control-Allow-Origin": ["*"], // Allow any domain to access
        //"Access-Control-Allow-Methods": ["GET, POST, PUT, DELETE, OPTIONS"], // Allowed methods
        //"Access-Control-Allow-Headers": ["Content-Type, Authorization"], // Allowed headers
      },
    });
  });

  userDataDirTree(userDataPath, [
    "/PANDORAE-DATA/logs",
    "/PANDORAE-DATA/userID",
    "/PANDORAE-DATA/flatDatasets",
  ]);

  createUserId(userDataPath);
  // createThemes();
  createMainWindow();
  createAudioManager();
  createDatabaseManager();

  mainWindow.onbeforeunload = (e) => {
    BrowserView.getAllViews().forEach((view) => view.destroy());
  };
};

async function savePNG(target) {
  setTimeout(() => {
    mainWindow.capturePage().then((img) => {
      dialog.showSaveDialog(target).then((filePath) => {
        fs.writeFile(filePath.filePath, img.toPNG(), () => {});
      });
    });
  }, 250);
}

async function saveSVG(target, string) {
  dialog.showSaveDialog(target).then((filePath) => {
    fs.writeFile(filePath.filePath, string, "utf8", (err) => {
      if (err) {
        window.electron.send("console-logs", JSON.stringify(err));
      }
    });
  });
}

const exportDataset = (details) =>
  dialog.showSaveDialog({ defaultPath: details.target }).then((filePath) => {
    fs.writeFile(filePath.filePath, details.data, () => {});
  });

export {
  readFlatFile,
  userDataDirTree,
  changeUDP,
  startRoutine,
  savePNG,
  saveSVG,
  exportDataset,
};
