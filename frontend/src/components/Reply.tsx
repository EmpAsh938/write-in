import {likeComment} from '../app/features/comment/commentSlice';
import {useAppSelector, useAppDispatch} from '../hooks/useReactRedux'
import {ReplyType} from '../types/postTypes'
import UserImage from './UserImage'

const Reply = ({ _id, author, body }:ReplyType) => {
    const { token } = useAppSelector(state => state.auth);
    const { profileImage, fullname } = author;
    
    const dispatch = useAppDispatch();

    const handleLikeReply = () => {
        if(token && _id) {
           dispatch(likeComment({id:_id,token})); 
        }
    }
  return (
	<div className='pl-4'>
        <div className='flex items-center justify-start text-sm gap-2'>
            <UserImage profileImage={profileImage} fullname={fullname} />
            <h3>{fullname}</h3>
        </div>
        <p>{body}</p>
        <div className='flex items-center justify-start text-sm gap-2'>
            <button onClick={handleLikeReply}>like</button>
        </div>
        	
    </div>
  )
}

export default Reply
