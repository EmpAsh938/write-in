import { useState, useEffect } from 'react';
import { loadMore, searchBlogs, resetPages } from '../app/features/post/postSlice';
import HomeBlogs from '../components/HomeBlogs';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';

const Search = () => {
    const { searchPosts, query, pages, rows } = useAppSelector(state => state.post);
    const [blogType, setBlogType] = useState<string>('');

    const dispatch = useAppDispatch();

    const handleClick = (e:React.MouseEvent<HTMLButtonElement>,type:string) => {
        document.querySelectorAll('.btn').forEach(btnelement => btnelement.classList.remove('active'));
        (e.target as Element).classList.add('active');
        setBlogType(type);
        dispatch(resetPages());
    }
    useEffect(() => {
        dispatch(searchBlogs({query,pages, rows, sort:!blogType ? 0 : blogType === 'asc' ? 1 : -1}));
        // if(blogType === 'asc') {
        //     dispatch(searchBlogs({query,pages, rows, sort:1}));
        // } else if(blogType === 'desc') {
        //     dispatch(searchBlogs({query,pages,rows,sort:-1}));
        // } else {
        //     dispatch(searchBlogs({query,pages,rows,sort:0}));
        // }
    }, [dispatch,pages,query,rows,blogType])
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
                {searchPosts.length > 0 && <Pagination handleClick={()=>dispatch(loadMore())} />}
            </section>
        </main>
    </>
  )
}

export default Search
