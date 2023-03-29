const express = require("express");
// const moment = require("moment-timezone");
// 連線資料庫
const db = require('../modules/db_connect');
const router = express.Router();

//自行定義FC名稱，此處叫getListData。沒有要回傳資料所以不用res。
const getCrowData = async (req) => {
    //先宣告空陣列
    let crow = [];

      const sql = `SELECT * FROM crowdfunding ORDER BY sid DESC LIMIT 0 , 1`;
        // 查詢最後一筆的資料

        // return res.send(sql); // SQL 除錯方式之一
        [crow] = await db.query(sql); //此處 query 是指查詢資料庫

    return {
        crow,
    }
};

router.get("/api", async (req, res) => {
    res.json( await getCrowData(req, res) );
});


module.exports = router;