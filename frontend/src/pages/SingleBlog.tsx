import { marked } from 'marked';
import { useEffect, useState } from 'react';
import * as DOMPurify from 'dompurify';
import { useNavigate, useParams } from 'react-router-dom';
import { GoHeart, GoBookmark } from 'react-icons/go';

import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import Comment from '../components/Comment';
import UserImage from '../components/UserImage';

import { getMonth } from '../utils/getMonth';
import { numberCount } from '../utils/numberCount'
import { bookmarkPost } from '../app/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { likeBlog, listSingleBlogs, resetSinglePost } from '../app/features/post/postSlice';
import { listComment, newComment } from '../app/features/comment/commentSlice';


const SingleBlog = () => {
    const { id } = useParams();
    const { token, user } = useAppSelector(state => state.auth);
    const { singlePost } = useAppSelector(state => state.post);
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

  const handleLinkNavigate = (author_id:string) => {
        navigate(`/user/${author_id}`);
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
        dispatch(resetSinglePost());
        if(id){
            dispatch(listSingleBlogs({id,token:token||''}));
            dispatch(listComment({
                pages: 1, 
                rows: 5,
                post_id: id,
            }));
        }

        return () => {
            dispatch(resetSinglePost());
        }
    }, [id,dispatch,token,navigate])
    if(Object.keys(singlePost).length === 0) {
        return (<Loader />) 
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
        <main className='p-[5%] bg-slate-100'>
            <section className='flex flex-col max-w-5xl min-h-screen p-5 mx-auto border border-green-300 border-solid rounded gap-3 shadow-xl bg-white hover:shadow-2xl  '>
                <div className='flex items-center justify-between mx-[2%] my-[3%]'>
                    <div onClick={() => handleLinkNavigate(author._id)} className='flex items-center gap-2 cursor-pointer'>
                        <div>
                            <UserImage profileImage={author.profileImage} fullname={author.fullname} width={45} height={45} />
                        </div>
                        <div className='flex flex-col'>
                            <h3 className='font-medium capitalize leading-3'>{author.fullname}</h3>
                            <span className='text-sm text-slate-500'>{`Created at ${getMonth(createdAt)} ${new Date(createdAt).getDate()} ${new Date(createdAt).getFullYear()}`}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-lg'>
                        <button className='relative' onClick={handleLike}>
                            <GoHeart className={`${(token && likes.includes(user._id)) ? 'text-red-500' : 'text-red-300'}`} />
                            {likes.length > 0 && <span className='absolute w-[25px] h-[25px] text-xs font-semibold text-center top-[-50%] left-[-130%] border border-solid border-gray-800 p-1 bg-white rounded-full'>{numberCount(likes.length)}</span>}
                        </button>
                        <button onClick={handleBookmark} className={`${(token && user.bookmarks.includes(id||'')) ? 'text-green-500': 'text-green-300'}`}>
                            <GoBookmark />
                        </button>
                    </div>
                </div>
                <div>
                    <h1 className='text-4xl font-bold text-left text-black leading-9 mx-[3%] mb-2'>
                    {title}
                    </h1>
                </div>
                <article className='text-lg font-normal markdown-css mx-[5%] leading-9' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(marked.parse(markdown))}}>
                </article>
                <article className='flex flex-col my-3'>
                    <div className='my-0'>
                        <h2 className='text-lg font-bold'>Comments</h2>
                    </div>
                    {token ? (<div className='flex items-center justify-start gap-2 flex-wrap mb-3'>
                        <UserImage profileImage={author.profileImage} fullname={author.fullname} width={40} height={40} />
                        <input value={commentText} onChange={e=>setCommentText(e.target.value)} className='p-2 text-sm border border-gray-300 border-solid outline-none' type='text' placeholder='type here' />
                        <button onClick={handleSaveComment} className='px-2 py-1 text-white bg-green-500 rounded'>Comment</button>
                    </div>): (
                        <div className='mb-2'>Please <a href='/login' className='font-bold text-green-700 underline'>Login</a> to comment, reply and like</div>
                    )}
                    <div className="m-5">
                       {comments.length === 0 ? (<p className="text-slate-500">no comments to display</p>) : (
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
