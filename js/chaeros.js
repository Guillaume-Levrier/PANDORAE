console.log("|==== CHAEROS.JS STARTS HERE ====|");

// This file is voluntarily left as short/small as possible
// The main file is the chaeros-switch.js script

import { chaerosSwitch } from "./chaeros/chaeros-switch";

window.electron.chaerosCompute((data) =>
  chaerosSwitch(data.fluxAction, data.fluxArgs)
);
