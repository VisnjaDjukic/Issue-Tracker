const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    content: { type: String, required: true }
});

const issueSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: { type: String, required: true },
    status: { type: Boolean, default: false },
    comments: [commentSchema]
});

const Issue = mongoose.model('Issue', issueSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Issue, Comment };
