import { fluxWindow, mainWindow } from "./window-creator";

const fs = require("fs");
const dns = require("dns");
const electron = require("electron");
const { app } = electron;
const userDataPath = app.getPath("userData");

var currentUser = {
  localServices: [],
};

const setCurrentUser = (key, value) => (currentUser[key] = value);

const createUserId = (userDataPath) => {
  const userID = {
    UserName: "",
    UserMail: "",
    theme: "vega",
    locale: "EN",
    distantServices: {},
    localServices: [],
  };

  if (!fs.existsSync(userDataPath + "/PANDORAE-DATA/userID/user-id.json")) {
    writeUserIDfile(userID);
  }
};

const writeUserIDfile = (userID) =>
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

const getUserDetails = (event) =>
  event.sender.send("getUserDetails", currentUser);
// const user = JSON.parse(readUserIDfile(userDataPath));

//};

const checkLocalService = (service) => {
  const location = service.serviceConfig.url.split(":");
  dns.lookupService(location[0], location[1], (err, hostname, s) => {
    if (hostname || s) {
      service.valid = true;
    } else {
      service.valid = false;
    }
  });
};

const getUserStatus = (req) => {
  if (req) {
    const data = JSON.parse(readUserIDfile(userDataPath));

    currentUser = data;

    var block = 0;

    if (currentUser.hasOwnProperty("localServices")) {
      console.log(1);
      console.log(currentUser.localServices);
      currentUser.localServices.forEach((service) => {
        switch (service.serviceType) {
          case "LocalNetworkConfig":
            block++;

            fetch(service.serviceConfig.url)
              .then((r) => r.json())
              .then((config) => {
                config.forEach((localAdminService) => {
                  checkLocalService(localAdminService);

                  currentUser.localServices.push(localAdminService);
                });
                block--;

                if (block === 0) {
                  //purge config files

                  const localServices = [];
                  if (currentUser.hasOwnProperty("localServices")) {
                    console.log(2);
                    console.log(currentUser.localServices);
                    currentUser.localServices.forEach((s) => {
                      if (s.serviceType != "LocalNetworkConfig") {
                        localServices.push(s);
                      }
                    });
                  }

                  currentUser.localServices = localServices;
                  mainWindow.webContents.send("userStatus", currentUser);
                }
              });
            break;

          default:
            checkLocalService(service);
            break;
        }
      });
    }

    // Making this systematic is too heavy on the user
    // we need to find a better way
    //  if (currentUser.UserName.length > 0) {
    //    getPPSData();
    //  }
    if (block === 0) {
      mainWindow.webContents.send("userStatus", currentUser);
    }
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

      writeUserIDfile(currentUser);

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
