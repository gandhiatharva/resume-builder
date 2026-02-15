import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { dummyResumeData } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
//useState → store UI data
//useEffect → run code on page load
import { useSelector } from 'react-redux'
//Reads data from Redux store (auth info)
import api from '../configs/api'
//Axios instance to talk to backend
import toast from 'react-hot-toast'
// to  Show success / error messages
import pdfToText from 'react-pdftotext'
// the above is used to convert pdr resumes to plain Text

const Dashboard = () => {

  const {user, token} = useSelector(state => state.auth)
  //useSelector is a React-Redux hook that lets a component read data from the Redux store.

  const colors = ["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  // the above state is used when we click on the button of create resume then we 
  // should be re-directed to resume builder page where we can start building from start
  // we initialized to false so that pop-up is hidden and cannot be seen before 
  const [showUploadResume, setShowUploadResume] = useState(false)
  // this is used when we want to upload our exisitng resume on the website
  const [title, setTitle] = useState('')
  // to store the title that we will use while creating the resume for our project 
  const [resume, setResume] = useState(null)
  // resume will be stored in this state 
  const [editResumeId, setEditResumeId] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const loadAllResumes = async () =>{
    try {
      const { data } = await api.get('/api/users/resumes', {headers: { Authorization: token }})
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const createResume = async (event) => {
   try {
    event.preventDefault()
    // Stops the browser’s default behavior.
    const { data } = await api.post('/api/resumes/create', {title}, {headers: { Authorization: token }})
    //It comes from your api.js file 
    // we call api.post to tell backend to create a new resume with this title and the current loggedIn user 
    //You are creating a new resume, so:/api/resumes/create
    //await will pause exectuion until response comes, without this data can be undefined 
    setAllResumes([...allResumes, data.resume])
    setTitle('')
    setShowCreateResume(false)
    // after submitting the form we need to hide this pop up, i.e when we click on create
    //resume we get a form, and once we have clicked, we need to hide it again 
    navigate(`/app/builder/${data.resume._id}`)
    // once we have created the resume, then we need to re-direct users to the builde page
    // where they can build the reusme step by step
   } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
   }
  }


  //This runs when the user submits the Upload Resume form
  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const resumeText = await pdfToText(resume)
      //resume = uploaded PDF file pdfToText reads the PDF on the client, Extracts raw text
      const { data } = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: { Authorization: token }})
      // using this we send request to backend and await for its response, since we need to use ai in this we pass that route 
      //a) Sends request to backend URL → /api/ai/upload-resume ,Body → resume title + extracted text, Header → JWT token
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)


//     console.log("TITLE:", title);
// console.log("FILE:", resume);
// const resumeText = await pdfToText(resume);
// console.log("RESUME TEXT:", resumeText);
// console.log("RESUME LENGTH:", resumeText?.length);

  }
  //Upload an existing resume (PDF) → extract text → send it to AI 
  //→ AI converts it into structured resume data → create a new resume → redirect to builder

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      const {data} = await api.put(`/api/resumes/update`, {resumeId: editResumeId, resumeData: { title }}, {headers: { Authorization: token }})
      //This matches your backend route:So this request will:pass through JWT authentication and reach the updateResume controller
      // the resumeId and resumeData will  tells the backend: which resume to update (resumeId)what to update (title only)
      // In headers we send the JWT token for backend to verify user idenitty 
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume))
      setTitle('')
      setEditResumeId('')
      toast.success(data.message)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
     if(confirm){
      const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers: { Authorization: token }})
      setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
      toast.success(data.message)
     }
    //  using this we are removing the resume with this particularId and then showing the message 
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
     
  }

  useEffect(()=>{
    loadAllResumes()
  },[])

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>

        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, Joe Doe</p>

        <div className='flex gap-4 '>
            <button onClick={()=> setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
            </button>
{/* so when we click above button of create resume, it will show setShowCreateResume(this popup is for the form that ask just the title of the resume we then redirect to the builder page ) 
pop up  since we made it true and we will get it here  */}


            {/* on clicking the upload resume button, you make setShowUploadResume true and that will return the 
            upload resume form where we can upload it  */}
            <button onClick={()=> setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500  text-white rounded-full'/>
              <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload Existing</p>
            </button>
        </div>

      <hr className='border-slate-300 my-6 sm:w-[305px]' />
      
      {/* using this code we have displayed the list of resumes that the user has created 
      and we use map for that */}
      <div className="grid grid-cols-2 sm:flex flex-wrap gap-4 ">
        {allResumes.map((resume, index)=>{
          const baseColor = colors[index % colors.length];
          return (
            <button key={index} onClick={()=> navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer' style={{background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}40)`, borderColor: baseColor + '40'}}>
              {/* on clicking any of the resume which you have made, you will be redirected to its builder page  */}
              <FilePenLineIcon className="size-7 group-hover:scale-105 transition-all " style={{ color: baseColor }}/>
              <p className='text-sm group-hover:scale-105 transition-all  px-2 text-center' style={{ color: baseColor }}>{resume.title}</p>
              <p className='absolute bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center' style={{ color: baseColor + '90' }}>
                 Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                 {/* this gives us the current date, and we show it here */}
              </p>
              {/* we put stopProppgation in the below div because if it is not there if we click it 
              it will not open the edit resume open think but open the entire listing, but we want just to edit the title for which we have made this  */}
              <div onClick={e=> e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                <TrashIcon onClick={()=>deleteResume(resume._id)} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
                <PencilIcon onClick={()=> {setEditResumeId(resume._id); setTitle(resume.title)}} className="size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors"/>
                {/* when we click the pencil icon we want to edit this resume with this particular id 
                so we use the setEditResumeId and pass its id with it  */}
                {/* both these are from lucid react, they exist on its own and we inserted the two 
                functions that perform the changes accordinly on resume, also set  */}
              </div>
            </button>
          )
        })}
      </div>
        
        {/* when showCreateResume is true then only we need to display the form tag where we wil
        ask for title and then create that title and then redirect  */}
        {showCreateResume && (
          <form onSubmit={createResume} onClick={()=> setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Create a Resume</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create Resume</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowCreateResume(false); setTitle('')}}/>
              {/* // once we have entered the title and create a new resume, we need to clear 
              //this field so we make setTitle = "" empty string */}
            </div>
          </form>
        )
        }

        {/* here also we we click on update resume, i.e its entry is true then only 
        show this window otherwise we dont need to show this  */}
        {/* onClick={() => setShowUploadResume(false)} ➡️ Any click on the background closes the modal */}
        {/* when you click inside the model, then we stop propogation using stopPropgatio to the 
        parent otherwise it reached parent and makes it false which closes it  */}
        {showUploadResume && (
          <form onSubmit={uploadResume} onClick={()=> setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>
                <div>
                  <label htmlFor="resume-input" className="block text-sm text-slate-700">
                    Select resume file
                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                      {resume ? (
                        <p className='text-green-700'>{resume.name}</p>
                      ) : (
                        <>
                          <UploadCloud className='size-14 stroke-1'/>
                          <p>Upload resume</p>
                        </>
                      )}
                      {/* if resume given then display the title of the resume , otherwise using upload cloud we just display content */}
                    </div>
                  </label>
                  {/* this helps us take a pdf file for us to upload in the website, then we
                  add the resume in the setResume state where we can use it  */}
                  <input type="file" id='resume-input' accept='.pdf' hidden onChange={(e)=> setResume(e.target.files[0])}/>
                </div>
              <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
                {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white'/>}
                {isLoading ? 'Uploading...' : 'Upload Resume'}
                
                </button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setShowUploadResume(false); setTitle('')}}/>
            </div>
          </form>
        )
        }

        {editResumeId && (
          <form onSubmit={editTitle} onClick={()=> setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
              <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
              <input onChange={(e)=>setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required/>

              <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Update</button>
              <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={()=> {setEditResumeId(''); setTitle('')}}/>
            </div>
          </form>
        )
        }
      
      </div>
    </div>
  )
}

export default Dashboard



// what we want from a dashboard, here user can 
// See all their resumes
// Create a new resume
// Upload an existing PDF resume
// Edit resume title
// Delete a resume
// Open resume builder

