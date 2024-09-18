//========== fluxDisplay ==========

import { CMT } from "../locales/locales";
import { createCascadeTab } from "./fluxDOMbuilder";

// Display relevant tab when called according to the tab's id.
var db = "";
const fluxDisplay = (tab) => {
  //db = tab;

  // previous strategy
  /*  let tabs = document.getElementsByClassName("fluxTabs"); // Get all content DIVs by their common class

  if (tab === "flux-manager") {
    document.getElementById("selectCascade").style.display = "block";
  } else {
    document.getElementById("selectCascade").style.display = "none";
  }

  for (let i = 0; i < tabs.length; i++) {
    // Loop on DIVs
    tabs[i].style.display = "none"; // Hide the DIVs
  }
  document.getElementById(tab).style.display = "block"; // Display the div corresponding to the clicked button
   */

  //const tabs = document.getElementsByClassName("fluxTabs");

  /* if (tab === "flux-manager") {
    document.getElementById("selectCascade").style.display = "block";
  } else {
    document.getElementById("selectCascade").style.display = "none";
  } */

  /* for (let i = 0; i < tabs.length; i++) {
    tabs[i].remove();
  } */

  createCascadeTab(CMT.EN.flux.tabs[tab]);
};

const date = () =>
  new Date().toLocaleDateString() + "-" + new Date().toLocaleTimeString();

export { fluxDisplay, db, date };
