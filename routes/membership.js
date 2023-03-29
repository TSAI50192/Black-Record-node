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


//編輯取值
const getMemberData = async(req)=>{
  console.log(req.params.sid);
  let member=[];
  const sql = `SELECT * FROM membership WHERE sid=?` ;
  [member] = await db.query(sql,[req.params.sid]);
  return {
    member,
  }
}

//編輯-會員編輯
router.get("/edit/:sid", async (req, res) => {
  const sql =`SELECT * FROM membership LEFT JOIN member_level ON membership.member_level=member_level.sid WHERE membership.sid=? `
  const [rows]=await db.query(sql,[req.params.sid])
  if(rows.length){
    // res.json(rows[0])
    res.render('',rows[0])
  }else{
    res.redirect(req.baseUrl)
  }
})


//編輯-會員編輯
router.put("/edit/:sid", async (req, res) => {
  
  const sid = req.params.sid;


  let {name,email,password,mobile,gender,birthday,address,city,area} = req.body;


  // TODO: 檢查表單各欄位的資料

  if(! moment(birthday).isValid()){
    birthday = null;
  } else {
    birthday = moment(birthday).format('YYYY-MM-DD');
  }
  
//sid再改回`sid`=?
  const sql = "UPDATE `membership` SET `name`=?,`email`=?,`password`=?,`gender`=?,`birthday`=?,`mobile`=?,`city`=?,`area`=?,`address`=? WHERE `sid`=?"

  const [result] = await db.query(sql, [name, email,password,gender, birthday,mobile,city,area,address, sid]);

  res.json({
    success: !! result.changedRows,
    formData: req.body,
    result
  })
});

//listapi
router.get("/api/:sid",async(req,res)=>{
res.json(await getMemberData(req,res));
})



module.exports = router;