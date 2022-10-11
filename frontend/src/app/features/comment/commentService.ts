import axios from 'axios';

export const addNewComment = async (post_id:string,body:string,token:string) => {
	const response = await axios.post(`/comment/new/`,{post_id,body}, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const addNewReply = async (post_id:string,comment_id:string,body:string,token:string) => {
	const response = await axios.post(`/reply/new`,{post_id,comment_id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentEdit = async (id:string,body:string,token:string) => {
	const response = await axios.put(`/comment/edit/${id}`,{id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}
export const replyEdit = async (id:string,body:string,token:string) => {
	const response = await axios.put(`/reply/edit/${id}`,{id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentDelete = async (id:string,token:string) => {
	const response = await axios.delete(`/comment/delete/${id}`,{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}
export const replyDelete = async (id:string,token:string) => {
	const response = await axios.delete(`/reply/delete/${id}`,{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentLike = async (id:string,token:string) => {
	const response = await axios.put(`/comment/like/${id}`,{id},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}
export const replyLike = async (id:string,token:string) => {
	const response = await axios.put(`/reply/like/${id}`,{id},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data;
}

export const commentList = async (post_id:string,pages:number,rows:number) => {
	const response = await axios.get(`/comment/list/${post_id}?pages=${pages}&rows=${rows}`)
	return response.data;
}


export const replyList = async (post_id:string,pages:number,rows:number) => {
	const response = await axios.get(`/reply/list/${post_id}?pages=${pages}&rows=${rows}`)
	return response.data;
}
