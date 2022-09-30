import Reply from './Reply';
import UserImage from './UserImage';

const Comments = () => {
	
	return (
		<div className=''>
			{/* comments  */}
			<div className='flexjustify-start items-center gap-2 text-sm'>
				<UserImage profileImage={''} fullname={''} />
				<h3>name</h3>
			</div>
			<p>Cool.</p>
			<div className='flex justify-start items-center gap-2 text-sm'>
				<button>like</button>
				<button>reply</button>
			</div>
			{/* reply */}
			<div className='flex justify-start items-center gap-2'>
				<input className='text-sm p-2 outline-none border border-solid border-gray-300' type='text' placeholder='reply here' />
				<button className='bg-green-500 text-white rounded px-2 py-1'>Reply</button>
        	</div>		
			<Reply />
		</div> 
	)
}


export default Comments;
