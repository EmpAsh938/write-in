import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { deleteBlog, editBlog, listPrivateAll, listPublicAll, listSingle, savePost } from './postService';
import { PostsObjType, PostsType } from '../../../types/postTypes';

interface PostState {
    pages: number;
    rows: number;
    postError: string;
    isLoading: boolean;
    privatePosts: PostsType[];
    singlePost: PostsType;
    posts: PostsType[];
}

const initialState: PostState = {
    pages:1,
    rows: 10,
    postError: '',
    isLoading:false,
    singlePost: {} as PostsType,
    privatePosts: [],
    posts:[]
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
   async ({pages,rows,token}:{pages:number,rows:number,token:string},thunkAPI) => {
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

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        resetPages: (state) => {
            state.pages = initialState.pages;
            state.rows = initialState.rows;
        },
        loadMore: (state, action) => {
            state.pages = action.payload.pages
        },
        resetSinglePost: (state) => {
            state.singlePost = {} as PostsType;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(listPublicBlogs.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(listPublicBlogs.fulfilled, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result) && action.payload.result.length > 0) {
                    if(initialState.pages !== state.pages || initialState.rows !== state.rows) {
                        state.posts = [...state.posts, ...action.payload.result]
                    } else {
                        state.posts = [...action.payload.result];
                    }
                }
            }
        })
        .addCase(listPublicBlogs.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.postError = action.payload
            }
        })
        .addCase(listSingleBlogs.pending, (state, action) => {
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
                state.postError = action.payload
            }

        })
        .addCase(listPrivate.pending, (state, action) => {
            state.isLoading = true;
        })
        .addCase(listPrivate.fulfilled, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result) && action.payload.result.length > 0) {
                    if(initialState.pages !== state.pages || initialState.rows !== state.rows) {
                        state.privatePosts = [...state.privatePosts, ...action.payload.result]
                    } else {
                        state.privatePosts = [...action.payload.result];
                    }
                }
            }
        })
        .addCase(listPrivate.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.postError = action.payload
            }
        })
        .addCase(updateBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        .addCase(updateBlog.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.postError = action.payload
            }
        })
        .addCase(removeBlog.fulfilled, (state, action) => {
            state.isLoading = false;
        })
        .addCase(removeBlog.rejected, (state, action) => {
            state.isLoading = false;
            if(typeof action.payload === 'string') {
                state.postError = action.payload
            }
        })
        .addCase(saveBlog.fulfilled, (state, action) => {

        })
        .addCase(saveBlog.rejected, (state, action) => {
            if(typeof action.payload === 'string') {
                state.postError = action.payload;
            }
        })
    }
})

export const { loadMore, resetPages, resetSinglePost } = postSlice.actions;

export const selectPost = (state: RootState) => state.post

export default postSlice.reducer