type ReplyType = {
	_id: string;
	body: string;
	author: string;
	likes: [string];
	root: string;
	updatedAt: string;
	createdAt: string;
}
type CommentType = {
	_id: string;
	body: string;
	author: string;
	likes: [string];
	reply: [ReplyType];
	updatedAt: string;
	createdAt: string;
}



type CommentState = {
	notifications: NotificationsObj;
	comments: CommentType;
}

const initialState = {
}

export const newComment;
export const newReply;
export const editComment;
export const deleteComment;

const commentSlice = {
	name: 'comment',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
		.addCase(newComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment added';
		})
		.addCase(newComment.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment failed to add';
		})
		.addCase(newReply.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'reply added';	
		})
		.addCase(newReply.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'reply failed to add';
		})
		.addCase(editComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment edited';
		})
		.addCase(editComment.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment edit failed';	
		})
		.addCase(deleteComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment deleted';
		})
		.addCase(deleteComment.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment delete failed';	
		})
	}
}

export default commentSlice.reducer;
