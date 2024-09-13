// tutorialJS

const { ipcRenderer } = require("electron"); // ipcRenderer manages messages with Main Process

ipcRenderer.on("scroll-to", (event, message) => {
  smoothScrollTo(message);
});

const tuto = (step) => {
  window.electron.send("tutorial", step);
  closeWindow();
};

const closeWindow = () => {
  window.electron.send("window-manager", "closeWindow", "tutorial");
};

const closeAndDisplay = () => {
  window.electron.send(
    "chaeros-notification",
    "return to tutorial",
    sectionList[activeIndex].id
  );
  closeWindow();
};

const refreshWindow = () => {
  location.reload();
};

const lastScroll = () => {
  smoothScrollTo("final8");
  document.body.style.animation = "invert 2s";
  document.body.style.animationFillMode = "forwards";
  document.body.style.overflow = "hidden";
  document.getElementById("backarrow").style.display = "none";

  setTimeout(() => {
    let seconds = 10;
    const secMinus = () => {
      seconds = seconds - 1;
      document.getElementById("restartCount").innerHTML =
        "Restarting in:<br>" + seconds;
    };

    setInterval(secMinus, 1000);

    setTimeout(() => {
      window.electron.invoke("restart", true);
    }, 10000);
  }, 7000);
};

window.addEventListener("load", (e) => {
  sectionList = document.querySelectorAll("section");

  document.getElementById("backarrow").addEventListener("click", (e) => {
    smoothScrollTo(previous, true);
  });

  document.getElementById("refresher").addEventListener("click", refreshWindow);

  document
    .getElementById("closeDisplay")
    .addEventListener("click", closeAndDisplay);

  setTimeout(() => {
    //This is important because otherwise the padding is messed up and no event listener will do
    addPadding();
    display();
    document.body.style.animation = "fadein 1s";
    setTimeout(() => {
      document.body.style.opacity = 1;
    }, 950);
  }, 200);
});
