const { Console } = require('console');
const fs = require('fs');
const File = require('../../src/api/files/files.model.js')

var deleteFolderRecursive = async function(path) {
// const user = await File.findOne({fullPath: path})
const array = []

    if(fs.existsSync(path)) {
       
        fs.readdirSync(path).forEach(async function(file) {
            // await File.deleteOne({path: path})
          var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath)
                await File.find().then(x => {
                    x.filter(y => {
                        if(y.fullPath == curPath){
                            y.delete()
                        }
                    })
                })
            }
        });
        fs.rmdirSync(path)
        await File.find().then(x => {
            x.filter(y => {
                if(y.fullPath == path){
                    y.delete()
                }
            })
        })
         
      }



  };



  module.exports = deleteFolderRecursive