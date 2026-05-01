import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { use } from "react";

export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI)=>{
        try {
            const response = await clientServer.get('/posts')
            return thunkAPI.fulfillWithValue(response.data)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

export const createPost = createAsyncThunk(
    "post/createPost",
    async(userData, thunkAPI)=>{
        const [file, body] = userData;
        try {
            const formData = new FormData();
            formData.append('media', file);
            formData.append('body', body);
            formData.append('token', localStorage.getItem('token'));

            const response = await clientServer.post('/post', formData, {
                headers:{
                    "Content-Type": "multipart/form-data"
                }
            })

            if(response.status === 200){
                return thunkAPI.fulfillWithValue(response.data)
            }
            else{
                return thunkAPI.rejectWithValue({message: "Failed to create post"})
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

// config/redux/action/postAction.js

export const deletePost = createAsyncThunk(
    "post/deletePost",
    async (payload, thunkAPI) => { // 1. Change argument name to payload
        try {
            // payload looks like: { post_id: "12345" }
            const response = await clientServer.delete(`/delete_post`, { // Check your route URL
                data: {
                    token: localStorage.getItem('token'),
                    postId: payload.post_id // 2. Map 'post_id' to 'postId' for backend
                }
            });
            return thunkAPI.fulfillWithValue(response.data);
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

export const incrementLikes = createAsyncThunk(
    "post/incrementLikes",
    async (payload, thunkAPI) => {  
        try{
            const response = await clientServer.post('/increment_post_like', {
                post_id: payload.post_id
            });
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }   
    }
);

export const getAllComments = createAsyncThunk(
    "post/getAllComments",
    async (payload, thunkAPI) => {  
        try{
            const response = await clientServer.get('/get_comments', {
                params: {
                    post_id: payload.post_id
                }
            });
            return thunkAPI.fulfillWithValue({
                comments : response.data.comments,
                postId: payload.post_id
            });
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }}
)

export const postComment = createAsyncThunk(
    "post/postComment", 
    async(payload, thunkAPI) => {
        try{
            if(!payload || !payload.body || payload.body.trim() === ''){
                return thunkAPI.rejectWithValue({message: 'Comment cannot be empty'});
            }
            const response = await clientServer.post('/comment', {
                token: localStorage.getItem('token'),
                post_id: payload.post_id,
                commentBody: payload.body
            });
            // Refresh comments for the post
            thunkAPI.dispatch(getAllComments({post_id: payload.post_id}));
            return thunkAPI.fulfillWithValue(response.data);
        }
        catch(error){
            return thunkAPI.rejectWithValue(error.response?.data || {message: 'Server error'});
        }
    }
) 