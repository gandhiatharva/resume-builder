import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {useSelector} from 'react-redux'
import Loader from '../components/Loader'
import Login from './Login'

const Layout = () => {

  const {user, loading} = useSelector(state => state.auth)
  //from this state.auth we will get user and loading property 

  if(loading){
    return <Loader />
    // if loading true we will provide loading component 
  }

  return (
    <div>
      {
        user ? (
          // if loggedIn we will show loggedIN page otherwise we will show the logIn page
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <Outlet />
        </div>
      ) 
      : <Login />
      }
      
    </div>
  )
}

export default Layout


// Layout is a protected wrapper that decides whether to show the app or the login page, 
//and provides a common layout (Navbar + content) for all protected routes.
//So: Any route starting with /app Must go through Layout.jsx first
// so is user exist then you display navbar and outlet like dashboard and if user is not
//authenticated then re-direct to the login page of your resume 
