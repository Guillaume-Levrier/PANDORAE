// ====== KEYBOARD SHORTCUTS ======

import { toggleConsole } from "./console";
import { coreExists, xtypeExists } from "./core";
import { toggledMenu, toggleFlux, toggleMenu } from "./menu";
import { categoryLoader } from "./type-loader";

var keylock = 0;

const setkeylock = (n) => (keylock = n);

field.addEventListener("focusin", () => (keylock = 1));
field.addEventListener("focusout", () => (keylock = 0));

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
        }
        categoryLoader("type");
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

export { keyShortCuts, keylock, setkeylock };
