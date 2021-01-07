const { remote } = require('electron')
const { dialog } = remote.require('electron')
const { mainWindow } = remote.require('../src/main.js')

var options = {
  location: '',
  season: 1,
  metadataFile: ''
}

function openFolder() {
  dialog.showOpenDialog(mainWindow, {properties:['openDirectory']}).then((folder) => {
    if (folder.filePaths[0]) {
      document.getElementById('folderPath').innerText = folder.filePaths[0]
      options.location = folder.filePaths[0]
    }
  })
}

function openMetadata() {
  let settings = {
    defaultPath: 'metadata',
    properties: ['createDirectory', 'showOverwriteConvirmation'],
    filters: [
      {
        name: 'JSON', extensions: ['json']
      }
    ]
  }
  dialog.showSaveDialog(mainWindow, settings).then((file) => {
    console.log(file)
    if (file.filePath) {
      document.getElementById('metadataPath').innerText = file.filePath
      options.metadataFile = file.filePath
    }
  })
}

function setSeason(season) {
  options.season = season
}

function start() {
  remote.require('../src/renamer.js')(options, log)
}

function log(str) {
  document.getElementById('console').innerHTML += `${str}<br />`
  document.getElementById('console').scrollTo(0, 999999)
}