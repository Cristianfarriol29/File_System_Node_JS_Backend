const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(

    {
        //Original path when user posts a new file
        path: { type: String, required: false, trim: true },
        fullPath: { type: String, required: false, trim: true },
        //users with permission to edit files or path
        userCreator:  { type: Object, required: false, trim: true },
        //file upload 
        file: { type: Object, required: false, trim: true },
        //Users with permission to create and read files
        usersWithPermission:{ type: Array, required: false, trim: true },
        userAssignedToVerify: { type: String, required: false, trim: true },
        isFile:{ type: Boolean, required: false, trim: true, default: true },
        isVerified: {type: Boolean, required: false, trim: true, default: false},
        verifiedBy: {type: String, required: false, trim: true},
        comments: {type: String, required: false, trim:true},
        status: {
          Unassigned: {
              type: Boolean,
              default: true
            },
            Send: {
              type: Boolean,
              default: false
            }
            ,
            Read: {
              type: Boolean,
              default: false
            }
            ,
            Verified: {
              type: Boolean,
              default: false
            }
          }
    },

    {
        timestamps: true
    }
);


const File = mongoose.model('files', fileSchema);

module.exports = File;