const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
let app = require('../../app');

const should = chai.should();
chai.use(chaiHttp);

describe('create new issue', () => {
    describe('request body has valid parameters', () => {
        after(done => {
            mongoose.connection.dropDatabase(() => {
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
                    res.body.createdIssue.description.should.equal(
                        'Lorem ipsum'
                    );
                    res.body.createdIssue.status.should.equal(true);
                    done();
                });
        });
    });
    describe('request body has not any parameters', () => {
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
    });
});
