// =========== LANGUAGE SELECTION ===========
var CM = CMT["EN"]; // Load the EN locale at start

fs.readFile(
  userDataPath + "/PANDORAE-DATA/userID/user-id.json",
  "utf8", // Check if the user uses another one
  (err, data) => {
    data = JSON.parse(data);
    if (data.locale) {
      CM = CMT[data.locale];
    } else {
      CM = CMT.EN;
    }
  }
);

const populateLocale = (divlist) => {
  divlist.forEach((div) => {
    document.getElementById(div.id).innerText = CM.menu[div.path];
  });
};

var divlist = [
  { id: "fluxMenu", path: "flux" },
  { id: "type", path: "type" },
  { id: "slideBut", path: "slide" },
  { id: "quitBut", path: "quit" },
  { id: "tutostartmenu", path: "returnToTutorial" },
];

populateLocale(divlist);

document.getElementById("lang").childNodes.forEach((lg) => {
  lg.addEventListener("click", (e) => {
    CM = CMT[lg.innerText];
    populateLocale(divlist);
    fs.readFile(
      userDataPath + "/PANDORAE-DATA/userID/user-id.json",
      "utf8",
      (err, data) => {
        data = JSON.parse(data);
        data.locale = lg.innerText;
        data = JSON.stringify(data);
        fs.writeFile(
          userDataPath + "/PANDORAE-DATA/userID/user-id.json",
          data,
          "utf8",
          (err) => {
            if (err) throw err;
          }
        );
      }
    );
  });
});
