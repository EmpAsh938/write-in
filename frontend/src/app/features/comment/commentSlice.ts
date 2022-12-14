import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { NotificationsType } from '../../../types/authTypes';
import { CommentType } from '../../../types/commentTypes';
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
	async({token,id,body}:{token:string,id:string,body:string},thunkAPI) => {
		try {
			return (await commentEdit(id,body,token));
		} catch (error:any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
		}
	}
);
export const editReply = createAsyncThunk(
	'reply/edit',
	async({token,reply_id,body}:{token:string,reply_id:string,body:string},thunkAPI) => {
		try {
			return (await replyEdit(reply_id,body,token));
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
		},
        commentNotification: (state) => {
            state.notifications.type = 'idle';
            state.notifications.message = '';
        }
	},
	extraReducers: (builder) => {
		builder
		.addCase(listComment.fulfilled, (state, action) => {
			if(typeof action.payload.result === 'object' && action.payload.result.length > 0) {
                state.comments = action.payload.result;
			
			}
		})
		.addCase(listComment.rejected, (state, action) => {
			if(typeof action.payload === 'string') {
				state.notifications.type = 'error';
				state.notifications.message = action.payload;
			}
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
			if(typeof action.payload.result === 'object' && action.payload.result.length > 0) {
				state.comments = action.payload.result;
			}
		})
		.addCase(newComment.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment failed to add';
		})
		.addCase(newReply.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = action.payload.message;
            if(Array.isArray(action.payload.result) && action.payload.result.length > 0) {
                state.comments.forEach(item => {
                    if(item._id === action.payload.result[0].comment) {
                        item.reply = action.payload.result;
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
			if(typeof action.payload.result === 'object') {
				state.comments = action.payload.result;
            }
		})
		.addCase(editComment.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment edit failed';	
		})
		.addCase(editReply.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'Reply edited';
            if(typeof action.payload.result === 'object') {
                state.comments.forEach(item => {
                    if(item._id === action.payload.result[0].comment) {
                        item.reply = action.payload.result;
                    }
                })
            }
		})
		.addCase(editReply.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'Reply edit failed';	
		})
		.addCase(likeReply.fulfilled, (state, action) => {
			if(typeof action.payload.result === 'object') {
				state.comments.forEach(item => {
                    if(item._id === action.payload.result[0].comment) {
                        item.reply = action.payload.result;
                    }
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
				state.comments = action.payload.result; 
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
				state.comments = action.payload.result;
			}
		})
		.addCase(deleteComment.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment delete failed';	
		})
		.addCase(deleteReply.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'Reply deleted';
			if(typeof action.payload.result === 'object') {
				state.comments.forEach(item => {
                    if(action.payload.result.length === 0) {
                        item.reply = [];
                    }
                    else if(item._id === action.payload.result[0].comment) {
                        item.reply = action.payload.result;
                    }
				})
			}
		})
		.addCase(deleteReply.rejected, (state) => {
			state.notifications.type = 'error';
			state.notifications.message = 'Reply delete failed';	
		})
	}
})

export const { resetPages, commentNotification } = commentSlice.actions;

export default commentSlice.reducer
