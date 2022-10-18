import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { NotificationsType } from "../../../types/authTypes"
import { upload } from "./uploadService";

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

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
        .addCase(uploadFile.pending, (state) => {
            state.uploadStatus = 'running';
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.uploadStatus = 'success';
            console.log(action.payload);
            if(action.payload.result === 'object') {
                state.imageUrl = action.payload.result.secure_url;
            }
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.uploadStatus = 'error';
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
    }
})

export default uploadSlice.reducer
