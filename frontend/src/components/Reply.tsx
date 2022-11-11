import { useState } from 'react';
import {deleteReply, editReply, likeReply} from '../app/features/comment/commentSlice';
import {useAppSelector, useAppDispatch} from '../hooks/useReactRedux'
import {ReplyType} from '../types/commentTypes'
import UserImage from './UserImage'

const Reply = ({ _id, author, body, likes }:ReplyType) => {
    const { token } = useAppSelector(state => state.auth);
    const { profileImage, fullname } = author;
    
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editInput, setEditInput] = useState<string>(body);
    
    const dispatch = useAppDispatch();

    const handleLikeReply = () => {
        if(token && _id) {
           dispatch(likeReply({id:_id,token})); 
        }
    }

    const handleEdit = () => {
      setIsEditing(false);
      if(token && editInput) {
        dispatch(editReply({token,body:editInput,reply_id:_id}));
      }
    }


    const handleDelete = () => {
      if(token && _id) {
        dispatch(deleteReply({token,id:_id}));
      }
    }
  return (
	  <div className='pl-4'>
      <div className='flex items-center justify-start text-sm gap-2'>
          <UserImage profileImage={profileImage} fullname={fullname} height={30} width={30} />
          <h3>{fullname}</h3>
      </div>
      {isEditing ? 
        (
          <div>
            <input type="text" value={editInput} onChange={e=>setEditInput(e.target.value)}/>
            <div>
              <button onClick={()=>setIsEditing(false)}>cancel</button>
              <button onClick={handleEdit}>submit</button>
            </div>
          </div>
        ) : 
        (
          <div>
            <p>{body}</p>
            <div className='flex items-center justify-between text-sm'>
              <button onClick={handleLikeReply}>{likes.length} like</button>
              <button onClick={() => setIsEditing(true)}>edit</button>
              <button onClick={handleDelete}>delete</button>
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Reply
