'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

// describe('Reality check', function () {

//   it('true should be true', function () {
//     expect(true).to.be.true;
//   });

//   it('2 + 2 should equal 4', function () {
//     expect(2 + 2).to.equal(4);
//   });

// });

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/DOES/NOT/EXIST')
      .then(res => {
        expect(res).to.have.status(404);
      });
  });

});

describe('GET /api/notes', function(){
  
  it('should return the default of 10 Notes as an array', function(){
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.exist;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.lengthOf(10);
      });
  });

  it('should return an array of objects with the id, title, and content', function(){
    return chai.request(app)
      .get('/api/notes')
      .then(function(res){
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');

        res.body.forEach(function (item){
          expect(item).to.be.a('object');
          expect(item).to.have.all.keys('id', 'title', 'content');
        });

      });
  });

  it('should return correct search results for a valid query', function(){
    return chai.request(app)
      .get('/api/notes/?searchTerm=cats')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(10);
      });
  });

  it('should return an empty array for an incorrect query', function(){
    return chai.request(app)
      .get('/api/notes/?searchTerm=NORESULTS')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body).to.have.length(0);
      });
  });

});

describe('GET /api/notes/:id', function(){

  it('should return correct note object with id, title, and content for a given id', function(){
    return chai.request(app)
      .get('/api/notes/1000')
      .then(function(res){
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body.id).to.equal(1000);
        expect(res.body.title).to.equal('5 life lessons learned from cats');
      });
  });

  it('should respond with a 404 for an invalid id', function(){
    return chai.request(app)
      .get('/api/notes/666')
      .then(function(res){
        expect(res).to.have.status(404);
      });
  });

});

describe('POST /api/notes', function(){

  it('should create and return a new item with location header when provided valid data', function(){
    
    const newNote = {
      'title' : 'dogs > cats',
      'content' : 'everyone knows it is true'
    };

    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res).to.have.header('location');
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content');
        expect(res.body.id).to.equal(1010);
        expect(res.body.title).to.equal(newNote.title);
        expect(res.body.content).to.equal(newNote.content);
      });

  });

  it('should return an object with a message property "Missing title in request body" when missing "title" field', function(){
    const newNote = {
      'content' : 'this note does not have a title!'
    };

    return chai.request(app)
      .post('/api/notes')
      .send(newNote)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res.body.message).to.deep.equal('Missing `title` in request body');
      });
  });

});

describe('PUT /api/notes/:id', function(){
  
  it('should update and return a note object when given valid data', function(){
    
    const updateNote = {
      'title': 'Why are there  so many notes about cats?',
      'content': 'This app was written by an obsessed cat lady'
    };
    return chai.request(app)
      .put('/api/notes/1004')
      .send(updateNote)
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1004);
        expect(res.body.title).to.equal(updateNote.title);
        expect(res.body.content).to.equal(updateNote.content);
      });

  });

  it('should responsd with a 404 for an invalid id', function(){
    
    const updateNote = {
      'title': 'Why are there  so many notes about cats?',
      'content': 'This app was written by an obsessed cat lady'
    };
    return chai.request(app)
      .put('/api/notes/5555')
      .send(updateNote)
      .then(res => {
        expect(res).to.have.status(404);
      });

  });

  it('should return an object with a message property "missing title in request body" when missing "title" field', function(){
    const updateNote = {
      'content' : 'this note does not have a title!'
    };

    return chai.request(app)
      .put('/api/notes/1003')
      .send(updateNote)
      .then(function(res){
        expect(res).to.have.status(400);
        expect(res.body.message).to.deep.equal('Missing `title` in request body');
      });
  });

});

describe('DELETE /api/notes/:id', function(){
  
  it('should delete an item by id', function(){
    return chai.request(app)
      .delete('/api/notes/1008')
      .then(res =>{
        expect(res).to.have.status(204);
      });
  });

});