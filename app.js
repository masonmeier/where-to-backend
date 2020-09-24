const mysql = require('mysql');
const express = require('express');
const app = express();
const cors = require('cors');
const port = 3002;
const host = '0.0.0.0';

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cors());

//SQL CALL STARTS HERE

app.get('/', (req, res) => {
// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
  const con = mysql.createConnection({
    // host: 'where-to-database.cgum1ruwasjh.us-west-2.rds.amazonaws.com',
    host: 'localhost',
    user: 'mason',
    password: 'Ohayoo#13',
    database: 'where-to'
  });

  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });

  con.query('SELECT * FROM country_data', (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });

  con.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
  });
});

//NEWS API CALL STARTS HERE

app.get('/news', (req, res) => {
  const NewsAPI = require('newsapi');
  const newsapi = new NewsAPI('3e01951ca9fc467bb9a23432e391b2b6');
  const queryStuff = req.query;
  console.log('query check', queryStuff);

  // To query /v2/top-headlines
  // All options passed to topHeadlines are optional, but you need to include at least one of them

  newsapi.v2.everything({
    q: req.query.q,
    language: 'en',
    pageSize: '20',
  }).then(response => {
    res.send(response)
  });
});

//WEATHER API CALL STARTS HERE

app.get('/weather', async (req, res) => {
  const fetch = require("node-fetch");
  const capital = req.query.q;

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${capital}&appid=ff1c70e34ab35b7f59df0cdc87918826`);
  const json = await response.json();
  res.send(json);
});

//USER INFORMATION POST REQUEST STARTS HERE

app.post('/submit',function(req,res){
  const submit_title = req.body.title;
  const user_name = req.body.nameText;
  const guess = req.body.guessInput;
  console.log('attempting to submit to database', submit_title, user_name, guess);

  const con = mysql.createConnection({
    // host: 'where-to-database.cgum1ruwasjh.us-west-2.rds.amazonaws.com',
    host: 'localhost',
    user: 'mason',
    password: 'Ohayoo#13',
    database: 'where-to'
  });

  con.connect((err) => {
    if(err){
      console.log('Error connecting to Db');
      return;
    }
    console.log('Connection established');
  });

  const query = `INSERT INTO user_submissions (user_guess, submit_title, user_name) VALUES ('${guess}', '${submit_title}', '${user_name}')`;
  console.log(query, 'buckteeth');
  con.query(query, (err, rows) => {
    if (err) throw err;
  });

  con.end((err) => {
    // The connection is terminated gracefully
    // Ensures all remaining queries are executed
    // Then sends a quit packet to the MySQL server.
  });
  res.end("yes");
});

app.use(function(req, res){
  console.log('404 error');
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


app.listen(port, host,  () => console.log(`App listening at http://localhost:${port}`));

function runSQL(query) {
  return new Promise(function (resolve, reject) {

    const con = mysql.createConnection({
      // host: 'where-to-database.cgum1ruwasjh.us-west-2.rds.amazonaws.com',
      host: 'localhost',
      user: 'mason',
      password: 'Ohayoo#13',
      database: 'where-to'
    });

    con.connect((err) => {
      if (err) {
        console.log('Error connecting to Db');
        return;
      }
      console.log('Connection established');
    });

    console.log(query, 'buckteeth');
    con.query(query, (err, rows) => {
      if (err) throw err;
    });

    con.end((err) => {
      // The connection is terminated gracefully
      // Ensures all remaining queries are executed
      // Then sends a quit packet to the MySQL server.
    });
  });
}
