const electron = require("electron");
const { app } = electron;
const userDataPath = app.getPath("userData");

const date = new Date().toJSON().replace(/:/g, "-"); // Create a timestamp
var dataLog = "PANDORÆ Log - " + date;

const addLineToConsole = (message) => {
  let newLine =
    "\r\n" + new Date().toLocaleTimeString("fr-FR") + " ~ " + message;
  dataLog = dataLog + newLine;
  mainWindow.webContents.send("consoleMessages", newLine); // send it to requester
};

const writeLogFlatFile = () =>
  fs.writeFileSync(
    // Write data
    userDataPath + "/PANDORAE-DATA/logs/log-" + date + ".txt",
    dataLog,
    "utf8", // Path/name, data, format
    (err) => {
      if (err) throw err;
    }
  );

export { addLineToConsole, writeLogFlatFile };
