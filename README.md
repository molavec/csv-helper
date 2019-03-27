# csv-helper
Ayuda a ejecutar operaciones con archivos csv.


## HOW TO

### Split
Divide el archivos csv en archivos con el tamaño de items indicados

```bash
node index.js -s 12  example/example.csv
```

## TODO

* Generar texto para mejorar ayuda
-h debe mostrar texto de help.


* Filtrar las columnas que solo se quieran
Ejemplo:
node index.js -s 12 -f "col1,col2,col3" example/example.csv
debería generar un archivo con solo col1,col2, col3

* Argumentos opcionales
Hacer que algunos argumentos sean opcionales



