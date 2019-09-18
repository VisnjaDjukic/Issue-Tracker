const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
let app = require('../app');

const Issue = require('../api/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('Issue', () => {
    it('should list all issues', done => {
        chai.request(app)
            .get('/issues')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.keys('count', 'issues');
                res.body.issues.should.be.a('array');
                done();
            });
    });

    it('should list a single issue by the given id', done => {
        var issue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'Something',
            status: false
        });
        issue.save((err, issue) => {
            chai.request(app)
                .get('/issues/' + issue._id)
                .send(issue)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.keys(
                        'id',
                        'description',
                        'status',
                        'resourceUrl',
                        'issueFiles',
                        'comments'
                    );
                    res.body.description.should.equal('Something');
                    res.body.status.should.equal(false);
                    res.body.id.should.equal(issue._id.toString());
                    done();
                });
        });
    });

    it('should not found issue by the given id', done => {
        const id = new mongoose.Types.ObjectId();
        chai.request(app)
            .get('/issues/' + id)
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal(
                    'No valid issue found for provided Id'
                );
                done();
            });
    });

    it('should return error by the given id', done => {
        const id = undefined;
        chai.request(app)
            .get('/issues/' + id)
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            });
    });

    it('should add a single issue', done => {
        chai.request(app)
            .post('/issues')
            .send({ description: 'Lorem ipsum', status: true })
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have
                    .property('message')
                    .equal('Issue created successfully');
                res.body.should.have.property('createdIssue');
                res.body.createdIssue.should.have.keys(
                    'id',
                    'description',
                    'status',
                    'comments',
                    'resourceUrl',
                    'issueFiles'
                );
                res.body.createdIssue.description.should.equal('Lorem ipsum');
                res.body.createdIssue.status.should.equal(true);
                done();
            });
    });

    it('should not post issue without required field', done => {
        chai.request(app)
            .post('/issues')
            .send()
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.have.property('error');
                done();
            });
    });

    it('should update issue by the given id', done => {
        var issue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'Something ',
            status: false
        });
        issue.save((err, issue) => {
            chai.request(app)
                .patch('/issues/' + issue._id)
                .send([{ propName: 'description', value: 'Something new' }])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Issue is updated');
                    done();
                });
        });
    });

    it('should delete issue by the given id', done => {
        var issue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'Something',
            status: false
        });
        issue.save((err, issue) => {
            chai.request(app)
                .delete('/issues/' + issue._id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    res.body.message.should.equal('Issue is deleted!');
                    done();
                });
        });
    });
});

after(() => {
    Issue.collection.drop();
    return mongoose.disconnect(() => {
        mongoose.models = {};
        mongoose.modelSchemas = {};
        mongoose.connection.close();
    });
});
