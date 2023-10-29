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

app.get("/weather", (req, res) => {
  var getreq = fetch("weatherEX.json");
  const json = getreq.json();
  console.log(json);
});

//LOCAL TESTING ROUTE
app.get("/weatherlocal", (req, res) => {
  fs.readFile("weatherEX.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const json = JSON.parse(data);
        console.log(json);
        res.json(json); // Send the JSON data as a response
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});
