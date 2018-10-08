'use strict';

// Load array of notes
const express = require('express');

const data = require('./db/notes');

const app = express();

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
  //destructring the query string into searchTerm
  const { searchTerm } = req.query;

  //running if statement to see if searchTerm exists
  if( searchTerm ){
    //filtering data based on searchTerm query
    let filteredList = data.filter(item => {
      return item.title.includes(searchTerm);
    });
    //returning filteredList of results in JSON
    res.json(filteredList);
  } else {
    //otherwise returning all data if searchTerm doesn't exist
    res.json(data);
  }

});

app.get('/api/notes/:id', (req, res) =>{
  const answer = data.find(item => item.id === Number(req.params.id));
  res.json(answer);
});

app.listen(8080, function(){
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});