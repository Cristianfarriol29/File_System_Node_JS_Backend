const fs = require('fs')


function deleteFile (pathToTheDelete) {

    try {
        fs.unlinkSync(pathToTheDelete);
            return "El Archivo se ha eliminado correctamente"

      } catch(err) {
        console.error('Something wrong happened removing the file')
      }
}



module.exports = deleteFile