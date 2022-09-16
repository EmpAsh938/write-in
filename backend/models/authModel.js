const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const authSchema = new Schema(
    {
        username: {
            type: String,
            validate: {
                validator: (v) => {
                    return /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,29}$/.test(v);
                },
                message: props => `${props.value} is not a valid username!`
            },
            required: [true, 'Please add an username'],
        },
        email: {
            type:String,
            validate: {
                validator: (v) => {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
                },
                message: props => `${props.value} is not a valid email!`
            },
            required: [true, 'Please add an email'],
        },
        password: {
            type:String,
            required: [true, 'Please add a password']
        },
        fullname: {
            type:String,
            required: [true, 'Please add a fullname']
        },
        bio: {
            type: String
        },
        profileImage: {
            type:String
        },
        bookmarks: {
            type: [Schema.Types.ObjectId],
            ref: 'Post'
        },
    },
    {
        timestamps: true
    }
)

const Auth = model('Auth', authSchema);

module.exports = Auth;