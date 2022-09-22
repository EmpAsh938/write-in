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
import React, { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import {
    useParams,
    useNavigate
} from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listSingleBlogs, saveBlog, resetSinglePost, updateBlog } from '../app/features/post/postSlice';
import { uploadFile } from '../app/features/upload/uploadSlice';


const Blog = () => {
    const { id } = useParams();
    const { token } = useAppSelector(state => state.auth);
    const { singlePost } = useAppSelector(state => state.post);
    const [isPreviewOn, setIsPreviewOn] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [markdown, setMarkdown] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    
    const handleTextArea = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        e.target.style.height = 'inherit';
        e.target.style.height = `${e.target.scrollHeight}px`;
        setMarkdown(e.target.value);
    }
    
    const handleCancel = () => {
        dispatch(resetSinglePost());
        setTitle('');
        setMarkdown('');
        setIsPreviewOn(false);
        navigate('/');
    }

    const handleFinish = (type:'published'|'draft') => {
        if(id) {
            dispatch(updateBlog({id,token,title,status:type,markdown}));
        } else {
            dispatch(saveBlog({title,markdown,status:type,token}));
        }
        navigate('/dashboard');
    }

    const handleUpload = (event:ChangeEvent<HTMLInputElement>) => {
        const fileList = event.target.files;
        if(token && fileList) {
            dispatch(uploadFile({file:fileList[0],token}));
        }
    }

    const handleTags = (e:SyntheticEvent<HTMLButtonElement>) => {
        if(e.target && e.currentTarget.dataset.id) {
            let tag = e.currentTarget.dataset.id;
            // console.log(tags.tag);
        }
    }

    const handleSelection = (e:SyntheticEvent<HTMLTextAreaElement>) => {
        console.log(e.currentTarget.selectionStart);
        console.log(e.currentTarget.selectionEnd);
    }


  useEffect(() => {
    // if(!token) navigate('/login');
    // eslint-disable-next-line
  }, [token])

  useEffect(() => {
    if(id && typeof id === 'string') {
        dispatch(listSingleBlogs(id));
    }
    // eslint-disable-next-line
  }, [id])

  useEffect(() => {
    if(Object.keys(singlePost).length > 0) {
        setTitle(singlePost.title);
        setMarkdown(singlePost.markdown);
    }
  }, [singlePost])
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
     <section className='flex flex-col gap-5 border border-solid border-green-200 rounded-sm p-3 bg-slate-100'>
     <div>
         <input type='text' value={title} onChange={e=>setTitle(e.target.value)} placeholder='Untitled' className='outline-none w-full text-4xl font-bold placeholder:text-slate-300' />
     </div>
     <div className='flex gap-4'>
         <button onClick={handleTags} data-id='header'>
             <FaHeading />
         </button>
         <button onClick={handleTags} data-id='italic'>
             <FaItalic />
         </button>
         <button onClick={handleTags} data-id='bold'>
             <FaBold />
         </button>
         <button onClick={handleTags} data-id='ul'>
             <MdFormatListBulleted />
         </button>
         <button onClick={handleTags} data-id='ol'>
             <MdFormatListNumbered />
         </button>
         <button onClick={handleTags} data-id='blockquote'>
             <GrBlockQuote />
         </button>
         <button onClick={handleTags} data-id='link'>
             <FaLink />
         </button>
         <button onClick={handleTags} className='relative cursor-pointer' data-id='image'>
            <label htmlFor='upload' className='cursor-pointer'>
             <FaImage />
            </label>
            <input onChange={handleUpload} className='hidden absolute inset-0 w-full h-full' type='file' id='upload' accept='image/*' />
         </button>
         <button onClick={handleTags} data-id='code'>
             <FaCode />
         </button>
     </div>
     {/* <div className='min-h-screen'> */}
     {/* </div> */}
         <textarea onChange={handleTextArea} onSelect={handleSelection} value={markdown} className='w-full resize-none' placeholder='Write your post here...'>

         </textarea>

 </section>
   ) : (
    <section className='bg-white'>
        <h2 className='font-semibold text-lg'>Preview</h2>
        {/* parse markdown */}
    </section>
   )}
    <section className='fixed bottom-0 left-0 w-full bg-white p-5 flex justify-center gap-2 border border-solid border-green-200'>
        <button onClick={() => handleFinish('published')} className='bg-green-600 text-white px-2 rounded-sm py-1'>Publish</button>
        <button onClick={() => handleFinish('draft')} className='bg-green-800 text-white px-2 rounded-sm py-1'>Save to Draft</button>
        <button onClick={handleCancel} className='bg-red-600 text-white px-2 rounded-sm py-1'>Cancel</button>
    </section>
    </main>
    
    </div>
  )
}

export default Blog