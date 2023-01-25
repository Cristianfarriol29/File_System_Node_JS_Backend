//IMPORTACIONES NODE
const multer = require('multer');
const fs = require('fs');
//IMPORTACIONES PROPIAS
const FileRoutes = require('express').Router();
const {postOne, deleteOne, moveOne, makeDirectory, getFiles, deleteFile, assignPermit, getFileByPath, verify, getByFileName, getFileByUserCreator, assignUserToVerify,  userHasRead,  userHasDownloaded, uploadFiles} = require('../files/files.controller.js');
const upload = require('../../../helpers/deleteFiles/upload');
const uploadFolders = require('../../../helpers/deleteFiles/uploadFolders.js');
const File = require('./files.model.js');



FileRoutes.post('/post-file/', upload.single('archivo'), postOne);
FileRoutes.post('/delete-file', deleteFile);
FileRoutes.post('/delete-directory', deleteOne);
FileRoutes.post('/move-file', moveOne);
FileRoutes.post('/make-directory', makeDirectory);
FileRoutes.post('/assign-permit', assignPermit)
FileRoutes.post('', getFiles)
FileRoutes.post('/get-file', getFileByPath)
FileRoutes.post('/get-file-by-user', getFileByUserCreator)
FileRoutes.post('/assign-to-verify', assignUserToVerify)
FileRoutes.post('/verify', verify)
FileRoutes.post("/download-file", userHasDownloaded)
FileRoutes.post('/read-file', userHasRead)
FileRoutes.post('/filename', getByFileName)
FileRoutes.post('/change-status', getByFileName)
FileRoutes.post("/upload-files/", uploadFolders.array('files'), uploadFiles)


module.exports = {FileRoutes}