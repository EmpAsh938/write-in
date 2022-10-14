const mongoose = require('mongoose');

const { Schema, model } = mongoose;


const postSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Please add a title']
        },
        status: {
            type: String,
            enum: {
                values: ['published', 'draft'],
                message: '{VALUE} is not supported'
            },
            required: [true, 'please add status']
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Auth',
            required: [true, 'please add author ref']
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Auth'
            }
        ],
        markdown: {
            type: String
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        views: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Auth'
            }
        ]
    },
    {
        timestamps: true
    }
)

const Post = model('Post', postSchema);

module.exports = Post;
