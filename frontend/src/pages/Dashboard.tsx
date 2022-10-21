import { useState, useEffect } from 'react';
import { MdOutlineDashboardCustomize } from 'react-icons/md';

import Card from '../components/Card';
import Navbar from '../components/Navbar';
import Blogcard from '../components/Blogcard';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listPrivate, resetPages, loadMore } from '../app/features/post/postSlice';
import Pagination from '../components/Pagination';
import {useNavigate} from 'react-router-dom';

const Dashboard = () => {
  const { token } = useAppSelector(state => state.auth);
  const { privatePosts, rows, pages } = useAppSelector(state => state.post);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(resetPages());
    if(token) {
      dispatch(listPrivate({pages,rows,token}));
    }
  }, [token,pages,dispatch])

  useEffect(() => {
      if(!token) navigate('/');
  }, [navigate,token])
 
  return (
    <div className='bg-slate-100'>
      <Navbar />
      <main className='flex flex-col max-w-3xl p-5 mx-auto gap-8 bg-green-50'>
        <section>
          <div className='flex items-center gap-2'>
              <MdOutlineDashboardCustomize className='text-3xl' />
              <h1 className='mb-2 text-2xl font-semibold'>Dashboard</h1>
          </div>
          <div className='flex items-center gap-4'>
            <Card count={1} title='Total likes'/>
            <Card count={1} title='Total views'/>
          </div>
        </section>
        <section>
          <h2 className='text-lg font-semibold'>Post</h2>
          <div className='flex flex-col py-2 border-t-2 border-green-200 border-solid gap-2'>
            {privatePosts.length > 0 ? (
              privatePosts.map(item => {
                return (
                  <Blogcard key={item._id} {...item}/>
                )
              })
            ) : (
              <p>No items to display.</p>
            )}
          </div>
        </section>
        <Pagination handleClick={()=>dispatch(loadMore())}/>
      </main>
    </div>
  )
}

export default Dashboard
