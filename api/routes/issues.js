const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Issue, Comment } = require('../models/issue');

// GET / - List all created issues
router.get('/', (req, res, next) => {
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
});

// POST / - Create a new issue
router.post('/', (req, res, next) => {
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
});

// GET /:issueId - Return a given issue
router.get('/:issueId', (req, res, next) => {
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
});

// PATCH /:issueId - Update a given issue
router.patch('/:issueId', (req, res, next) => {
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
});

// DELETE /:issueId - Delete a given issue
router.delete('/:issueId', (req, res, next) => {
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
});

// GET /:issueId/comments - List all created comments for provided issue
router.get('/:issueId/comments', (req, res, next) => {
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
});

// POST /:issueId/comments - Create new comment for provided issue
router.post('/:issueId/comments', (req, res, next) => {
    const id = req.params.issueId;
    const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        content: req.body.content
    });
    Issue.findOne({ _id: id })
        .then(issue => {
            issue.comments.push(comment);
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
});

module.exports = router;
