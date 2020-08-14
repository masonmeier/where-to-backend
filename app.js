const mysql = require('mysql');
const express = require('express');
const app = express();
const port = 3002;


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//this post request is still under construction

app.post('/', (req, res) => {
  console.log(req, 'req sanity check');
  const con = mysql.createConnection({
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

  con.query('INSERT INTO user_data (userName, guessInfo) VALUES (userName, guessInfo)', (err, rows) => {
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




app.get('/', (req, res) => {
// First you need to create a connection to the database
// Be sure to replace 'user' and 'password' with the correct values
  const con = mysql.createConnection({
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

app.get('/news', (req, res) => {
  const NewsAPI = require('newsapi');
  const newsapi = new NewsAPI('3e01951ca9fc467bb9a23432e391b2b6');
  const queryStuff = req.query;
  console.log('query check', queryStuff);
  // const country = req.query.result;

  // To query /v2/top-headlines
  // All options passed to topHeadlines are optional, but you need to include at least one of them

  newsapi.v2.everything({
    //query will eventually need to be the result.country we receive from Results Calculator on the client side.
    q: req.query.q,
    language: 'en',
    pageSize: '20',
    //country will eventually be the provided country ISO
  }).then(response => {
    res.send(response)
    /*
      {
        status: "ok",
        articles: [...]
      }
    */
  });
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
