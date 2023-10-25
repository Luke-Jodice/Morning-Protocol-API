var fs = require("fs");
var express = require("express");

var app = express();

console.log("server starting");

var server = app.listen(3000);
app.use(express.static("public"));
app.use(express.json());

//encorporate this:
//https://developer.here.com/develop/javascript-api

app.post("/coords", (req, res) => {
  console.log("got post");
  console.log(req.body);
  const data = req.body;
  res.json({ status: "Sucess", long: data.long, lat: data.lat });
});
