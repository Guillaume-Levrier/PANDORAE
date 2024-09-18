import { CMT } from "../locales/locales";
import { toggleFlux, toggleMenu } from "./menu";
import { categoryLoader } from "./type-loader";
import { closeWindow } from "./window";

// =========== LANGUAGE SELECTION ===========
var CM = CMT["EN"]; // Load the EN locale at start

// Write a label in the right language on each menu button
// and match a function on click
const populateLocale = (divlist) => {
  divlist.forEach((div) => {
    const button = document.getElementById(div.id);
    button.innerText = CM.menu[div.path];
    button.addEventListener("click", div.func);
  });
};

var divlist = [
  { id: "fluxMenu", path: "flux", func: () => toggleFlux() },
  { id: "type", path: "type", func: () => categoryLoader("type") },
  { id: "slideBut", path: "slide", func: () => categoryLoader("slide") },
  {
    id: "tutostartmenu",
    path: "returnToTutorial",
    func: () => {
      toggleMenu();
      tutorialOpener();
    },
  },
  { id: "quitBut", path: "quit", func: () => closeWindow() },
];

// lang selection is to be rebuilt

/* fs.readFile(
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
 */

/* document.getElementById("lang").childNodes.forEach((lg) => {
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
 */
const activateMenu = () => populateLocale(divlist);
/* {
  // put the labels

   document
    .getElementById("fluxMenu")
    .addEventListener("click", (e) => toggleFlux());

     
   document
    .getElementById("type")
    .addEventListener("click", (e) => categoryLoader("type"));
     
  document
    .getElementById("slideBut")
    .addEventListener("click", (e) => categoryLoader("slide"));
  document.getElementById("tutostartmenu").addEventListener("click", (e) => {
    toggleMenu();
    tutorialOpener();
  });
  document
    .getElementById("quitBut")
    .addEventListener("click", (e) => closeWindow());
} */

export { activateMenu };
