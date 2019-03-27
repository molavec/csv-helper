const fs = require('fs')
const path = require('path')
const parseArgs = require('minimist')
const splitcsv = require('./split-csv')


var argv = parseArgs(process.argv.slice(2))
//console.log(argv)
let CHUNCK_SIZE = (argv.s) ? argv.s : 100
let OUTPUT_DIRECTORY = (argv.o) ? argv.o : 'output'
let CSV_FILE = (argv._[0] !== undefined)? argv._[0] : undefined


//veridica que se agreda una archivo
if (CSV_FILE === undefined){
  console.log("Debes ingresar un archivo csv")
  return 0
}

let OUTPUT_PREFIX = (argv.p) ? argv.p : path.basename(CSV_FILE).substring(0, path.basename(CSV_FILE).indexOf("."))

//crea el directorio de salida
if (!fs.existsSync(OUTPUT_DIRECTORY)){
  fs.mkdirSync(OUTPUT_DIRECTORY)
}

splitcsv(CSV_FILE, CHUNCK_SIZE, OUTPUT_DIRECTORY, OUTPUT_PREFIX)