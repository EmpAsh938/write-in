import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { NotificationsType } from '../../../types/authTypes';
import { CommentType, ReplyType } from '../../../types/commentTypes';
import { addNewComment,addNewReply,commentEdit,commentDelete,commentLike,commentList, replyList, replyLike, replyDelete, replyEdit } from './commentService';

type CommentState = {
	notifications: NotificationsType;
	comments: CommentType[];
	pages: number;
	rows: number;
}

const initialState:CommentState = {
	notifications: {
		type: 'idle',
		message: ''
	},
	pages: 1,
	rows: 5,
	comments: []
}

export const newComment = createAsyncThunk(
	'comment/new',
	async ({token,post_id,body}:{token:string,post_id:string,body:string},thunkAPI) => {
		try {
			return (await addNewComment(post_id,body,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const newReply = createAsyncThunk(
	'reply/new',
	async({token,post_id,comment_id,body}:{token:string,post_id:string,comment_id:string,body:string},thunkAPI) => {
		try {
			return (await addNewReply(post_id,comment_id,body,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		};
	}
);
export const editComment = createAsyncThunk(
	'comment/edit',
	async({token,post_id,body}:{token:string,post_id:string,body:string},thunkAPI) => {
		try {
			return (await commentEdit(post_id,body,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const editReply = createAsyncThunk(
	'reply/edit',
	async({token,post_id,body}:{token:string,post_id:string,body:string},thunkAPI) => {
		try {
			return (await replyEdit(post_id,body,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const deleteComment = createAsyncThunk(
	'comment/delete',
	async({token,id}:{token:string,id:string},thunkAPI) => {
		try {
			return (await commentDelete(id,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const deleteReply = createAsyncThunk(
	'reply/delete',
	async({token,id}:{token:string,id:string},thunkAPI) => {
		try {
			return (await replyDelete(id,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const likeComment = createAsyncThunk(
	'comment/like',
	async({token,id}:{token:string,id:string},thunkAPI) => {
		try {
			return (await commentLike(id,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const likeReply = createAsyncThunk(
	'reply/like',
	async({token,id}:{token:string,id:string},thunkAPI) => {
		try {
			return (await replyLike(id,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const listComment = createAsyncThunk(
	'comment/list',
	async({post_id,pages,rows}:{post_id:string,pages:number,rows:number}, thunkAPI) => {
		try {
			return (await commentList(post_id,pages,rows));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const listReply = createAsyncThunk(
	'reply/list',
	async({post_id,pages,rows}:{post_id:string,pages:number,rows:number}, thunkAPI) => {
		try {
			return (await replyList(post_id,pages,rows));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);

const commentSlice = createSlice({
	name: 'comment',
	initialState,
	reducers: {
		resetPages: (state) => {
			state.pages = 1;
			state.rows = 5;
		}
	},
	extraReducers: (builder) => {
		builder
		.addCase(listComment.pending, (state) => {
			state.notifications.type = 'loading';
			state.notifications.message = 'fetching comments';
		})
		.addCase(listComment.fulfilled, (state, action) => {
			if(typeof action.payload.result === 'object' && action.payload.result.length > 0) {
				state.notifications.type = 'success';
				state.notifications.message = 'fetched comments successfully';
                state.comments = action.payload.result;
			
			}
		})
		.addCase(listComment.rejected, (state, action) => {
			if(typeof action.payload === 'string') {
				state.notifications.type = 'error';
				state.notifications.message = action.payload;
			}
		})
	    .addCase(listReply.pending, (state) => {
            state.notifications.type = 'loading';
            state.notifications.message = 'fetching replies';
        })
        .addCase(listReply.fulfilled, (state, action) => {
            if(typeof action.payload.result === 'object'){
               state.comments.forEach(item => {
                //    if(typeof action.payload.result[0] === 'string' && item._id === action.payload.result[0]) {
                //        item.reply = action.payload.result;
                //    }
					if(typeof action.payload.result[0] === 'object' && item._id === action.payload.result[0].comment) {
						item.reply = action.payload.result;
					}
				})
            }
        })
        .addCase(listReply.rejected, (state, action) => {
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
        .addCase(newComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment added';
			if(typeof action.payload.result === 'object' && action.payload.result.length > 0) {
				state.comments = action.payload.result;
			}
		})
		.addCase(newComment.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment failed to add';
		})
		.addCase(newReply.fulfilled, (state, action:PayloadAction<{message:string,result:ReplyType}>) => {
			state.notifications.type = 'success';
			state.notifications.message = action.payload.message;
            if(action.payload.result) {
                state.comments.forEach(item => {
                    if(item._id === action.payload.result.comment) {
                        item.reply = [...item.reply, action.payload.result];
                    }
                })
            }
		})
		.addCase(newReply.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'reply failed to add';
		})
		.addCase(editComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment edited';
			console.log(action.payload);
		})
		.addCase(editComment.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment edit failed';	
		})
		.addCase(editReply.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'Reply edited';
			console.log(action.payload);
		})
		.addCase(editReply.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'Reply edit failed';	
		})
		.addCase(likeReply.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'Reply liked';
			if(typeof action.payload.result === 'object') {
				state.comments = state.comments.map(item => {
					if(item._id === action.payload.result.comment) {
						item.likes = action.payload.result.likes;
					}
					return item;
				})
			}
		})
		.addCase(likeReply.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'Reply like/unlike failed';	
		})
		.addCase(likeComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = action.payload.result.message;
			if(typeof action.payload.result === 'object') {
				state.comments = state.comments.map(item => {
					if(item._id === action.payload.result._id) {
						return action.payload.result;
					}
					return item;
				})
			}
		})
		.addCase(likeComment.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'Reply edit failed';	
		})
		.addCase(deleteComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment deleted';
			if(typeof action.payload.result === 'object') {
				state.comments = state.comments.filter(item => item._id !== action.payload.result._id);
			}
		})
		.addCase(deleteComment.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment delete failed';	
		})
		.addCase(deleteReply.fulfilled, (state, action) => {
			console.log(action.payload)
			state.notifications.type = 'success';
			state.notifications.message = 'Reply deleted';
			if(typeof action.payload.result === 'object') {
				state.comments = state.comments.map(item => {
					item.reply = item.reply.filter(newitem => (typeof newitem === 'object' && newitem._id !== action.payload.result._id));
					return item;
				})
			}
		})
		.addCase(deleteReply.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'Reply delete failed';	
		})
	}
})

export const { resetPages } = commentSlice.actions;

export default commentSlice.reducer
