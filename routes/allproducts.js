const express = require("express");
const db = require('../modules/db_connect');
const router = express.Router();

const getAllProductsData = async (req) => {
  let allVr=[];
  let allRec=[];
  let allMer=[];
  const sql1=`SELECT * FROM vr_album`;
  const sql2=`SELECT * FROM record_player`;
  const sql3=`SELECT * FROM merchandise`;
  
  [allVr]=await db.query(sql1);
  [allRec]=await db.query(sql2);
  [allMer]=await db.query(sql3);


  return {
    allVr,
    allRec,
    allMer,
}
};

router.get("/api",async(req,res)=>{
  res.json(await getAllProductsData(req,res));
});

module.exports = router;