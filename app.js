const express = require("express");
const app = express();
const cors = require("cors");
const listenPort = 3002;
//respond to any computer that hits this
const host = "0.0.0.0";
// const backendAddress = 'ec2-44-238-207-106.us-west-2.compute.amazonaws.com'
const backendAddress =
  "where-to-database-psql.cgum1ruwasjh.us-west-2.rds.amazonaws.com";
//using local host to point the backend to the PSQL database that is living on the same box
//we do not need to use the URL in this instance because they exist on the same server.
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());
var pg = require("pg");

//SQL CALL STARTS HERE

app.get("/", (req, res) => {
  // First you need to create a connection to the database
  // Be sure to replace 'user' and 'password' with the correct values
  const query = "SELECT * FROM country_data";
  runSQL(query).then((rows) => {
    res.send(rows);
  });
});

function runSQL(query) {
  return new Promise(function (resolve, reject) {
    const con = pg.createConnection({
      host: backendAddress,
      user: "mason",
      password: "Ohayoo#13",
      database: "where-to",
      port: "3306",
    });
    con.connect((err) => {
      if (err) {
        console.log("Error connecting to Db", err);
        return;
      }
      console.log("Connection established");
    });
    con.query(query, (err, rows) => {
      resolve(rows);
      if (err) reject(err);
    });
    con.end((err) => {
      // The connection is terminated gracefully
      // Ensures all remaining queries are executed
      // Then sends a quit packet to the PSQL server.
    });
  });
}

//USER INFORMATION POST REQUEST STARTS HERE

app.post("/submit", function (req, res) {
  const submit_title = req.body.title;
  const user_name = req.body.nameText;
  const guess = req.body.guessInput;
  const message = "yes";
  console.log(
    "attempting to submit to database",
    submit_title,
    user_name,
    guess
  );
  const query = `INSERT INTO user_submissions (user_guess, submit_title, user_name) VALUES ('${guess}', '${submit_title}', '${user_name}')`;
  runSQL(query);
  res.send({ message });
});

app.use(function (req, res) {
  console.log("404 error");
  res.status(404);

  // respond with html page
  if (req.accepts("html")) {
    res.render("404", { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts("json")) {
    res.send({ error: "Not found" });
    return;
  }

  // default to plain-text. send()
  res.type("txt").send("Not found");
});

//NEWS API CALL STARTS HERE

app.get("/news", (req, res) => {
  const NewsAPI = require("newsapi");
  const newsapi = new NewsAPI("3e01951ca9fc467bb9a23432e391b2b6");
  const queryStuff = req.query;
  console.log("query check", queryStuff);

  // To query /v2/top-headlines
  // All options passed to topHeadlines are optional, but you need to include at least one of them

  newsapi.v2
    .everything({
      q: req.query.q,
      language: "en",
      pageSize: "20",
    })
    .then((response) => {
      res.send(response);
    });
});

//WEATHER API CALL STARTS HERE

app.get("/weather", async (req, res) => {
  const fetch = require("node-fetch");
  const capital = req.query.q;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${capital}&appid=ff1c70e34ab35b7f59df0cdc87918826`
  );
  const json = await response.json();
  res.send(json);
});

app.listen(listenPort, host, () =>
  console.log(`App listening at http://${backendAddress}:${listenPort}`)
);
