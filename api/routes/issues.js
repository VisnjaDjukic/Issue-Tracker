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
        fileSize: 1024 * 1024 * 5
    }
});

//GET / - List all created issues
router.get('/', IssuesController.issues_get_all);

//POST / - Create a new issue
router.post('/', IssuesController.issues_create_issue);

//GET /:issueId - Return issue for provided issue ID
router.get('/:issueId', IssuesController.issues_get_issue);

//PATCH /:issueId - Update a given issue
router.patch('/:issueId', IssuesController.issues_update_issue);

//DELETE /:issueId - Delete issue for provided issue ID
router.delete('/:issueId', IssuesController.issues_delete_issue);

//GET /:issueId/comments - List all created comments for provided issue
router.get('/:issueId/comments', IssuesController.issues_get_comments);

//POST /:issueId/comments - Create new comment for provided issue
router.post('/:issueId/comments', IssuesController.issues_create_comment);

// POST /:issueId/uploads - Upload files for provided issue
router.post(
    '/:issueId/uploads',
    upload.single('issueFile'),
    IssuesController.issues_upload_file
);

// POST /:issueId/downloads - Download file from issue
router.post('/:issueId/downloads', IssuesController.issues_download_file);

module.exports = router;
