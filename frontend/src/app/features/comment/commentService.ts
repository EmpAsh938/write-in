import axios from 'axios';

export const addNewComment = async (post_id:string,body:string,token:string) => {
	const response = await axios.post(`/post/comment/new/`,{post_id,body}, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const addNewReply = async (post_id:string,comment_id:string,body:string,token:string) => {
	const response = await axios.post(`/post/comment/reply/`,{post_id,comment_id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentEdit = async (id:string,body:string,token:string) => {
	const response = await axios.put(`/post/comment/edit/${id}`,{id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentDelete = async (id:string,token:string) => {
	const response = await axios.delete(`/post/comment/delete/${id}`,{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentLike = async (id:string,token:string) => {
	const response = await axios.put(`/post/comment/like/${id}`,{id},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentList = async (post_id:string,pages:number,rows:number) => {
	const response = await axios.get(`/post/comment/list/${post_id}?pages=${pages}&rows=${rows}`)
	return response.data;
}


export const replyList = async (post_id:string,pages:number,rows:number) => {
	const response = await axios.get(`/post/comment/list/reply/${post_id}?pages=${pages}&rows=${rows}`)
	return response.data;
}
