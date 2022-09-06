import {
    FaBold,
    FaCode,
    FaLink,
    FaImage,
    FaItalic,
    FaHeading,
} from 'react-icons/fa';
import {
    MdFormatListBulleted,
    MdFormatListNumbered,
} from 'react-icons/md';
import {
    GrBlockQuote
} from 'react-icons/gr';
import React, { useState, useEffect } from 'react';
import {
    useNavigate
} from 'react-router-dom';

import { useAppSelector } from '../hooks/useReactRedux';


const Blog = () => {
    const { token } = useAppSelector(state => state.auth);
    const [isPreviewOn, setIsPreviewOn] = useState<boolean>(false);

    const navigate = useNavigate();
    
    const handleTextArea = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = `${e.target.scrollHeight}px`;
    }
    
    const handleCancel = () => {
        setIsPreviewOn(false);
        navigate('/');
    }


  useEffect(() => {
    if(!token) navigate('/login');
    // eslint-disable-next-line
  }, [token])
  return (
    <div className='bg-slate-100 min-h-screen'>
    <main className='overflow-y-visible max-w-xl mx-auto p-5 pb-40 flex flex-col gap-8'>
    <section className='flex items-center justify-between'>
        <h2 className='font-semibold text-lg'>Create Post</h2>
        <div className='flex gap-2'>
            <button onClick={()=>setIsPreviewOn(false)} className={isPreviewOn ? 'font-normal' : 'font-bold'}>Edit</button>
            <button onClick={()=>setIsPreviewOn(true)} className={isPreviewOn ? 'font-bold' : 'font-normal'}>Preview</button>
        </div>
    </section>
   {!isPreviewOn ? (
     <section className='overflow-x-hidden flex flex-col gap-5 border border-solid border-green-200 rounded-sm p-3 bg-slate-100'>
     <div>
         <input type='text' placeholder='Untitled' className='outline-none text-3xl font-bold placeholder:text-slate-300' />
     </div>
     <div className='flex gap-2'>
         <button>
             <FaHeading />
         </button>
         <button>
             <FaItalic />
         </button>
         <button>
             <FaBold />
         </button>
         <button>
             <MdFormatListBulleted />
         </button>
         <button>
             <MdFormatListNumbered />
         </button>
         <button>
             <GrBlockQuote />
         </button>
         <button>
             <FaLink />
         </button>
         <button>
             <FaImage />
         </button>
         <button>
             <FaCode />
         </button>
     </div>
     {/* <div className='min-h-screen'> */}
     {/* </div> */}
         <textarea onChange={handleTextArea} className='w-full resize-none' placeholder='Write your post here...'>

         </textarea>

 </section>
   ) : (
    <section className='bg-white'>
        <h2 className='font-semibold text-lg'>Preview</h2>
        {/* parse markdown */}
    </section>
   )}
    <section className='fixed bottom-0 left-0 w-full bg-white p-5 flex justify-center gap-2 border border-solid border-green-200'>
        <button className='bg-green-600 text-white px-2 rounded-sm py-1'>Publish</button>
        <button className='bg-green-800 text-white px-2 rounded-sm py-1'>Save to Draft</button>
        <button onClick={handleCancel} className='bg-red-600 text-white px-2 rounded-sm py-1'>Cancel</button>
    </section>
    </main>
    </div>
  )
}

export default Blog