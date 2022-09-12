import { marked } from 'marked';
import { useEffect } from 'react';
import * as DOMPurify from 'dompurify';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegHeart, FaRegBookmark } from 'react-icons/fa';

import { getMonth } from '../utils/getMonth';
import UserImage from '../components/UserImage';
import { likeBlog, listSingleBlogs } from '../app/features/post/postSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { bookmarkPost } from '../app/features/auth/authSlice';


const SingleBlog = () => {
    const { id } = useParams();
    const { token } = useAppSelector(state => state.auth);
    const { singlePost } = useAppSelector(state => state.post);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();


  const handleLike = () => {
    if(token && id) {
        dispatch(likeBlog({id,token}));
    }
  }

  const handleBookmark = () => {
    if(token && id) {
        dispatch(bookmarkPost({id,token}));
    }
  }

    useEffect(() => {
        if(!id) {
            navigate('/');
            return;
        }
        dispatch(listSingleBlogs(id));
        // eslint-disable-next-line
    }, [id])
    if(Object.keys(singlePost).length === 0) {
        return <p>No items to fetch</p>
    }
    marked.use({
        pedantic: false,
        gfm: true,
        breaks: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      });
    const { title, markdown, createdAt, author } = singlePost;
    return (
        <main className='p-10'>
            <aside className='fixed h-full w-fit p-3 bottom-0 left-0 bg-white'>
                <section>
                    <button className='' onClick={handleLike}>
                        <FaRegHeart />
                        <span>Like</span>
                    </button>
                    <button onClick={handleBookmark}>
                        <FaRegBookmark />
                        <span>Bookmark</span>
                    </button>
                </section>
            </aside>
            <section className='max-w-5xl min-h-screen mx-auto p-4 border border-solid border-green-300 rounded flex flex-col gap-3'>
                <div className='flex items-center justify-start gap-2'>
                    <div>
                        <UserImage profileImage={author.profileImage} fullname={author.fullname} />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h3 className='font-medium'>{author.fullname}</h3>
                        <span className='text-slate-500 text-sm'>{`Created at ${getMonth(createdAt)} ${new Date(createdAt).getDate()} ${new Date(createdAt).getFullYear()}`}</span>
                    </div>
                </div>
                <div>
                    <h1 className='text-4xl font-bold text-left'>
                    {title}
                    </h1>
                </div>
                <article className='text-lg font-light text-slate-700 markdown-css' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(markdown))}}>
                </article>
            </section>
        </main>
  )
}

export default SingleBlog;