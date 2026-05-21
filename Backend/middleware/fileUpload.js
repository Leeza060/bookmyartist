const multer = require("multer");
const fs = require("fs"); //file system
const path = require("path"); //file path

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dstn = "public/uploads";
    if (!fs.existsSync(dstn)) {
      fs.mkdirSync(dstn, { recursive: true });
    }

    cb(null, dstn);
  },

  filename: function (req, file, cb) {
    //file name
    //apple.jpg
    //extname = '.jpg'
    //basename= apple
    let extname = path.extname(file.originalname)
    let basename = path.basename(file.originalname,extname)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    let filename = file.fieldname + '_' + basename + '_' + uniqueSuffix + extname

    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

module.exports = upload
