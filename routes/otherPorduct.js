const express = require("express");
const db = require('../modules/db_connect');
const router = express.Router();

const getOtherData = async (req) => {
  // 取得Vr_album資料
  let other=[];
  // 宣告rev變數
  const sql=`SELECT * FROM merchandise`;
  // 取得vr_album的所有資料
  [other]=await db.query(sql);
  // 將資料庫內的資料放入剛剛宣告的rev變數回傳陣列

  return {
    other,
  }
};

// 以下為限制網域下之使用者才可看到資料
router.get("/api",async(req,res)=>{

  res.json(await getOtherData(req,res));
  // 回傳檔案已json格式顯示
});

//傳指定商品資料
router.get("/ProductDt/:number", async (req, res) => {
  const sql = "SELECT * FROM merchandise WHERE merchandise.number=?";

  const [other] = await db.query(sql, [req.params.number]);
  res.json( other );

});

module.exports = router;


