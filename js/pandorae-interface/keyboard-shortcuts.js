// ====== KEYBOARD SHORTCUTS ======

const keyShortCuts = (event) => {
  if (!keylock) {
    switch (event.isComposing || event.code) {
      case "Digit1":
        if (coreExists) {
          toggleMenu();
        }
        break;

      case "Digit2":
        if (coreExists) {
          toggleFlux();
          toggleMenu();
        }
        break;

      case "Digit3":
        if (coreExists) {
          if (toggledMenu === false) {
            toggleMenu();
          }
          categoryLoader("type");
        }
        break;

      case "IntlBackslash":
      case "Backquote":
        location.reload();

        break;

      case "Digit4":
        toggleConsole();
        break;

      case "Digit5":
        if (xtypeExists) {
          if (toggledMenu === false) {
            toggleMenu();
          }
          categoryLoader("export");
        }

        break;
    }
  }
};
