const getPassword = (service, user) =>
  ipcRenderer.sendSync("keyManager", {
    user,
    service,
    type: "getPassword",
  });
const setPassword = (service, user, value) =>
  ipcRenderer.sendSync("keyManager", {
    user,
    service,
    value: value,
    type: "setPassword",
  });

const getUserData = () =>
  fs.readFile(
    userDataPath + "/PANDORAE/userID/user-id.json", // Read the designated datafile
    "utf8",
    (err, data) => {
      if (err) throw err;

      let user = JSON.parse(data);

      let userName = user.UserName;
      let userMail = user.UserMail;
      let zoteroUser = user.ZoteroID;

      document.getElementById("userNameInput").value = userName;
      document.getElementById("userMailInput").value = userMail;
      document.getElementById("zoterouserinput").value = zoteroUser;

      document.getElementById("zoterokeyinput").value = getPassword(
        "Zotero",
        zoteroUser
      );
      document.getElementById("scopuskeyinput").value = getPassword(
        "Scopus",
        userName
      );

      document.getElementById("woskeyinput").value = getPassword(
        "WebOfScience",
        userName
      );
    }
  );

const basicUserData = () => {
  let userButton = document.getElementById("user-button");

  let userName = document.getElementById("userNameInput").value;
  let userMail = document.getElementById("userMailInput").value;
  let zoteroUser = document.getElementById("zoterouserinput").value;

  if (userName.length > 0) {
    fs.readFile(
      userDataPath + "/PANDORAE/userID/user-id.json", // Read the user data file
      "utf8",
      (err, data) => {
        const user = JSON.parse(data);

        if (userName) {
          user.UserName = userName;
        }

        user.UserMail = userMail;
        user.ZoteroID = zoteroUser;
        user.locale = "EN";

        const datafile = JSON.stringify(user);

        fs.writeFile(
          userDataPath + "/PANDORAE/userID/user-id.json",
          datafile,
          "utf8",
          (err) => {
            if (err) throw err;

            userButton.style.transition = "all 1s ease-out";
            userButton.style.backgroundPosition = "right bottom";
            userButton.style.color = "black";
            userButton.innerText = "User credentials updated";
          }
        );
      }
    );
    //getUserData();
  } else {
    userButton.style.transition = "all 1s ease-out";
    userButton.style.backgroundPosition = "right bottom";
    userButton.style.color = "red";
    userButton.innerText = "Failure: username cannot be empty";
  }
};

const updateUserData = (service) => {
  let userName = document.getElementById("userNameInput").value;
  let zoteroUser = document.getElementById("zoterouserinput").value;

  switch (service) {
    case "Zotero":
      setPassword(
        "Zotero",
        zoteroUser,
        document.getElementById("zoterokeyinput").value
      );
      checkKey("zoteroAPIValidation");
      break;

    case "Scopus":
      setPassword(
        "Scopus",
        userName,
        document.getElementById("scopuskeyinput").value
      );
      checkKey("scopusValidation");
      break;

    case "WebOfScience":
      setPassword(
        "WebOfScience",
        userName,
        document.getElementById("woskeyinput").value
      );
      checkKey("wosValidation");
      break;
  }

  // getUserData();
};

const checkKey = (service, status) => {
  let success = false;

  switch (service) {
    case "zoteroAPIValidation":
      if (status === undefined) {
        zoteroCollectionRetriever();
      }
      break;

    case "scopusValidation":
      if (status === undefined) {
        scopusBasicRetriever(true);
      }
      break;
  }

  success = status;

  if (success) {
    document.getElementById(service).style.color = "green";
    document.getElementById(service).innerHTML = "check_circle_outline";
  } else {
    document.getElementById(service).style.color = "red";
    document.getElementById(service).innerHTML = "highlight_off";
  }
};

//getUserData();

//window.addEventListener("DOMContentLoaded", getUserData);
window.addEventListener("DOMContentLoaded", () => {
  getUserData();
});
