//IMPORTACIONES NODE
const File = require('./files.model')
const fs = require('fs')
const path = require('path');

//IMPORTACIONES DEL PROYECTO
const moveDirectory = require('../../../helpers/deleteFiles/moveFile.js');
const deleteFolderRecursive = require('../../../helpers/deleteFiles/deleteFolderRecursive.js')
const deleteFiles = require('../../../helpers/deleteFiles/deleteFile.js');
const getAndProcessInDB = require('../../../helpers/processInDb');


const getFiles = async (req, res, next) => {

    try {
        let fileResponse = await File.find();

        fileResponse = fileResponse.filter(f => {
            if(req.body.admin === false){
                if(req.body.userSession === f.userCreator || f.usersWithPermission.includes(req.body.userSession) ){
                    return f
                }
            }else{
                return f
            }
          
    })

    // const fileResponse = await File.find();


    return res.status(200).json(fileResponse);
    } catch (error) {
        res.status(500).json(error)
    }
}

const getFileByPath =  async (req, res, next) => {

    try {
        let fileResponse = await File.find({path:req.body.path});

        fileResponse = fileResponse.filter(f => {

            if(req.body.admin === false){
                if(req.body.userSession === f.userCreator || f.usersWithPermission.includes(req.body.userSession)  ){
                
                    return f
                }
            }else {
                return f
            }

            
            
        })

        return res.status(200).json(fileResponse)
    } catch (error) {
        res.status(404).json({msg: "No se encontro la ruta o el usuario no tiene permiso"})
    }

}

const getFileByUserCreator = async (req, res, next) => {

    const filesOwner = await File.find({userCreator: req.body.userCreator})

    try {

        if(filesOwner !== null){
            res.status(200).json(filesOwner)
        }else{
            res.send("No files created by you")
        }
        
    } catch (error) {
        res.status(404).json({msg: "Something went wrong"})
    }

}

const getByFileName = async (req,res, next) => {

    let filesInDB = await File.find()

 

try {
   filesInDB = filesInDB.filter(f => {
        if (f.userCreator === req.body.userSession){
            if (f.file.toLowerCase().includes(req.body.filename.toLowerCase()))
 
            return f
        } else if (f.usersWithPermission.includes(req.body.userSession)){
            if (req.body.filename === f.file)
            return f
        }
    })

    res.status(200).json(filesInDB)
    
} catch (error) {
    console.log(error)
}

}


//Postea un archivo
const postOne = async (req,res,next) => {


    try {
        const fileToSaveInDB = new File();
        fileToSaveInDB.path = req.body.path;
        fileToSaveInDB.file = req.file.originalname;
        fileToSaveInDB.userCreator = req.body.userCreator;
        fileToSaveInDB.usersWithPermission = req.body.usersWithPermission;
        fileToSaveInDB.isFile = true;
        fileToSaveInDB.fullPath = fileToSaveInDB.path !== "" ? `${fileToSaveInDB.path}/${fileToSaveInDB.file}`: fileToSaveInDB.file;
        fileToSaveInDB.comments = req.body.comments

        await fileToSaveInDB.save();
    
            res.status(200).json(fileToSaveInDB);

    } catch (error) {
        return res.status(400).json({msg: "ERROR"})
    }
};

//Este metodo eliminara la carpeta con todo lo que tenga adentro
const deleteOne = async (req, res, next) => {
    try {
        deleteFolderRecursive(req.body.path !== "" ? `${req.body.path}/${req.body.file}`: req.body.file )
       return res.status(200).json({msg: "El archivo se eliminó correctamente"});

    } catch (error) {
        console.log(error);
    }
}

//Este metodo eliminara el archivo que se especifique
const deleteFile = async (req, res, next) => {

const fileDB = await File.findOneAndDelete({userCreator: req.body.userCreator, fullPath: req.body.file})

    try {
     
        // Paso la ubicación de la carpeta que contiene al archivo y especifico cual será el archivo que quiero eliminar
        if (fileDB){
            const msg = deleteFiles(fileDB.fullPath)
            // await fileDB.delete()
            return res.status(200).json(fileDB);
        }else {
            res.status(200).json({msg: "No tienes permiso para eliminar el archivo"});
        }
        
    } catch (error) {
        res.send("Hubo un error a la hora de eliminar el archivo")
    }

}


//Este metodo es para mover la ubicación de un archivo, primero hay que crear el directorio para que reconozca la ruta del mismo
const moveOne = async (req, res, next) => {

    const {oldPath, newPath, fileToMove, isFile, isEmpty} = req.body;

    const newFolderPath = newPath;
    const oldFolderPath = oldPath;

    let files;


// if(isFile){
    files = await File.find({ path: { $regex: `^${oldPath}` } })
// }

if(isEmpty === true){
    files = await File.find()
}

    for (const file of files) {

        if(file.fullPath.includes(oldFolderPath) && file.fullPath.includes(fileToMove) && !isEmpty ){

                file.path = file.path.replace(oldFolderPath, newFolderPath);
                const last = file.path.charAt(0) === "/" ? file.path.replace("/", "") : file.path
                file.path = last
                file.fullPath = file.path === "" ? file.file : `${file.path}/${file.file}`
                const newFilePath = file.path
                const newFullPath = file.fullPath
             let toSend =  await File.updateOne({ _id: file._id }, { $set: { path: newFilePath, fullPath: newFullPath  } });
     
        }
        else if(isEmpty === true && (file.fullPath === fileToMove || file.fullPath.split("/")[0] === fileToMove)){

            if(file.path !== ""){
              
                file.path = file.path.replace(oldFolderPath, newFolderPath !== undefined ? `${newFolderPath}/` : "");
            }
            else{
                file.path = file.path.replace(oldFolderPath,  newFolderPath !== undefined ? `${newFolderPath}` : "");
            }

            file.fullPath = newFolderPath !== "" ? `${file.path}/${file.file}` : file.file;
            const newFilePath = file.path
            const newFullPath = file.fullPath

         let toSend =  await File.updateOne({ _id: file._id }, { $set: { path: newFilePath, fullPath: newFullPath  } });
        }
       
     
}
// Actualiza la ruta de cada archivo encontrado para reflejar la nueva ubicación de la carpeta


// }
    // fs.mkdir(newPath, (error) => error)
    try {
         moveDirectory(fileToMove, oldPath, newPath !== undefined ? newPath : "")
         const allFiles = await File.find()
         res.send(allFiles)
    } catch (error) {
        console.log(error)
    }
}

//Este metodo crea un directorio en la raiz del proyecto, 
//todavia resta definir quien puede crear carpetas y como gestionar las ubicaciones
const makeDirectory = async  (req, res, next) => {
    const {file, path, isFile} = req.body;
let dest = "";




if (path === "" && isFile === false ){
 dest = file;
} else if (path !== "" && isFile === false){
dest = `${path}/${file}`;
} else {
    return res.send("Hubo un error a la hora de crear la carpeta")
}



try {


     fs.mkdir(dest, async (error) => {
        if(error){
    return  res.status(404).json({msg:"The folder already exists, please insert another folder name"})
        } else {
            let fileToSaveInDB = new File();
            fileToSaveInDB.path = req.body.path;
            fileToSaveInDB.file = req.body.file;
            fileToSaveInDB.userCreator = req.body.userCreator;
            if(!req.body.usersWithPermission.includes(req.body.userCreator)){
                fileToSaveInDB.usersWithPermission.push(req.body.userCreator)
            }
            if(typeof req.body.usersWithPermission === "string"){
                fileToSaveInDB.usersWithPermission.push(req.body.usersWithPermission);
            }else if(typeof req.body.usersWithPermission === "object"){
                fileToSaveInDB.usersWithPermission.push(...req.body.usersWithPermission);
            }
            
            fileToSaveInDB.isFile = false;
            fileToSaveInDB.fullPath = fileToSaveInDB.path !== "" ? `${fileToSaveInDB.path}/${fileToSaveInDB.file}`: fileToSaveInDB.file
                await fileToSaveInDB.save()
        return res.status(200).json(fileToSaveInDB)
        }
 })
} catch (error) {
    res.send("Ha habido un problema y no se ha creado la carpeta")
}
}

const assignPermit = async (req, res, next) => {

    const {userWithPermit, path, fullPath, isFile, userCreator, file} = req.body
    let allFiles = [];
    let users = await File.find()
    let filesToAssignPermits = fullPath.split("/")
    let pathToMatch = ""



    if(!isFile){
        filesToAssignPermits = []
        users.forEach(v => {
            if( v.fullPath.includes(fullPath.split("/")[0], 0) && v.fullPath.includes(file) && v.fullPath.includes(fullPath) ){
                filesToAssignPermits = v.fullPath.split("/")
            }
            if(v.fullPath.includes(fullPath, 0) && path == "" ){
                    allFiles.push(getAndProcessInDB(userCreator, v.fullPath, userWithPermit))
                    filesToAssignPermits = []
                // if(v.isFile && !filesToAssignPermits.includes){
             

                // }
            }
        })
    } 
        for( let i = 0; i <= filesToAssignPermits.length - 1; i++){
            if(filesToAssignPermits.length > 0)
            pathToMatch = pathToMatch !== "" ? pathToMatch + '/' + filesToAssignPermits[i] :  pathToMatch + filesToAssignPermits[i];
           allFiles.push(getAndProcessInDB(userCreator, pathToMatch, userWithPermit))
        }

       


    try {
Promise.all(allFiles).then( r => {
            res.status(200).json(r)
        })
    

        
    } catch (error) {
        // console.log(error)
    }

}


const assignUserToVerify = async(req, res, next) => {

    const fileToUpdateInDB = await File.findOne({fullPath: req.body.fullPath})

    try {
        fileToUpdateInDB.userAssignedToVerify = req.body.userToVerify
        fileToUpdateInDB.status.Unassigned = false;
        fileToUpdateInDB.status.Send = true;
        fileToUpdateInDB.status.Read = false;
        fileToUpdateInDB.status.Verified = false;
   
        await fileToUpdateInDB.save()
   
        return res.status(200).json(fileToUpdateInDB)
    } catch (error) {
        console.log(error)
    }
}


const userHasRead = async(req, res, next) => {

    const fileToUpdateInDB = await File.findOne({fullPath: `${req.body.path}/${req.body.file}`, userAssignedToVerify: req.body.userAssignedToVerify})

    try {

            fileToUpdateInDB.status.Unassigned = false;
            fileToUpdateInDB.status.Send = false;
            fileToUpdateInDB.status.Read = true;
            fileToUpdateInDB.status.Downloaded = false;
            fileToUpdateInDB.status.Verified = false;
            await fileToUpdateInDB.save()
   
        return res.status(200).json(fileToUpdateInDB)
    } catch (error) {
        console.log(error)
    }
}

const userHasDownloaded = async(req, res, next) => {

    const fileToUpdateInDB = await File.findOne({fullPath: req.body.fullPath})

    try {
        fileToUpdateInDB.status.Unassigned = false;
        fileToUpdateInDB.status.Send = false;
        fileToUpdateInDB.status.Read = false;
        fileToUpdateInDB.status.Downloaded = true;
        fileToUpdateInDB.status.Verified = false;
   
        await fileToUpdateInDB.save()
   
        return res.status(200).json(fileToUpdateInDB)
    } catch (error) {
        console.log(error)
    }
}


const verify = async(req, res, next) => {

    const fileToUpdateInDB = await File.findOne({fullPath: req.body.fullPath})



    try {
            fileToUpdateInDB.verifiedBy = req.body.verifiedBy
            fileToUpdateInDB.status.Unassigned = false;
            fileToUpdateInDB.status.Send = false;
            fileToUpdateInDB.status.Read = false;
            fileToUpdateInDB.status.Downloaded = false;
            fileToUpdateInDB.status.Verified = true;
            fileToUpdateInDB.comments = req.body.comments

            await fileToUpdateInDB.save()
           return res.status(200).json(fileToUpdateInDB)
      
    } catch (error) {
        console.log(error)
    }

}


const uploadFiles = (req, res, next) => {


    try {
        
    } catch (error) {
        
    }


}


module.exports = {
    postOne,
    deleteOne,
    moveOne,
    makeDirectory, 
    deleteFile,
    assignPermit,
    getFiles,
    getFileByPath,
    verify,
    getByFileName,
    getFileByUserCreator,
    assignUserToVerify,
    userHasRead,
    userHasDownloaded,
    uploadFiles

}






