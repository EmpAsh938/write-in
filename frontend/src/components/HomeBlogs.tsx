import { FaRegHeart } from 'react-icons/fa';

import UserImage from './UserImage';
import { PostsType } from '../types/postTypes';
import { getMonth } from '../utils/getMonth';
import { Link } from 'react-router-dom';

const HomeBlogs = ({_id, author, title, createdAt}:PostsType) => {
  
  return (
    <Link to={_id} className='border border-solid border-green-200 shadow-md rounded p-3 bg-white'>
      <div className='flex gap-2 items-center'>
        <UserImage profileImage='' fullname='Alex Chapman' />
        <h3>{author.fullname}</h3>
      </div>
      <div className='ml-[45px] flex flex-col gap-1'>
        <h2 className='text-2xl font-bold'>{title}</h2>
        <div className='flex flex-wrap gap-2 text-sm text-gray-600'>
          <span className='border border-solid border-gray-300 rounded-sm px-2 py-1'>#dev</span>
          <span className='border border-solid border-gray-300 rounded-sm px-2 py-1'>#javascript</span>
          <span className='border border-solid border-gray-300 rounded-sm px-2 py-1'>#tech</span>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        <button className=''>
          <FaRegHeart className='hover:fill-red-500'/>
        </button>
        <div>
          <span className='text-xs text-gray-500'>{getMonth(createdAt)}{" "}{new Date(createdAt).getFullYear()}</span>
        </div>
      </div>
    </Link>
  )
}

export default HomeBlogs