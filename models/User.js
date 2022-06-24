import mongoose from 'mongoose'
import validator from 'validator'

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
    },
    userName: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: value => {
            return validator.isEmail(value)
        }
    },
    active: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    coverPhoto: {
        type: String,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    retweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    socketId: {
        type: String,
        default: ''
    },
    location: {
        type: Object
    },
    education: {
        type: String,
        trim: true
    },
    emailConfirmation: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
}, { timestamps: true})


module.exports = mongoose.model('User', UserSchema)