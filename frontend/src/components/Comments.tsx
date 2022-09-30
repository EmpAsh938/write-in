import UserImage from './UserImage';

const Comments = () => {
	
	return (
		<section>
			<div>
				<h2>Comments</h2>
			</div>
			<div>
				// user image
				<UserImage />
				// input
				<input type='text' placeholder='type here' />
				// button
				<button>Comment</button>
			</div>
			<div>
				// comment list
				<div>
				// user
				<div>
					<UserImage />
					<h3>name</h3>
				</div>
				// comment description
				<p>Cool.</p>
				// comment actions
				<div className='flex justify-start items-center gap-2 text-sm'>
					<button>like</button>
					<button>reply</button>
				</div>
				// load reply	
				// reply
				<div>
					<input type='text' placeholder='reply here' />
					<button>Reply</button>
				</div>			
				</div> 
			</div>
		</section>
	)
}


export default Comments;
