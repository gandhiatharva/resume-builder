import { Lock, Mail, User2Icon } from 'lucide-react'
import React from 'react'
import api from '../configs/api'
import { useDispatch } from 'react-redux'
import { login } from '../app/features/authSlice'
import toast from 'react-hot-toast'

const Login = () => {

    const dispatch = useDispatch()
  const query = new URLSearchParams(window.location.search)
// so query.get will get the state from our url whether we have given a sighUp page or 
// we have given a login page and extract the state and then pase it accordinly to the next
// so if it is for login, content of login comes otherwise content of signUp comes 
  const urlState = query.get('state')
  const [state, setState] = React.useState(urlState || "login")

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        //Normally, submitting a form reloads the page, so it prevent that 
        //“Don’t reload. I’ll handle this with JavaScript.”
        try {
            const { data } = await api.post(`/api/users/${state}`, formData)
            // state is either:
            // "login" → /api/users/login
            // "register" → /api/users/register
            //Sends user credentials to the backend API.
            dispatch(login(data))
            //This sends the backend response to Redux.
            //Inside authSlice: token is saved in Redux,user data is saved in Redux
            //so the entire app knows the user is loggedIn
            localStorage.setItem('token', data.token)
            //Redux state disappears on refresh localStorage does not.
            //On refresh, App.jsx reads this token and restores Redux state.
            toast.success(data.message)
        } catch (error) {
            toast(error?.response?.data?.message || error.message)
            //reads error message from backend if available
        }
    }
    //This function runs when the user clicks the Login / Sign up button:
    // <form onSubmit={handleSubmit}>


    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50'>
      <form onSubmit={handleSubmit} className="sm:w-[350px] w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white">
                <h1 className="text-gray-900 text-3xl mt-10 font-medium">{state === "login" ? "Login" : "Sign up"}</h1>
                <p className="text-gray-500 text-sm mt-2">Please {state} to continue</p>
                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <User2Icon size={16} color='#6B7280'/>
                        <input type="text" name="name" placeholder="Name" className="border-none outline-none ring-0" value={formData.name} onChange={handleChange} required />
                    </div>
                )}
                <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Mail size={13} color="#6B7280" />
                    <input type="email" name="email" placeholder="Email id" className="border-none outline-none ring-0" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                    <Lock size={13} color="#6B7280"/>
                    <input type="password" name="password" placeholder="Password" className="border-none outline-none ring-0" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="mt-4 text-left text-green-500">
                    <button className="text-sm" type="reset">Forget password?</button>
                </div>
                <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                    {state === "login" ? "Login" : "Sign up"}
                </button>
                <p onClick={() => setState(prev => prev === "login" ? "register" : "login")} className="text-gray-500 text-sm mt-3 mb-11">{state === "login" ? "Don't have an account?" : "Already have an account?"} <a href="#" className="text-green-500 hover:underline">click here</a></p>
            </form>
    </div>
  )
}

export default Login
