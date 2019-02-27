const electron = require('electron')
const {app, BrowserWindow, ipcMain, shell} = electron;
const fs = require('fs');
const userDataPath = app.getPath('userData');

let mainWindow

const basePath = app.getAppPath();


//FileSystem
var pandoDir = userDataPath;

var dirTree = [
  "/logs",
  "/userID",
  "/themes"
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
// themes
let activeTheme;

fs.copyFileSync(basePath+"/json/themes.json", userDataPath +"/themes/themes.json");

const changeTheme = () => {

fs.readFile(basePath+"/json/themes.json", // Read the designated datafile
                                'utf8', (err, theme) => {             // utf8 ecoding - start function

let themedata;

try {
  themeData = JSON.parse(theme);
} catch (error) {
  //console.log(error);             //Often fails at parsing 
}

activeTheme = themeData.activeTheme;

for (let i = 0; i < themeData.themes.length; i++) {
  if (themeData.themes[i]["theme-name"]===activeTheme) {
    
     mainWindow.webContents.send('change-theme',themeData.themes[i]);     
  }
  }
});

};

const themeChangeTrigger = (theme) => {

  fs.readFile(basePath +'/json/themes.json', // Read the designated datafile
  'utf8', (err, newThemeData) => {             // utf8 ecoding - start function
    let changeThemedata = JSON.parse(newThemeData);
    changeThemedata.activeTheme = theme;

    fs.writeFile(basePath+"/json/themes.json",JSON.stringify(changeThemedata),'utf8',
      (err) => {if (err) throw err;}
    );

    fs.writeFile(userDataPath +"/themes/themes.json",JSON.stringify(changeThemedata),'utf8',
      (err) => {if (err) throw err;}
    );
   
    changeTheme();

})

};

ipcMain.on('change-theme', (event,theme) => {
  themeChangeTrigger(theme);
})

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
         nodeIntegrationInWorker: true
       }
   })

  mainWindow.loadFile('index.html')

  mainWindow.addListener("enter-full-screen",(e) => {
    themeChangeTrigger("normal");
  });
  
  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {

      if (frameName === 'modal') {
          event.preventDefault()

        Object.assign(options, {
            modal: true,
            parent: mainWindow,
            frame: true,
            webPreferences: {
                nodeIntegrationInWorker: true
              }
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


var windowIds = [
{name:"flux",id:0},
{name:"tutorialHelper",id:0},
{name:"tutorial",id:0}
]


ipcMain.on('window-ids', (event,window,id) => {
    windowIds.forEach(d=>{if (d.name === window) { d.id = id};})
});


const openHelper = (helperFile) => {

  let screenWidth = electron.screen.getPrimaryDisplay().workAreaSize.width;
  let screenHeight = electron.screen.getPrimaryDisplay().workAreaSize.height;

  let win = new BrowserWindow({
    backgroundColor: 'white',
    resizable: false,
    width: 350,
    height: 700,
    alwaysOnTop:true,
    autoHideMenuBar : true,
    x:screenWidth-350,
    y:100
  })
  win.once('ready-to-show', () => {
  win.show()
})
  var path = 'file://' + __dirname + '/'+ helperFile +'.html';
  win.loadURL(path);
}

const openModal = (modalFile,scrollTo) => {
  let win = new BrowserWindow({
    backgroundColor: 'white',
    modal: true,
    alwaysOnTop:true,
    frame: false,
    resizable: false,
    show: false
  })
  var path = 'file://' + __dirname + '/'+ modalFile +'.html';
  win.loadURL(path);
  win.once('ready-to-show', () => {
  win.show();
  win.webContents.send('scroll-to',scrollTo);
})
}

ipcMain.on('window-manager', (event,type,file,scrollTo) => {

let win = {};

for (var i = 0; i < windowIds.length; i++) {
  if (windowIds[i].name === file) {
    win = BrowserWindow.fromId(windowIds[i].id)}
}

switch (type) {
  case "openHelper": openHelper(file);
    break;
  case "openModal": openModal(file,scrollTo);
    break;
  case "closeWindow":
     win.webContents.send('window-close','close');
    break;
}

});


let userID = {"UserName":"Enter your name","UserMail":"Enter your e-mail (not required)","ZoteroID":"Enter your Zotero ID (required to use Flux features)"};

  if (!fs.existsSync(userDataPath+'/userID/user-id.json')) {
    fs.writeFile(userDataPath +"/userID/user-id.json",JSON.stringify(userID),'utf8',
      (err) => {if (err) throw err;}
    );
  }

//CONSOLE

let date = new Date().toJSON().replace(/:/g,"-");                 // Create a timestamp
var dataLog =  "PANDORÆ Log - "+date;

  ipcMain.on('console-logs', (event,message) => {
    let newLine = "\r\n"+new Date().toLocaleTimeString('fr-FR')+" ~ "+message;
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

    if (datasets.kind===parseInt(folderOne[j][0])){                                 // if this is the relevant subsubfolder
      fs.readdir(userDataPath+'/datasets/'+files[i]+'/'+folderOne[j], (err, folderTwo) => {     // read its content
          for (let k = 0;k<folderTwo.length;k++){           // loop on each object
            let item = folderTwo[k];
            let kind = folderOne[j];
            let type = files[i];
            let path = userDataPath+'/datasets/'+ files[i]+'/'+folderOne[j]+'/'+item;
              mainWindow.webContents.send('datalist',type,kind,item,path);           // send it to requester
                    };
                 });
              } else {

                // Send OK signal for Worker activation

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
    show: false,
    webPreferences: {
        nodeIntegrationInWorker: true
      }
  });

  chaerosWindow.loadFile('chaeros.html')

  chaerosWindow.webContents.on('did-finish-load', function () {
  //  chaerosWindow.webContents.openDevTools();
  });

}

// Quit when all windows are closed.
app.on('window-all-closed', function () {
// Write log
  fs.writeFile(                                                        // Write data
    userDataPath +'/logs/log-'+date+".txt",dataLog,'utf8',     // Path/name, data, format
    (err) => {
if (err) throw err;

//Purge Buffer
if( fs.existsSync(userDataPath+"/datasets/buffer") ) {
  fs.readdirSync(userDataPath+"/datasets/buffer").forEach(function(file,index){
    var curPath = userDataPath+"/datasets/buffer/" + file;
      fs.unlinkSync(curPath);
  });
  fs.rmdirSync(userDataPath+"/datasets/buffer");
}

  app.quit()
});
})

// Tutorial

ipcMain.on('tutorial', (event,message) => {
  switch (message) {
    case 'flux': 
                mainWindow.webContents.send('tutorial','openFlux');
      break;

  }
});



