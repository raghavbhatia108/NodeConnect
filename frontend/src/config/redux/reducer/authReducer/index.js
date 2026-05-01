import { createSlice } from "@reduxjs/toolkit";
import { getAboutUser, getAllUsers, getConnectionsRequests, loginUser, registerUser, sendConnectionRequest } from "../../action/authAction";



const initialState = {
    user: undefined,
    isError: false,
    isLoading: false,
    isSuccess: false,
    isTokenThere: false,
    loggedIn: false,
    message: "",
    profileFetched: false,
    connections: [],
    connectionRequests: [],
    all_users : [],
    all_profiles_fetched : false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers : {
        reset: () => initialState,
        handleLoginUser: (state) => {
            state.message = "Hello"
        },
        emptyMessage: (state) => {
            state.message = ""
        },
        setTokenIsThere : (state) =>{
            state.isTokenThere = true
        },
        setTokenIsNotThere : (state) => {
            state.isTokenThere = false
        }
    },

    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Logging in...";
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.loggedIn = true;
            state.message = "Login successful";
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload.message || "Login failed";
        })
        .addCase(registerUser.pending, (state) => {
            state.isLoading = true;
            state.message = "Registering user...";
        })
        .addCase(registerUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.message = {
                message: "Registration is Succesful, Please Log in"
            }
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload;
        })
        .addCase(getAboutUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.profileFetched = true;
            state.user = action.payload;
        })
        .addCase(getAllUsers.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_profiles_fetched = true;
            state.all_users = action.payload;
        })
        .addCase(getConnectionsRequests.pending, (state)=>{
            state.isLoading = true;
            state.message = "Fetching connection requests";
        })
        .addCase(getConnectionsRequests.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.isError = false;
            state.connectionRequests = action.payload;
        }
    )
        .addCase(sendConnectionRequest.fulfilled, (state) => {
            state.isLoading = false;
            state.isError = false;
            // connectionRequests is refreshed via getConnectionsRequests after send
        })
        .addCase(getConnectionsRequests.rejected, (state, action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || {message: "Failed to fetch connection requests"};
        })
    }
})

export default authSlice.reducer;
export const {reset, handleLoginUser, emptyMessage, setTokenIsNotThere, setTokenIsThere} = authSlice.actions