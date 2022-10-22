import { Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';

import { PostsType } from '../types/postTypes';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { removeBlog, removePrivatePost } from '../app/features/post/postSlice';

const Blogcard = ({ _id, title, status }:PostsType) => {
  const { token } = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  const handleDelete = (id:string) => {
    dispatch(removeBlog({id,token}));
    dispatch(removePrivatePost({id}));
  }
  return (
    <div className='flex items-center justify-between p-2 bg-white border border-green-200 border-solid rounded'>
      <h2 className='text-lg font-medium'>{title}</h2>
      <div className=''>
          <span className={`p-2 text-sm font-bold text-white uppercase ${status === 'published' ? 'bg-green-500' : 'bg-orange-500'}`}>{status}</span>
      </div>
      <div className='flex text-sm gap-2'>
        <Link to={`/edit/${_id}`} className='text-green-600 w-fit'>
          <FaEdit className='text-lg' />
        </Link>
        <button className='text-red-600 w-fit' onClick={()=>handleDelete(_id)}>
          <FaTrash className='text-lg' />
        </button>
      </div>
    </div>
  )
}

export default Blogcard
