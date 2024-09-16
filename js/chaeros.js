console.log("|==== CHAEROS.JS STARTS HERE ====|");

// This file is voluntarily left as short/small as possible
// The main file is the chaeros-start.js script

import { listenForOrders } from "./chaeros/chaeros-start";

window.addEventListener("load", listenForOrders);
