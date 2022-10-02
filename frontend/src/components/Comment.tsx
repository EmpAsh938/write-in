import { useState } from 'react';

import Reply from './Reply';
import UserImage from './UserImage';

import { CommentType }  from '../types/postTypes';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { likeComment, newReply } from '../app/features/comment/commentSlice';

const Comment = ({  _id, body, author, reply}: CommentType) => {
    const { token } = useAppSelector(state => state.auth);
    const { singlePost } = useAppSelector(state => state.post);
    const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
    const [replyText, setReplyText] = useState<string>('');
    const { profileImage, fullname } = author;
    
    const dispatch = useAppDispatch();

    const handleLike = () => {
        if(_id && token) {
            dispatch(likeComment({id:_id,token}));
        }
    }
    const handleReply = () => {
        if(_id && token && replyText) {
            dispatch(newReply({post_id:singlePost._id,comment_id:_id,token,body:replyText}));
        }
    }
	return (
		<div className=''>
			{/* comments  */}
			<div className='flex items-center justify-start text-sm gap-2'>
				<UserImage profileImage={profileImage} fullname={fullname} />
				<h3>{fullname}</h3>
			</div>
			<p>{body}</p>
			<div className='flex items-center justify-start text-sm gap-2'>
				<button onClick={handleLike}>like</button>
				<button onClick={()=>setIsReplyOpen(!isReplyOpen)}>reply</button>
			</div>
			{/* reply */}
            {isReplyOpen && (
                    <div className='flex items-center justify-start gap-2'>
                        <input value={replyText} onChange={e=>setReplyText(e.target.value)} className='p-2 text-sm border border-gray-300 border-solid outline-none' type='text' placeholder='reply here' />
                        <button onClick={handleReply} className='px-2 py-1 text-white bg-green-500 rounded'>Reply</button>
                    </div>	
            )}

			{reply.length > 0 && (reply.map(item => {
				return (<Reply key={item._id} />)
			}))}
		</div> 
	)
}


export default Comment;
