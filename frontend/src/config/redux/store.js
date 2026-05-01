import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer"
/*
*
* Steps for state management
* 1. Create Redux Store
* 2. Provide the store to the app   
* 3. Submit action
* 4. Handle action in it's reducer
*5. Register here => reducer
*
*
*/

export const store = configureStore({
    reducer: {
        auth: authReducer,
        postReducer: postReducer
    }
})