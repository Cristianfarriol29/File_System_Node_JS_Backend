const multer = require('multer')
const fs = require('fs')
const path = require("path");
const File = require('../../src/api/files/files.model.js');



 const storage =  multer.diskStorage({
 
  //Nos encontramos en la llave 'destination' donde determinaremos el lugar en el que se guardara el archivo y el nombre de la carpeta
    destination: async (req, file, cb) => {
      const path2 = path.join(__dirname, '..' , '..');

      //Almacenamos la ruta que llega en el cuerpo de la petición
        const dest = req.body.path
            fs.access(dest ? dest: path2, async function (error) {
              if (error) {
                //Si no existed
            return fs.mkdir(dest, (error) => {
              cb(error, dest)
            }); //El nombre de la ruta que almacenamos anteriormente, se lo asignaremos como argumento al método
          } else {
        //Como describi lineas atras, 'destination' necesita un directorio creado para asignar el destino, en este caso, cuando el directorio ya está creado
        //obviamente no necesita crearse y por eso lo destinará al directorio existente

            return cb(null, dest);
          }
        });
      },
      //Aqui asignaremos el nombre del archivo, conservaremos el nombre original
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
    })

    //Una vez hecha la configuración, se la pasamos a Multer
    const upload = multer({ storage })

    module.exports = upload