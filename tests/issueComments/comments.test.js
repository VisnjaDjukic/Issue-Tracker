const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../backend/app');

const Issue = require('../../backend/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('create new comment', () => {
    let issue;
    before(done => {
        issue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'Something',
            status: false
        });
        issue.save(() => {
            done();
        });
    });
    after(done => {
        mongoose.connection.dropDatabase(() => {
            done();
        });
    });
    it('should create comment for the given issue', done => {
        chai.request(app)
            .post('/issues/' + issue._id + '/comments')
            .send({ content: 'first comment' }, issue.save())
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have
                    .property('message')
                    .equal('Comment is posted!');
                res.body.should.have.property('postedComment');
                res.body.postedComment.should.have.property('content');
                res.body.postedComment.content.should.equal('first comment');
                done();
            });
    });
    it('should list comments for the given issue', done => {
        chai.request(app)
            .get('/issues/' + issue._id + '/comments')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.keys('issueId', 'count', 'comments');
                res.body.count.should.equal(1);
                res.body.comments.should.be.a('array');
                res.body.comments[0].should.have.property('content');
                res.body.comments[0].content.should.equal('first comment');
                done();
            });
    });
});

