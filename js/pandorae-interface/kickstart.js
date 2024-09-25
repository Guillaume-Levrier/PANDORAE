import { toggleMenu } from "./menu";
import { toggleConsole } from "./console";

//// ========== KICKSTART ========

const menuIcon = document.getElementById("menu-icon");
const consoleIcon = document.getElementById("console-icon");
const field = document.getElementById("field");

const openTutorial = (tutoSlide) => {
  if (tutoSlide) {
    window.electron.send("windowManager", "openModal", "tutorial", tutoSlide);
  } else {
    window.electron.send("windowManager", "openModal", "tutorial");
  }
};

const requestStatus = () => window.electron.send("userStatus", true);

window.electron.userStatus((user) => kickStart(user));

const kickStart = (user) => {
  if (user.UserName === "") {
    menuIcon.style.cursor = "not-allowed";
    consoleIcon.style.cursor = "not-allowed";
    //document.getElementById("tutostartmenu").style.display = "block";
    field.style.pointerEvents = "all";
    field.style.cursor = "pointer";
    field.value = "start tutorial";
  } else {
    document.getElementById("menu-icon").onclick = toggleMenu;
    document.getElementById("option-icon").onclick = toggleConsole;
    document.getElementById("menu-icon").style.cursor = "pointer";
    document.getElementById("option-icon").style.cursor = "pointer";
    document.getElementById("version").innerHTML =
      user.UserName.toUpperCase() + " | " + "v2 beta";
  }
};

window.electron.tutorial((message) => {
  menuIcon.onclick = toggleMenu;
  menuIcon.style.cursor = "pointer";
  consoleIcon.style.cursor = "pointer";

  tutoSlide = "message";

  switch (message) {
    case "flux":
    case "istexRequest":
    case "sendToZotero":
    case "zoteroImport":
    case "reImportToSystem":
      openHelper("tutorialHelper", message);
      blinker("menu-icon");
      blinker("fluxMenu");
      break;

    case "openTutorial":
      openTutorial(tutoSlide);
      break;
  }
});

export { requestStatus };
