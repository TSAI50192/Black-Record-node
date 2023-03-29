const express = require("express");
// 連線資料庫
const db = require('../modules/db_connect');
// 使用 Multer 處理檔案上傳，建立上傳檔案的模組
const upload = require('../modules/upload-imgs');

const router = express.Router();


const getMaterData = async (req, res) => {
    // 算總筆數
    // [[{ totalRows }]] 是展開設定，用[]&{}來撥開包裹的東西
    //此處加 totalRows 是改變 count 的名稱
    const [[{ matertotalRows }]] = await db.query(
        "SELECT COUNT(1) matertotalRows FROM customization_material"); 


    //先宣告空陣列
    let mater = [];
    //先判斷有無資料，有才拿
    if (matertotalRows > 0) {
      const sql = `SELECT * FROM customization_material`;
        // return res.send(sql); // SQL 除錯方式之一
        [mater] = await db.query(sql); //此處 query 是指查詢資料庫
    }
    return {
        matertotalRows,
        mater,
    }
};

router.get("/api", async (req, res) => {
    res.json( await getMaterData(req, res) );
});



module.exports = router;