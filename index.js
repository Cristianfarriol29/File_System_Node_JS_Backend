// Importar Express -> Métodos o funciones para gestionar mi server
const express = require('express');
// Importar Cors -> Librería que gestiiona proxies o urls permitadas
const cors = require('cors');
const multer = require('multer');
const { FileRoutes } = require('./src/api/files/files.routes');
const { connect }= require('./src/utils/database/db.js');
const { UsersRoutes } = require('./src/api/users/users.routes');
const uploadFolders = require('./helpers/deleteFiles/uploadFolders');






// Inicializar Express
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:4200"],
  })
  );
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Origin', '*')
    next()
})

app.use(express.urlencoded({
  extended: false
}));
app.use(express.static('./../server'))

connect()

app.listen(8000, () => console.log("Servidor corriendo en el puerto 8000") )

app.use('/file', FileRoutes);
app.use('/users', UsersRoutes);



