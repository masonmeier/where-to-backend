const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3002;
const host = '0.0.0.0';


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//this post request is still under construction

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
    // console.log(JSON.stringify(rows));
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
  // const country = req.query.result;

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
  // console.log('query check',capital);

  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${capital}&appid=ff1c70e34ab35b7f59df0cdc87918826`)
  const json = await response.json();
  res.send(json);
  // console.log(json, 'weather response sanity check')
});


app.listen(port, host,  () => console.log(`Example app listening at http://localhost:${port}`));

