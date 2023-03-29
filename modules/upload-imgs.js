const multer = require("multer");


const { v4: uuidv4 } = require("uuid");


// 定義允許上傳的檔案附檔名
const extMap = {
  //mimetype(媒體類別) 對應到 附檔名
  "image/jpeg": ".jpg",
  "image/png": ".png",
  // "image/gif": ".gif",
};



const fileFilter = (req, file, cb) => {
  cb(null, !!extMap[file.mimetype]);
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + "/../public/uploads");
  },
  filename: (req, file, cb) => {
    const ext = extMap[file.mimetype]; //拿到檔案的附檔名
    const fid = uuidv4(); //拿到主檔名
    cb(null, fid + ext);  //拿到主檔名+附檔名
  },
});



//匯出
module.exports = multer({ fileFilter, storage });
