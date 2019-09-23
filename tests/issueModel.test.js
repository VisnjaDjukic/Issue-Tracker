const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const Issue = require('../api/models/issue');

const should = chai.should();
chai.use(chaiHttp);

describe('create new issue model', () => {
    after(() => {
        mongoose.connection.dropDatabase();
        console.log('CLEAR DB!!!');
    });
    it('should transform data from model issue', done => {
        const newIssueModel = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: 'first issue description'
        });
        newIssueModel.save((err, data) => {
            const transformedData = data.toJSON();
            transformedData.should.be.a('object');
            transformedData.should.have.keys(
                'id',
                'description',
                'status',
                'resourceUrl',
                'issueFiles',
                'comments'
            );
            transformedData.description.should.equal('first issue description');
            transformedData.resourceUrl.should.equal(
                process.env.SERVER_URL + 'issues/' + transformedData.id
            );
        });
        done();
    });
    it('should not create issue if property description is empty', done => {
        const newIssueModel = new Issue({
            _id: new mongoose.Types.ObjectId(),
            description: ''
        });
        newIssueModel.save(err => {
            should.exist(err);
            err.should.be.a('object');
            err.should.have.keys('errors', 'name', 'message', '_message');
            err.name.should.equal('ValidationError');
            err._message.should.equal('Issue validation failed');
        });
        done();
    });
    
});
