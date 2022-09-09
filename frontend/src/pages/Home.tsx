import { useEffect } from 'react';

import Navbar from '../components/Navbar';
import HomeBlogs from '../components/HomeBlogs';
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listPublicBlogs, resetPages } from '../app/features/post/postSlice';


const Home = () => {
  const { posts } = useAppSelector(state => state.post);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(resetPages());
    dispatch(listPublicBlogs({pages:1,rows:10}));
  }, [])  
  return (
    <div className='bg-slate-100'>
      <Navbar />
      <main className='max-w-xl min-h-screen mx-auto p-2 flex flex-col gap-2'>
       {posts.length > 0 && (
        posts.map(item => {
          return (
            <HomeBlogs key={item._id} {...item}/>
          )
        })
       )}
       <Pagination />
      </main>
    </div>
  )
}

export default Home