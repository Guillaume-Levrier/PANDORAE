import { fluxWindow, mainWindow } from "./window-creator";

const fs = require("fs");
const dns = require("dns");
const electron = require("electron");
const { app } = electron;
const userDataPath = app.getPath("userData");

var currentUser;

const setCurrentUser = (key, value) => (currentUser[key] = value);

const createUserId = (userDataPath) => {
  const userID = {
    UserName: "",
    UserMail: "",
    theme:  "vega",
    distantServices:{},
    localServices:{}  
  };

  if (!fs.existsSync(userDataPath + "/PANDORAE-DATA/userID/user-id.json")) {
    writeUserIDfile(userDataPath, userID);
  }
};

const writeUserIDfile = (userDataPath, userID) =>
  fs.writeFileSync(
    userDataPath + "/PANDORAE-DATA/userID/user-id.json",
    JSON.stringify(userID),
    "utf8",
    (err) => {
      if (err) throw err;
    }
  );

const readUserIDfile = () =>
  fs.readFileSync(
    userDataPath + "/PANDORAE-DATA/userID/user-id.json", // Read the user data file
    "utf8",
    (err, data) => JSON.parse(data)
  );

const getUserDetails = (event) => {
  const user = JSON.parse(readUserIDfile(userDataPath));
  event.sender.send("getUserDetails", user);
};

const getUserStatus = (req) => {
  if (req) {
    const data = JSON.parse(readUserIDfile(userDataPath));

    currentUser = data;

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

    // Making this systematic is too heavy on the user
    // we need to find a better way
    //  if (currentUser.UserName.length > 0) {
    //    getPPSData();
    //  }

    mainWindow.webContents.send("userStatus", currentUser);
  }
};

const manageUserKeys = (event, request) => {
  // This used to be managed through keytar, which raises
  // many technical issues and doesn't make the app portable
  // it was then moved to a flat file (with a notice to the user
  // that their API keys are stored as flat files).

  const data = JSON.parse(readUserIDfile(userDataPath));

  switch (request.type) {
    case "apikey":
      event.return = Valuedata[request.service].apikey;
      break;
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
};

export {
  createUserId,
  writeUserIDfile,
  readUserIDfile,
  getUserStatus,
  currentUser,
  manageUserKeys,
  setCurrentUser,
  getUserDetails,
};
