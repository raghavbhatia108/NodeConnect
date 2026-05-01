import { createSlice } from "@reduxjs/toolkit"
import { getAllPosts, getAllComments, postComment } from "../../action/postAction"


const initialState = {
    posts: [],
    isError:false,
    postFetched: false,
    isLoading: false,
    loggedIn: false,
    message: "",
    comments: [],
    postId: "",
}


const postSlice = createSlice({
    name: "post",
    initialState,
    reducers:{
        reset: () => initialState,
        resetPostId: (state) => {
            state.postId = ""
            state.comments = []
        }
    },
    extraReducers : (builder) =>{
        builder
        .addCase(getAllPosts.pending, (state)=>{
            state.isLoading = true
            state.message = "Fetching all the posts"
        })
        .addCase(getAllPosts.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.postFetched = true;
            state.posts = action.payload.posts.reverse();
        })
        .addCase(getAllPosts.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true,
            state.message = action.payload
        })        .addCase(postComment.pending, (state)=>{
            state.isLoading = true;
            state.message = 'Posting comment';
        })
        .addCase(postComment.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.message = action.payload.message || 'Comment posted';
        })
        .addCase(postComment.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || {message: 'Failed to post comment'};
        })
        .addCase(getAllComments.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.comments = action.payload.comments;
            state.postId = action.payload.postId;
        })
       
    }
})

export default postSlice.reducer

export const {reset, resetPostId} = postSlice.actions   