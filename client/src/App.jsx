import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import api from './configs/api'
import { login, setLoading } from './app/features/authSlice'
import {Toaster} from 'react-hot-toast'

const App = () => {

  const dispatch = useDispatch()
  //Now dispatch is available in this component.
  //dispatch sends an action to Redux.

  const getUserData = async () => {
    const token = localStorage.getItem('token')
    //This is client-side persistence: Redux state resets on refresh ,localStorage survives refresh
    try {
      if(token){
        const { data } = await api.get('/api/users/data', {headers: {Authorization: token}})
        //Calls backend and Backend verifies JWT,Returns user info if valid
        if(data.user){
          dispatch(login({token, user: data.user}))
          //This means: Trigger the login reducer in authSlice,Update state.auth
          //Internally this happens->dispatch(action)
          // → Redux finds matching reducer
          // → Reducer updates store
          // → Components re-render
        }  
        dispatch(setLoading(false))
      }else{
        dispatch(setLoading(false))
      }
    } catch (error) {
      dispatch(setLoading(false))
      console.log(error.message)
    }
  }

  useEffect(()=>{
    getUserData()
  },[])

  return (
    <>
    <Toaster />
      <Routes>
        {/* // within this you can include all you routes, so this is with the class router-router-dom */}
        <Route path='/' element={<Home />}/>
        {/* // within routes you can include as many route as you want and all wll come within 
        //this tag without any issue,
        when we come at path = /, we will come to home page, so element will return home page  */}

        <Route path='app' element={<Layout />}>
          <Route index element={<Dashboard />}/>
          <Route path='builder/:resumeId' element={<ResumeBuilder />}/>
          {/* this above path is dynamic whatever Id comes it will come according to that */}
        </Route>

        {/* this above is a nested route and it matches route from left to right, so if app comes
        layout will be rendered, shows dashboard inside layout and then if finds buider/id, will
        show resume inside the layout, Most specific matching child route wins.  */}
        {/* React Router first matches the parent path, then chooses the child route that best matches the remaining URL segment */}

        <Route path='view/:resumeId' element={<Preview />}/>
        {/* this is for use public resume view, anyone can view from here  */}

      </Routes>
    </>
  )
}

export default App


// Explaintions 
// toast is a small temporary notifcation message that appers on the screen, does not 
//block the user and auto disapper after a few seconds 
// it is of many types which can be read from documentaiton 
// toaster - > It is the container that displays toast messages on the screen.
// messages like login successful and something went wrong can come from here 


//Redlated to Redix-> App.jsx is the first real component that runs after the app is bootstrapped.
//So this is the best place to:
// check if the user is already logged in
// restore auth state from localStorage
// update Redux so the entire app knows the user status
// Redux here is used for global authentication state.
