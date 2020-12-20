const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app.js');

//all tests will fail in apps current state because it is configured for AWS server

//SQL Call Test
//will not work with current config due to security permissions
describe('SQL Call', () => {
  it('Should return a response object from SQL database', () => {
    return supertest(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });
});

//User Submissions
//Will not pass without dummy data
describe('User Submission', () => {
  it('Should post to user submission list', () => {
    return supertest(app)
      .post('/submit')
      .expect(200)
  });
});

//News Call Test
describe('News Call', () => {
  it('Should return a response object from NEWS API', () => {
    return supertest(app)
      .get('/news')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });
});

//Weather Call Test
describe('Weather Call', () => {
  it('Should return a response object from Weather API', () => {
    return supertest(app)
      .get('/weather')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });
});