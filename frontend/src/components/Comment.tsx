import { useEffect, useState } from 'react';

import Reply from './Reply';
import UserImage from './UserImage';

import { CommentType }  from '../types/commentTypes';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { deleteComment, editComment, likeComment, listReply, newReply } from '../app/features/comment/commentSlice';

const Comment = ({  _id, body, author, reply}: CommentType) => {
    const { token } = useAppSelector(state => state.auth);
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
		<div className=''>
			{/* comments  */}
			<div className='flex items-center justify-start text-sm gap-2'>
				<UserImage profileImage={profileImage} fullname={fullname} height={40} width={40} />
				<h3>{fullname}</h3>
			</div>
            {
                isEditing ? (
                    <div>
                        <input type="text" value={editText} onChange={e=>setEditText(e.target.value)} />
                        <div>
                            <button onClick={() => setIsEditing(false)}>cancel</button>
                            <button onClick={handleEdit}>submit</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>{body}</p>
                        <div className='flex items-center justify-between text-sm'>
                            <button onClick={handleLike}>like</button>
                            <button onClick={()=>setIsReplyOpen(!isReplyOpen)}>reply</button>
                            <button onClick={() => setIsEditing(true)}>edit</button>
                            <button onClick={handleDelete}>delete</button>
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
