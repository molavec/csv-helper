let fs = require('fs')
let parse = require('csv-parse')
let stringify = require('csv-stringify')
let parseArgs = require('minimist')




var argv = parseArgs(process.argv.slice(2));
let CHUNCK_SIZE = (argv.s) ? argv.s : 100
let CSV_FILE = (argv._[0] !== undefined)? argv._[0] : undefined
let OUTPUT_PREFIX = (argv._[1]) ? argv._[0] : 'output'

if (CSV_FILE === undefined){
  console.log("Debes ingresar un archivo csv")
  return 0
}

let parser = parse({delimiter: ',', columns: true}, function (err, data) {

  //Separa el listado en partes iguales y guarda los "mini-arreglos"
  //en el un gran arreglo "result"

  var result = chunkArray(data, CHUNCK_SIZE);
  console.log(result)
  //Guarda los listados en archivos independientes.
  for(var i=0; i < result.length; i++){
    csvToFile(result[i], OUTPUT_PREFIX+i+'.csv')
  }
});

fs.createReadStream(CSV_FILE).pipe(parser);


/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function chunkArray(myArray, chunk_size){
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
      myChunk = myArray.slice(index, index+chunk_size);
      // Do something if you want with the group
      tempArray.push(myChunk);
  }

  return tempArray;
}

/**
 * Almacena en un archivo CSV el contenido del arreglo.
 * @param {Array} objArray arreglo de objetos que se almacenarán en el CSV.
 * @param {filename} filename nombre archivo de salida
 */
function csvToFile(objArray, filename){
  let columns = {
    col1: 'col1',
    col2: 'col2',
    col3: 'col3',
    col4: 'col4',
    col5: 'col5',
    col6: 'col6'
  };
  stringify(objArray, { header: true, columns: columns }, (err, output) => {
    if (err) throw err;
    fs.writeFile(filename, output, (err) => {
      if (err) throw err;
      console.log(filename + ' saved');
    });
  });
}

/**
 * Normaliza número de teléfono a un formato que sea útil para ser utlizado
 * en la generación de enlaces de whatsapp.
 *
 * @param {String} phoneOriginal Número original de teléfono.
 */
function parsePhone(phoneOriginal) {
  let phone = null;
  if(phoneOriginal != null) {
    let phoneString = phoneOriginal.replace(/ |,|\+,(|)/g,'').substr(0,12);
    if(phoneString.charAt(0) === '+') {
      phone = phoneString
    } else if (phoneString.charAt(0) === '0') {
      phone =  "+56" + phoneString.substr(1,phoneString.length)
    } else if (phoneString.substr(0,2) === '56') {
      phone =  "+" + phoneString
    } else if (phoneString.length === 9 ) {
      phone =  "+56" + phoneString
    } else if (phoneString.length === 8 ) {
      phone = "+569" + phoneString
    } else {
      phone = null
    }
  }
  return phone;
}