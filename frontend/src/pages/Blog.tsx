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
import { useState, useEffect, ChangeEvent, SyntheticEvent } from 'react';
import {
    useParams,
    useNavigate
} from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listSingleBlogs, saveBlog, resetSinglePost, updateBlog } from '../app/features/post/postSlice';
import { resetImageUrl, uploadFile } from '../app/features/upload/uploadSlice';
import { getTags } from '../utils/getTags';
import { Preview, Modal } from '../components';

const Blog = () => {
    const { id } = useParams();
    const { token } = useAppSelector(state => state.auth);
    const { singlePost } = useAppSelector(state => state.post);
    const { imageUrl } = useAppSelector(state => state.upload);
    const [isPreviewOn, setIsPreviewOn] = useState<boolean>(false);
    const [title, setTitle] = useState<string>('');
    const [markdown, setMarkdown] = useState<string>('');
    const [startSelect, setStartSelect] = useState<number>(0);
    const [endSelect, setEndSelect] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleCancelPost = () => {
        if(markdown || title || images.length > 0) {
            if(id) {
                dispatch(updateBlog({id,token,title:title || 'untitled',images,status:singlePost.status,markdown}));
            } else {
                dispatch(saveBlog({title:title || 'untitled',markdown,images,status:'draft',token}));
            }
        }
        dispatch(resetSinglePost());
        setTitle('');
        setMarkdown('');
        setIsPreviewOn(false);
        navigate('/');
    }

    const handleFinish = (type:'published'|'draft') => {
        if(id) {
            dispatch(updateBlog({id,token,title,images,status:type,markdown}));
        } else {
            dispatch(saveBlog({title,markdown,images,status:type,token}));
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
            if(tag !== 'image') {
                let firstPart = markdown.substring(0,startSelect);
                let midPart = markdown.substring(startSelect,endSelect);
                let secondPart = markdown.substring(endSelect,markdown.length);
                midPart = getTags(tag,midPart || 'text');
                setMarkdown(firstPart+midPart+secondPart);
            }
        }
    }

    const handleSelection = (e:SyntheticEvent<HTMLTextAreaElement>) => {
        setStartSelect(e.currentTarget.selectionStart);
        setEndSelect(e.currentTarget.selectionEnd);
    }



  useEffect(() => {
    if(id && typeof id === 'string') {
        dispatch(listSingleBlogs({id,token:token || ''}));
    }
  }, [id,dispatch,token])

  useEffect(() => {
    if(Object.keys(singlePost).length > 0) {
        setTitle(singlePost.title);
        setMarkdown(singlePost.markdown);
    }
  }, [singlePost])

  useEffect(() => {
      if(imageUrl) {
          setImages(prev => [...prev, imageUrl]);
          let firstPart = markdown.substring(0,startSelect);
          let midPart = markdown.substring(startSelect,endSelect);
          let secondPart = markdown.substring(endSelect,markdown.length);
          midPart = getTags('image',imageUrl);
          setMarkdown(firstPart+midPart+secondPart);
          dispatch(resetImageUrl());
        }
  }, [imageUrl, markdown, startSelect, endSelect, dispatch])

  useEffect(() => {
      if(!token) navigate('/');
  }, [token, navigate])
  return (
    <div className='min-h-screen bg-slate-100'>
    <main className='flex flex-col max-w-xl p-5 pb-40 mx-auto overflow-y-visible gap-8'>
    <section className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>Create Post</h2>
        <div className='flex gap-2'>
            <button onClick={()=>setIsPreviewOn(false)} className={isPreviewOn ? 'font-normal' : 'font-bold'}>Edit</button>
            <button onClick={()=>setIsPreviewOn(true)} className={isPreviewOn ? 'font-bold' : 'font-normal'}>Preview</button>
        </div>
    </section>
   {!isPreviewOn ? (
     <section className='flex flex-col p-3 border border-green-200 border-solid rounded-sm gap-5 bg-slate-100'>
     <div>
         <input type='text' value={title} onChange={e=>setTitle(e.target.value)} placeholder='Untitled' className='w-full text-4xl font-bold outline-none placeholder:text-slate-300' />
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
            <input onChange={handleUpload} className='absolute inset-0 hidden w-full h-full' type='file' id='upload' accept='image/*' />
         </button>
         <button onClick={handleTags} data-id='code'>
             <FaCode />
         </button>
     </div>
     {/* <div className='min-h-screen'> */}
     {/* </div> */}
         <textarea onChange={e=>setMarkdown(e.target.value)} onSelect={handleSelection} value={markdown} className='w-full min-h-[200px]  overflow-y-visible resize-none' placeholder='Write your post here...'>

         </textarea>

 </section>
   ) : (
    <section className='bg-white'>
        <h2 className='text-lg font-semibold'>Preview</h2>
        <Preview markdown={markdown} />
    </section>
   )}
    <section className='fixed bottom-0 left-0 flex justify-center w-full p-5 bg-white border border-green-200 border-solid gap-2'>
        <button onClick={() => handleFinish('published')} className='px-2 py-1 text-white bg-green-600 rounded-sm'>Publish</button>
        <button onClick={() => handleFinish('draft')} className='px-2 py-1 text-white bg-green-800 rounded-sm'>Save to Draft</button>
        <button onClick={()=>setIsModalOpen(true)} className='px-2 py-1 text-white bg-red-600 rounded-sm'>Cancel</button>
    </section>
    </main>
   { isModalOpen && <Modal message='Do you seriously want to exit from here? Your post will be saved as draft if there are any unsaved changes.' handleExecute={handleCancelPost} handleCancel={()=>setIsModalOpen(false)} /> } 
    </div>
  )
}

export default Blog
