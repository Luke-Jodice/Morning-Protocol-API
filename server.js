const fs = require("fs").promises;
const express = require("express");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());



app.post("/coords", (req, res) => {
  console.log(req.body);
  const data = req.body;
  res.json({ status: "Success", long: data.long, lat: data.lat });
});

//this will need to be Made as a repo on its own
app.get("/weather", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "Artifacts from Alpha", "weatherEX.json");
    const data = await fs.readFile(filePath, "utf8");
    const json = JSON.parse(data);
    const currWeather = json.current;
    res.json(currWeather);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
