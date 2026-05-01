import Post from "../models/posts.model.js";
import User from "../models/users.model.js";
import Comment from "../models/comments.model.js";



export const activeCheck = async (req, res) =>{
    return res.status(200).json({message:"Running"});
}

export const createPost = async (req, res) => {
    const {token} = req.body;
    try {
        const user = await User.findOne({token: token});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const post = new Post({
            userId: user._id,
            body: req.body.body,
            media: req.file != undefined ? req.file.path : '',
            fileType: req.file != undefined ? req.file.mimetype.split('/')[1] : ''
        })
        await post.save();
        return res.status(200).json({message: "Post created successfully"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: "Server error"});
    }
}

export const getAllPosts = async (req, res) =>{
    try {
        const posts = await Post.find().populate('userId', 'name username email profilePicture')
        return res.status(200).json({posts});
    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
}

export const deletePost = async (req, res) => {
    const {token, postId} = req.body;
    try {
        const user = await User.findOne({token}).select('_id');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const post = await Post.findOne({_id: postId});
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        if(post.userId.toString() != user._id.toString()){
            return res.status(403).json({message: "Unauthorized"});
        }
        await Post.deleteOne({_id: postId});
        return res.status(200).json({message: "Post deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const commentPost = async(req, res) =>{
    try {
        const {token, post_id, commentBody} =req.body;
        const user = await User.findOne({token}).select("_id");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }

        const comment = new Comment({
            postId: post._id,
            userId: user._id,
            body: commentBody
        });
        const savedComment = await comment.save();
        const populated = await Comment.findById(savedComment._id).populate('userId', 'name username profilePicture');
        return res.status(200).json({message: "Comment added successfully", comment: populated});

    } catch (error) {
        return res.status(500).json({message: "Server error"});
    }
} 

export const getCommentsByPosts = async (req, res) => {
    const post_id = req.query.post_id || req.body.post_id;
    try {
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        const comments = await Comment.find({ postId: post._id }).populate('userId', 'name username profilePicture');
        return res.status(200).json({comments});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
} 

export const deleteCommentOfUser = async (req, res) => {
    const {token, comment_id} = req.body;
    try {
      const user = await User.findOne({token}).select("_id");  
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const comment = await Comment.findOne({"_id": comment_id});
        if(!comment){
            return res.status(404).json({message: "Comment not found"});
        }
        if(comment.userId.toString() != user._id.toString()){
            return res.status(403).json({message: "Unauthorized"});
        }
        await Comment.deleteOne({"_id": comment_id});
        return res.status(200).json({message: "Comment deleted successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const incrementLikes = async (req, res) => {
    const {post_id} = req.body;
    try {
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(404).json({message: "Post not found"});
        }
        post.likes += 1;
        await post.save();
        return res.status(200).json({message: "Like added successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }}