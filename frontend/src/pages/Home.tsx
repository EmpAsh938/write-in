import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import HomeBlogs from '../components/HomeBlogs';
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listPublicBlogs, loadMore, resetPages } from '../app/features/post/postSlice';


const Home = () => {
  const { posts, pages, rows } = useAppSelector(state => state.post);

  const dispatch = useAppDispatch();

    const handleLoadPages = () => {
        dispatch(loadMore());
    }
  useEffect(() => {
    dispatch(resetPages());
    dispatch(listPublicBlogs({pages,rows}));
  }, [dispatch,pages,rows])  
  return (
    <div className='bg-slate-100'>
      <Navbar />
      <main className='flex flex-col max-w-xl min-h-screen p-2 mx-auto gap-2'>
       {posts.length > 0 && (
        posts.map(item => {
          return (
            <HomeBlogs key={item._id} {...item}/>
          )
        })
       )}
       <Pagination handleClick={()=>handleLoadPages} />
      </main>
    </div>
  )
}

export default Home
