const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const replySchema = new Schema(
    { 
        comment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            required: [true,'Please add comment id']
        },
        body: {
            type: String,
            required: [true, 'please add some text']
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: 'Auth'
        }
    }, 
    {
        timestamps: true
    }
)

const Reply = model('Reply', replySchema);

module.exports = Reply;