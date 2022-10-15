import { marked } from 'marked';
import { useEffect, useState } from 'react';
import * as DOMPurify from 'dompurify';
import { useNavigate, useParams } from 'react-router-dom';
import { FaRegHeart, FaRegBookmark } from 'react-icons/fa';

import Navbar from '../components/Navbar';
import Comment from '../components/Comment';
import UserImage from '../components/UserImage';

import { getMonth } from '../utils/getMonth';
import { bookmarkPost } from '../app/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { likeBlog, listSingleBlogs } from '../app/features/post/postSlice';
import { listComment, newComment } from '../app/features/comment/commentSlice';


const SingleBlog = () => {
    const { id } = useParams();
    const { token, user, } = useAppSelector(state => state.auth);
    const { singlePost, bookmarkPosts } = useAppSelector(state => state.post);
    const { comments } = useAppSelector(state => state.comment);

    const [commentText, setCommentText] = useState<string>('');

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

  const handleSaveComment = () => {
    if(commentText && token && id) {
        dispatch(newComment({
            token,
            body: commentText,
            post_id: id
        }));
        setCommentText('');
    }
  }

    useEffect(() => {
        if(id){
            dispatch(listSingleBlogs(id));
            dispatch(listComment({
                pages: 1, 
                rows: 5,
                post_id: id,
            }));
        }
    }, [id,dispatch,token,navigate])
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
    const { title, markdown, createdAt, author, likes } = singlePost;
    return (
        <>
        <Navbar />
        <main className='p-10'>
            <section className='flex flex-col max-w-5xl min-h-screen p-4 mx-auto border border-green-300 border-solid rounded gap-3'>
                <div className='flex items-center justify-between'>
                    <div>
                        <div>
                            <UserImage profileImage={author.profileImage} fullname={author.fullname} width={45} height={45} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <h3 className='font-medium'>{author.fullname}</h3>
                            <span className='text-sm text-slate-500'>{`Created at ${getMonth(createdAt)} ${new Date(createdAt).getDate()} ${new Date(createdAt).getFullYear()}`}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <button className='relative' onClick={handleLike}>
                            <FaRegHeart className={`${likes.includes(user._id) ? 'text-red-500' : ''}`} />
                            {likes.length > 0 && <span className='absolute w-[25px] h-[25px] text-xs font-semibold text-center top-[-50%] left-[-130%] border border-solid border-gray-800 p-1 bg-white rounded-full'>{likes.length}</span>}
                        </button>
                        <button onClick={handleBookmark} className={`${bookmarkPosts.some(item => item._id === id) ? 'bg-gray-300' : ''}`}>
                            <FaRegBookmark />
                        </button>
                    </div>
                </div>
                <div>
                    <h1 className='text-4xl font-bold text-left'>
                    {title}
                    </h1>
                </div>
                <article className='text-lg font-light text-slate-700 markdown-css' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(markdown))}}>
                </article>
                <article className='flex flex-col gap-4'>
                    <div>
                        <h2 className='text-lg'>Comments</h2>
                    </div>
                    <div className='flex items-center justify-start gap-2'>
                        <UserImage profileImage={author.profileImage} fullname={author.fullname} width={40} height={40} />
                        <input value={commentText} onChange={e=>setCommentText(e.target.value)} className='p-2 text-sm border border-gray-300 border-solid outline-none' type='text' placeholder='type here' />
                        <button onClick={handleSaveComment} className='px-2 py-1 text-white bg-green-500 rounded'>Comment</button>
                    </div>
                    <div className=''>
                       {comments.length === 0 ? (<p>no comments to display</p>) : (
                        comments.map(item => {
                            return (<Comment key={item._id} {...item} />)})
                       )}
                    </div>
                </article>
            </section>
        </main>
        </>

  )
}

export default SingleBlog;
