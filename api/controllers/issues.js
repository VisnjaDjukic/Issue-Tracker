const mongoose = require('mongoose');
const path = require('path');

const Issue = require('../models/issue');

exports.issuesGetAll = (req, res, next) => {
    Issue.find()
        .exec()
        .then(issues => {
            res.status(200).json({
                count: issues.length,
                issues
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesCreateIssue = (req, res, next) => {
    const issue = new Issue({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description,
        status: req.body.status
    });
    issue
        .save()
        .then(issue => {
            res.status(201).json({
                message: 'Issue created successfully',
                createdIssue: issue
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesGetIssue = (req, res, next) => {
    const id = req.params.issueId;
    Issue.findById(id)
        .exec()
        .then(issue => {
            if (issue) {
                res.status(200).json(issue);
            } else {
                res.status(404).json({
                    message: 'No valid issue found for provided Id'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesUpdateIssue = (req, res, next) => {
    const id = req.params.issueId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Issue.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Issue is updated',
                resourceUrl: process.env.SERVER_URL + '/issues/' + id
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesDeleteIssue = (req, res, next) => {
    const id = req.params.issueId;
    Issue.deleteOne({ _id: id })
        .exec()
        .then(() => {
            res.status(200).json({
                message: 'Issue is deleted!'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesGetComments = (req, res, next) => {
    const id = req.params.issueId;
    Issue.findById(id)
        .exec()
        .then(issue => {
            if (issue) {
                res.status(200).json({
                    issueId: id,
                    count: issue.comments.length,
                    comments: issue.comments
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesCreateComment = (req, res, next) => {
    const id = req.params.issueId;
    Issue.findOne({ _id: id })
        .then(issue => {
            issue.comments.push({ content: req.body.content });
            issue.save();
            res.status(201).json({
                message: 'Comment is posted!',
                postedComment: issue.comments[issue.comments.length - 1]
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesUploadFile = (req, res, next) => {
    const id = req.params.issueId;
    Issue.findOne({ _id: id })
        .then(issue => {
            issue.issueFiles.push({
                name: req.file.filename,
                path: req.file.path
            });
            issue.save();
            res.status(201).json({
                message: 'File is uploaded!',
                issueFiles: issue.issueFiles
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issuesDownloadFile = (req, res, next) => {
    const file = path.join(__dirname, '/../../uploads/') + req.body.name;
    res.download(file);
};
