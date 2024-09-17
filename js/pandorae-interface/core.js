import * as d3 from "d3";

// ========== CORE ACTIONS ===========
import { createTooltip } from "../pandorae-interface/tooltip";

var coreExists = true; // core does exist on document load
const setCoreExists = (n) => (coreExists = n);

var xtypeExists = false; // xtype SVG doesn't exist on document load
const setxtypeExists = (n) => (xtypeExists = n);

const xtypeDisplay = () => {
  xtype.style.opacity = "1";
  xtype.style.zIndex = "6";
  createTooltip();
};

const purgeXtype = () => {
  if (document.getElementById("xtypeSVG")) {
    xtype.style.zIndex = "-2"; // Send the XTYPE div to back
    xtype.removeChild(document.getElementById("xtypeSVG"));
    removeTooltip();
  }
};

const displayCore = () => {
  purgeXtype();
  if (coreExists === false) {
    reloadCore();
  }
  xtypeExists = false;
  coreExists = true;
};

const purgeCore = () => {
  if (coreExists) {
    d3.select("canvas").remove();
    document.body.removeChild(document.getElementById("core-logo"));
    document.body.removeChild(document.getElementById("version"));

    // currently deactivated

    // If the mainSlideSections DIV is removed, the slider detects it as sliding back to 1st slide.
    // So the cheapest solution is probably to "deep copy" the element storing the current slide,
    // remove the div, then wait for the slider to "acknowledge" that it's gone back to the 1st slide,
    // and only then replace that information with the copy we had stored in the first place.
    /* 
    let currentStepBuffer = JSON.parse(JSON.stringify(currentMainPresStep));
    document.getElementById("mainSlideSections").remove();
    setTimeout(() => {
      currentMainPresStep = currentStepBuffer;
    }, 200); */

    field.style.display = "none";

    Array.from(document.getElementsByClassName("purgeable")).forEach((d) => {
      document.body.removeChild(document.getElementById(d.id));
      d3.select(d.id).remove();
    });
  }
};

export {
  xtypeDisplay,
  purgeXtype,
  displayCore,
  purgeCore,
  coreExists,
  setCoreExists,
  xtypeExists,
  setxtypeExists,
};
