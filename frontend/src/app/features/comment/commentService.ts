import axios from 'axios';
import { CommentListType } from '../../../types/commentTypes';

export const addNewComment = async (post_id:string,body:string,token:string) => {
	const response = await axios.post(`/post/bookmark/new/`,{post_id,body}, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const addNewReply = async (post_id:string,comment_id:string,body:string,token:string) => {
	const response = await axios.post(`/post/bookmark/reply/`,{post_id,comment_id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const commentEdit = async (id:string,body:string,token:string) => {
	const response = await axios.put(`/post/bookmark/edit/${id}`,{id,body},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const commentDelete = async (id:string,token:string) => {
	const response = await axios.delete(`/post/bookmark/delete/${id}`,{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const commentLike = async (id:string,token:string) => {
	const response = await axios.put(`/post/bookmark/like/${id}`,{id},{
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
	return response.data();
}

export const commentList = async (post_id:string,pages:number,rows:number,type:CommentListType,token:string) => {
	const response = await axios.get(`/post/bookmark/list/${post_id}?pages=${pages}&rows=${rows}&type=${type}`, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
	return response.data();
}
