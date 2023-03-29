const express = require("express");
const moment = require("moment-timezone");
const db = require('../modules/db_connect')//處理檔案上傳，建立上傳檔案
const upload = require('../modules/upload-imgs')

const router = express.Router();

router.use((req, res, next)=>{
  /*若重這邊則登入後才能繼續作業
  if(! req.session.admin){
    return res.redirect('/login');
  }
  */
  next();
});


//評論取值
const getCommentData = async(req)=>{
  let comment=[];
  const sql = "SELECT * FROM `membership`LEFT JOIN `comment` ON `membership`.`member_number`=`comment`.`member_number` WHERE `membership`.`sid`=5";
   [comment] = await db.query(sql);
  return {
    comment
  }
}

//listapi
router.get("/api",async(req,res)=>{
res.json(await getCommentData(req,res));
})





module.exports = router;