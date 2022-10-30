import { FaRegHeart } from 'react-icons/fa';

import UserImage from './UserImage';
import { PostsType } from '../types/postTypes';
import { getMonth } from '../utils/getMonth';
import { Link, useNavigate } from 'react-router-dom';

const HomeBlogs = ({_id, author, title, images, createdAt}:PostsType) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${_id}`);
    }
  
  return (
    <div onClick={handleClick} className='p-3 bg-white border border-green-200 border-solid rounded shadow-md'>
    <div className='flex'>
    <div>
      <div className='flex items-center gap-2'>
        <UserImage profileImage={author.profileImage} fullname={author.fullname} width={45} height={45} />
        <h3 className='capitalize'><Link to={`/user/${author._id}`}>{author.fullname}</Link></h3>
      </div>
      <div className='ml-[45px] flex flex-col gap-1'>
        <h2 className='text-2xl font-bold'>{title}</h2>
{/*        <div className='flex flex-wrap text-sm text-gray-600 gap-2'>
          <span className='px-2 py-1 border border-gray-300 border-solid rounded-sm'>#dev</span>
          <span className='px-2 py-1 border border-gray-300 border-solid rounded-sm'>#javascript</span>
          <span className='px-2 py-1 border border-gray-300 border-solid rounded-sm'>#tech</span>
        </div>
*/}
      </div>
  </div>
    {images.length > 0 && (<img src={images[0]} alt=""/>)}
    </div>
      <div className='flex items-center justify-between'>
        <button className=''>
          <FaRegHeart className='hover:fill-red-500'/>
        </button>
        <div>
          <span className='text-xs text-gray-500'>{getMonth(createdAt)}{" "}{new Date(createdAt).getFullYear()}</span>
        </div>
      </div>
    </div>
  )
}

export default HomeBlogs
