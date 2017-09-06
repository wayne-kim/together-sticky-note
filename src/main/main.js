const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

const FM = require('./FileManager.js')
FM.init("./data");

let wins = [];
let win;
let useDevTools = false;

function createWindow(option) {
  win = new BrowserWindow({
    minWidth: 200,
    minHeight: 100,
    width: option ? option.width : 270,
    height: option ? option.height : 200,
    x : option ? option.x + 50 : null,
    y : option ? option.y + 50 : null,
    frame: true
  }) 
  if (useDevTools) win.webContents.openDevTools();

  win.loadURL(url.format({
    pathname: path.join(__dirname, '../renderer/sticky.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.on('closed', () => {
    win = null
  })
  wins.push(win);
}

function loadWindows(fileList) {
  for (let fileName of fileList) {
    let optionObject = FM.readOption(fileName);

    win = new BrowserWindow({
      minWidth: 200,
      minHeight: 100,
      width: optionObject.width,
      height: optionObject.height,
      x: optionObject.x,
      y: optionObject.y,
      frame: false,
      title: fileName
    })

    //win.setTitle(fileName);
    if (useDevTools) win.webContents.openDevTools();

    win.loadURL(url.format({
      pathname: path.join(__dirname, '../renderer/sticky.html'),
      protocol: 'file:',
      slashes: true
    }))

    win.on('closed', () => {
      win = null
    })

    wins.push(win);
  }
}

//app
app.on('ready', function () {
  FM.fileList.size == 0 ?
    createWindow() :
    loadWindows(FM.fileList);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// app.on('activate', () => {
//   if (win === null) {
//     createWindow()
//   }
// })

//ipcMain
ipcMain.on("save", (event, html, option) => {
  let fileName = FM.getUniqueFileName(10);
  FM.saveFile(fileName, html);
  FM.writeOption(fileName, option);
  event.sender.send('quit');
})

ipcMain.on("load", (event, fileName) => {
  let data = FM.loadFile(fileName);
  event.sender.send('load', data);
})

ipcMain.on("update", (event, html, fileName, option) => {
  FM.updateFile(fileName, html);
  FM.writeOption(fileName, option);
  event.sender.send('quit');
})

ipcMain.on("delete", (event, fileName) => {
  FM.deleteFile(fileName);
  event.sender.send('quit');
}) 

ipcMain.on("new", (event, option) => {
  let optionObject = JSON.parse(option);
  createWindow(optionObject);
})

ipcMain.on("save2", (event, html, option) => {
  let fileName = FM.getUniqueFileName(10);
  FM.saveFile(fileName, html);
  FM.writeOption(fileName, option);
  event.sender.send("setTitle", fileName);
  console.log("real1");
})
ipcMain.on("update2", (event, html, fileName, option) => {
  FM.updateFile(fileName, html);
  FM.writeOption(fileName, option);
  console.log("real2");
})
