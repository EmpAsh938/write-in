const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Reply = new model(
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
