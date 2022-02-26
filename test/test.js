var chai = require('chai');
const expect = chai.expect;

chaiHttp = require('chai-http');
chai.use(chaiHttp);
module.exports = require('../');
let server = `http://localhost:${process.env.PORT}`
var storedToken = 'null';
var storedDate = 'null';
var listingID = 'null';
//var storedUserID = 'null';

describe('POST user', () => 
{
    it('Test create user posting.', (done) => 
    {
        let user = {
            "username": "MochaTest",
            "name": "First Last",
            "phonenumber": "123456789",
            "email": "mocha@test.com",
            "password": "mochatest"
        }
        chai.request(server).post('/api/users').send(user).end((err, res) => 
        {
          expect(err).to.be.null;
          done();
        });
    });
})

describe('GET users', () => 
{
    it('It should return the users array.', (done) => 
    {
      chai.request(server).get('/api/users').end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('username');
        expect(res.body[0]).to.have.property('name');
        expect(res.body[0]).to.have.property('phonenumber');
        expect(res.body[0]).to.have.property('email');
        expect(res.body[0]).to.have.property('listings');
        expect(res.body[0]).to.have.property('id');
        done();
      });
    });
});

describe('POST login', () => 
{
    it('It should try to login and return 200 status.', (done) => 
    {
      let user = {
        "username": "MochaTest",
        "password": "mochatest"
      }
      chai.request(server).post('/api/login')
      .send(user)
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        storedToken = res.body.token;
        done();
      });
    });
});

describe('POST listings', () => 
{
    let listing = {
      "title": "Test",
      "description": "Test1",
      "category": "Test2CategoryMOCHA",
      "location": "Test3",
      "images": [ "testurl" ],
      "price": 200,
      "deliverytype": "shipping",
    }
    it('It should try to post listing with stored token and succeed.', (done) => 
    {
      chai.request(server).post('/api/listings')
      .auth(storedToken, { type: 'bearer' })
      .send(listing)
      .end((err, res) => 
      {
        expect(storedToken).not.to.be.null;
        expect(err).to.be.null;
        expect(res).to.not.have.status(401);
        done();
      });
    });
});

describe('GET listings', () => 
{
    it('It should return the listings array.', (done) => 
    {
      chai.request(server).get('/api/listings').end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('user');
        done();
      });
    });
});


describe('GET listings by category', () => 
{
    it('It should return the listings array with selected category.', (done) => 
    {
      chai.request(server).get('/api/listings?category=Test2CategoryMOCHA')
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('user');
        done();
      });
    });
});

describe('GET listings by location', () => 
{
    it('It should return the listings array with selected category.', (done) => 
    {
      chai.request(server).get('/api/listings?location=Test3')
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('user');
        expect(res.body[0]).to.have.property('date');
        storedDate = res.body[0].date;
        done();
      });
    });
});

describe('GET listings by date', () => 
{
    it('It should return the listings array with selected category.', (done) => 
    {
      chai.request(server).get('/api/listings?date=' + storedDate)
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('user');
        done();
      });
    });
});

describe('GET listings by category, location and date', () => 
{
    it('It should return the listings array with selected category.', (done) => 
    {
      chai.request(server).get('/api/listings?category=Test2CategoryMOCHA&location=Test3&date=' + storedDate)
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('user');
        expect(res.body[0]).to.have.property('id');
        listingID = res.body[0].id;
        done();
      });
    });
});

describe('GET listings by id', () => 
{
    it('It should return the listings array with selected id.', (done) => 
    {
      chai.request(server).get('/api/listings?id=' + listingID)
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('user');
        expect(res.body[0]).to.have.property('id');
        done();
      });
    });
});

/* Not implemented yet.
describe('POST listings with ID', () => 
{
    let listing = {
      "title": "TestMOD",
      "description": "TestMOD",
      "category": "Test2CategoryMOCHA",
      "location": "Test3",
      "images": [ "testurl" ],
      "price": 200,
      "deliverytype": "shipping",
    }
    it('It should try to overwrite existing listing with given id', (done) => 
    {
      chai.request(server).post('/api/listings?id=' + listingID)
      .auth(storedToken, { type: 'bearer' })
      .send(listing)
      .end((err, res) => 
      {
        expect(storedToken).not.to.be.null;
        expect(err).to.be.null;
        expect(res).to.not.have.status(401);
        done();
      });
    });
});*/

describe('DELETE listings by id', () => 
{
    it('It should delete the previous tested listing.', (done) => 
    {
      chai.request(server).delete('/api/listings?id=' + listingID)
      .auth(storedToken, { type: 'bearer' })
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.not.have.status(400);
        expect(res).to.not.have.status(401);
        done();
      });
    });
});
