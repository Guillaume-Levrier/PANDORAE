import { mainWindow } from "./window-creator";

const electron = require("electron");
const { ipcMain, WebContents } = electron;

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

export { updatePPS };
