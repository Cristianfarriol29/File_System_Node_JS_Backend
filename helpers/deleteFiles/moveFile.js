const fs = require("fs");
const path = require("path");
const mv = require('mv')
//fs-extra permite no solo cambiar la ubicación, sino que genera la ruta nueva que se le indique en su metodo 'move'
const fsExtra = require('fs-extra')



function moveDirectory (file,pathToMove,newPath) {
  let destinationPath;
    const currentPath = path.join(__dirname, '..' , '..', `${pathToMove}`, `${file}`);
    if(newPath !== ""){
      destinationPath = path.join(__dirname , '..' ,'..', `${newPath}`, `${file}`)
    }else {
      destinationPath = path.join(__dirname , '..' ,'..',  `${file}`)
    }
    


   fs.rename(currentPath, destinationPath, function (err) {
        if (err) console.log(err)
      })
   
}



module.exports = moveDirectory;