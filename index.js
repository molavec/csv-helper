let fs = require('fs')
let path = require('path')
let parse = require('csv-parse')
let stringify = require('csv-stringify')
let parseArgs = require('minimist')

var argv = parseArgs(process.argv.slice(2));
//console.log(argv)
let CHUNCK_SIZE = (argv.s) ? argv.s : 100
let OUTPUT_DIRECTORY = (argv.o) ? argv.o : 'output'
let CSV_FILE = (argv._[0] !== undefined)? argv._[0] : undefined
let OUTPUT_PREFIX = (argv.p) ? argv.p : path.basename(CSV_FILE).substring(0, path.basename(CSV_FILE).indexOf("."))


if (CSV_FILE === undefined){
  console.log("Debes ingresar un archivo csv")
  return 0
}

//crea el directorio de salida
if (!fs.existsSync(OUTPUT_DIRECTORY)){
  fs.mkdirSync(OUTPUT_DIRECTORY);
}


let parser = parse({delimiter: ',', columns: true}, function (err, data) {
  //Separa el listado en partes iguales y guarda los "mini-arreglos"
  //en el un gran arreglo "result"
  var result = chunkArray(data, CHUNCK_SIZE);
  //Guarda los listados en archivos independientes.
  for(var i=0; i < result.length; i++){
    csvToFile(result[i], `${OUTPUT_DIRECTORY}/${OUTPUT_PREFIX}${i}.csv`)
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
  /*
  let columns = {
    col1: 'col1',
    col2: 'col2',
    col3: 'col3',
    col4: 'col4',
    col5: 'col5',
    col6: 'col6'
  };

  stringify(objArray, { header: true, columns: columns }, (err, output) => {
  */
  stringify(objArray, { header: true}, (err, output) => {
    if (err) throw err;
    fs.writeFile(filename, output, (err) => {
      if (err) throw err;
      console.log(filename + ' saved');
    });
  });
}
