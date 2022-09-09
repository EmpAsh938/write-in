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
    <div className='flex justify-between items-center p-2 border border-solid border-green-200 rounded bg-white'>
      <h2 className='font-medium text-lg'>{title}</h2>
      <div className='flex gap-2 text-sm'>
        <Link to={`/edit/${_id}`} className='w-fit text-green-600'>
          <FaEdit />
        </Link>
        <button className='w-fit text-red-600' onClick={()=>handleDelete(_id)}>
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default Blogcard