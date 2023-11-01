var fs = require("fs");
var express = require("express");
// var mongoose = require("mongoose");
const stops = "mbta-json/tstops.json";
var app = express();
const trainStops = [];
app.set("json spaces", 2);

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

getstops();
//encorporate this:
//https://developer.here.com/develop/javascript-api

function getstops() {
  if (trainStops.length === 0) {
    console.log("nothing");
    fs.readFile(stops, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading the JSON file");
      } else {
        const jsonData = JSON.parse(data);
        console.log(jsonData["data"][0]);
        if (trainStops.length === 0) {
          console.log("yep");
          console.log(jsonData["data"].length);
          console.log(jsonData["data"][1]["id"]);

          for (var i = 0; i < jsonData["data"].length; i++) {
            var idx = jsonData["data"][i];
            var obj = {
              lineName: idx["id"],
              lineColor: idx["attributes"]["color"],
              trackEnds: [
                {
                  name: idx["attributes"]["direction_destinations"][0],
                  direction: idx["attributes"]["direction_names"][0],
                },
                {
                  name: idx["attributes"]["direction_destinations"][1],
                  direction: idx["attributes"]["direction_names"][1],
                },
              ],
            };
            trainStops.push(obj);
          }
        }
      }
    });
  } else {
    console.log(trainStops.length);
    return trainStops;
  }
}

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
      if (trainStops.length === 0) {
        console.log("yep");
        console.log(jsonData["data"].length);
        console.log(jsonData["data"][1]["id"]);

        for (var i = 0; i < jsonData["data"].length; i++) {
          var idx = jsonData["data"][i];
          var obj = {
            lineName: idx["id"],
            lineColor: idx["attributes"]["color"],
            trackEnds: [
              {
                name: idx["attributes"]["direction_destinations"][0],
                direction: idx["attributes"]["direction_names"][0],
              },
              {
                name: idx["attributes"]["direction_destinations"][1],
                direction: idx["attributes"]["direction_names"][1],
              },
            ],
          };
          trainStops.push(obj);
        }
      }
      getstops();
      res.json(trainStops);
    }
  });
});

app.get("/trains/:lineName", (req, res) => {
  var stops = [];
  fs.readFile(stops, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading the JSON file");
    } else {
      const jsonData = JSON.parse(data);
      console.log(jsonData["data"][0]);
      if (trainStops.length === 0) {
        console.log("yep");
        console.log(jsonData["data"].length);
        console.log(jsonData["data"][1]["id"]);

        for (var i = 0; i < jsonData["data"].length; i++) {
          var idx = jsonData["data"][i];
          var obj = {
            lineName: idx["id"],
            lineColor: idx["attributes"]["color"],
            trackEnds: [
              {
                name: idx["attributes"]["direction_destinations"][0],
                direction: idx["attributes"]["direction_names"][0],
              },
              {
                name: idx["attributes"]["direction_destinations"][1],
                direction: idx["attributes"]["direction_names"][1],
              },
            ],
          };
          stops.push(obj);
          // if (obj.lineName === req.params.lineName) {
          //   console.log("same");
          //   res.json(obj);
          //   return;
          // }
        }
      }
    }
  });

  res.json(req.params);
});
