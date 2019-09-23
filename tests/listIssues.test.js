const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
let app = require('../app');

const Issue = require('../api/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('list all issues', () => {
    describe('there are 10 issues in db', () => {
        before(() => {
            for (let i = 0; i < 10; i++) {
                const issue = new Issue({
                    _id: new mongoose.Types.ObjectId(),
                    description: 'Something' + i,
                    status: false
                });
                issue.save();
            }
        });
        after(() => {
            mongoose.connection.dropDatabase();
            console.log('CLEAR DB!');
        });
        it('should list all issues in db', done => {
            chai.request(app)
                .get('/issues')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.keys('count', 'issues');
                    res.body.issues.should.be.a('array');
                    res.body.count.should.equal(10);
                    done();
                });
        });
    });
    describe('there are no issues in db', () => {
        it('should return empty array', done => {
            chai.request(app)
                .get('/issues')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.keys('count', 'issues');
                    res.body.issues.should.be.a('array');
                    res.body.count.should.equal(0);
                    done();
                });
        });
    });
});
