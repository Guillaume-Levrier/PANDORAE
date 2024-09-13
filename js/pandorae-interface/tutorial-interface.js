// TUTORIAL

const openTutorial = (tutoSlide) => {
  if (tutoSlide) {
    window.electron.send("window-manager", "openModal", "tutorial", tutoSlide);
  } else {
    window.electron.send("window-manager", "openModal", "tutorial");
  }
};
