import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// this Browser router is used for routing of pages correctly comes directly from react router dom class
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import { store } from './app/store.js'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>
      {/* It injects the Redux store into React’s context. */}
      {/* After this: Any component can access Redux,Any component can dispatch actions
          Any component can read global state  and Without this → Redux is invisible to React.*/}
      <App />
    </Provider>
  </BrowserRouter>,
)

//main.jsx is the entry point of your React app.
// This is the first React code that runs.
// Anything you wrap here becomes available everywhere.

// we do not keep this in app.jsx because if app.jsx re-renders then, we would need to re-create store,
//it will break architecture and be a bad practice 