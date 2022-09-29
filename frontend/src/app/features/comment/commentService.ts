import axios from 'axios';

export const addNewComment = (post_id:string,body:string,token:string) => {
	const response = await axios.post(`/post/bookmark/new/`,{post_id,body}, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const addNewReply = (post_id:string,comment_id:string,body:string,token:string) => {
	const response = await axios.post(`/post/bookmark/reply/`,{post_id,comment_id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const commentEdit = (id:string,body:string,token:string) => {
	const response = await axios.put(`/post/bookmark/edit/${id}`,{id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const commentDelete = (id:string,token:string) => {
	const response = await axios.delete(`/post/bookmark/delete/${id}`,{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const commentLike = (id:string,token:string) => {
	const response = await axios.put(`/post/bookmark/like/${id}`,{id},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}
