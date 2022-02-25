var chai = require('chai');
const expect = chai.expect;

chaiHttp = require('chai-http');
chai.use(chaiHttp);
module.exports = require('../');
let server = `http://localhost:${process.env.PORT}`
var storedToken = null
var storedListingID = null

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
        storedToken = res.body.token
        done();
      });
    });
});

describe('POST listings', () => 
{
    let listing = {
      "title": "Test",
      "description": "Test1",
      "category": "Test2",
      "location": "Test3",
      "images": [ "testurl" ],
      "price": 200,
      "deliverytype": "shipping",
    }
    it('It should try to post listing with stored token and succeed.', (done) => 
    {
      chai.request(server).post('/api/listings')
      .auth(storedToken, { type: 'Bearer' })
      .send(listing)
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.not.have.a.status();
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
    it('It should return the listings array.', (done) => 
    {
      let param = 'Test2'
      chai.request(server).get('/api/listings/category/' + param)
      .end((err, res) => 
      {
        expect(err).to.be.null;
        expect(res).to.have.property('body');
        expect(res.body[0]).to.have.property('user');
        done();
      });
    });
});