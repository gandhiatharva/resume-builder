import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { dummyResumeData } from '../assets/assets'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2Icon, Sparkles, User } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfessionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import toast from 'react-hot-toast'

const ResumeBuilder = () => {

  const { resumeId } = useParams()
  const {token} = useSelector(state => state.auth)

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
  })
  // the above is the intial value using which we initialize it 

  //supoose we have an an resume in url then we open that directly 
  const loadExistingResume = async () => {
   try {
    const {data} = await api.get('/api/resumes/get/' + resumeId, {headers: { Authorization: token }})
    if(data.resume){
      setResumeData(data.resume)
      document.title = data.resume.title;
    }
   } catch (error) {    
    console.log(error.message)
   }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false);

  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]
  // this is used because we will place only those section in the preview which have been filled by the user 

  useEffect(()=>{
    loadExistingResume()
  },[])
  // whenever components gets excuted it will load the existing function 


  // this is used to make public and private resume 
  //Declared async because it makes an API call (await api.put
  const changeResumeVisibility = async () => {
    try {
        //Creates a FormData object Used when sending multipart/form data (often for files or mixed data)
       const formData = new FormData()
       formData.append("resumeId", resumeId)
       //Sends the resume’s unique ID to the backend Backend uses this to identify which resume to update
       formData.append("resumeData", JSON.stringify({public: !resumeData.public}))

       const {data} = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})
       //Authorization header → proves user is logged in
      //Sends the update request to backend 
      //PUT → update existing resource
      //  if public make it private, if private make it public 
       setResumeData({...resumeData, public: !resumeData.public})
       //Updates frontend state to match the backend
        // Copies all existing resume data
        // Flips only the public field
      // Triggers UI re-render (button, label, etc.)
       toast.success(data.message)
    } catch (error) {
      console.error("Error saving resume:", error)
    }
  }

  const handleShare = () =>{
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId;
    // if share is true we will show the url which the user can share 
    if(navigator.share){
      navigator.share({url: resumeUrl, text: "My Resume", })
    }else{
      alert('Share not supported on this browser.')
    }
  }

  //standard way to download by using print function 
  const downloadResume = ()=>{
    window.print();
  }


const saveResume = async () => {
  try {
    let updatedResumeData = structuredClone(resumeData)

    // remove image from updatedResumeData
    if(typeof resumeData.personal_info.image === 'object'){
      delete updatedResumeData.personal_info.image
    }

    const formData = new FormData();
    formData.append("resumeId", resumeId)
    formData.append('resumeData', JSON.stringify(updatedResumeData))
    removeBackground && formData.append("removeBackground", "yes");
    typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

    const { data } = await api.put('/api/resumes/update', formData, {headers: { Authorization: token }})

    setResumeData(data.resume)
    toast.success(data.message)
  } catch (error) {
    console.error("Error saving resume:", error)
  }
}

  return (
    <div>

      {/* when you press the backbutton, you want to go back to dashboard so we do this */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className="size-4"/> Back to Dashboard
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>
        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel - Form */}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/* progress bar using activeSectionIndex */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200"/>
              <hr className="absolute top-0 left-0  h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000" style={{width: `${activeSectionIndex * 100 / (sections.length - 1)}%`}}/>

              {/* Section Navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">

                <div className='flex items-center gap-2'>
                  {/* these two below are used to select the template of the resume and 
                  also the color which we have choosen, we have created two seperate 
                  components for this which we can use  */}
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=> setResumeData(prev => ({...prev, template}))}/>
                  <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev => ({...prev, accent_color: color}))}/>
                  {/* we keep the previous data as it is just updated the new color using ... operator  */}
                </div>
                {/* for above we have written below  */}
                {/* This code passes the current template and accent_color from resumeData 
                to child components, and when the user selects a new value, the child calls 
                onChange to update the parent state. Inside setResumeData, ...prev first 
                copies the entire existing resumeData object, and then the specific field
                (template or accent_color) is replaced with the new value, ensuring only that
                 property changes while the rest of the state remains untouched. */}

                <div className='flex items-center'>
                  {/* when you have added a section then only we show the prevButtoon */}
                  {activeSectionIndex !== 0 && (
                    <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.max(prevIndex - 1, 0))} className='flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all' disabled={activeSectionIndex === 0}>
                      <ChevronLeft className="size-4"/> Previous
                    </button>
                  )}
                  <button onClick={()=> setActiveSectionIndex((prevIndex)=> Math.min(prevIndex + 1, sections.length - 1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length - 1}>
                      Next <ChevronRight className="size-4"/>
                    </button>
                </div>
              </div>

              {/* Form Content */}
              {/*  Based on activeSection.id, it decides which form component to show 
              Only one form is rendered at a time  Each form edits a specific part of resumeData*/}
              {/* If the condition is true → React renders the component  If the condition is false → React renders nothing */}
              <div className='space-y-6'>
                  {activeSection.id === 'personal' && (
                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev => ({...prev, personal_info: data }))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                  )}
                  {/* if it is true then show this  */}
                  {activeSection.id === 'summary' && (
                    <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data)=> setResumeData(prev=> ({...prev, professional_summary: data}))} setResumeData={setResumeData}/>
                  )}
                  {activeSection.id === 'experience' && (
                    <ExperienceForm data={resumeData.experience} onChange={(data)=> setResumeData(prev=> ({...prev, experience: data}))}/>
                  )}
{/* so the things is that we when active section is education we call educationForm and pass current education to it 
it if it changes, we keep everything else same and update the education portion of it   */}
                  {activeSection.id === 'education' && (
                    <EducationForm data={resumeData.education} onChange={(data)=> setResumeData(prev=> ({...prev, education: data}))}/>
                  )}
                  {activeSection.id === 'projects' && (
                    <ProjectForm data={resumeData.project} onChange={(data)=> setResumeData(prev=> ({...prev, project: data}))}/>
                  )}
                  {activeSection.id === 'skills' && (
                    <SkillsForm data={resumeData.skills} onChange={(data)=> setResumeData(prev=> ({...prev, skills: data}))}/>
                  )}
                  
              </div>
              {/* we will have this save changes  */}
              <button onClick={()=> {toast.promise(saveResume, {loading: 'Saving...'})}} className='bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm'>
                Save Changes
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          {/* we use this for sharing and downloading the message  */}
          <div className='lg:col-span-7 max-lg:mt-6'>
              <div className='relative w-full'>
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>
                    {resumeData.public && (
                      // if public then we can share the resume therefor display that otherwise we will not display it 
                      <button onClick={handleShare} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors'>
                        <Share2Icon className='size-4'/> Share
                      </button>
                    )}
                    <button onClick={changeResumeVisibility} className='flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 ring-purple-300 rounded-lg hover:ring transition-colors'>
                      {/* if public we can show the ehye icon  */}
                      {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                      {resumeData.public ? 'Public' : 'Private'}
                    </button>
                    <button onClick={downloadResume} className='flex items-center gap-2 px-6 py-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors'>
                      <DownloadIcon className='size-4'/> Download
                    </button>
                </div>
              </div>
                
                {/* here we have called resume Preview which we have made and we called it 
                and we pass the four field that needed to be passes to show the preview  */}
              <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default ResumeBuilder

// in the resume builder page, we have a left section where we go step by step and ask
// for different things to be filled in resume 
//inside the left view we also have form content 
// on the right side we have the preview where we can see what we have made until now 
//

