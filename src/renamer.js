const fs = require('fs')
const wget = require('wget-improved')
const { dialog } = require('electron')
const { mainWindow } = require('./main')

module.exports = (options, log) => {
  log('<span style="color:cyan">------</span><span style="color:magenta">Unus Annus Video Renamer</span><span style="color:cyan">------</span>')
  log('<span style="color: magenta">If you have any questions, please feel free to contact me at <a href="mailto:contact@unusannusarchive.tk" style="color:magenta">contact@unusannusarchive.tk</a>!<br /><br /><br /></span>')
  log(`<span style="color:cyan">Using the following settings: </span><span>${JSON.stringify(options)}</span>`)
  
  if (fs.existsSync(options.location)) {
    log(`<span style="color:green">The folder ${options.location} exists!</span>`)
    log('<span style="color:cyan">Checking for metadata file...</span>')
    if (fs.existsSync(options.metadataFile)) {
      log(`<span style="color:green">The metadata file ${options.metadataFile} exists!</span>`)
      convert(options, log)
    } else {
      log(`<span style="color:red">The metadata file ${options.metadataFile} does not exist!</span>`)
      log('<span style="color:cyan">Downloading metadata file...</span>')
      downloadMetadata(options, log)
    }
  } else {
    log(`<span style="color:red">The folder ${options.location} does not exist!</span>`)
  }
}

function downloadMetadata(options, log) {
  const download = wget.download('https://cdn.unusannusarchive.tk/metadata/all.json', options.metadataFile)

  download.on('error', (err) => {
    log('<span style="color:red">An error has occurred! Please contact me at <a href="mailto:contact@unusannusarchive.tk" style="color:red">contact@unusannusarchive.tk</a> for help!</span>')
    log(err)
    console.error(err)
    dialog.showErrorBox('An error has occurred!', err)
  })

  download.on('end', () => {
    log('<span style="color:green">Downloaded metadata file successfully!</span>')
    convert(options, log)
  })
}

function convert(options, log) {
  log('<span style="color:cyan">Starting conversion...</span>')

  log('<span style="color:cyan">Loading files in directory...</span>')
  const dir = fs.readdirSync(options.location)
  log('<span style="color:cyan">Loading metadata...</span>')
  const metadata = JSON.parse(fs.readFileSync(options.metadataFile, 'utf-8'))

  var numconverted = 0
  for (var i = 0; i < dir.length; i++) {
    if (dir[i].toLowerCase().endsWith('.mp4')) {
      const episode = parseInt(dir[i].toLowerCase().replace('.mp4', ''))
      if (!isNaN(episode)) {
        log(`<span style="color:cyan">Working on ${dir[i]} (Episode ${episode})...</span>`)
        var title
        if (options.season == 0) {
          title = metadata[0][episode - 1].title.replace(/[/\\?%*:|"<>]/g, '')
        } else if (options.season == 1) {
          title = metadata[1][episode -1].title.replace(/[/\\?%*:|"<>]/g, '')
        } else {
          log('<span style="color:red">An error has occurred! Please contact me at <a href="mailto:contact@unusannusarchive.tk" style="color:red">contact@unusannusarchive.tk</a> for help!</span>')
          log('Invalid season')
          console.error('Invalid season')
          dialog.showErrorBox('An error has occurred!', 'Invalid season')
        }
        if (fs.existsSync(`${options.location}/${title}.mp4`)) {
          fs.renameSync(`${options.location}/${dir[i]}`, `${options.location}/${title}-${dir[i]}`)
        } else {
          try {
            fs.renameSync(`${options.location}/${dir[i]}`, `${options.location}/${title}.mp4`)
          } catch (err) {
            log('<span style="color:red">An error has occurred! Please contact me at <a href="mailto:contact@unusannusarchive.tk" style="color:red">contact@unusannusarchive.tk</a> for help!</span>')
            log(err)
            console.error(err)
            dialog.showErrorBox('An error has occurred!', err)
          }
        }
        numconverted++
      }
    }
  }

  if (numconverted == 0) {
    log(`<span style="color:red">No video files found in ${options.location}!</span>`)
  } else {
    log(`<span style="color:green">Successfully renamed ${numconverted} files!</span>`)
  }
}