import { useEffect, useState } from 'react';

import Reply from './Reply';
import UserImage from './UserImage';

import { CommentType }  from '../types/commentTypes';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { deleteComment, editComment, likeComment, listReply, newReply } from '../app/features/comment/commentSlice';

const Comment = ({  _id, body, author, likes, reply}: CommentType) => {
    const { token, user } = useAppSelector(state => state.auth);
    const { singlePost } = useAppSelector(state => state.post);
    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
    const [replyText, setReplyText] = useState<string>('');
    const [pages, setPages] = useState<number>(1);
    const [loadReply, setLoadReply] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editText, setEditText] = useState<string>(body);

    const { profileImage, fullname } = author;
    
    const dispatch = useAppDispatch();

    const handleLike = () => {
        if(_id && token) {
            dispatch(likeComment({id:_id,token}));
        } else {
            console.log('something\'s not right');
        }
    }
    const handleReply = () => {
        if(_id && token && replyText) {
            setLoadReply(true);
            dispatch(newReply({post_id:singlePost._id,comment_id:_id,token,body:replyText}));
        } else console.log('reply not working');
        setIsReplyOpen(false);
        setReplyText('');
    }

    const handleLoadReply = () => {
        setLoadReply(true);
        setPages(prev => prev+1);
    }


    const handleEdit = () => {
        setIsEditing(false);
        if(token && editText) {
            dispatch(editComment({token,id:_id,body:editText}));
        }
    }

    const handleDelete = () => {
        if(token && _id) {
            dispatch(deleteComment({token,id:_id}));
        }
    }
    useEffect(() => {
        if(_id) {
            dispatch(listReply({post_id:_id,pages,rows:5}));
        }
    }, [_id,pages,dispatch])
	return (
		<div className='max-w-lg'>
			{/* comments  */}
			<div className='flex items-center justify-start text-sm gap-2'>
				<UserImage profileImage={profileImage} fullname={fullname} height={40} width={40} />
				<h3>{fullname}</h3>
			</div>
            {
                isEditing ? (
                    <div>
                        <input type="text" value={editText} onChange={e=>setEditText(e.target.value)} />
                        <div className='flex items-center gap-2'>
                            <button onClick={() => setIsEditing(false)} className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>cancel</button>
                            <button onClick={handleEdit} className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>submit</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>{body}</p>
                        <div className='flex justify-start text-sm gap-4'>
                            <button onClick={handleLike} className='capitalize'>{likes.length} like</button>
                            <button onClick={()=>setIsReplyOpen(!isReplyOpen)} className='capitalize'>reply</button>
                            {user._id === author._id ? (
                            <>
                            <button onClick={() => setIsEditing(true)} className='capitalize'>edit</button>
                            <button onClick={handleDelete} className='capitalize'>delete</button>
                            </>) : null }
                        </div>
                    </div>
                )
            }
			{/* reply input */}
            {isReplyOpen && (
                    <div className='flex items-center justify-start gap-2'>
                        <input value={replyText} onChange={e=>setReplyText(e.target.value)} className='p-2 text-sm border border-gray-300 border-solid outline-none' type='text' placeholder='reply here' />
                        <button onClick={handleReply} className='px-2 py-1 text-white bg-green-500 rounded'>Reply</button>
                    </div>	
            )}
            {/* reply */}
			{(reply.length > 0 && loadReply) && (reply.map(item => {
                if(typeof item !== 'string') {
                    return (<Reply key={item._id} {...item} />)
                }
                return (<div key={item} className='hidden'></div>)
			}))}
            { reply.length > 0 && (<button className='px-2 py-1 my-2 text-sm text-white capitalize bg-green-700 rounded w-fit' onClick={handleLoadReply}>load more reply</button>) }
		</div> 
	)
}


export default Comment;
