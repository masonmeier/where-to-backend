/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	
Amplify Params - DO NOT EDIT */

var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

const mysql = require('mysql');



app.get('/', (req, res) => {
  // First you need to create a connection to the database
  // Be sure to replace 'user' and 'password' with the correct values
    const con = mysql.createConnection({
      host: 'where-to-database.cgum1ruwasjh.us-west-2.rds.amazonaws.com',
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

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
