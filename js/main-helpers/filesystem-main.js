import { createUserId } from "./user-main";
import {
  createAudioManager,
  createMainWindow,
  mainWindow,
} from "./window-creator";

const electron = require("electron");
const fs = require("fs");
const { dialog, app } = electron;

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
    (err, data) => data
  );

const createThemes = () => {
  fs.copyFileSync(
    basePath + "/json/themes.json",
    userDataPath + "/PANDORAE-DATA/themes/themes.json"
  );
};

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
    "/PANDORAE-DATA/themes",
    "/PANDORAE-DATA/flatDatasets",
  ]);

  createUserId(userDataPath);
  createThemes();
};

var themeData;

const startRoutine = () => {
  userDataDirTree(userDataPath, [
    "/PANDORAE-DATA/logs",
    "/PANDORAE-DATA/userID",
    "/PANDORAE-DATA/themes",
    "/PANDORAE-DATA/flatDatasets",
  ]);

  createUserId(userDataPath);
  createThemes();
  createMainWindow();
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

export {
  readFlatFile,
  userDataDirTree,
  changeUDP,
  startRoutine,
  themeData,
  savePNG,
  saveSVG,
};
