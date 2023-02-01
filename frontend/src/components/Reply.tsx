import { useState } from 'react';
import {deleteReply, editReply, likeReply} from '../app/features/comment/commentSlice';
import {useAppSelector, useAppDispatch} from '../hooks/useReactRedux'
import {ReplyType} from '../types/commentTypes'
import UserImage from './UserImage'

const Reply = ({ _id, author, body, likes }:ReplyType) => {
    const { token, user } = useAppSelector(state => state.auth);
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
              <button onClick={()=>setIsEditing(false)} className='focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>cancel</button>
              <button onClick={handleEdit} className='focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-900'>submit</button>
            </div>
          </div>
        ) : 
        (
          <div>
            <p>{body}</p>
            <div className='flex justify-start gap-4 text-sm'>
              <button onClick={handleLikeReply} className='capitalize'>{likes.length} like</button>
              {user._id === author._id ? (
              <><button onClick={() => setIsEditing(true)} className='capitalize'>edit</button>
              <button onClick={handleDelete} className='capitalize'>delete</button>
              </>) : null }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Reply
