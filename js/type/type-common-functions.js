import * as d3 from "d3";

import {
  purgeCore,
  setCoreExists,
  setxtypeExists,
  xtypeDisplay,
} from "../pandorae-interface/core";
import { iconCreator } from "../pandorae-interface/icon";
import { toggleMenu } from "../pandorae-interface/menu";

// =========== LOADTYPE ===========
// LoadType is the process that removes the main display canvas and then displays
// the xtype div and xtype SVG element. It is usually called when the data has been
// loaded and rekindled by the type function, i.e. when the visualisation is (almost)
// ready to show

var dispose = false;

const loadType = (type, id) => {
  type = type;
  id = id;

  dispose = true;
  xtypeDisplay();
  purgeCore();
  setxtypeExists(1);
  setCoreExists(0);

  window.electron.send("audio-channel", "button1");
  field.value = "";
  const exporter = () => categoryLoader("export");

  iconCreator("export-icon", toggleMenu, "Export");

  //
  //  CURRENT DEACTIVATED
  //
  //  PRESENTATION SYSTEM DEPENDENT

  //if (!currentMainPresStep.step) {
  // iconCreator("back-to-pres", backToPres, "Back to presentation");

  //
  //  iconCreator("step-icon", addPresentationStep);
  //  iconCreator("slide-icon", createSlide);
  //  iconCreator("save-icon", savePresentation);
  //}

  document.getElementById("fluxMenu").style.display = "none";
  document.getElementById("type").style.display = "none";
  document.getElementById("menu-icon").addEventListener("click", () => {
    document.body.style.animation = "fadeout 0.1s";
    setTimeout(() => {
      document.body.remove();
      location.reload();
    }, 100);
  });

  var exportButton = document.createElement("DIV");
  exportButton.innerText = "export";
  exportButton.className = "tabs menu-item";
  exportButton.addEventListener("click", (e) => categoryLoader("export"));

  document
    .getElementById("menu")
    .insertBefore(exportButton, document.getElementById("quitBut"));

  //window.onresize = resizer;
};

// =========== XTYPE ===========

var width, height, toolWidth, xtype;

var presentationBox = document.createElement("div");
presentationBox.id = "presentationBox";

window.addEventListener("load", (event) => {
  xtype = document.getElementById("xtype");
  if (xtype) {
    width = xtype.clientWidth; // Fetching client width
    height = xtype.clientHeight; // Fetching client height
    toolWidth = 0.3 * width + 20; // The tooltip is around a third of total available screen width
  }
  document.body.appendChild(presentationBox);
});

// ========== TIME ===========
const currentTime = new Date(); // Precise time when the page has loaded
const Past = d3.timeYear.offset(currentTime, -1); // Precise time minus one year
const Future = d3.timeYear.offset(currentTime, 1); // Precise time plus one year

// =========== TIME MANAGEMENT ===========
//Parsing and formatting dates
const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%d/%m/%Y");

//locales
const locale = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan.",
    "Feb.",
    "Mar",
    "Avr.",
    "May",
    "June",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ],
});

const localeFR = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ],
  shortDays: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ],
  shortMonths: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avr.",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc.",
  ],
});

const localeEN = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  shortDays: ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  shortMonths: [
    "Jan.",
    "Feb.",
    "Mar",
    "Avr.",
    "May",
    "June",
    "Jul.",
    "Aug.",
    "Sept.",
    "Oct.",
    "Nov.",
    "Dec.",
  ],
});

const localeZH = d3.timeFormatLocale({
  dateTime: "%A, le %e %B %Y, %X",
  date: "%d/%m/%Y",
  time: "%H:%M:%S",
  periods: ["AM", "PM"],
  days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
  shortDays: [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ],
  months: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
  shortMonths: [
    "一月",
    "二月",
    "三月",
    "四月",
    "五月",
    "六月",
    "七月",
    "八月",
    "九月",
    "十月",
    "十一月",
    "十二月",
  ],
});

const formatMillisecond = locale.format(".%L"),
  formatSecond = locale.format(":%S"),
  formatMinute = locale.format("%I:%M"),
  formatHour = locale.format("%H"),
  formatDay = locale.format("%d/%m/%Y"),
  formatWeek = locale.format("%d %b %Y"),
  formatMonth = locale.format("%m/%Y"),
  formatYear = locale.format("%Y");

const multiFormat = (date) =>
  (d3.timeSecond(date) < date
    ? formatMillisecond
    : d3.timeMinute(date) < date
    ? formatSecond
    : d3.timeHour(date) < date
    ? formatMinute
    : d3.timeDay(date) < date
    ? formatHour
    : d3.timeMonth(date) < date
    ? d3.timeWeek(date) < date
      ? formatDay
      : formatWeek
    : d3.timeYear(date) < date
    ? formatMonth
    : formatYear)(date);

const zoomToNode = (node, svg, zoom, width, height) => {
  const x = parseInt(node.getAttribute("cx"));
  const y = parseInt(node.getAttribute("cy"));

  svg
    .transition()
    .duration(1000)
    .call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width * 0.36, height / 2)
        .scale(2)
        .translate(-x, -y)
    );
};

export { loadType, width, height, toolWidth, zoomToNode };
