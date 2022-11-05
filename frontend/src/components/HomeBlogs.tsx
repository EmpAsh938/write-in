import { FaRegHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

import UserImage from './UserImage';
import { PostsType } from '../types/postTypes';
import { getMonth } from '../utils/getMonth';

const HomeBlogs = ({_id, author, title, images, createdAt, likes}:PostsType) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${_id}`);
    }
  
  return (
    <div className='p-3 bg-white border border-green-200 border-solid rounded shadow-md'>
    <div className='flex'>
        <div>
              <div className='flex items-center gap-2'>
                <UserImage profileImage={author.profileImage} fullname={author.fullname} width={45} height={45} />
                <h3 className='capitalize cursor-pointer'><Link to={`/user/${author._id}`}>{author.fullname}</Link></h3>
              </div>
              <div onClick={handleClick}className='ml-[45px] flex flex-col gap-1 cursor-pointer'>
                <h2 className='text-2xl font-bold'>{title}</h2>
              </div>
      </div>
    {images.length > 0 && (<img className='max-w-[200px] object-contain' src={images[0]} alt=""/>)}
    </div>
      <div onClick={handleClick} className='flex items-center justify-between cursor-pointer'>
        <button className='flex flex-row-reverse items-center gap-1'>
          <FaRegHeart className='hover:fill-red-500'/>
          {likes.length > 0 ? <span className='text-sm text-gray-800'>{likes.length}</span> : null }
        </button>
        <div>
          <span className='text-xs text-gray-500'>{getMonth(createdAt)}{" "}{new Date(createdAt).getFullYear()}</span>
        </div>
      </div>
    </div>
  )
}

export default HomeBlogs
