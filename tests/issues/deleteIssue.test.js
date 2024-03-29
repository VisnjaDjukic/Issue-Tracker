const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../backend/app');

const Issue = require('../../backend/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('delete single issue', () => {
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
        it('should delete issue by the given id', done => {
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
    describe('URL parameter is not valid id', () => {
        it('should return error by the given id', done => {
            const id = undefined;
            chai.request(app)
                .delete('/issues/' + id)
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
