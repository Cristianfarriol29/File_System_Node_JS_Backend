const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(

    {
        groupName: { type: String, required: false, trim: true },
        users: { type: Array, required: false, trim: true, default: [] }
    },
    {
        timestamps: true
    }
);


const Users = mongoose.model('users', fileSchema);

module.exports = Users;