import { useEffect } from 'react'
import { FaRegBookmark } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { bookmarkLists, loadMore } from '../app/features/post/postSlice'
import HomeBlogs from '../components/HomeBlogs'
import Navbar from '../components/Navbar'
import Pagination from '../components/Pagination'
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux'
import { useUser } from '../hooks/useUser'

const Bookmarks = () => {

    const isAuthorized = useUser();
    const { token } = useAppSelector(state => state.auth);
    const { bookmarkPosts, pages, rows } = useAppSelector(state => state.post);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    if(!isAuthorized) {
        navigate('/login');
    }

    useEffect(() => {
        if(token) {
            dispatch(bookmarkLists({pages,rows,token}));
        } else {
            navigate('/login');
        }
        // eslint-disable-next-line
    }, [pages,rows,token])
  return (
   <>
    <Navbar />
    <main className='max-w-3xl mx-auto p-4'>
        <section>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-start'>
                    <FaRegBookmark className='text-3xl' />
                    <h1 className='text-2xl text-gray-800 font-semibold'>Bookmarks</h1>
                </div>
                <div className='flex items-center justify-start pb-1 border-b border-solid border-green-300'>
                    <p className='text-lg'>Your reading list</p>
                </div>
            </div>
            <div>
                <div className='flex flex-col gap-4 p-2'>

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
                        {bookmarkPosts.length > 0 && <Pagination />}
                    </div>
            </div>
        </section>
    </main>
   </>
  )
}

export default Bookmarks