import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../components/Card';
import Navbar from '../components/Navbar';
import Blogcard from '../components/Blogcard';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listPrivate, resetPages } from '../app/features/post/postSlice';
import Pagination from '../components/Pagination';

const Dashboard = () => {
  const { token } = useAppSelector(state => state.auth);
  const { privatePosts, pages, rows } = useAppSelector(state => state.post);


  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(!token) navigate('/login');
    // eslint-disable-next-line
  }, [token])
  
  useEffect(() => {
    dispatch(resetPages());
    if(token) {
      dispatch(listPrivate({pages,rows,token}));
    }
    // eslint-disable-next-line
  }, [])
 
  return (
    <div className='bg-slate-100'>
      <Navbar />
      <main className='max-w-3xl mx-auto p-5 flex flex-col gap-8 bg-green-50'>
        <section>
          <h1 className='font-semibold text-2xl mb-2'>Dashboard</h1>
          <div className='flex items-center gap-4'>
            <Card count={1} title='Total likes'/>
            <Card count={1} title='Total views'/>
          </div>
        </section>
        <section>
          <h2 className='font-semibold text-lg'>Post</h2>
          <div className='border-t-2 border-solid border-green-200 py-2 flex flex-col gap-2'>
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
        <Pagination />
      </main>
    </div>
  )
}

export default Dashboard