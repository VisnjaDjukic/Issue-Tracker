const express = require('express');
const router = express.Router();
const multer = require('multer');

const IssuesController = require('../controllers/issues');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.FILE_MAX_SIZE
    }
});

//GET / - List all created issues
router.get('/', IssuesController.issuesGetAll);

//POST / - Create a new issue
router.post('/', IssuesController.issuesCreateIssue);

//GET /:issueId - Return issue for provided issue ID
router.get('/:issueId', IssuesController.issuesGetIssue);

//PATCH /:issueId - Update a given issue
router.patch('/:issueId', IssuesController.issuesUpdateIssue);

//DELETE /:issueId - Delete issue for provided issue ID
router.delete('/:issueId', IssuesController.issuesDeleteIssue);

//GET /:issueId/comments - List all created comments for provided issue
router.get('/:issueId/comments', IssuesController.issuesGetComments);

//POST /:issueId/comments - Create new comment for provided issue
router.post('/:issueId/comments', IssuesController.issuesCreateComment);

// POST /:issueId/uploads - Upload files for provided issue
router.post(
    '/:issueId/uploads',
    upload.single('issueFile'),
    IssuesController.issuesUploadFile
);

// POST /:issueId/downloads - Download file from issue
router.post('/:issueId/downloads', IssuesController.issuesDownloadFile);

module.exports = router;
