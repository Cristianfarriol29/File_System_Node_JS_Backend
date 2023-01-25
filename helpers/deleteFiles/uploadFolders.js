const express = require('express');
const multer = require('multer');
const path = require("path");
const bodyParser = require('body-parser');
const app = express();


app.use(express.json());

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const path2 = path.join(__dirname, '..' , '..');

    cb(null, `${path2}/${req.body.path}`);
  },
  filename: async (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const uploadFolders = multer({ storage})

module.exports = uploadFolders