const multer = require('multer')
const fs = require('fs')
const path = require("path");


 const storage =  multer.diskStorage({
    destination: async (req, file, cb) => {
        const dest = req.body.path;
            fs.access(dest, async function (error) {
              if (error) {
                console.log("Directory does not exist.");
            return fs.mkdir(dest, (error) => {
              cb(error, dest)
            });
          } else {
            console.log("Directory exists.");
            return cb(null, dest);
          }
        });
      },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
    })

    const upload = multer({ storage });

    module.exports = upload