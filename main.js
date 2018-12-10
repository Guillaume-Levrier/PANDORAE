const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const userDataPath = app.getPath('userData');

let mainWindow

function createWindow () {

  mainWindow = new BrowserWindow({
     width: 1200,
     height: 800,
     fullscreenable:true,
     backgroundColor: 'white',
     titleBarStyle: 'hidden',
     frame: true
   })

  mainWindow.loadFile('index.html')

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {

      if (frameName === 'modal') {
          event.preventDefault()

        Object.assign(options, {
            modal: true,
            parent: mainWindow,
            frame: true
        })

        event.newGuest = new BrowserWindow(options)
      }
    })

  mainWindow.setMenu(null);
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => { mainWindow = null })

}

app.on('ready', ()=>{
    createWindow();
})

app.on('activate',  () => { if (mainWindow === null) { createWindow() } })

//FileSystem
var pandoDir = userDataPath;

var dirTree = [
  "/logs",
  "/userID",
  "/datasets",
  "/datasets/altmetric",
  "/datasets/altmetric/requests",
  "/datasets/altmetric/results",
  "/datasets/anthropotype",
  "/datasets/anthropotype/affiliations",
  "/datasets/anthropotype/humans",
  "/datasets/anthropotype/links",
  "/datasets/chronotype",
  "/datasets/chronotype/biblio",
  "/datasets/chronotype/links",
  "/datasets/geotype",
  "/datasets/geotype/locations",
  "/datasets/pharmacotype",
  "/datasets/pharmacotype/trials",
  "/datasets/publicdebate",
  "/datasets/publicdebate/capco",
  "/datasets/publicdebate/links",
  "/datasets/publicdebate/matching",
  "/datasets/publicdebate/pubdeb",
  "/datasets/scopus",
  "/datasets/scopus/csl-json",
  "/datasets/scopus/scopusDatasets",
  "/datasets/zotero",
  "/datasets/zotero/csl-json",
  "/datasets/zotero/csl-zoteroCollections"
]

const userDataDirTree = (path,dirTree) => {
    dirTree.forEach(d=>{
        if (!fs.existsSync(path+d)){
          fs.mkdirSync(path+d, { recursive: true }, (err) => {
                if (err) throw err;
              })
          }
    })
}

userDataDirTree(pandoDir,dirTree);

let userID = {"UserName":"Enter your name (not required)","UserMail":"Enter your e-mail (not required)","ZoteroID":"Enter your Zotero ID (required to use Flux features)"};

  if (!fs.existsSync(userDataPath+'/userID/user-id.json')) {
    fs.writeFile(userDataPath +"/userID/user-id.json",JSON.stringify(userID),'utf8',
      (err) => {if (err) throw err;}
    );
  }

//CONSOLE

let date = new Date().toJSON().replace(/:/g,"-");                 // Create a timestamp
var dataLog =  "PANDORÆ Log - "+date;

  ipcMain.on('console-logs', (event,message) => {
    let newLine = "\r\n"+new Date().toLocaleTimeString('fr-FR')+" - "+message;
    dataLog = dataLog + newLine;
    mainWindow.webContents.send('console-messages',newLine);           // send it to requester
  })

//FLUX

const availableDatasets = (datasets) => {

    let dataList = [];

fs.readdir(userDataPath+'/datasets/',{withFileTypes: true}, (err, files) => {      // list dataset subfolders
    for (let i = 0;i<files.length;i++){                              // loop on available subfolders
      if (datasets.type===files[i]){                                 // if this is the relevant subfolder
        fs.readdir(userDataPath+'/datasets/'+files[i],{withFileTypes: true}, (err, folderOne) => { // read its content

  for (let j = 0;j<folderOne.length;j++){
    if (datasets.kind===folderOne[j]){                                 // if this is the relevant subsubfolder
      fs.readdir(userDataPath+'/datasets/'+files[i]+'/'+folderOne[j], (err, folderTwo) => {     // read its content

          for (let k = 0;k<folderTwo.length;k++){           // loop on each object
            let item = folderTwo[k];
            let kind = folderOne[j];
            let type = files[i];
            let path = userDataPath+'/datasets/'+ files[i]+'/'+folderOne[j]+'/'+item;
              mainWindow.webContents.send('datalist',type,kind,item,path);           // send it to requester

                    };
                 });
              }
            };
          })
        };
      }
    })
};

ipcMain.on('datalist', (event,message) => { availableDatasets(message) });

// CHAEROS
const powerValveArgsArray = [];

ipcMain.on('dataFlux', (event,fluxAction,fluxArgs,message) => {
  mainWindow.webContents.send('coreSignal',fluxAction,fluxArgs,message);

  let powerValveAction = {};

  powerValveAction.fluxAction = fluxAction;
  powerValveAction.fluxArgs = fluxArgs;
  powerValveAction.message = message;

  powerValveArgsArray.push(powerValveAction);

  chaerosCalculator();
})

ipcMain.on('test', (event,message) => { console.log(message); })

ipcMain.on('chaeros-failure', (event,message) => {
      mainWindow.webContents.send('chaeros-failure',message);
    });

ipcMain.on('chaeros-success', (event,message,action) => {
    mainWindow.webContents.send('chaeros-success',message,"detransfect");
  });

ipcMain.on('chaeros-is-ready', (event, arg) => {
    let action = powerValveArgsArray[powerValveArgsArray.length-1];
    event.sender.send('chaeros-compute', action.fluxAction,action.fluxArgs,action.message);
  });

let chaerosWindow

const chaerosCalculator = () =>  {
  let chaerosWindow = new BrowserWindow({
    width: 10,
    height: 10,
    frame: false,
    transparent: true,
    show: false
  });

  chaerosWindow.loadFile('chaeros.html')

  chaerosWindow.webContents.on('did-finish-load', function () {
    chaerosWindow.webContents.openDevTools();
  });

}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  fs.writeFile(                                                        // Write data
    userDataPath +'/logs/log-'+date+".txt",dataLog,'utf8',     // Path/name, data, format
    (err) => {
if (err) throw err;
  app.quit()
});
})
