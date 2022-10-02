const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const commentSchema = new Schema(
    {
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, 'Please add post id']
        },
        body: {
            type: String,
            required: [true, 'Please add some string']
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Auth',
            required: [true, 'Please add author id']
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Auth'
            }
        ],
        reply: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment',
            }
        ]
    },
    {
        timestamps: true
    }
)

const Comment = model('Comment', commentSchema);

module.exports = Comment;