import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { deleteBlog, editBlog, likePost, listBookmark, listPrivateAll, listPublicAll, listSingle, savePost, searchBlog } from './postService';
import { PostsObjType, PostsType } from '../../../types/postTypes';
import { NotificationsType } from '../../../types/authTypes';

interface PostState {
    pages: number;
    rows: number;
    notifications: {
        type: NotificationsType,
        message: string
    };
    query:string,
    isLoading: boolean;
    posts: PostsType[];
    singlePost: PostsType;
    searchPosts: PostsType[];
    privatePosts: PostsType[];
    bookmarkPosts: PostsType[];
}

const initialState: PostState = {
    pages: 1,
    rows: 10,
    notifications: {
        type: '',
        message: '',
    },
    query:'',
    posts:[],
    isLoading:false,
    singlePost: {} as PostsType,
    privatePosts: [],
    searchPosts: [],
    bookmarkPosts:[]
}

export const listPublicBlogs = createAsyncThunk(
    'post/list/public/all',
   async ({pages,rows}:{pages:number,rows:number},thunkAPI) => {
    try {
        return (await listPublicAll(pages,rows));    
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

export const listSingleBlogs = createAsyncThunk(
    'post/list/single',
   async (id:string, thunkAPI) => {
    try {
        return (await listSingle(id));
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

export const listPrivate = createAsyncThunk(
    'post/private/all',
   async ({pages,rows,token}:{pages:number,rows:number,token:string | null},thunkAPI) => {
    try {
        return (await listPrivateAll(pages,rows,token));
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

export const updateBlog = createAsyncThunk(
    'post/edit',
    async({id,token,title,status,markdown}:PostsObjType & {id:string,token:string|null}, thunkAPI) => {
        try {
            return (await editBlog({id,token,title, status, markdown}));
        } catch (error:any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const removeBlog = createAsyncThunk(
    'post/remove',
   async ({id,token}:{id:string,token:string | null}, thunkAPI) => {
    try {
        return (await deleteBlog(id,token));        
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

export const saveBlog = createAsyncThunk(
    'post/save',
   async ({title,markdown,status,token}:PostsObjType & {token: string | null}, thunkAPI) => {
    try {
        return (await savePost({title,markdown,status,token}));
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

export const searchBlogs = createAsyncThunk(
    'posts/search',
   async ({query,rows,pages,sort}:{query:string,rows:number,pages:number,sort:number},thunkAPI) => {
    try {
        return (await searchBlog({query,rows,pages,sort}));
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

export const likeBlog = createAsyncThunk(
    'post/like',
   async ({id,token}:{id:string,token:string | null},thunkAPI) => {
    try {
        return (await likePost({id,token}));
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

export const bookmarkLists = createAsyncThunk(
    'post/bookmarks/list',
   async ({ pages, rows, token }:{pages:number,rows: number, token:string},thunkAPI) => {
    try {
        return (await listBookmark(pages,rows,token));
    } catch (error:any) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        searchString: (state, action) => {
            state.query = action.payload.search;
        },
        resetPages: (state) => {
            state.pages = initialState.pages;
            state.rows = initialState.rows;
        },
        loadMore: (state) => {
            state.pages += 1;
        },
        resetSinglePost: (state) => {
            state.singlePost = {} as PostsType;
        },
        removePrivatePost: (state,action) => {
            const { id } = action.payload;
            const filteredPost = state.privatePosts.filter(item => item._id !== id);
            state.privatePosts = filteredPost;
            state.notifications.type = 'success';
            state.notifications.message = 'post removed';
        },
        postNotification: (state, action) => {
            const { type, message } = action.payload;
            state.notifications.type = type;
            state.notifications.message = message;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(listPublicBlogs.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(listPublicBlogs.fulfilled, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result)) {
                    if(action.payload.result.length > 0) {

                        if(initialState.pages !== state.pages || initialState.rows !== state.rows) {
                            state.posts = [...state.posts, ...action.payload.result]
                        } else {
                            state.posts = [...action.payload.result];
                        }
                    } else {
                        state.pages = state.pages - 1;
                    }
                }
            }
        })
        .addCase(listPublicBlogs.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload
            }
        })
        .addCase(listSingleBlogs.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(listSingleBlogs.fulfilled, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload.result === 'object') {
                state.singlePost = action.payload.result;
            }
        })

        .addCase(listSingleBlogs.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }

        })
        .addCase(listPrivate.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(listPrivate.fulfilled, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result)) {
                    if(action.payload.result.length > 0) {

                        if(initialState.pages !== state.pages || initialState.rows !== state.rows) {
                            state.privatePosts = [...state.privatePosts, ...action.payload.result]
                        } else {
                            state.privatePosts = [...action.payload.result];
                        }
                    } else {
                        state.pages = state.pages - 1;
                    }
                }
            }
        })
        .addCase(listPrivate.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
        .addCase(updateBlog.fulfilled, (state, action) => {
            state.isLoading = false;
            state.notifications.type = 'success';
            state.notifications.message = 'post edited';
        })
        .addCase(updateBlog.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
        .addCase(removeBlog.fulfilled, (state) => {
            state.isLoading = false;
            state.notifications.type = 'success';
            state.notifications.message = 'post removed';
        })
        .addCase(removeBlog.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
        .addCase(saveBlog.fulfilled, (state) => {
            state.notifications.type = 'success';
            state.notifications.message = 'post saved';
        })
        .addCase(saveBlog.rejected, (state, action) => {
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
        .addCase(searchBlogs.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(searchBlogs.fulfilled, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result)) {
                    if(action.payload.result.length > 0) {

                        if(initialState.pages !== state.pages || initialState.rows !== state.rows) {
                            state.searchPosts = [...state.searchPosts, ...action.payload.result]
                        } else {
                            state.searchPosts = [...action.payload.result];
                        }
                    } else {
                        state.pages = state.pages - 1;
                    }
                }
            }
        })
        .addCase(searchBlogs.rejected, (state, action) => {
            state.isLoading = false;
            state.notifications.type = 'error';
            state.notifications.message = typeof action.payload === 'string' ? action.payload : '';
        })
        .addCase(likeBlog.fulfilled, (state, action) => {
            console.log(action.payload);
        })
        .addCase(likeBlog.rejected, (state, action) => {
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }

        })
        .addCase(bookmarkLists.pending, (state) => {
            state.isLoading = true;
        })

        .addCase(bookmarkLists.fulfilled, (state, action) => {
            state.isLoading = false;

            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result)) {
                    if(action.payload.result.length > 0) {

                        if(initialState.pages !== state.pages || initialState.rows !== state.rows) {
                            state.bookmarkPosts = [...state.bookmarkPosts, ...action.payload.result]
                        } else {
                            state.bookmarkPosts = [...action.payload.result];
                        }
                    } else {
                        state.pages = state.pages - 1;
                    }
                }
            }
        })
        .addCase(bookmarkLists.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
    }
})

export const { searchString, loadMore, resetPages, resetSinglePost, removePrivatePost, postNotification } = postSlice.actions;

export const selectPost = (state: RootState) => state.post

export default postSlice.reducer