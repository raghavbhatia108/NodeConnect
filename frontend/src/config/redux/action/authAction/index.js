import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";

export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      console.log("LOGIN CALLED");

      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      console.log("RESPONSE:", response.data);

      if (response.data.token && typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.log("ERROR:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);


export const registerUser = createAsyncThunk(
    "user/register",
    async (user, thunkAPI) => {
      try {

        const request = await clientServer.post("/register", {
          username: user.username,
          password: user.password,
          email: user.email,
          name: user.name
        })
        
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    });

export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async(user, thunkAPI) => {
    console.log(user)
    try {
      const response = await clientServer.get("/get_user_and_profile", {
        params : {
          token: user.token
        }
      })
      return thunkAPI.fulfillWithValue(response.data)
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async(_, thunkAPI) => {
    console.log("getAllUsers API called");
    

    try {
      const response = await clientServer.get("/users/get_all_users");
      return thunkAPI.fulfillWithValue(response.data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { message: "Failed to fetch users" })
    }
  }
)

export const sendConnectionRequest = createAsyncThunk(
  "users/sendConnectionRequest",
  async(payload, thunkAPI) => {
    try{
      const response = await clientServer.post('/users/send_connection_request', {
        token: payload.token,
        connectionId: payload.user_id
      });
      return thunkAPI.fulfillWithValue(response.data);
    }
      catch(error){
        return thunkAPI.rejectWithValue(error.response.data);
      } 
  });

  export const getConnectionsRequests = createAsyncThunk(
    "users/getConnectionsRequests",
    async(payload, thunkAPI) => {
      try{
        // backend expects { token } in the body
        const response = await clientServer.post('/users/getConnectionRequests', {
          token: payload.token
        });
        return thunkAPI.fulfillWithValue(response.data);
      }
        catch(error){
          return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch connection requests' });
        }
    });

    export const getMyConnectionRequests = createAsyncThunk(
      "users/getMyConnectionRequests",
      async(payload, thunkAPI) => {
        try{
          // backend expects a GET to this route and token in query params
          const response = await clientServer.get('/users/user_connection_request', {
            params: { token: payload.token }
          });
          return thunkAPI.fulfillWithValue(response.data);

        }
        catch(error){
          return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to fetch my connection requests' }); 
        }});

    export const acceptConnectionRequest = createAsyncThunk(
      "users/acceptConnection",
      async(payload, thunkAPI) => { 
        try{
          // backend expects requestId (the ConnectionRequest _id)
          const response = await clientServer.post('/users/accept_connection_request', {
            token: payload.token,
            requestId: payload.requestId,
            action_type: payload.action_type
          });
          thunkAPI.dispatch(getConnectionsRequests({token: payload.token}));
          thunkAPI.dispatch(getMyConnectionRequests({token: payload.token}));
          return thunkAPI.fulfillWithValue(response.data);
        } 
        catch(error){
          return thunkAPI.rejectWithValue(error.response?.data || { message: 'Failed to accept connection request' });
        } });