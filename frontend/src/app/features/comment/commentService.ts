export const addNewComment = () => {
	const response = await axios.post();
	return response.data();
}

export const addNewReply = () => {
	const response = await axios.post();
	return response.data();
}

export const commentEdit = () => {
	const response = await axios.put();
	return response.data();
}

export const commentDelete = () => {
	const response = await axios.delete();
	return response.data();
}
