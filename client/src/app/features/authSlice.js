import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    //Creates a slice of the global Redux state This slice is responsible only for authentication
    name: 'auth',
    //dentifies this sliceUsed internally by Redux to prefix action names
    //login → auth/login ,logout → auth/logout .This avoids action name collisions.
    initialState: {
        token: null,
        user: null,
        loading: true
    },
    //how auth state looks when app starts
    reducers: {
        //reducers define All the ways auth state is allowed to change
        login: (state, action)=>{
            state.token = action.payload.token
            state.user = action.payload.user
        },
        // login runs  When: dispatch(login(data)), then logIn
        //It saves tokens, user data and redux toolkit safely updates states 
        logout: (state)=>{
            state.token = '',
            state.user = null,
            localStorage.removeItem('token')
        },
        setLoading: (state, action)=>{
            state.loading = action.payload
            //Used during app startup or async calls
            //called when dispatch(setLoading(false))
            //Used for: App startup, API calls, Token validation
        }
    }
    //Reducers define: “If X happens, change state like Y”
})

export const {login, logout, setLoading} = authSlice.actions
//These are action creators used in components.

export default authSlice.reducer
//authSlice.reducer IS the reducer created from authSlice.


// authSlice.js defines how authentication state looks and how it can change.
//File ->	Responsibility
// store.js	-> Creates the global store
// authSlice.js -> 	Defines auth state + rules to update it