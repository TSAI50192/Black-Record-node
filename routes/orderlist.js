const express = require("express");
const moment = require("moment-timezone");
const db = require("../modules/db_connect"); //處理檔案上傳，建立上傳檔案
const upload = require("../modules/upload-imgs");

const router = express.Router();

router.use((req, res, next) => {
    /*若重這邊則登入後才能繼續作業
  if(! req.session.admin){
    return res.redirect('/login');
  }
  */
    next();
});


//歷史訂單取值
const getOrderlistData = async (req) => {
     let orderlist = [];


// 歷史訂單
  const sql = `SELECT orders.*,order_status.status_name ,membership.*,order_details.*,vr_album.* FROM orders JOIN order_details on order_details.orders_sid =orders.sid join vr_album ON vr_album.sid = order_details.product_sid JOIN membership ON membership.sid=orders.membership_sid JOIN order_status ON order_status.sid = orders.order_status WHERE orders.membership_sid=?;`;
  [orderlist] = await db.query(sql,[req.params.sid]);
  console.log(orderlist);
  return{
    orderlist
  }

};




//listapi
router.get("/api/:sid", async (req, res) => {
    res.json(await getOrderlistData(req, res));
});

module.exports = router;