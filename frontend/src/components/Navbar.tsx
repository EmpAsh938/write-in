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
    <header className='bg-white border border-green-200 border-solid'>
      <nav className='flex items-center gap-10 p-2 mx-auto max-w-7xl'>
        <div className='hidden sm:block'>
          <Link to='/' className=''>
            <h2 className='w-fit py-3 px-2 rounded text-center bg-slate-900 text-white font-bold uppercase text-[.9rem]'>Write In</h2>
          </Link>
        </div>
        <div className='flex-1 flex items-center gap-20'>
        <form onSubmit={handleSearch} className='flex-1 flex p-1 pr-2 border border-green-200 border-solid rounded-sm'>
          <input value={searchquery} onChange={e=>setSearchQuery(e.target.value)} type='text' placeholder="Search blogs here(>2 letters)" className='flex-1 outline-none pl-4'/>
          <button className='text-green-700 opacity-50' onClick={handleSearch}>
            <FaSearch />
          </button>
        </form>
        <div className=''>
          <div className='items-center hidden md:flex gap-2'>
          {token ? (
            <>
            <Link to='/new' className='px-4 py-2 text-sm font-medium text-green-800 bg-green-100 border border-green-500 border-solid rounded-sm'>Create Post</Link>
              <div className='relative cursor-pointer' onClick={()=>setToggleModal(!toggleModal)}>
              <UserImage profileImage={user.profileImage} fullname={user.fullname} width={45} height={45} />
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
              <Link to='/login' className='px-3 py-1 text-sm font-medium text-white bg-green-500 rounded'>Login</Link>
              <Link to='/register' className='px-3 py-1 text-sm font-medium text-white bg-green-500 rounded'>Register</Link>           
            </>
          )}
          </div>
          <div className='px-2 md:hidden'>
            <FaBars className='text-lg' onClick={()=>setIsActive(true)} />
            {isActive && <NavModal setIsActive={setIsActive} handleLogout={handleLogout}/>}
          </div>
        </div>
        
</div> 
</nav>

    </header>
  )
}

export default Navbar
