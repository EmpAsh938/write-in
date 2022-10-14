import { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

import UserImage from './UserImage';
import { useAppSelector } from '../hooks/useReactRedux';

type Props = {
    setIsActive: Dispatch<SetStateAction<boolean>>;
    handleLogout: () => void;
}

const NavModal = ({ setIsActive, handleLogout }: Props) => {
    const { token, user } = useAppSelector(state => state.auth);

    
  return (
    <aside className='fixed top-0 right-0 w-[300px] h-screen p-4 bg-green-500 text-white flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
            <Link to='/' >
                <h2 className='px-2 py-4 text-sm uppercase bg-black rounded'>write in</h2>
            </Link>
            <FaPlus className='text-3xl text-red-700 bg-transparent cursor-pointer rotate-45' onClick={()=>setIsActive(false)}/>
        </div>
        <div className='flex flex-col gap-2'>
        {token ? (
            <>
                <Link to='/new' className=''>Create Post</Link>
                <UserImage profileImage={user.profileImage} fullname={user.fullname} height={45} width={45} />
                <div className='p-1 flex flex-col gap-[2px]'>
                  <h3 className='font-medium'>{user.fullname}</h3>
                  <p>{user.email}</p>
                </div>
                <div className='flex flex-col gap-[2px]'>
                  <Link to='/profile' className='text-left'>Profile</Link>
                  <Link to='/dashboard' className='text-left'>Dashboard</Link>
                  <Link to='/bookmark' className='text-left'>Bookmark</Link>
                </div>
                <button onClick={handleLogout} className='font-medium hover:text-red-800'>Log Out</button>
          </>
          ) : (
            <>
              <Link to='/login' className='w-fit'>Login</Link>
              <Link to='/register' className='w-fit'>Register</Link>           
            </>
          )}
        </div>
    </aside>
  )
}

export default NavModal
