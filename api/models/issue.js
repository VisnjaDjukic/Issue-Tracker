const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { type: String, required: true }
});

const fileSchema = new Schema({
    name: { type: String },
    path: { type: String }
});

const issueSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        description: { type: String, required: true },
        status: { type: Boolean, default: false },
        issueFiles: [fileSchema],
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
                resourceUrl: process.env.SERVER_URL + 'issues/' + ret._id,
                issueFiles: ret.issueFiles,
                comments: ret.comments
    
                    }
            }
        }
    }
);

module.exports = mongoose.model('Issue', issueSchema);
