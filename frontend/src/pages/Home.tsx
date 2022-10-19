import { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import HomeBlogs from '../components/HomeBlogs';
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { listPublicBlogs, resetPages } from '../app/features/post/postSlice';


const Home = () => {
  const { posts } = useAppSelector(state => state.post);
  const [pages, setPages] = useState<number>(1);

  const dispatch = useAppDispatch();

    const handleLoadPages = () => {
    setPages(prev => prev+1);
    }
  useEffect(() => {
    dispatch(resetPages());
    dispatch(listPublicBlogs({pages,rows:10}));
  }, [dispatch,pages])  
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
       <Pagination />
      </main>
    </div>
  )
}

export default Home
