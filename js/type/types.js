//========== TYPES ==========
// PANDORAE is a data exploration tools. Once the user's data has been loaded through Flux
// and potentially hand-curated through Zotero and/or rekindled in Chaeros, it is to be sent
// to one of the available Types. Types are simple data visualisation frameworks designed to
// support certain types of data. Each focuses on a certain aspect, and helps the user
// discover patterns on potentially large datasets.


// =========== NODE - NPM ===========
const {remote, ipcRenderer, shell} = require('electron');
const fs = require('fs');
const d3 = require('d3');
const THREE = require('three');
const userDataPath = remote.app.getPath('userData');
const Dexie = require('dexie');

// =========== SHARED WORKER ===========
// Some datasets can be very large, and the data rekindling necessary before display that 
// couldn't be done in Chaeros can be long. In order not to freeze the user's mainWindow,
// most of the math to be done is sent to a Shared Worker which loads the data and sends
// back to Types only what it needs to know.
if (!!window.SharedWorker) {
var multiThreader = new SharedWorker("js/type/mul[type]threader.js");
    multiThreader.onerror = () => {console.log("Worker error")};
}

// =========== LINKS ===========
const links = {};
const linkedByIndex = {};
const isConnected = (a, b) => linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;

// =========== DRAG =========
const dragged = (d) => {
  d3.select(this)
      .attr("cx", d.zone = d3.event.x)
      .attr("x", d.zone = d3.event.x);
    }

// ========== TIME ===========
const currentTime = new Date();                           // Precise time when the page has loaded
const Past = d3.timeYear.offset(currentTime,-1);          // Precise time minus one year
const Future = d3.timeYear.offset(currentTime,1);         // Precise time plus one year

// =========== TIME MANAGEMENT ===========
//Parsing and formatting dates
const parseTime = d3.timeParse("%Y-%m-%d");
const formatTime = d3.timeFormat("%d/%m/%Y");

//locales
const locale = d3.timeFormatLocale({
"dateTime": "%A, le %e %B %Y, %X",
 "date": "%d/%m/%Y",
 "time": "%H:%M:%S",
 "periods": ["AM", "PM"],
 "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
 "Saturday"],
 "shortDays": ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
 "months": ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"],
 "shortMonths": ["Jan.", "Feb.", "Mar", "Avr.", "May", "June", "Jul.","Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
});

const localeFR = d3.timeFormatLocale({
  "dateTime": "%A, le %e %B %Y, %X",
   "date": "%d/%m/%Y",
   "time": "%H:%M:%S",
   "periods": ["AM", "PM"],
   "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi","samedi"],
   "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
   "months": ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet","Août", "Septembre", "Octobre", "Novembre", "Décembre"],
   "shortMonths": ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.","Août", "Sept.", "Oct.", "Nov.", "Déc."]
  });

const localeEN = d3.timeFormatLocale({
"dateTime": "%A, le %e %B %Y, %X",
 "date": "%d/%m/%Y",
 "time": "%H:%M:%S",
 "periods": ["AM", "PM"],
 "days": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
 "Saturday"],
 "shortDays": ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."],
 "months": ["January", "February", "March", "April", "May", "June", "July","August", "September", "October", "November", "December"],
 "shortMonths": ["Jan.", "Feb.", "Mar", "Avr.", "May", "June", "Jul.","Aug.", "Sept.", "Oct.", "Nov.", "Dec."]
});

const localeZH = d3.timeFormatLocale({
  "dateTime": "%A, le %e %B %Y, %X",
   "date": "%d/%m/%Y",
   "time": "%H:%M:%S",
   "periods": ["AM", "PM"],
   "days": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五","星期六"],
   "shortDays": ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
   "months": ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月", "九月", "十月", "十一月", "十二月"],
   "shortMonths": ["一月", "二月", "三月", "四月", "五月", "六月", "七月","八月", "九月", "十月", "十一月", "十二月"]
  });

const formatMillisecond = locale.format(".%L"),
    formatSecond = locale.format(":%S"),
    formatMinute = locale.format("%I:%M"),
    formatHour = locale.format("%H"),
    formatDay = locale.format("%d %B %Y"),
    formatWeek = locale.format("%d %b %Y"),
    formatMonth = locale.format("%B %Y"),
    formatYear = locale.format("%Y");

const multiFormat = (date) =>
      (d3.timeSecond(date) < date ? formatMillisecond
      : d3.timeMinute(date) < date ? formatSecond
      : d3.timeHour(date) < date ? formatMinute
      : d3.timeDay(date) < date ? formatHour
      : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
      : d3.timeYear(date) < date ? formatMonth
      : formatYear)(date);

//========== typesSwitch ==========
// Switch used to which type to draw/generate

const typeSwitch = (type,datasets) => {

ipcRenderer.send('console-logs',"typesSwitch started a "+ type +" process using the following datasets : " + JSON.stringify(datasets));

      switch (type) {

          case 'anthropotype' : 
          

          break;

          case 'chronotype' : 
          
          
          break;

          case 'gazouillotype' : 
          

          break;

          case 'geotype' : 
          

          break;

          case 'pharmacotype' : 
          

          break;

          case 'topotype' : 
          


          break;

          

      }

}

module.exports = {typeSwitch: typeSwitch};                            // Export the switch as a module
