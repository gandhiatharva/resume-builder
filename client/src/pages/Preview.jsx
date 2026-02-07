import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeftIcon } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {
  const { resumeId } = useParams()
  //useParams reads route parameters from React Router

  const [isLoading, setIsLoading] = useState(true)
  //isLoading → controls loader vs content
  const [resumeData, setResumeData] = useState(null)
  //if null, nothing loaded, not found, if object, resume exists in that case


  //Fetches the resume data from the backend using the resume ID.
  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId)
      //Sends a GET request to backend
      // Endpoint means:
      // “Give me the public resume with this ID”
      // Backend returns resume data if: Resume exists or Resume is public
      setResumeData(data.resume)
      //Saves the fetched resume into state Triggers re-render
    } catch (error) {
      console.log(error.message);
      // this will handle error like resume is private, or resume does not exist or network issue 
    }finally{
      //Runs no matter what Stops showing loader Prevents infinite loading screen
      setIsLoading(false)
    }
  }

  useEffect(()=>{
    loadResume()
    // Runs once when component mounts also equivalent to “When this page opens, fetch the resume.”
  },[])
  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='py-4 bg-white'/>
      </div>
    </div>
  ) : (
    <div>
      {/* if is loading, we will show the loader otherwise we will show resume not found  */}
      {isLoading ? <Loader /> : (
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-6xl text-slate-400 font-medium'>Resume not found</p>
          <a href="/" className='mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 flex items-center transition-colors'>
            <ArrowLeftIcon className='mr-2 size-4'/>
            go to home page
          </a>
        </div>
      )}
    </div>
  )
}

export default Preview

// opne when someone calls /view/:resumeId
//Read the resumeId from the URL
// Fetch the public resume data from the backend
// Show:
// a resume preview if found
// a loader while fetching
//an error screen if not found
// this is used if someone click on the link for you resume, he should be able to see 
//so we use this for that so we see what is being printed   