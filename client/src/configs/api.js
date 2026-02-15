import axios from 'axios'

  
const api = axios.create({
    
    baseURL: import.meta.env.VITE_API_URL,

});

// const api = axios.create({
//     baseURL: `${import.meta.env.VITE_API_URL}/api`,
//   });


export default api
//api.js is a central configuration file for making HTTP requests from your React app to your backend.
//api.js is a pre-configured helper that your frontend uses to talk to the backend.
//Instead of writing fetch or axios setup again and again, you do it once here.
//// baseURL: import.meta.env.VITE_BASE_URL,

