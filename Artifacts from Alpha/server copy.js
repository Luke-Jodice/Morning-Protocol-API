var fs = require("fs");
var express = require("express");
const axios = require("axios");
// var mongoose = require("mongoose");
// var customfetch = require("./modules/customfetch");
const tstops = "mbta-json/tstops.json";
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

//encorporate this:
//https://developer.here.com/develop/javascript-api

// FUNCTION readjson() IS DEPRICATED FOR THE TIME BEING @11/1/2023
//REASON:Feels like each of the endpoints read in a file locally and use it in different ways

// function readjson(filename){ // this needs to be a string/filepath
//   fs.readFile(filename, "utf8", (err, data) => {
//     if (err) {
//       console.error("Error reading the file:", err);
//       res.status(500).send("Internal Server Error");
//     } else {
//       try {
//         const json = JSON.parse(data);
//         return json.current; // Send the JSON data as a response
//       } catch (parseError) {
//         console.error("Error parsing JSON:", parseError);
//         res.status(500).send("Internal Server Error");
//       }
//     }
//   });
// }

function getstops() {
  if (trainStops.length === 0) {
    //If the cached array is empty then read in the values from json
    fs.readFile(tstops, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading the JSON file");
      } else {
        const jsonData = JSON.parse(data);
        if (trainStops.length === 0) {
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
    //the values are already loaded into the array
    console.log(trainStops.length); // length printed for error checking
    return trainStops;
  }
}

app.get("/weather", (req, res) => {
  var getreq = fetch("weatherEX.json");
  const json = getreq.json();
  console.log(json);
});

app.post("/coords", (req, res) => {
  console.log(req.body);
  const data = req.body;
  res.json({ status: "Success", long: data.long, lat: data.lat });
});

app.get("/weatherlocal", (req, res) => {
  fs.readFile("weatherEX.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading the file:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      try {
        const json = JSON.parse(data);
        const currWeather = json.current;
        res.json(currWeather);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        res.status(500).json({ error: "Internal Server Error" });
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
  fs.readFile(tstops, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading the JSON file");
    } else {
      const jsonData = JSON.parse(data);
      console.log(jsonData["data"][0]);
      if (trainStops.length === 0) {
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
  var stops = getstops();
  for (var i = 0; i < stops.length; i++) {
    if (stops[i]["lineName"] === req.params.lineName) {
      res.json(stops[i]);
      return; // Add 'return' to exit the loop when a match is found
    }
  }
  // If no match is found, you can send an appropriate response, e.g., 404 Not Found
  res.status(404).send("Train line not found");
});

//gets the routes from given line
app.get("/mbta-stops/:route_id", async (req, res) => {
  // Get the train route ID from the request parameter
  const routeId = req.params.route_id;
  // Make a request to the MBTA API to get all of the stops on the route
  try {
    const response = await axios.get(
      `https://api-v3.mbta.com/stops?filter[route]=${routeId}`
    );
    const stopsJson = response.data;

    // Send the stops back to the client
    res.send(stopsJson);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching data.");
  } // Send the stops back to the client
});

//get the times of the trains comming into a given stop
app.get("/mbta-train-times/:stop_name", async (req, res) => {
  // Get the train stop name from the request parameter
  const stopName = req.params.stop_name;
  try {
    const response = await axios.get(
      "https://api-v3.mbta.com/predictions?filter[stop]=place-${stopName}"
    );
    const stopJson = response.data;

    res.send(stopJson);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});
