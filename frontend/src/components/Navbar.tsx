import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars } from 'react-icons/fa';

import UserImage from './UserImage';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { logoutUser } from '../app/features/auth/authSlice';
import { searchBlogs, searchString } from '../app/features/post/postSlice';
import NavModal from './NavModal';

const Navbar = () => {
  const { token, user } = useAppSelector(state => state.auth);
  const { query, pages, rows } = useAppSelector(state => state.post);
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [searchquery, setSearchQuery] = useState<string>(query);
  const [isActive, setIsActive] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSearch = (e:FormEvent | MouseEvent) => {
    e.preventDefault();
    if(searchquery.length > 2) {
      dispatch(searchString({search:searchquery}));
      dispatch(searchBlogs({query:searchquery,pages,rows,sort:0}));
      navigate('/search');
    }
  }
  const handleLogout = () => {
    dispatch(logoutUser());
  }
  return (
    <header className='border border-solid border-green-200 bg-white'>
      <nav className='max-w-7xl mx-auto flex justify-between items-center p-2'>
        <div>
          <Link to='/' className=''>
            <h2 className='w-fit py-3 px-2 rounded text-center bg-slate-900 text-white font-bold uppercase text-[.9rem]'>Write In</h2>
          </Link>
        </div>
        <form onSubmit={handleSearch} className='max-w-sm flex-1 flex border border-solid border-green-200 p-1 rounded-sm'>
          <input value={searchquery} onChange={e=>setSearchQuery(e.target.value)} type='text' placeholder='Search blogs here(>2 letters)' className='flex-1 outline-none'/>
          <button className='text-green-700 opacity-50' onClick={handleSearch}>
            <FaSearch />
          </button>
        </form>
        <div>
          <div className='hidden md:flex gap-2 items-center'>
          {token ? (
            <>
            <Link to='/new' className='bg-green-100 rounded-sm text-sm font-medium text-green-800 border border-solid border-green-500 px-4 py-2'>Create Post</Link>
              <div className='relative cursor-pointer' onClick={()=>setToggleModal(!toggleModal)}>
              <UserImage profileImage={user.profileImage} fullname={user.fullname} />
              {toggleModal && <div className='absolute w-[150px] top-[100%] right-[0%] text-sm bg-gray-100 border border-solid border-green-100 flex flex-col gap-2'>
                <div className='p-1'>
                  <h3 className='font-medium'>{user.fullname}</h3>
                  <p>{user.email}</p>
                </div>
                <div className='border border-x-0 py-2 border-solid border-green-300 flex flex-col gap-[2px]'>
                  <Link to='/profile' className='text-left'>Profile</Link>
                  <Link to='/dashboard' className='text-left'>Dashboard</Link>
                  <Link to='/bookmark' className='text-left'>Bookmark</Link>
                </div>
                <div>
                  <button onClick={handleLogout} className='font-medium hover:text-red-800'>Log Out</button>
                </div>
              </div>}
            </div>
          </>
          ) : (
            <>
              <Link to='/login' className='font-medium bg-green-500 text-sm text-white px-3 py-1 rounded'>Login</Link>
              <Link to='/register' className='font-medium bg-green-500 text-sm text-white px-3 py-1 rounded'>Register</Link>           
            </>
          )}
          </div>
          <div className='md:hidden px-2'>
            <FaBars className='text-lg' onClick={()=>setIsActive(true)} />
            {isActive && <NavModal setIsActive={setIsActive} handleLogout={handleLogout}/>}
          </div>
        </div>
        
 
</nav>

    </header>
  )
}

export default Navbar