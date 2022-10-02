import React from 'react'
import UserImage from './UserImage'

const Reply = () => {
    const handleLikeReply = () => {
    }
  return (
	<div className='pl-4'>
        <div className='flex justify-start items-center gap-2 text-sm'>
            <UserImage profileImage={''} fullname={''} />
            <h3>name</h3>
        </div>
        <p>Cool.</p>
        <div className='flex justify-start items-center gap-2 text-sm'>
            <button onClick={handleLikeReply}>like</button>
        </div>
        	
    </div>
  )
}

export default Reply
