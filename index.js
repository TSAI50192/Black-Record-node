// 設定開發環境，使用專案的.env。
if(process.argv[2] && process.argv[2]==='production'){
    require('dotenv').config({
      path: './production.env'
    });
  } else {
    require('dotenv').config({
      path: './dev.env'
    });
  }

  

//-----------------------------------------------------------
// 1-1. 引入 express ，是 Node.js 底下的一個前端 + 後端的框架。
const express = require("express");
const Jimp = require("jimp");
const session = require("express-session");
const MysqlStore = require('express-mysql-session')(session);

const moment = require("moment-timezone");
//有時區的功能，但檔案較大，如果沒有要用轉換時區，可以用dayjs就好
const cors = require('cors');
const bcrypt = require("bcryptjs");

// 使用 Multer 處理檔案上傳，建立上傳檔案的模組
const upload = require('./modules/upload-imgs');

// 連線資料庫
const db = require('./modules/db_connect');
const sessionStore = new MysqlStore({},db);



//linepay
const { HmacSHA256 } = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_CHANNEL_SECRET_KEY,
  LINEPAY_VERSION,
  LINEPAY_SITE,
  LINEPAY_RETURN_HOST,
  LINEPAY_RETURN_CONFIRM_URL,
  LINEPAY_RETURN_CANCEL_URL,
} = process.env;
const { default: axios } = require("axios");














//-----------------------------------------------------------
// 1-2. 建立 web server 物件 (網站伺服器)
const app = express();


app.set('view engine', 'ejs');
// var express = require('express');
// var app = express();
app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:'jdkfksd8934-@_753634jdkssdfg',
    store:sessionStore,
    cookie:{
    // maxAge:1200_000
    }
}));

const corsOptions = {
    // credentials: true,
    origin: function(origin, cb){
      console.log({origin});
      cb(null, true);
    }
  };



// 將 body-parser 設定成頂層 middleware，放在所有路由之前。
// body-parser 是Express 經常使用的中介軟體，用於解析請求的資料(body)
// 若用戶送進來的資料是urlencoded，才會進來做解析。
app.use(express.urlencoded({extended: false}));
app.use(cors());

// 若用戶送進來的資料是json，才會進來做解析。
app.use(express.json());
// set 是設定，use 是接收 http 所有的方法。所以所有方法都會先進入這個頂層 middleware。



//-----------------------------------------------------------
// 1-3. 放後端路由 routes
// 路由是指，當用戶來拜訪時要符合http的方法跟對的路徑，才可以拿到資料。若有相同的路徑，前面會蓋掉後面的。
app.get("/", (req, res) => {
  res.send("會員您好");
});





//建立訂單
app.use("/createOrder",(req,res)=>{
  console.log(req.params,req.body)
  const orderSid = req.body.orderSid;
  const membership = req.body.membership;
  const address = `${req.body.city}`+`${req.body.area}`+`${req.body.address}`;
  const total = req.body.total;
  const state = req.body.state;
  const payment = req.body.payment_status;
  const update = req.body.update_status;
  const order = req.body.order_status;
  db.query("INSERT INTO `orders`(`order_number`, `membership_sid`, `addressee`, `total_price`, `payment_status`, `update_status`, `order_status`) VALUES (?,?,?,?,?,?,?)",[orderSid,membership,address,total,payment,update,order]);
  res.json()
})




//連線到linepay
app.post("/linepay", async (req, res) => {
  console.log('data送給linepay',req.body)
  const texttotal  =req.body.total
  const order = {
    amount: req.body.total,
    currency: "TWD",
    packages: [
      {
        id: req.body.orderSid,
        amount: req.body.total,
        products: [
          {
            name: req.body.username,
            quantity: 1,
            price: texttotal,
          },
        ],
      },
    ],
    orderId: req.body.orderSid,
  };
  console.log(order)
  try {
    const linePayBody = {
      ...order,
      redirectUrls: {
        confirmUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CONFIRM_URL}`,
        cancelUrl: `${LINEPAY_RETURN_HOST}${LINEPAY_RETURN_CANCEL_URL}}`,
      },
    };

    const uri = "/payments/request";
    const nonce = parseInt(new Date().getTime() / 1000);
    const string = `${LINEPAY_CHANNEL_SECRET_KEY}/${LINEPAY_VERSION}${uri}${JSON.stringify(
      linePayBody
    )}${nonce}`;

    const signature = Base64.stringify(
      HmacSHA256(string, LINEPAY_CHANNEL_SECRET_KEY)
    );

    const headers = {
      "Content-Type": "application/json",
      "X-LINE-ChannelId": LINEPAY_CHANNEL_ID,
      "X-LINE-Authorization-Nonce": nonce,
      "X-LINE-Authorization": signature,
    };

    const url = `${LINEPAY_SITE}/${LINEPAY_VERSION}${uri}`;
    const linePayRes = await axios.post(url, linePayBody, { headers });
    console.log(linePayRes.data);
    if (linePayRes?.data?.returnCode === "0000") {
      const linePayUrl = linePayRes.data.info.paymentUrl.web;
      res.json({ url, linePayBody, headers, linePayUrl });
      console.log(order)
    } else {
    }
    res.end();
  } catch (err) {
    res.end();
  }
});





app.post("/try-uploads",upload.array('photos',5),(req,res)=> {
  res.json({
    body:req.body,
    files:req.files
  })
})
app.post("/try-upload",upload.single('avatar'),(req,res)=> {
  res.json(req.file)
})



//app.use(require('./routes/admin2'));//router當作middleware

app.use('/admin', require('./routes/admin2'));




app.get('/try-moment', (req, res) => {
  const fmStr = 'YYYY-MM-DD HH:mm:ss';
  const m1 = moment(); // 取得當下時間
  const m2 = moment('2023-02-29');
   
  res.json({
    body: req.body,
    files: req.files
  });
});



////////////////////////////////////////////////////////////////////////////

app.use('/membership', require('./routes/membership'));
app.use('/membership/edit', require('./routes/membership'));
app.use('/coupon', require('./routes/coupon'));
app.use('/wishlistRE', require('./routes/wishlistRE'));
app.use('/wishlistVR', require('./routes/wishlistVR'));
app.use('/wishlistME', require('./routes/wishlistME'));
app.use('/comment', require('./routes/comment'));
app.use('/orderlist', require('./routes/orderlist'));


//連線 customization_item 資料表
app.get('/customization-item', async (req, res) => {
  //因會回傳 [rows,fields-欄位資訊] 陣列，此處只要限定拿rows的資料，習慣上用中括號來解開陣列拿第一層
  const [rows] = await db.query("SELECT * FROM customization_item");
  res.json(rows);
});
// router 當作 middleware
app.use('/db-customization-item', require('./routes/customization-item'));


// app.get('/customization-material', async (req, res) => {
//   const [rows] = await db.query("SELECT * FROM customization_material");
//   res.json(rows);
// });
app.use('/db-customization-material', require('./routes/customization-material'));

app.use('/db-vr-album', require('./routes/vr-album'));

app.use('/db-all-vr-album', require('./routes/all-vr-album'));

app.use('/db-record-player', require('./routes/record-player'));

app.use('/db-merchandise', require('./routes/merchandise'));

app.use('/db-crowdfunding', require('./routes/crowdfunding'));

app.use('/db-memberlogin', require('./routes/login'));

app.use('/register', require('./routes/register'));

// app.use('/db-product',require('./routes/product'));
// 商品頁面全
app.use('/db-recordPlayerAll',require('./routes/recordPlayerAll'));
// 唱機頁面全

//登入
app.use('/db-membership',require('./routes/login'));

// app.use('/db-commit',require('./routes/commit'));
// 評論頁面全有問題,回家看
// FIXME:
// 差其他商品
app.use('/db-allproducts',require('./routes/allproducts'));

app.use('/db-otherPorduct',require('./routes/otherPorduct'));
//其他商品資料庫

app.use('/db-commentAll',require('./routes/commentAll'));


// app.get('/a.html', (req, res) => {
//   res.send('假的啦!');
// }); 因為寫在app.use(express.static('public')); 的前面, 所以跑完就結束;就是個後端做的假靜態內容

app.use(express.static('public'));
// app.use(express.static('node_modules/bootstrap/dist'));


// 自訂404頁面 *** 此段放在所有路由設定的後面 ***
app.use((req, res) => {
  // res.type('text/plain'); 沒有寫就是用html格式
  res.status(404).send(`<h1>抱歉！找不到頁面</h1>
  <p>404 QQ</p>`);
});


//-----------------------------------------------------------
// 1-4. Server 偵聽
//有設定就用設定檔，沒有就用3000。
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`伺服器啟動: ${port}`);
});
