const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
  res.send("<h2>admin2</h2>")
});

// router.get("/admin2/:action?/:id",(req,res)=>{
//   const {url,baseUrl,originlUrl}=req;
//   res.json({url,baseUrl,originlUrl,params:req.params})
// })


module.exports = router;
