import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const AiTools = () => {
    const navigate = useNavigate()
    const { user } = useUser()

  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>Powerful AI Tools</h2>
        <p className='text-gray-500 max-w-lg mx-auto'>
          Everything you need to create, enhance and optimize your content with cutting-edge AI technology.
        </p>
      </div>

      <div className='flex flex-wrap mt-10 justify-center'>
        {AiToolsData.map((tool, index) => (
            <div 
                key={index} 
                className='p-8 m-4 w-full sm:max-w-xs rounded-2xl bg-[#FDFDFE] shadow-md border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer' 
                onClick={() => user && navigate(tool.path)}
            >
                  {/* Fixed 'background' typo and structured gradient with starting and ending colors */}
                  <tool.Icon 
                    className='w-12 h-12 p-3 text-white rounded-xl' 
                    style={{ background: `linear-gradient(to bottom, ${tool.bg?.from || '#3b82f6'}, ${tool.bg?.to})` }}
                  />
                  
                  {/* Fixed the broken closing h3 tag here */}
                  <h3 className='mt-6 mb-3 text-lg font-semibold text-gray-800'>{tool.title}</h3>
                  
                  <p className='text-gray-400 text-sm max-w-[95%]'>{tool.description}</p>
            </div>
        ))}
      </div>
    </div>
  )
}

export default AiTools
