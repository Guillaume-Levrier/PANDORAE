import "../css/pandorae.css";
import { initializeMainScreen } from "./pandorae-interface/pandorae";

//const preloadPath = window.electron.getPreloadPath();

console.log(window.electron);

console.log("coucou");

window.addEventListener("DOMContentLoaded", initializeMainScreen);
