import { CMT } from "../locales/locales";
import { displayCore } from "./core";
import { pulse } from "./pulse";

// ====== MENU ======
const CM = CMT["EN"];
let toggledMenu = false;

const iconDiv = document.getElementById("icons");
const xtype = document.getElementById("xtype"); // xtype is a div containing each (-type) visualisation
const menu = document.getElementById("menu");
const consoleDiv = document.getElementById("console");

const purgeMenuItems = (menu) => {
  let menuContent = document.getElementById(menu);
  while (menuContent.firstChild) {
    menuContent.removeChild(menuContent.firstChild);
  }
};

const toggleMenu = () => {
  field.removeEventListener("click", tutorialOpener);
  if (toggledMenu) {
    window.electron.send("console-logs", CM.console.menu.closing);
    if (toggledSecondaryMenu) {
      toggleSecondaryMenu();
      toggleMenu();
    } else if (toggledTertiaryMenu) {
      toggleTertiaryMenu();
      toggleSecondaryMenu();
      toggleMenu();
    } else {
      menu.style.left = "-150px";
      iconDiv.style.left = "25px";
      consoleDiv.style.left = "0px";
      xtype.style.left = "0px";
      var menuItems = document.getElementsByClassName("menu-item");
      for (let i = 0; i < menuItems.length; i++) {
        menuItems[i].style.left = "-150px";
      }

      toggledMenu = false;
    }
  } else {
    window.electron.send("console-logs", CM.console.menu.opening);

    menu.style.left = "0px";
    consoleDiv.style.left = "150px";
    iconDiv.style.left = "175px";
    xtype.style.left = "150px";
    var menuItems = document.getElementsByClassName("menu-item");
    for (let i = 0; i < menuItems.length; i++) {
      menuItems[i].style.left = "0";
      toggledMenu = true;
    }
  }
};

let toggledSecondaryMenu = false;

const toggleSecondaryMenu = () => {
  purgeMenuItems("thirdMenuContent");
  if (toggledSecondaryMenu) {
    if (toggledTertiaryMenu) {
      toggleTertiaryMenu();
    }
    document.getElementById("secmenu").style.left = "-150px";
    consoleDiv.style.left = "150px";
    iconDiv.style.left = "175px";

    xtype.style.left = "150px";
    toggledSecondaryMenu = false;
  } else {
    document.getElementById("secmenu").style.left = "150px";
    consoleDiv.style.left = "300px";
    iconDiv.style.left = "325px";
    xtype.style.left = "300px";
    toggledSecondaryMenu = true;
  }
};

let toggledTertiaryMenu = false;

const toggleTertiaryMenu = () => {
  purgeMenuItems("thirdMenuContent");

  if (toggledTertiaryMenu) {
    pulse(1, 1, 10, true);
    document.getElementById("thirdmenu").style.left = "-150px";
    consoleDiv.style.left = "300px";
    iconDiv.style.left = "325px";
    xtype.style.left = "300px";
    toggledTertiaryMenu = false;
  } else {
    document.getElementById("thirdmenu").style.left = "300px";
    consoleDiv.style.left = "450px";
    iconDiv.style.left = "475px";
    xtype.style.left = "450px";
    toggledTertiaryMenu = true;
    pulse(1, 1, 10);
  }
};

const openHelper = (helperFile, section) => {
  window.electron.send("console-logs", "Opening helper window");
  window.electron.send("windowManager", "openHelper", helperFile, "", section);
};
const openModal = (modalFile) =>
  window.electron.send("windowManager", { type: "openModal", file: modalFile });

const openFlux = () =>
  window.electron.send("windowManager", { type: "openFlux" });

const toggleFlux = () => {
  window.electron.send("console-logs", "Opening Flux");
  toggleMenu();
  displayCore();
  openFlux();
};

const tutorialOpener = () => {
  openTutorial(tutoSlide);
  field.value = "";
};

// =========== MENU LOGO ===========

const blinker = (item) => {
  let blinking;
  let blinking2;

  let target = document.getElementById(item);

  function blink() {
    blinking = setInterval(function () {
      target.style.backgroundColor = "#141414";
      target.style.color = "white";
    }, 500);
    blinking2 = setInterval(function () {
      target.style.backgroundColor = "white";
      target.style.color = "#141414";
    }, 1000);
  }

  blink();

  target.addEventListener("click", function () {
    clearInterval(blinking);
    clearInterval(blinking2);
    target.style.backgroundColor = "white";
    target.style.color = "#141414";
  });
};

export {
  purgeMenuItems,
  toggleMenu,
  toggleSecondaryMenu,
  toggleTertiaryMenu,
  toggledTertiaryMenu,
  openHelper,
  toggleFlux,
  blinker,
  toggledMenu,
};
