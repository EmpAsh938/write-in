import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { NotificationsType } from "../../../types/authTypes"
import { removeUploads, upload } from "./uploadService";

interface UploadState {
    notifications: NotificationsType;
    uploadStatus: 'idle' | 'running' | 'success' | 'error';
    imageUrl: string;
}

const initialState: UploadState = {
    uploadStatus: 'idle',
    imageUrl: '',
    notifications: {
        type: 'idle',
        message: ''
    }
}

export const uploadFile = createAsyncThunk(
    'upload/file',
   async ({file,token}:{file:File,token:string},thunkAPI) => {
    try {
        return (await upload(file,token));
    } catch (error:any) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
    }
   }
)

    export const cancelUploads = createAsyncThunk(
        'upload/cancel',
        async ({images,token}:{images:string[],token:string},thunkAPI) => {
            try {
               return (await removeUploads(images,token)); 
            } catch (error:any) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
        return thunkAPI.rejectWithValue(message);
            }
        })

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        resetNotification: (state, action) => {
            state.notifications.type = action.payload.type;
            state.notifications.message = action.payload.message;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(uploadFile.pending, (state) => {
            state.notifications.type = 'loading';
            state.notifications.message = 'upload pending';
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.notifications.type = 'success';
            state.notifications.message = 'upload success';
            if(typeof action.payload.result === 'object') {
                state.imageUrl = action.payload.result.secure_url;
            }
        })
        .addCase(uploadFile.rejected, (state, action) => {
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
        .addCase(cancelUploads.fulfilled, (state,action)=>{
            state.notifications.type = 'success';
            state.notifications.message = 'upload cancel success';
        })
        .addCase(cancelUploads.rejected, (state,action)=>{
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
    }
})

export const { resetNotification } = uploadSlice.actions;

export default uploadSlice.reducer
