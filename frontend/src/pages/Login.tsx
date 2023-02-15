import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../hooks/useReactRedux';
import { loginUser } from '../app/features/auth/authSlice';

const Login = () => {
  const { token } = useAppSelector(state => state.auth);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSignIn = (event:FormEvent) => {
    event.preventDefault();
    dispatch(loginUser({email, password}));
    setPassword('');
  }
 // commenting inorder to make previous deployment successful

  useEffect(() => {
    if(token) navigate('/');
  }, [token,navigate])
  
  return (
    <main className='min-h-screen grid place-items-center bg-green-500 p-2'>
      <section className='bg-slate-100 rounded p-4 max-w-sm w-full flex flex-col gap-8'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold
            '>Welcome to <span className='text-green-900'>Write In</span></h1>
            <p className='text-gray-500 text-sm italic'>A place where you can write blogs and share on public</p>
          </div>
          <div>

          <form onSubmit={handleSignIn} className='flex flex-col gap-3 px-5'>
              <h2 className='text-center text-2xl font-semibold'>Have an Account Already</h2>
              <div className='flex flex-col gap-1'>
                <label 
                className='text-base text-gray-800'
                htmlFor="email">Enter your email</label>
                <input
                value={email}
                onChange={e=>setEmail(e.target.value)} 
                className='outline-none px-2 py-1 rounded border border-solid border-green-100 focus:border-green-800'
                type="email" id="email" placeholder='Email'/>
              </div>
              <div className='flex flex-col gap-1'>
                <label 
                className='text-base text-gray-800'
                htmlFor="password">Password</label>
                <input 
                value={password}
                onChange={e=>setPassword(e.target.value)}
                className='outline-none px-2 py-1 rounded border border-solid border-green-100 focus:border-green-800'
                type="password" id="password" placeholder='Password'/>
              </div>
              <div className='flex'>
                <button onClick={handleSignIn} className='flex-1 rounded py-3 text-center bg-green-600 text-white font-medium'>Login</button>
              </div>
          </form>
          <div className='mt-2'>
              <div className='text-center text-sm'>
                <p>Don't have an account?<Link to='/register' className='ml-1 font-semibold'>Register</Link></p>
              </div>
          </div>
          </div>
      </section>
    </main>
  )
}

export default Login;
