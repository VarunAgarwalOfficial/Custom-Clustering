var fs = require("fs");
var PNG = require("pngjs").PNG;
const express = require("express");
const app = express();

app.get("/" , (req,res)=>{
    res.send("This is the homePage")
})


app.listen(3000 , ()=>{
    console.log("Listening at 3000")
})