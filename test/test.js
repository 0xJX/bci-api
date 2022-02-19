var chai = require('chai');
chaiHttp = require('chai-http');
chai.use(chaiHttp);
module.exports = require('../');
let server = `http://localhost:${process.env.PORT}`

describe('GET users', () => 
{
    it('It should return the users array.', (done) => 
    {
      chai.request(server).get('/api/users').end((err, res) => 
      {
        chai.expect(res).to.have.property('body');
        chai.expect(res.body[0]).to.have.property('username');
        chai.expect(res.body[0]).to.have.property('name');
        chai.expect(res.body[0]).to.have.property('phonenumber');
        chai.expect(res.body[0]).to.have.property('email');
        chai.expect(res.body[0]).to.have.property('listings');
        chai.expect(res.body[0]).to.have.property('id');
        done();
      });
    });
});

/* This could be modified to check the returned token, but this is a public repo 
   so we avoid commiting any userdetail related tests.*/
describe('POST login', () => 
{
    it('It should try to login without credentials and return error status.', (done) => 
    {
      chai.request(server).post('/api/login').end((err, res) => 
      {
        chai.expect(res).to.have.property('error'); //.equals("Invalid username or password")
        done();
      });
    });
});

describe('POST listings', () => 
{
    it('It should try to post listing without the token and respond with token missing.', (done) => 
    {
      chai.request(server).post('/api/listings').end((err, res) => 
      {
        chai.expect(res).to.have.property('error');
        done();
      });
    });
});

describe('/POST create user', () => 
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
          done();
        });
    });
})