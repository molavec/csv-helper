const fs = require('fs')
const split = require('split')


const splitCSV = (CSV_FILE, CHUNCK_SIZE, OUTPUT_DIRECTORY, OUTPUT_PREFIX) => {
  let lineCounter = 0
  let fileCounter = 1
  let columns
  let outputfileStream

  fs.createReadStream(CSV_FILE)
    .pipe(split())
    .on('data', (line) => {

      // Obtiene la primera linea con el nombre de las columnas
      if(lineCounter === 0){
        columns = line
        lineCounter++ //aumenta el contador de línea antes de retornar
        return
      }

      // Crea un nuevo stream
      // y añade el header con el nombre de las columnas
      if((lineCounter-1) % CHUNCK_SIZE === 0){
        outputfileStream = fs.createWriteStream(OUTPUT_DIRECTORY+'/'+OUTPUT_PREFIX + '_' + fileCounter++ +'.csv')
        line =  columns + '\n' + line
      }

      // Evita el retorno de carro en la ultina línea
      if ((lineCounter-1) % CHUNCK_SIZE === CHUNCK_SIZE-1){
        outputfileStream.write(line);
      } else {
        outputfileStream.write(line + '\n');
      }

      //aumenta el contador de línea
      lineCounter++
    })
}

module.exports = splitCSV