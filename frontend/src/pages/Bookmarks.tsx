import { useEffect } from 'react'
import { FaRegBookmark } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { bookmarkLists, loadMore } from '../app/features/post/postSlice'
import { HomeBlogs, Pagination, Navbar } from '../components'
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux'

const Bookmarks = () => {
    const { token } = useAppSelector(state => state.auth);
    const { bookmarkPosts, pages, rows } = useAppSelector(state => state.post);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handlePages = () => {
        dispatch(loadMore());
    }

    useEffect(() => {
        if(token) {
            dispatch(bookmarkLists({pages,rows,token}));
        } else {
            navigate('/login');
        }
    }, [dispatch,navigate,pages,rows,token])
  useEffect(() => {
      if(!token) navigate('/');
  }, [token,navigate])
  return (
   <>
    <Navbar />
    <main className='max-w-3xl p-4 mx-auto'>
        <section>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-start'>
                    <FaRegBookmark className='text-3xl' />
                    <h1 className='text-2xl font-semibold text-gray-800'>Bookmarks</h1>
                </div>
                <div className='flex items-center justify-start pb-1 border-b border-green-300 border-solid'>
                    <p className='text-lg'>Your reading list</p>
                </div>
            </div>
            <div>
                <div className='flex flex-col p-2 gap-4'>

                {
                    bookmarkPosts.length > 0 ? (bookmarkPosts.map(item => {
                        return (
                            <HomeBlogs key={item._id} {...item}/>
                        )
                    })) : (
                        <p>no items to display</p>
                        )
                    }
                
                </div>
                    <div>
                        {bookmarkPosts.length > 0 && <Pagination handleClick={handlePages}/>}
                    </div>
            </div>
        </section>
    </main>
   </>
  )
}

export default Bookmarks
