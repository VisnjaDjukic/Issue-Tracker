const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../app');
const fs = require('fs');

const Issue = require('../../api/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('upload file', () => {
    let issue;
    before(done => {
        issue = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'Something',
            status: false
        });
        issue.save(()=>{
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

    it('should upload file for the given issue', done => {
        chai.request(app)
            .post('/issues/' + issue._id + '/uploads')
            .attach('issueFile', './tests/issueFiles/test-file.jpg')
            .end((err, res) => {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have
                    .property('message')
                    .equal('File is uploaded!');
                res.body.should.have.property('issueFiles');
                res.body.issueFiles.should.be.a('array');
                res.body.issueFiles[0].should.have.keys('_id', 'name', 'path');

                const ime = res.body.issueFiles[0].name;
                done();
                return ime;
            });
    });
});
