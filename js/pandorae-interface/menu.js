// ====== MENU ======

let menu, consoleDiv, iconDiv;
let toggledMenu = false;

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
      document.getElementById("logostate").remove(); // Remove the status svg
      toggledMenu = false;
    }
  } else {
    window.electron.send("console-logs", CM.console.menu.opening);
    logostatus();
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
  window.electron.send("window-manager", "openHelper", helperFile, "", section);
};
const openModal = (modalFile) => {
  window.electron.send("window-manager", "openModal", modalFile);
};
const toggleFlux = () => {
  window.electron.send("console-logs", "Opening Flux");
  toggleMenu();
  displayCore();
  openModal("flux");
};

const tutorialOpener = () => {
  openTutorial(tutoSlide);
  field.value = "";
};

// =========== MENU LOGO ===========
// The menu logo behavior. This feature isn't called by any process yet.
var logostatus = (statuserror) => {
  let svg = d3
    .select(menu)
    .append("svg")
    .attr("id", "logostate")
    .attr("width", "90")
    .attr("height", "90")
    .attr("position", "absolute")
    .style("top", "0");

  var statuserror = false;

  var lifelines = svg.append("g").attr("class", "lifeline");
  lifelines
    .append("polyline")
    .attr("id", "networkstatus")
    .attr("points", "26,45, 45,55, 64,45");
  lifelines
    .append("polyline")
    .attr("id", "corestatus")
    .attr("points", "26,48, 45,58, 64,48");
  lifelines
    .append("polyline")
    .attr("id", "datastatus")
    .attr("points", "26,51, 45,61, 64,51");

  if ((statuserror = false)) {
    lifelines.attr("class", "lifelinerror");
  }
};

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
  openHelper,
  toggleFlux,
  logostatus,
};
