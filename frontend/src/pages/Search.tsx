import { useState } from 'react';
import { searchBlogs } from '../app/features/post/postSlice';
import HomeBlogs from '../components/HomeBlogs';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';

const Search = () => {
    const { searchPosts, query } = useAppSelector(state => state.post);
    const [pages, setPages] = useState<number>(1);

    const dispatch = useAppDispatch();

    const handleClick = (e:React.MouseEvent<HTMLButtonElement>,type:string) => {
        document.querySelectorAll('.btn').forEach(btnelement => btnelement.classList.remove('active'));
        (e.target as Element).classList.add('active');
        if(type === 'asc') {
            dispatch(searchBlogs({query,pages, rows:10, sort:1}));
        } else if(type === 'desc') {
            dispatch(searchBlogs({query,pages,rows:10,sort:-1}));
        } else {
            dispatch(searchBlogs({query,pages,rows:10,sort:0}));
        }
    }
  return (
    <>
        <Navbar />
        <main className='max-w-4xl p-5 mx-auto'>
            <section className='flex items-center justify-between'>
                <h3 className='text-2xl'>Search for '{query}'</h3>
                <div className='flex text-sm gap-2'>
                    <button onClick={(e)=>handleClick(e,'relevant')} className='btn active'>Most Relevant</button>
                    <button onClick={(e)=>handleClick(e,'desc')} className='btn'>Latest</button>
                    <button onClick={(e)=>handleClick(e,'asc')} className='btn'>Oldest</button>
                </div>
            </section>
            <section className='flex flex-col p-2 gap-4'>
                {searchPosts.length > 0 ? (
                    searchPosts.map(item => {
                        return (
                            <HomeBlogs key={item._id} {...item} />
                        )
                    })
                ) : (
                    <p>no search results found.</p>
                )}
                {searchPosts.length > 0 && <Pagination handleClick={()=>{}} />}
            </section>
        </main>
    </>
  )
}

export default Search
