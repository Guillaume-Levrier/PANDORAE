console.log("|==== INDEX.JS STARTS HERE ====|");

// This file is voluntarily left as short/small as possible
// The main file is the pandorae.js script

import "../css/pandorae.css";
import { initializeMainScreen } from "./pandorae-interface/pandorae";

window.addEventListener("DOMContentLoaded", initializeMainScreen);
