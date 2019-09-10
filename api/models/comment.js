const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    content: { type: String, required: true }
});

module.exports = mongoose.model('Comment', commentSchema);
