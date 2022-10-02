import Reply from './Reply';
import UserImage from './UserImage';

import { CommentType }  from '../types/postTypes';

const Comment = ({  _id, body, author, reply}: CommentType) => {
    const { profileImage, fullname } = author;
	return (
		<div className=''>
			{/* comments  */}
			<div className='items-center text-sm flexjustify-start gap-2'>
				<UserImage profileImage={profileImage} fullname={fullname} />
				<h3>{fullname}</h3>
			</div>
			<p>{body}</p>
			<div className='flex items-center justify-start text-sm gap-2'>
				<button>like</button>
				<button>reply</button>
			</div>
			{/* reply */}
			<div className='flex items-center justify-start gap-2'>
				<input className='p-2 text-sm border border-gray-300 border-solid outline-none' type='text' placeholder='reply here' />
				<button className='px-2 py-1 text-white bg-green-500 rounded'>Reply</button>
        	</div>		
			{reply.length > 0 && (reply.map(item => {
				return (<Reply key={item._id} />)
			}))}
		</div> 
	)
}


export default Comment;
