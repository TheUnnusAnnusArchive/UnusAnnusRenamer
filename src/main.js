const { app, BrowserWindow, dialog } = require('electron')
const isRoot = require('is-root')

var mainWindow = null

app.on('ready', () => {
  if (isRoot()) {
    dialog.showErrorBox('Do not run as root!', 'Please do not run this app as superuser! It is a possibility that it could mess something up!')
    process.exit()
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minHeight: 450,
    title: 'Unus Annus Renamer',
    fullscreenable: true,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      nodeIntegrationInSubFrames: true
    }
  })

  mainWindow.loadFile('app/index.html')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
})

exports.mainWindow = mainWindow