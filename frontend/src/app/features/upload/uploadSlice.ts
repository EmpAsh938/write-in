import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { NotificationsType } from "../../../types/authTypes"
import { upload } from "./uploadService";

interface UploadState {
    notifications: {
        type: NotificationsType,
        message: string
    };
    file: File | null;
}

const initialState: UploadState = {
    file: null,
    notifications: {
        type: '',
        message: ''
    }
}

export const uploadFile = createAsyncThunk(
    'upload/file',
   async ({file,token}:{file:File,token:string},thunkAPI) => {
    try {
        return (await upload(file,token));
    } catch (error:any) {
        return thunkAPI.rejectWithValue('');
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
        .addCase(uploadFile.pending, (state, action) => {

        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            console.log(action.payload);
        })
        .addCase(uploadFile.rejected, (state, action) => {
            if(typeof action.payload === 'string') {
                state.notifications.type = 'error';
                state.notifications.message = action.payload;
            }
        })
    }
})

export default uploadSlice.reducer