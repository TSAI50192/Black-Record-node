const express = require("express");
const db = require('../modules/db_connect');
const router = express.Router();
// 以上是必須要有

const getCommentData = async (req) => {
  // 取得Vr_album資料
  let gcd=[];
  // 宣告rev變數
  const sql=`SELECT * FROM comment JOIN membership`;
  // 取得vr_album的所有資料
  [gcd]=await db.query(sql);
  // 將資料庫內的資料放入剛剛宣告的rev變數回傳陣列
  return {
    gcd,
  }
};

// 以下為限制網域下之使用者才可看到資料
router.get("/api",async(req,res)=>{
  res.json(await getCommentData(req,res));
  // 回傳檔案已json格式顯示
});

module.exports = router;



