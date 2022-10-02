import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { NotificationsType } from '../../../types/authTypes';
import { UserState } from '../auth/authSlice';
import { CommentType } from '../../../types/postTypes';
import { addNewComment,addNewReply,commentEdit,commentDelete,commentLike,commentList, replyList } from './commentService';

type ReplyType = {
	_id: string;
	body: string;
	author: UserState;
	likes: [string];
	root: string;
	updatedAt: string;
	createdAt: string;
}

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
		}
	}
);
export const newReply = createAsyncThunk(
	'comment/reply',
	async({token,post_id,comment_id,body}:{token:string,post_id:string,comment_id:string,body:string},thunkAPI) => {
		try {
			return (await addNewReply(post_id,comment_id,body,token));
		} catch (error:any) {};
	}
);

export const editComment = createAsyncThunk(
	'comment/edit',
	async({token,post_id,body}:{token:string,post_id:string,body:string},thunkAPI) => {
		try {
			return (await commentEdit(post_id,body,token));
		} catch (error:any) {
		}
	}
);
export const deleteComment = createAsyncThunk(
	'comment/delete',
	async({token,id}:{token:string,id:string},thunkAPI) => {
		try {
			return (await commentDelete(id,token));
		} catch (error:any) {
		}
	}
);

export const likeComment = createAsyncThunk(
	'comment/like',
	async({token,id}:{token:string,id:string},thunkAPI) => {
		try {
			return (await commentLike(id,token));
		} catch (error:any) {
		}
	}
)

export const listComment = createAsyncThunk(
	'comment/list',
	async({token,post_id,pages,rows}:{token:string,post_id:string,pages:number,rows:number}, thunkAPI) => {
		try {
			return (await commentList(post_id,pages,rows,token));
		} catch (error:any) {
		}
	}
)


export const listReply = createAsyncThunk(
	'comment/list/reply',
	async({token,post_id,pages,rows}:{token:string,post_id:string,pages:number,rows:number}, thunkAPI) => {
		try {
			return (await replyList(post_id,pages,rows,token));
		} catch (error:any) {
		}
	}
)

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
			if(typeof action.payload.result === 'object') {
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
                state.comments = state.comments.map(item => {
                    if(item._id === action.payload.result._id) {
                        return {
                            ...item,
                            reply: action.payload.result.reply
                        }
                    } 
                    return item;
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
			if(typeof action.payload.result === 'object') {
				state.comments = action.payload.result;
			}
		})
		.addCase(newComment.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment failed to add';
		})
		.addCase(newReply.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'reply added';
			console.log(action.payload);	
		})
		.addCase(newReply.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'reply failed to add';
		})
		.addCase(editComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment edited';
			console.log(action.payload);
		})
		.addCase(editComment.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment edit failed';	
		})
		.addCase(deleteComment.fulfilled, (state, action) => {
			state.notifications.type = 'success';
			state.notifications.message = 'comment deleted';
			console.log(action.payload);
		})
		.addCase(deleteComment.rejected, (state, action) => {
			state.notifications.type = 'error';
			state.notifications.message = 'comment delete failed';	
		})
	}
})

export const { resetPages } = commentSlice.actions;

export default commentSlice.reducer
