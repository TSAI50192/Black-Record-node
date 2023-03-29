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

//我的最愛取值(後面sid改?)
const getWishlistVRData = async (req) => {
    let wishlistVR = [];


    //唱片專輯VR
    const sql = `SELECT temporary_order.sid,temporary_order.amount, temporary_order.created_time, vr_album.vr_img, vr_album.vr_name, vr_album.vr_price FROM temporary_order JOIN membership ON membership.sid=temporary_order.membership_sid JOIN vr_album ON temporary_order.type_sid= vr_album.type AND temporary_order.product_sid=vr_album.sid WHERE temporary_order.membership_sid=? ORDER BY temporary_order.created_time DESC`;

    [wishlistVR] = await db.query(sql,[req.params.sid]);
  

    return {
      wishlistVR,

    };
};

//刪除我的最愛(where 後面改sid=?)

router.delete('/:sid', async (req, res) => {
    const sql = "DELETE FROM temporary_order WHERE sid= ? ";
    const [result] = await db.query(sql, [req.params.sid]);
    console.log(result);
    res.json(result);
});

//listapi
router.get("/api/:sid", async (req, res) => {
    res.json(await getWishlistVRData(req, res));
});

module.exports = router;
