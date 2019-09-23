const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const Issue = require('../api/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('comments', () => {
    let issue;
    before(() => {
        issue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'Something',
            status: false
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
});
