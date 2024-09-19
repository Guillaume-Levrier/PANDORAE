const userDataPath = window.electron.userDataPath;

var currentUser;

const changeUserID = () => window.electron.send("change-udp", "change");

const getPassword = (service) => currentUser[service].value;

const setPassword = (service, user, value) =>
  window.electron.send("keyManager", {
    user,
    service,
    value: value,
    type: "setPassword",
  });

const userIdFilePath = userDataPath + "/PANDORAE-DATA/userID/user-id.json";

const getUserData = () => window.electron.send("getUserDetails", true);

var userData = {};

window.electron.getUserDetails((user) => (userData = user));

/* const updateFields = (user) => {
  currentUser = user;

  const userName = user.UserName;
  const userMail = user.UserMail;
  const zoteroUser = user.ZoteroID;

  document.getElementById("userNameInput").value = userName;
  document.getElementById("userMailInput").value = userMail;
  document.getElementById("zoterouserinput").value = zoteroUser;

  if (user.hasOwnProperty("Zotero")) {
    document.getElementById("zoterokeyinput").value = user.Zotero.value;
  }

  if (user.hasOwnProperty("Scopus")) {
    document.getElementById("scopuskeyinput").value = user.Scopus.value;
  }

  if (user.hasOwnProperty("wos")) {
    document.getElementById("woskeyinput").value = user.WoS.value;
  }
}; */

const basicUserData = () => {
  let userButton = document.getElementById("user-button");

  let userName = document.getElementById("userNameInput").value;
  let userMail = document.getElementById("userMailInput").value;
  let zoteroUser = document.getElementById("zoterouserinput").value;

  if (userName.length > 0) {
    fs.readFile(
      userIdFilePath, // Read the user data file
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

        fs.writeFile(userIdFilePath, datafile, "utf8", (err) => {
          //if (err) throw err;

          userButton.style.transition = "all 1s ease-out";
          userButton.style.backgroundPosition = "right bottom";
          userButton.style.color = "black";
          userButton.innerText = "User credentials updated";
          if (err) {
            userButton.innerText = err;
            console.log(err);
          }

          getUserData();
        });
      }
    );
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
};

const checkKey = (service, status) => {
  if (status) {
    document.getElementById(service).style.color = "green";
    document.getElementById(service).innerHTML = "check_circle_outline";
    getUserData();
  } else {
    document.getElementById(service).style.color = "red";
    document.getElementById(service).innerHTML = "highlight_off";
  }
};

export {
  basicUserData,
  changeUserID,
  checkKey,
  updateUserData,
  getUserData,
  getPassword,
  userData,
};
