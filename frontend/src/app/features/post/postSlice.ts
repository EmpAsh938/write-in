import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { RootState } from '../../store';
import { listPublicAll } from './postService';
import { PostsType } from '../../../types/postTypes';



interface PostState {
    pages: number;
    rows: number;
    posts: PostsType[];
}

const initialState: PostState = {
    pages:1,
    rows: 10,
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

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(listPublicBlogs.fulfilled, (state, action) => {
            if(typeof action.payload === 'object') {
                if(Array.isArray(action.payload.result) && action.payload.result.length > 0) {
                   state.posts = [...state.posts, ...action.payload.result]
                }
            }
        })
    }
})

export const selectPost = (state: RootState) => state.post

export default postSlice.reducer