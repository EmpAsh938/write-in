import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { deleteBlog, editBlog, listPrivateAll, listPublicAll, listSingle } from './postService';
import { PostsType } from '../../../types/postTypes';



interface PostState {
    pages: number;
    rows: number;
    isLoading: boolean;
    posts: PostsType[];
}

const initialState: PostState = {
    pages:1,
    rows: 10,
    isLoading:false,
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
    async({id,token}:{id:string,token:string}, thunkAPI) => {
        try {
            return (await editBlog(id,token));
        } catch (error:any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    }
)

export const removeBlog = createAsyncThunk(
    'post/remove',
   async ({id,token}:{id:string,token:string}, thunkAPI) => {
    try {
        return (await deleteBlog(id,token));        
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

    },
    extraReducers: (builder) => {
        builder
        .addCase(listPublicBlogs.pending, (state, action) => {

        })
        .addCase(listPublicBlogs.fulfilled, (state, action) => {
            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result) && action.payload.result.length > 0) {
                   state.posts = [...state.posts, ...action.payload.result]
                }
            }
        })
        .addCase(listPublicBlogs.rejected, (state, action) => {

        })
        .addCase(listSingleBlogs.pending, (state, action) => {

        })
        .addCase(listSingleBlogs.fulfilled, (state, action) => {

        })

        .addCase(listSingleBlogs.rejected, (state, action) => {


        })
        .addCase(listPrivate.pending, (state, action) => {

        })
        .addCase(listPrivate.fulfilled, (state, action) => {

        })
        .addCase(listPrivate.rejected, (state, action) => {

        })
        .addCase(updateBlog.fulfilled, (state, action) => {

        })
        .addCase(updateBlog.rejected, (state, action) => {

        })
        .addCase(removeBlog.fulfilled, (state, action) => {

        })
        .addCase(removeBlog.rejected, (state, action) => {
            
        })
    }
})

export const selectPost = (state: RootState) => state.post

export default postSlice.reducer