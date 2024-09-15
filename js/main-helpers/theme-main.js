import { themeData } from "./filesystem-main";
import { readUserIDfile } from "./user-main";
import { mainWindow } from "./window-creator";

const electron = require("electron");
const { app, BrowserView, BrowserWindow, ipcMain, shell, dialog, WebContents } =
  electron;
const userDataPath = app.getPath("userData");

// can be either read what theme is applied
// or set a new one
const manageTheme = (req) => {
  switch (req.type) {
    case "read":
      const data = readUserIDfile(userDataPath);
      var currentUser = JSON.parse(data);

      if (currentUser.theme) {
        mainWindow.webContents.send(
          "themeContent",
          themeData[currentUser.theme.value]
        );
      } else {
        mainWindow.webContents.send("themeContent", themeData.normal);
      }

      break;

    case "set":
      mainWindow.webContents.send("themeContent", themeData[req.theme]);
      break;
  }
};

export { manageTheme };
