import axios from 'axios';

export const addNewComment = (post_id:string,body:string,token:string) => {
	const response = await axios.post();
	return response.data();
}

export const addNewReply = (comment_id:string,body:string,token:string) => {
	const response = await axios.post();
	return response.data();
}

export const commentEdit = (id:string,body:string,token:string) => {
	const response = await axios.put();
	return response.data();
}

export const commentDelete = (id:string,token:string) => {
	const response = await axios.delete();
	return response.data();
}

export const commentLike = (id:string,token:string) => {
	const response = await axios.put();
	return response.data();
}
