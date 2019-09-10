const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Issue = require('../models/issue');
const Comment = require('../models/comment');

// GET / - list all created issues
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
                        _id: docs._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/issues/' + doc._id
                        }
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
        // .populate('Comment')
        .exec()
        .then(doc => {
            console.log(doc);
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

// GET / - list all created comments
router.get('/:issueId/comments', (req, res, next) => {
    const id = req.params.issueId;
    Comment.find()
        .where('issue')
        .equals(id)
        .select('-__v')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// POST / - create new comment
router.post('/:issueId/comments', (req, res, next) => {
    const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        issue: req.params.issueId,
        content: req.body.content
    });
    comment
        .save()
        .then(result => {
            res.status(201).json({
                message: 'Comment is posted!',
                createdComment: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
