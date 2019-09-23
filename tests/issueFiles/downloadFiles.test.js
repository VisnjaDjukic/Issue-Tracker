const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const fs = require('fs');

const Issue = require('../../api/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('download file', () => {
    let issue;
    before(done => {
        issue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'Something',
            status: false
        });
        issue.save();
        chai.request(app)
            .post('/issues/' + issue._id + '/uploads')
            .attach('issueFile', './tests/issueFiles/test-file.jpg')
            .end(() => {
                done();
            });
    });
    afterEach(done => {
        //delete test-file from uploads folder
        Issue.findById(issue._id, (err, issue) => {
            const path = issue.issueFiles[0].path;
            fs.unlink(path, () => {
                console.log('File deleted!');
                done();
            });
        });
    });
    after(done => {
        mongoose.connection.dropDatabase(() => {
            done();
        });
    });
    it('should download file for the given issue', done => {
        Issue.findById(issue._id, (err, issue) => {
            const fileName = issue.issueFiles[0].name;
            chai.request(app)
                .post('/issues/' + issue._id + '/downloads')
                .send({ name: fileName })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.have.header('content-type');
                    done();
                });
        });
    });
});
