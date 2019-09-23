const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
let app = require('../../app');

const Issue = require('../../api/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('update single issue', () => {
    describe('request body has valid parameters and valid id', () => {
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
        it('should update issue', done => {
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
    describe('request body has not valid id', () => {
        it('should return error', done => {
            const id = undefined;
            chai.request(app)
                .patch('/issues/' + id)
                .send([{ propName: 'description', value: 'Something new' }])
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
