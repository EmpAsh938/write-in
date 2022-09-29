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
	notifications: {
		type: 'idle',
		message: ''
	},
	comments: []
}

export const newComment = createAsyncThunk(
	'comment/new',
	async ({token,post_id,body},thunkAPI) => {
		try {
			return (await addNewComment(post_id,body,token));
		} catch (error:any) {
		}
	}
);
export const newReply = createAsyncThunk(
	'comment/reply',
	async({token,comment_id,body},thunkAPI) => {
		try {
			return (await addNewReply(comment_id,body,token));
		} catch (error:any) {};
);

export const editComment = createAsyncThunk(
	'comment/edit',
	async({token,post_id,body},thunkAPI) => {
		try {
			return (await commentEdit(post_id,body,token));
		} catch (error:any) {
		}
	};
);
export const deleteComment = createAsynThunk(
	'comment/delete',
	async({token,id},thunkAPI) => {
		try {
			return (await commentDelete(id,token));
		} catch (error:any) {
		}
	};
);

export const likeComment = createAsyncThunk(
	'comment/like',
	async({token,id},thunkAPI) => {
		try {
			return (await commentLike(id,token));
		} catch (error:any) {
		}
	}
)
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
