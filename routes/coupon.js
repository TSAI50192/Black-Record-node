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

//取值
const getCouponData = async(req)=>{
  let coupon=[];
  const sql = "SELECT c.`sid`, c.`menbership_SID`, c.`coupon-item_SID`, c.`receive_date_SID`, c.`use_or_not`, c.`coupon_amount`, c.`order_SID`, i.`coupon_name_SID`, i.`discount_amount`, i.`time_interval`, u.`status_of_use` FROM coupon c LEFT JOIN coupon_item i ON c.`coupon-item_SID` = i.`sid` LEFT JOIN couponuse_or_not u ON c.`use_or_not` = u.`sid` WHERE c.`menbership_SID` = ?; ";
   [coupon] = await db.query(sql,[req.params.sid]);
  return {
    coupon
  }
}





//listapi
router.get("/api/:sid",async(req,res)=>{
res.json(await getCouponData(req,res));
})






module.exports = router;