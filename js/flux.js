console.log("|==== FLUX.JS STARTS HERE ====|");

// This file is voluntarily left as short/small as possible
// The main file is the flux-interface.js script

import "../css/pandorae.css";
import { initializeFlux } from "./flux/flux-interface";

window.addEventListener("DOMContentLoaded", initializeFlux);
