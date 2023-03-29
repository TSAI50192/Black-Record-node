const express = require("express");
const db = require("../modules/db_connect");
const router = express.Router();


router.post('/login', async (req, res) => {
    const output = {
      success: false,
      error: '帳號或密碼錯誤 !!!',
      code: 0,
      postData: req.body,
      loginData:{},
    };
    console.log('前端給的',req.body)  
    console.log(req.body.email)
    const sql = "SELECT * FROM membership WHERE email=?";

    const [rows] = await db.query(sql, [req.body.email]);
  
    console.log(rows)
    if(!rows.length){
      // 帳號是錯的
        output.code = 401;
        output.error = "查無此帳號";
        return res.json(output);
    }
    
    if(!(req.body.password === rows[0].password)){
      // 密碼是錯的
        output.code = 402;
        output.error = '密碼錯誤'  
        console.log(2)
        return res.json(output)
      
    } else {
        output.success = true;
        output.code = 200;
        output.error = '';
        output.loginData = rows[0];
    }
    console.log('後端給前端',output)
     res.json(output);
    });




module.exports = router