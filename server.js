var fs = require("fs");
var express = require("express");
// var mongoose = require("mongoose");
const stops = "tstops.json";
var app = express();

// const weatherschema = new mongoose.Schema({
//   precipitation: Boolean,
//   tempC : Number,
//   weatherdesc : String,
//   pictureURL : URL
// });
// const Weather = mongoose.model("Weather",weatherschema);

// const todayschema = new mongoose.Schema({
//   weather : Weather
// });

// const Today = mongoose.model("today",todayschema);

// mongoose.connect("mongodb://127.0.0.1:27017/test");

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
  res.json({ status: "Success", long: data.long, lat: data.lat });
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
        var currweather = json.current;
        res.json(currweather); // Send the JSON data as a response
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

app.get("/stops", (req, res) => {
  fs.readFile("tstops.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).send("Internal Server Error");
    } else {
      try {
        const json = JSON.parse(data);
        console.log(json);
        res.json({
          status: "Success",
          data: json,
        });
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).send("Internal Server Error");
      }
    }
  });
});

app.get("/trains", (req, res) => {
  fs.readFile(stops, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading the JSON file");
    } else {
      const jsonData = JSON.parse(data);
      console.log(jsonData["data"][0]);
      res.json(jsonData);
    }
  });
});
