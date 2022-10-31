import {useNavigate} from 'react-router-dom';
import { MouseEvent, useEffect, useState } from 'react';
import { MdOutlineDashboardCustomize } from 'react-icons/md';

import Card from '../components/Card';
import Navbar from '../components/Navbar';
import Blogcard from '../components/Blogcard';
import Pagination from '../components/Pagination';

import { tabHandler } from '../utils/tabHandler';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listPrivate, resetPages, loadMore, resetPrivatePost, getBlogAnalytic } from '../app/features/post/postSlice';

const Dashboard = () => {
  const { token, user } = useAppSelector(state => state.auth);
  const { privatePosts, rows, pages, views, likes, totals } = useAppSelector(state => state.post);
  const [blogType, setBlogType] = useState<string>('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleTabs = (event:MouseEvent<HTMLButtonElement>,type:string) => {
      tabHandler(event,'dashboard-tab');
      setBlogType(type);
      dispatch(resetPages());
      dispatch(resetPrivatePost());
  }
  
  useEffect(() => {
    if(token) {
      dispatch(listPrivate({type:blogType,pages,rows,token}));
    }
  }, [token,blogType,pages,rows,dispatch])

  useEffect(() => {
      if(!token) navigate('/');
      if(token) dispatch(getBlogAnalytic({token}));
  }, [navigate,token,dispatch])
 
  return (
    <div className='bg-slate-100'>
      <Navbar />
      <main className='flex flex-col max-w-3xl p-5 mx-auto gap-8 bg-green-50'>
        <section>
          <div className='flex items-center gap-2'>
              <MdOutlineDashboardCustomize className='text-3xl' />
              <h1 className='mb-2 text-2xl font-semibold'>Dashboard</h1>
          </div>
          <div className='flex items-center flex-wrap gap-4'>
            <Card count={likes} title='Total likes'/>
            <Card count={views} title='Total views'/>
            <Card count={user.followers.length} title='Total followers'/>
            <Card count={totals} title='Total Blogs'/>
          </div>
        </section>
        <section>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Post</h2>
          <div className='flex items-center gap-2'>
              <button onClick={(e)=>handleTabs(e,'')} className='dashboard-tab active'>All</button>
              <button onClick={(e)=>handleTabs(e,'published')} className='dashboard-tab'>Published</button>
              <button onClick={(e)=>handleTabs(e,'draft')} className='dashboard-tab'>Drafts</button>
          </div>
        </div>
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
