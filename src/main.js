const fs = require('fs')
const colors = require('colors')
const { argv } = require('process')
const isRoot = require('is-root')
const wget = require('wget-improved')

console.log('------'.cyan, 'Unus Annus Video Renamer'.magenta, '------'.cyan)
console.log('If you have any questions, please feel free to contact me at contact@unusannusarchive.tk!\n\n\n'.magenta)

if (isRoot()) {
  console.log('\n\n\nWe\'ve disabled the functionality to run as super user so that we don\'t accidentally fuck up your OS due to an error.\nPlease run as a normal user with rights to the current directory\n\n\n'.red)
  process.exit()
}

if (!argv[1] || !argv[2]) {
  console.log('No arguments provided!'.red, 'Please run this command with the --help argument for help.'.cyan)
  process.exit()
}

//help
if (argv[1] == '--help' || argv[1] == '-h' || argv[2] == '--help' || argv[2] == '-h') {
  console.log('------'.cyan, 'Help'.magenta, '------\n'.cyan,
    `
      --help: Shows this message
      --location: Sets the location, usage: --location <folder>
      --season: Sets the season you wanna rename, usage: --season <season (0 or 1)>
      --metadata: Sets the location of the metadata file, ending in .json (if it doesn't exist, it will download it to that location), usage: --metadata <filename>

      Example command: <executable> --location ./01 --season 1 --metadata ./metadata.json
    `
  )
  process.exit()
}

var options = {
  location: './',
  season: 1,
  metadataFile: './metadata.json'
}

//argv parser
for (var i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('-')) {
    if (argv[i] == '--location' || argv[i] == '-l') {
      options.location = argv[i + 1]
    } else if (argv[i] == '--season' || argv[i] == '-s') {
      options.season = parseInt(argv[i + 1])
    } else if (argv[i] == '--metadata' || argv[i] == '-m') {
      options.metadataFile = argv[i + 1]
    }
  }
}

console.log('Using the following settings:'.cyan, options)

if (isNaN(options.season)) {
  console.log('Please enter a valid season! (0 or 1)'.red)
  process.exit()
}

if (fs.existsSync(options.location)) {
  console.log(`The folder ${options.location} exists!`.green)
  console.log('Checking for metadata file...'.cyan)
  if (fs.existsSync(options.metadataFile)) {
    console.log(`The metadata file ${options.metadataFile} exists!`.green)
    convert()
  } else {
    console.log(`The metadata file ${options.metadataFile} does not exist!`.red)
    console.log('Downloading metadata file...'.cyan)
    downloadMetadata()
  }
} else {
  console.log(`The folder ${options.location} does not exist!`.red)
}

function downloadMetadata() {
  const download = wget.download('https://cdn.unusannusarchive.tk/metadata/all.json', options.metadataFile)

  download.on('error', (err) => {
    console.log('An error has occurred! Please contact me at contact@unusannusarchive.tk for help!')
    console.log(err)
    process.exit()
  })

  download.on('end', () => {
    console.log('Downloaded metadata file successfully!'.green)
    convert()
  })
}

function convert() {
  console.log('Starting conversion...'.cyan)
  
  console.log('Loading files in directory...'.cyan)
  const dir = fs.readdirSync(options.location)
  console.log('Loading metadata...'.cyan)
  const metadata = JSON.parse(fs.readFileSync(options.metadataFile, 'utf-8'))

  var numconverted = 0
  for (var i = 0; i < dir.length; i++) {
    if (dir[i].toLowerCase().endsWith('.mp4')) {
      const episode = parseInt(dir[i].toLowerCase().replace('.mp4', ''))
      if (!isNaN(episode)) {
        console.log(`Working on ${dir[i]} (Episode ${episode})...`.cyan)
        if (options.season == 0) {
          const title = metadata[0][episode - 1].title.split('\\').join('').split('/').join('').split(':').join(' -').split('*').join('').split('?').join('').split('<').join('').split('>').join('').split('|').join('-')
  
          if (fs.existsSync(`${options.location}/${title}.mp4`)) {
            fs.renameSync(`${options.location}/${dir[i]}`, `${options.location}/${title}-${dir[i]}`)
          } else {
            fs.renameSync(`${options.location}/${dir[i]}`, `${options.location}/${title}.mp4`)
          }
        } else if (options.season == 1) {
  
        } else {
          console.log('Please enter a valid season! (0 or 1)'.red)
          process.exit()
        }
        numconverted++
      }
    }
  }

  if (numconverted == 0) {
    console.log(`No video files found in ${options.location}!`.red)
  } else {
    console.log(`Successfully renamed ${numconverted} files!`.green)
  }
}