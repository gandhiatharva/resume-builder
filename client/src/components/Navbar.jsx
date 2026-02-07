import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../app/features/authSlice'

const Navbar = () => {

   const {user} = useSelector(state => state.auth)
   //useSelector is a React-Redux hook that lets a component read data from the Redux store.
    //  to get user directly 
   const dispatch = useDispatch()
   //useDispatch gives you a function that lets you send actions to Redux.

    const navigate = useNavigate()

    const logoutUser = ()=>{
        navigate('/')
        dispatch(logout())
        //we send this to redux to tell it to logout the user 
        // whenever this called, we will navigate to the '/' page and logout the user 
    }

  return (
    <div className='shadow bg-white'>
      <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
        <Link to='/'>
            <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>
        <div className='flex items-center gap-4 text-sm'>
            <p className='max-sm:hidden'>Hi, {user?.name}</p>
            <button onClick={logoutUser} className='bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all'>Logout</button>
            {/* when you click this button you want user to logOut so you whenever this called
            the above function is called  */}
        </div>
      </nav>
    </div>
  )
}

export default Navbar

// this will come in each and every page after we have loggedIn or signed UP
