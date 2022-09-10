import { searchBlogs } from '../app/features/post/postSlice';
import HomeBlogs from '../components/HomeBlogs';
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';

const Search = () => {
    const { searchPosts, query, pages, rows } = useAppSelector(state => state.post);

    const dispatch = useAppDispatch();

    const handleClick = (e:React.MouseEvent<HTMLButtonElement>,type:string) => {
        document.querySelectorAll('.btn').forEach(btnelement => btnelement.classList.remove('active'));
        (e.target as Element).classList.add('active');
        if(type === 'asc') {
            dispatch(searchBlogs({query,pages, rows, sort:1}));
        } else if(type === 'desc') {
            dispatch(searchBlogs({query,pages,rows,sort:-1}));
        } else {
            dispatch(searchBlogs({query,pages,rows,sort:0}));
        }
    }
  return (
    <>
        <Navbar />
        <main className='max-w-4xl mx-auto p-5'>
            <section className='flex items-center justify-between'>
                <h3 className='text-2xl'>Search for {query || "''"}</h3>
                <div className='flex gap-2 text-sm'>
                    <button onClick={(e)=>handleClick(e,'relevant')} className='btn active'>Most Relevant</button>
                    <button onClick={(e)=>handleClick(e,'desc')} className='btn'>Latest</button>
                    <button onClick={(e)=>handleClick(e,'asc')} className='btn'>Oldest</button>
                </div>
            </section>
            <section className='flex flex-col gap-4 p-2'>
                {searchPosts.length > 0 ? (
                    searchPosts.map(item => {
                        return (
                            <HomeBlogs key={item._id} {...item} />
                        )
                    })
                ) : (
                    <p>no search results found.</p>
                )}
                {searchPosts.length > 0 && <Pagination />}
            </section>
        </main>
    </>
  )
}

export default Search