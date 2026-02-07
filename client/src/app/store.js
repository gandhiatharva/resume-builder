import {configureStore} from '@reduxjs/toolkit'
import authReducer from './features/authSlice'
//authSlice defines: auth state (user, token, isLoggedIn) reducers (login, logout, etc.)
// here we have imported the reducers created in authSlice and then we are using it store 
// as authReducer because that is how we have exported it 
//authReducer is exactly authSlice.reducer

export const store = configureStore({
    reducer : {
        auth: authReducer
        // so this means ->“Whenever an action related to auth happens, 
        //use this reducer to update the auth state.”
    }
})
//This does the core work.
//Creates a Redux store
// Registers a reducer called auth
// The global state shape becomes:
//Store is provided to React, In main.jsx or index.js:


//Note-> authSlice is linked automatically because authReducer comes from authSlice.



//It creates a global store where your app can keep shared state
// (like logged-in user info) so any component can access it.
// In React:
// useState → local component state
// Redux store → global app state
// Your store.js is the single source of truth for global data like:
// auth status , user info , tokens