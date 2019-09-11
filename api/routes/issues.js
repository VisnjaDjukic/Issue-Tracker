const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Issue, Comment } = require('../models/issue');

// GET / - List all created issues
router.get('/', (req, res, next) => {
    Issue.find()
        .select('-__v')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                issues: docs.map(doc => {
                    return {
                        description: doc.description,
                        status: doc.status,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/issues/' + doc._id
                        },
                        comments: doc.comments
                    };
                })
            };
            res.status(200).json(response);
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
        .then(result => {
            res.status(201).json({
                message: 'Issue created successfully',
                createdIssue: {
                    description: result.description,
                    status: result.status,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/issues/' + result._id
                    }
                }
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
        .select('-__v')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    issue: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/issues'
                    }
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
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/issues/' + id
                }
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
                message: 'Issue is deleted!',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/issues',
                    body: {
                        description: 'String',
                        status: 'Boolean'
                    }
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// GET /:issueId/comments - List all created comments
router.get('/:issueId/comments', (req, res, next) => {
    const id = req.params.issueId;
    Issue.findById(id)
        .select('comments')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    issueId: id,
                    count: doc.comments.length,
                    comments: doc.comments
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

// UPDATE /:issueId/comments - Create new comment
router.patch('/:issueId/comments', (req, res, next) => {
    const id = req.params.issueId;
    const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        content: req.body.content
    });
    Issue.findOneAndUpdate(
        { _id: id },
        { $push: { comments: comment } },
        { new: true }
    )
        .exec()
        .then(result => {
            res.status(201).json({
                message: 'Comment is posted!',
                issueId: result._id,
                postedComment: result.comments[result.comments.length - 1],
                allComments: result.comments
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
