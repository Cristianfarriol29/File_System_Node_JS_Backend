const Users = require("./users.model")


const postOne = async (req,res,next) => {

    const usersExists = await Users.findOne({groupName: req.body.groupName})

try {
    if(usersExists === null){
        const users = new Users()
        users.groupName = req.body.groupName;
        users.users.push(req.body.user)
        await users.save()
        res.status(200).json(users)
    }else {
        if(!usersExists.users.includes(req.body.user)){
            usersExists.users.push(req.body.user)
            await usersExists.save()
            res.status(200).json(usersExists)
        }else {
            res.status(404).json({msg: "El usuario ya pertenece a este grupo"})
        }

    }
    
} catch (error) {
    console.log(error)
}
}


const getAllGroups = async (req,res,next) => {

    try {
        const allGroups = await Users.find()
        res.status(200).json(allGroups)
    } catch (error) {
        console.log(error)
    }
}

const postByGroupName = async (req, res, next) => {

    const createANewGroup = new Users()
    try {

        if(req.body.groupName.length){
            createANewGroup.groupName = req.body.groupName
            await createANewGroup.save()
            res.status(200).json(createANewGroup)
        }

        res.status(404).json({msg: "The group name cannot be empty"})
        
    } catch (error) {
        console.log(error)
    }
}

const postUserInGroup = async (req, res, next) => {

const userGroupInDatabase = await Users.findOne({_id: req.body._id})

try {

    userGroupInDatabase.users.push(req.body.user)
    await userGroupInDatabase.save()
    res.status(200).json(userGroupInDatabase)
} catch (error) {
    console.log(error)
}

}


module.exports = {
postOne,
getAllGroups,
postByGroupName,
postUserInGroup
}