import { loadMore } from '../app/features/post/postSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';

const Pagination = () => {
    const { pages } = useAppSelector(state => state.post);

    const dispatch = useAppDispatch();

    const handleClick = (type:string) => {
        if(type === 'prev') {
            if(pages > 1) {
                dispatch(loadMore({rows: pages-1}));
            }
        }
        if(type === 'next') {
            dispatch(loadMore({rows: pages+1}));
        }
    }
  return (
    <section className='flex items-center justify-center mt-2 xs:mt-0'>
        <button onClick={()=>handleClick('prev')} className='border border-solid border-green-300 cursor-pointer text-sm font-semibold bg-white px-2 py-1 rounded-sm text-green-800'>
            Load More
        </button>
  </section>
  )
}

export default Pagination;