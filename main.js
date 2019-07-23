const electron = require('electron')
const {app, BrowserView, BrowserWindow, ipcMain, shell} = electron;
const fs = require('fs');
const userDataPath = app.getPath('userData');

let mainWindow

const basePath = app.getAppPath();

//FileSystem
const userDataDirTree = (path,dirTree) => {
    dirTree.forEach(d=>{
        if (!fs.existsSync(path+d)){
          fs.mkdirSync(path+d, { recursive: true }, (err) => {
                if (err) throw err;
              })
          }
    })
}

let userID;

const createUserId = () => {

  userID = {"UserName":"Enter your name","UserMail":"Enter your e-mail (not required)","ZoteroID":"Enter your Zotero ID (required to use Flux features)","theme":"normal"};

  if (!fs.existsSync(userDataPath+'/userID/user-id.json')) {
    fs.writeFileSync(userDataPath +"/userID/user-id.json",JSON.stringify(userID),'utf8',
      (err) => {if (err) throw err;}
    );
  }
};

  const createThemes = () => {
    if (!fs.existsSync(userDataPath+'/themes/themes.json')) {
      fs.copyFileSync(basePath+"/json/themes.json", userDataPath +"/themes/themes.json");
    }
  }; 

function createWindow () {

  mainWindow = new BrowserWindow({
     width: 1200,
     height: 800,
     fullscreenable:true,
     backgroundColor: 'white',
     titleBarStyle: 'hidden',
     frame: true,
     resizable:false,
     webPreferences: {
         nodeIntegration: true,
         nodeIntegrationInWorker: true,
         plugins: true
       }
   })


  mainWindow.loadFile('index.html')
  
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {

      if (frameName === 'modal') {
          event.preventDefault()

        Object.assign(options, {
            modal: true,
            parent: mainWindow,
            frame: true,
            webPreferences: {
              nodeIntegration: true,
              nodeIntegrationInWorker: true
              }
        })

        event.newGuest = new BrowserWindow(options)
      }
    })

  mainWindow.setMenu(null);
  //mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => { mainWindow = null })
}

app.on('ready', ()=>{
  userDataDirTree(userDataPath,["/logs","/userID","/themes","/flatDatasets"]);
  createUserId();
  createThemes();
  createWindow();

  mainWindow.onbeforeunload = (e) => {
    BrowserView.getAllViews().forEach(view=>view.destroy());
  }

});

app.on('activate',  () => { if (mainWindow === null) { createWindow() } });

var windowIds = [
{name:"flux",id:0,open:false},
{name:"tutorialHelper",id:0,open:false},
{name:"tutorial",id:0,open:false}
];

ipcMain.on('window-ids', (event,window,id,open) => {
    windowIds.forEach(d=>{if (d.name === window) {
       d.id = id;
       d.open=open;
      }})
});

const openHelper = (helperFile) => {

  let screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width;
  let screenHeight = electron.screen.getPrimaryDisplay().workAreaSize.height;

  let win = new BrowserWindow({
    backgroundColor: 'white',
    resizable: false,
    frame: true,
    width: 350,
    height: 700,
    alwaysOnTop:false,
    autoHideMenuBar : true,
    x:screenWidth-350,
    y:100,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
      }
  })
  win.once('ready-to-show', () => {
  win.show()
})
  var path = 'file://' + __dirname + '/'+ helperFile +'.html';
  win.loadURL(path);
}

const openModal = (modalFile,scrollTo) => {
  
  for (let i = 0; i < windowIds.length; i++) {
    if (windowIds[i].name === modalFile){ 



      if (windowIds[i].open === false) {
              let win = new BrowserWindow({
                backgroundColor: 'white',
                modal: true,
                alwaysOnTop:false,
                frame: false,
                resizable: false,
                show: false,
                y:100,
                webPreferences: {
                  nodeIntegration: true,
                  nodeIntegrationInWorker: true
                  }
              })

              var path = 'file://' + __dirname + '/'+ modalFile +'.html';
              win.loadURL(path);
              win.once('ready-to-show', () => {
              win.show();
              win.webContents.send('scroll-to',scrollTo);
            })
          }
        }
      }
}

ipcMain.on('window-manager', (event,type,file,scrollTo,section) => {

let win = {};


switch (type) {
  case "openHelper": 
  openHelper(file);

setTimeout(()=>{
  for (var i = 0; i < windowIds.length; i++) {
    if (windowIds[i].name === file) {
      BrowserWindow.fromId(windowIds[i].id).webContents.send('tutorial-types',section);
    }
  }
},800);

    break;
  case "openModal": openModal(file,scrollTo);
    break;
  case "closeWindow":
  try{
    
      for (var i = 0; i < windowIds.length; i++) {
        if (windowIds[i].name === file) {
          win = BrowserWindow.fromId(windowIds[i].id)}
      }
     win.webContents.send('window-close','close');
    }catch(e){
      console.log(e);
    }
    break;
}

});


//CONSOLE

let date = new Date().toJSON().replace(/:/g,"-");                 // Create a timestamp
var dataLog =  "PANDORÆ Log - "+date;

  ipcMain.on('console-logs', (event,message) => {
    let newLine = "\r\n"+new Date().toLocaleTimeString('fr-FR')+" ~ "+message;
    dataLog = dataLog + newLine;
    mainWindow.webContents.send('console-messages',newLine);           // send it to requester
  })


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

ipcMain.on('chaeros-failure', (event,message) => {
      mainWindow.webContents.send('chaeros-failure',message);
    });

ipcMain.on('chaeros-notification', (event,message,action) => {
    mainWindow.webContents.send('chaeros-notification',message,"detransfect");
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
    show: false,
    webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      }
  });

  chaerosWindow.loadFile('chaeros.html')

  chaerosWindow.webContents.on('did-finish-load', function () {
   //chaerosWindow.webContents.openDevTools();
  });

}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
// Write log
  fs.writeFile(                                                        // Write data
    userDataPath +'/logs/log-'+date+".txt",dataLog,'utf8',     // Path/name, data, format
    (err) => {
if (err) throw err;
setTimeout(()=>{app.quit()},100);
    })
  });

// Tutorial
ipcMain.on('tutorial', (event,message) => { mainWindow.webContents.send('tutorial',message)});

ipcMain.on('mainWindowReload', (event,message) => { 
  mainWindow.webContents.send('mainWindowReload',message)
});


/* ipcMain.on('hyphe', (event,message) => { 
  let view = new BrowserView();
  view.setBounds({ x: 0, y: 20, width: 1200, height: 780 })

  if (message === "close") {
    view.destroy();
  } else {
    mainWindow.setBrowserView(view)
    view.webContents.loadURL(message)
  }

});
 */

// ProgressBar
ipcMain.on('progress', (event,message) => { 
  let ratio = parseInt(message);
  mainWindow.webContents.send('progressBar',ratio)
});