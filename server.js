const fs = require("fs").promises;
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your-secret-key", // Replace with a real secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.get("/ExampleData.json", (req, res) => {
  res.sendFile(path.join(__dirname, "ExampleData.json"));
});


//When the user is accessing the website on its own
app.post("/register", async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    const users = JSON.parse(await fs.readFile("users.json", "utf8"));

    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), email, password: hashedPassword, name, phone };
    users.push(newUser);
    await fs.writeFile("users.json", JSON.stringify(users, null, 2));

    res.redirect("/login.html");
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = JSON.parse(await fs.readFile("users.json", "utf8"));
    const user = users.find((user) => user.email === email);

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.user = user;
      res.redirect("/");
    } else {
      res.status(401).send("Invalid credentials.");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/session", (req, res) => {
  res.json(req.session);
});

//Start of the information that would be needed to call the APIs to retrieve data 
app.post("/coords", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("Unauthorized.");
  }
  console.log(req.body);
  const data = req.body;
  res.json({ status: "Success", long: data.long, lat: data.lat });
});

//
//this will need to be Made as a repo on its own
//

//This will be called from Weather API service
app.get("/weather", async (req, res) => {

});

//This will be called from News API service
app.get("/news", async (req, res) => {
 
});

//This will be called from Stocks API service
app.get("/stocks", async (req, res) => {

});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
