const express = require("express");
// const moment = require("moment-timezone");
// 連線資料庫
const db = require('../modules/db_connect');
const router = express.Router();

//自行定義FC名稱，此處叫getListData。沒有要回傳資料所以不用res。
const getMerchData = async (req) => {
    //先宣告空陣列
    let merchs = [];

      const sql = `SELECT * FROM merchandise WHERE sid BETWEEN 1 AND 20 ORDER BY RAND() LIMIT 4`;
        // 亂數取出 record_player 資料表中限定在 sid=1~sid=20 中的 4 筆資料。

        // return res.send(sql); // SQL 除錯方式之一
        [merchs] = await db.query(sql); //此處 query 是指查詢資料庫

    return {
        merchs,
    }
};

router.get("/api", async (req, res) => {
    res.json( await getMerchData(req, res) );
});


module.exports = router;