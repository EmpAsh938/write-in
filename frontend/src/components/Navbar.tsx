import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

import UserImage from './UserImage';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { logoutUser } from '../app/features/auth/authSlice';

const Navbar = () => {
  const { token, user } = useAppSelector(state => state.auth);
  const [toggleModal, setToggleModal] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  }
  return (
    <header className='border border-solid border-green-200 bg-white'>
      <nav className='max-w-7xl mx-auto flex justify-between items-center py-2'>
        <div>
          <Link to='/' className=''>
            <h2 className='w-fit py-4 px-2 rounded text-center bg-slate-900 text-green-500 font-bold uppercase'>Write In</h2>
          </Link>
        </div>
        <form className='max-w-sm flex-1 flex border border-solid border-green-200 p-1 rounded-sm'>
          <input type='text' placeholder='Search blogs here' className='flex-1 outline-none'/>
          <button className='text-green-700 opacity-50'>
            <FaSearch />
          </button>
        </form>
        <div className='flex gap-2 items-center'>
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
        
 
</nav>

    </header>
  )
}

export default Navbar