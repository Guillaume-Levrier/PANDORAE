//// ========== TUTORIAL ========

const menuIcon = document.getElementById("menu-icon");

const openTutorial = (tutoSlide) => {
  if (tutoSlide) {
    window.electron.send("window-manager", "openModal", "tutorial", tutoSlide);
  } else {
    window.electron.send("window-manager", "openModal", "tutorial");
  }
};

//to be reinstated

window.electron.send("userStatus", true);
ipcRenderer.on("userStatus", (event, user) => kickStart(user));

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
      user.UserName.toUpperCase() + " | " + version;
  }
};

ipcRenderer.on("tutorial", (event, message) => {
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
