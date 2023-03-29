const express = require("express");
// const moment = require("moment-timezone");
// 連線資料庫
const db = require('../modules/db_connect');
// 使用 Multer 處理檔案上傳，建立上傳檔案的模組
// const upload = require('../modules/upload-imgs');

const router = express.Router();

//自行定義FC名稱，此處叫getListData。沒有要回傳資料所以不用res。
const getVinylData = async (req) => {
    let redirect = '';
    const perPage = 10;  //每頁 10 筆

    //目前用戶要看第幾頁，用 req.query 接收 query string 參數 => 拿到自串
    //因會拿到字串，所以用＋做類型轉換成number。如果拿不到number，就會是false，值一樣會設定成 1。
    let page = +req.query.page || 1; 

    //將 page 轉成整數
    page = parseInt(page);
    
    // 如果page < 1，baseUrl是指轉到 "/" 所在位置
    if (page < 1) {
        redirect = req.baseUrl; // 設定要轉向的 URL
    }
    
    // 算總筆數
    // [[{ totalRows }]] 是展開設定，用[]&{}來撥開包裹的東西
    //此處加 totalRows 是改變 count 的名稱
    const [[{ totalRows }]] = await db.query(
        "SELECT COUNT(1) totalRows FROM vr_album"); 

    //總頁數， Math.ceil()無條件進位，回傳小於等於所給數字的最大整數
    const totalPages = Math.ceil(totalRows/perPage);

    //先宣告空陣列
    let vinyls = [];
    //先判斷有無資料，有才拿
    if (totalRows > 0) {
        if(page > totalPages){
            redirect = req.baseUrl + `?page=`+totalPages;  // 設定轉到最後一頁
        }
      const sql = `SELECT * FROM vr_album WHERE sid BETWEEN 1 AND 20 ORDER BY RAND() LIMIT 10`;
      //亂數取出 vr_album 資料表中限定在 sid=1~sid=20 中的 10 筆資料
        

        // return res.send(sql); // SQL 除錯方式之一
        [vinyls] = await db.query(sql); //此處 query 是指查詢資料庫
    }

    // 轉換 Date 類型的物件變成格式化的字串
    // const fm = 'YYYY-MM-DD';
    // rows.forEach(v=>{
    // v.birthday2 = moment(v.birthday).format(fm);
    // //format是指要將當地時間轉換成怎樣的格式
    // });

    return {
        totalRows,
        totalPages,
        perPage,
        page,
        vinyls,
        redirect
    }
};

router.get("/api", async (req, res) => {
    res.json( await getVinylData(req, res) );
});

//傳指定商品資料
router.get("/ProductDt/:number", async (req, res) => {
  const sql = "SELECT * FROM vr_album WHERE vr_album.number=?";

  const [vinyls] = await db.query(sql, [req.params.number]);
  res.json( vinyls );

});
  

module.exports = router;