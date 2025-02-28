import { checkConfiguredLocalServices } from "./services/local-services";

const fs = require("fs");

const electron = require("electron");
const { app } = electron;
const userDataPath = app.getPath("userData");

var currentUser;

const setCurrentUser = (key, value) => (currentUser[key] = value);

const createUserId = (userDataPath) => {
  const userID = {
    UserName: "",
    UserMail: "",
    theme: "vega",
    locale: "EN",
    distantServices: [],
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

const getUserStatus = (req) => {
  if (req) {
    currentUser = JSON.parse(readUserIDfile());
    checkConfiguredLocalServices(currentUser);
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
