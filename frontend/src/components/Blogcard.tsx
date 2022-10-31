import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';

import Modal from './Modal';

import { PostsType } from '../types/postTypes';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { removeBlog, removePrivatePost } from '../app/features/post/postSlice';

const Blogcard = ({ _id, title, status }:PostsType) => {
  const { token } = useAppSelector(state => state.auth);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleDelete = (id:string) => {
    dispatch(removeBlog({id,token}));
    dispatch(removePrivatePost({id}));
  }
  return (
    <div className='flex items-center justify-between p-2 bg-white border border-green-200 border-solid rounded'>
    { isModalOpen && <Modal message='It will delete your post permanently and retrieving it will be impossible.' handleExecute={ ()=>handleDelete(_id)} handleCancel={()=>setIsModalOpen(false)} />}    
      <h2 className='text-lg font-medium'>{title}</h2>
      <div className=''>
          <span className={`p-2 text-sm font-bold text-white uppercase ${status === 'published' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>{status}</span>
      </div>
      <div className='flex text-sm gap-2'>
        <Link to={`/edit/${_id}`} className='text-green-600 w-fit'>
          <FaEdit className='text-lg' />
        </Link>
        <button className='text-red-600 w-fit' onClick={()=>setIsModalOpen(true)}>
          <FaTrash className='text-lg' />
        </button>
      </div>
    </div>
  )
}

export default Blogcard
