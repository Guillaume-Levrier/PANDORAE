import { themeData } from "./filesystem-main";
import { readUserIDfile, writeUserIDfile } from "./user-main";
import { mainWindow } from "./window-creator";

const electron = require("electron");
const { app } = electron;
const userDataPath = app.getPath("userData");

// can be either read what theme is applied
// or set a new one
const manageTheme = (req) => {
  const data = readUserIDfile(userDataPath);
  var currentUser = JSON.parse(data);

  switch (req.type) {
    case "read":
      if (currentUser.theme) {
        mainWindow.webContents.send(
          "themeContent",
          themeData[currentUser.theme]
        );
      } else {
        mainWindow.webContents.send("themeContent", themeData.vega);
      }

      break;

    case "set":
      currentUser.theme = req.theme;
      writeUserIDfile(userDataPath, currentUser);
      mainWindow.webContents.send("themeContent", themeData[req.theme]);
      break;
  }
};

export { manageTheme };
