import { loadMore } from '../app/features/post/postSlice';
import { useAppDispatch } from '../hooks/useReactRedux';

const Pagination = () => {
    const dispatch = useAppDispatch();

    const handleClick = () => {
       dispatch(loadMore());
    }
  return (
    <section className='flex items-center justify-center mt-2 xs:mt-0'>
        <button onClick={handleClick} className='border border-solid border-green-300 cursor-pointer text-sm font-semibold bg-white px-2 py-1 rounded-sm text-green-800'>
            Load More
        </button>
  </section>
  )
}

export default Pagination;