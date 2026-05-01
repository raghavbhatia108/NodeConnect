import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    body: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    created_at: {
        type : Date,
        default : Date.now,
    },
    updated_at: {
        type : Date,
        default : Date.now,
    },
    media : {
        type : String,
        default : ''
    },
    active : {
        type: Boolean,
        default : null

    },
    fileType : {
        type: String,
        default: ''
    },
    
});

const Post = mongoose.model('Post', postSchema);
export default Post;