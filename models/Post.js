import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    content: {
        type: String,
        trim: true
    },
    postedBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    pinned: Boolean,
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweetUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    retweetData: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    replyTo: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
}, {timestamp: true})

module.exports = mongoose.model('Post', PostSchema)