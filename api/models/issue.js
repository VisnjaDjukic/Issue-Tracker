const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: { type: String, required: true }
});

const issueSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        description: { type: String, required: true },
        status: { type: Boolean, default: false },
        comments: [commentSchema]
    },
    {
        toJSON: {
            versionKey: false,
            transform: (doc, ret) => {
                return {
                    id: ret._id,
                    status: ret.status,
                    description: ret.description,
                    resourceUrl: process.env.SERVER_URL + '/issues/' + ret._id,
                    comments: (() => {
                        return ret.comments.length !== 0
                            ? ret.comments
                            : 'No comments for this issue';
                    })()
                };
            }
        }
    }
);

const Issue = mongoose.model('Issue', issueSchema);
const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Issue, Comment };
