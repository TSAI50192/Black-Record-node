const express = require("express");
const moment = require("moment-timezone");
const db = require("./../modules/db_connect");
const upload = require('./../modules/upload-imgs');

const router = express.Router();

router.post("/add", upload.none(), async (req, res) => {
	const output = {
		success: false,
		error: "會員填寫註冊資料有誤",
		code: 0,
		postData: req.body,
        row:[]
	};
	const sql = "INSERT INTO `membership`(`name`, `email`, `password`, `birthday`, `mobile`) VALUES (?,?,?,?,?)";
	// let memHeadshot = "";
	// if (req.body.mGender === "男") {
	// 	memHeadshot = "male.jpg";
	// } else if (req.body.mGender === "女") {
	// 	memHeadshot = "female.jpg";
	// }
	const [result] = await db.query(sql, [
		req.body.name,
		req.body.email,
		req.body.password,
    // req.body.gender,
    req.body.birthday,
		req.body.mobile,
    // req.body.city,
    // req.body.area,
    // req.body.address,
    // req.body.member_level,
    // req.body.sub_sid,
    // req.body.created_time,
		// req.body.mBirth,
		// req.body.mEmail,
		// req.body.mMobile,
		// req.body.mIdentity,
	]);
	if (!result) {
		output.code = 401;
		output.error = "此帳號已被使用";
		return res.json(output);
	}
	output.success = true;
	output.code = 200;
	output.error = "";
    output.row=result
	// console.log(output);
	res.json(output);
});

// router.post("/add", upload.none(), async (req, res) => {

//   let {member_number, name, email, password, gender, birthday, mobile, city, area, address, member_level, sub_sid} = req.body;

//   // TODO: 檢查表單各欄位的資料

//   if(! moment(birthday).isValid()){
//     birthday = null;
//   } else {
//     birthday = moment(birthday).format('YYYY-MM-DD');
//   }

//   const sql = "INSERT INTO `membership`(`member_number`, `name`, `email`, `password`, `gender`, `birthday`, `mobile`, `city`, `area`, `address`, `member_level`, `sub_sid`, `created_time`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?, NOW())";
//   const [result] = await db.query(sql, [member_number, name, email, password, gender, birthday, mobile, city, area, address, member_level, sub_sid]);

//   res.json({
//     success: !! result.affectedRows,
//     postData: req.body,
//     result
//   });
// });

// router.get("/", async (req, res) => {
//   const output = await getListData(req, res);
//   if(output.redirect){
//     return res.redirect(output.redirect);
//   }

//   res.render('address-book/list', output);
// });

// router.get("/api", async (req, res) => {
//   res.json( await getListData(req, res) );
// });

module.exports = router;
