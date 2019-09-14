const mongoose = require('mongoose');
const path = require('path');

const Issue = require('../models/issue');

exports.issues_get_all = (req, res, next) => {
    Issue.find()
        .exec()
        .then(issues => {
            res.status(200).json({
                count: issues.length,
                issues: issues
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.issues_create_issue = (req, res, next) => {
    const issue = new Issue({
        _id: new mongoose.Types.ObjectId(),
        description: req.body.description,
        status: req.body.status
    });
    console.log(issue)
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

exports.issues_get_issue = (req, res, next) => {
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

exports.issues_update_issue = (req, res, next) => {
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

exports.issues_delete_issue = (req, res, next) => {
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

exports.issues_get_comments = (req, res, next) => {
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

exports.issues_create_comment = (req, res, next) => {
    const id = req.params.issueId;
    console.log(req.body.content)
    Issue.findOne({ _id: id })
        .then(issue => {
            issue.comments.push({ content: req.body.content });
            console.log(req.body.content);
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

exports.issues_upload_file = (req, res, next) => {
    console.log(req.file);
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

exports.issues_download_file = (req, res, next) => {
    const file = path.join(__dirname, '/../../uploads/') + req.body.name;
    res.download(file);
};
