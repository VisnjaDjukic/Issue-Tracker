const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../backend/app');

const Issue = require('../../backend/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('get single issue', () => {
    describe('URL parameter is valid id', () => {
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
        it('should list a single issue by the given id', done => {
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
    describe('URL parameter is invalid id', () => {
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
    });
});
