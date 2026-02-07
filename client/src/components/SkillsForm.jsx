import { Plus, Sparkles, X } from 'lucide-react'
import React, { useState } from 'react'

const SkillsForm = ({ data, onChange }) => {
    // This stores: What the user is currently typing It’s temporary and only relevant to this component
    const [newSkill, setNewSkill] = useState("")

     const addSkill = () => {
      // trim is used to remove extra whitespaces or empty and includes is used to prevent 
      //duplicate skills
        if(newSkill.trim() && !data.includes(newSkill.trim())){
            onChange([...data, newSkill.trim()])
            //Copies all existing skills Appends the new skill at the end 
            //Creates a new array (important for React)
            // then onChange sends the newSKill to the parent and parent updates skills
            setNewSkill("")
        }
     }

      const removeSkill = (indexToRemove)=>{
        //Loops over all skills Keeps everything except the one at indexToRemove
        //Remove one skill at a specific position from the skills array.
        //filter goes through the entire arrays index and check if you want to keep or not
        //_ → the skill value (we don’t need it here) index → position of the skill in the array
        //_ is just a normal variable name, no speacial meaning, it can be taken as anything 
        // so it signifies -> “Yes, a value is passed here, but I don’t care about it.”
        // since we only need index we can pass this and it can go without any issue 
        onChange(data.filter((_, index)=> index !== indexToRemove))
      }

      const handleKeyPress = (e)=>{
        if(e.key === "Enter"){
            e.preventDefault();
            addSkill();
        }
      }
  return (
    <div className='space-y-4'>
      <div>
        <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'> Skills </h3>
        <p className='text-sm text-gray-500'> Add your technical and soft skills </p>
      </div>

      <div className="flex gap-2">
            <input type="text" placeholder="Enter a skill (e.g., JavaScript, Project Management)" className='flex-1 px-3 py-2 text-sm'
            onChange={(e)=>setNewSkill(e.target.value)}
            value={newSkill}
            onKeyDown={handleKeyPress}
            />
            {/* if we have not added any skill, then we will now show this add button, 
            we will only show this if and when a skill has been added   */}
            <button onClick={addSkill} disabled={!newSkill.trim} className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                <Plus className="size-4"/> Add
            </button>
      </div>

      {/* if we have the skills we will need to show those skills and we map around them 
      and we will also but a cross button using lucid react (X) which we will show there  */}
      {data.length > 0 ? (
        <div className='flex flex-wrap gap-2'>
            {data.map((skill, index)=>(
                <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                    {skill}
                    <button onClick={()=> removeSkill(index)} className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors">
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
        </div>
      )
    :
    (
      // if we have not added any kind of skills i.e data.length == 0, then we will show 
      //this that no skills has been added,
        <div className='text-center py-6 text-gray-500'>
            <Sparkles className="w-10 h-10 mx-auto mb-2 text-gray-300"/>
            <p>No skills added yet.</p>
            <p className="text-sm">Add your technical and soft skills above.</p>
        </div>
    )}

    <div className='bg-blue-50 p-3 rounded-lg'>
        <p className='text-sm text-blue-800'><strong>Tip:</strong> Add 8-12 relevant skills. Include both technical skills (programming languages, tools) and soft skills (leadership, communication).</p>
    </div>
    </div>
  )
}

export default SkillsForm

// Does not own the skills data
// Receives:
// data → array of skills (from parent)
// onChange → function to update skills in parent state
// Owns only temporary input state (newSkill)