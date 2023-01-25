const File = require("../src/api/files/files.model");

async function getAndProcessInDB(userCreator, fullPath, userWithPermit ){

    let fileDB = await File.findOne({userCreator, fullPath})

try {
    if(typeof userWithPermit === "string"){
        fileDB.usersWithPermission.push(userWithPermit);
    } else if(typeof userWithPermit === "object"){
        fileDB.usersWithPermission = [...fileDB.usersWithPermission, ...userWithPermit]
    }
    fileDB.usersWithPermission = fileDB.usersWithPermission.filter(v => v !== "")
    fileDB.usersWithPermission = fileDB.usersWithPermission.filter((v, i) => {
      
    return fileDB.usersWithPermission.indexOf(v) === i
})


await fileDB.save() 




return  fileDB
} catch (error) {
    
}
                  
}



module.exports = getAndProcessInDB