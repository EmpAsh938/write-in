import { Link, useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';

import ErrorMessage from '../components/ErrorMessage';
import { RegisterAuthState } from '../types/authTypes';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { registerUser } from '../app/features/auth/authSlice';

const Register = () => {
  const [userDetails, setUserDetails] = useState<RegisterAuthState>({
    username: '',
    email: '',
    fullname: '',
    password: ''
  })
  const { token, notifications: {message: error} } = useAppSelector(state => state.auth);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();


  const handleChange = (event:ChangeEvent<HTMLInputElement>) => {

    setUserDetails(prev => {
      return {
        ...prev,
        [event.target.name]: event.target.value
      }
    })
  }

  const handleSubmit = (event:MouseEvent | FormEvent) => {
    event.preventDefault();
    dispatch(registerUser(userDetails));
    setUserDetails({username:'',email:'',fullname:'',password:''})
  }

  useEffect(() => {
    if(token) navigate('/');
    // eslint-disable-next-line
  }, [token])
  
  return (
    <main className='min-h-screen grid place-items-center bg-green-500 p-2'>
      <section className='bg-slate-100 rounded p-4 max-w-sm w-full flex flex-col gap-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold
            '>Welcome to <span className='text-green-900'>Write In</span></h1>
            <p className='text-slate-500 text-sm italic'>A place where you can write blogs and share on public</p>
          </div>
          <div>

          <form onSubmit={handleSubmit} className='flex flex-col gap-3 px-5'>
              <h2 className='text-center text-2xl font-semibold'>New to <span className='text-green-900'>Write In</span></h2>
              <div className='flex flex-col gap-1'>
                <label 
                className='text-base text-gray-800'
                htmlFor="fullname">Enter your fullname</label>
                <input 
                value={userDetails.fullname}
                onChange={handleChange}
                className='outline-none px-2 py-1 rounded border border-solid border-green-50 focus:border-green-800'
                type="text" name='fullname' id="fullname" placeholder='Fullname'/>
              </div>
              <div className='flex flex-col gap-1'>
                <label 
                className='text-base text-gray-800'
                htmlFor="username">Choose your username</label>
                <input 
                value={userDetails.username}
                onChange={handleChange}
                className='outline-none px-2 py-1 rounded border border-solid border-green-50 focus:border-green-800'
                type="text" name="username" id="username" placeholder='Username'/>
              </div>
              <div className='flex flex-col gap-1'>
                <label 
                className='text-base text-gray-800'
                htmlFor="email">Enter your email</label>
                <input 
                value={userDetails.email}
                onChange={handleChange}
                className='outline-none px-2 py-1 rounded border border-solid border-green-50 focus:border-green-800'
                type="email" id="email" name='email' placeholder='Email'/>
              </div>
              <div className='flex flex-col gap-1'>
                <label 
                className='text-base text-gray-800'
                htmlFor="password">Password</label>
                <input 
                value={userDetails.password}
                onChange={handleChange}
                className='outline-none px-2 py-1 rounded border border-solid border-green-50 focus:border-green-800'
                type="password" id="password" name='password' placeholder='Password'/>
              </div>
              {/* <div className='flex flex-col gap-1'>
                <label 
                className='text-base text-gray-800'
                htmlFor="cpassword">Confirm Password</label>
                <input 
                className='outline-none px-2 py-1 rounded border border-solid border-green-50 focus:border-green-800'
                type="password" name='cpassword' id="cpassword" placeholder='Retype Password'/>
              </div> */}
              <div className='flex'>
                <button  onClick={handleSubmit} className='flex-1 rounded py-3 text-center bg-green-600 text-white font-medium'>Register</button>
              </div>
          </form>
          <div className='mt-2'>
              <div className='text-center text-sm'>
                <p>Already have an account?<Link to='/login' className='ml-1 font-semibold'>Login</Link></p>
              </div>
          </div>
          </div>
      </section>
      {error && <ErrorMessage />}
    </main>
  )
}

export default Register;