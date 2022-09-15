import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { register, login, logout, verify, bookmark, passwordChange } from './authService'
import { RegisterAuthState, LoginAuthState, NotificationsType } from '../../../types/authTypes'

type NotificationsObj = {
  type: NotificationsType;
  message: string;
}

export type UserState = {
  email: string;
  fullname: string;
  username:string;
  profileImage: string;
}

// Define a type for the slice state
interface AuthState {
  token: string | null;
  notifications: NotificationsObj;
  user: UserState;
}

const lsk = JSON.parse(localStorage.getItem('user_db') || 'null');

// Define the initial state using that type
const initialState: AuthState = {
  notifications: {
    type:'error',
    message: ''
  },
  token: lsk ? lsk.token : null,
  user: lsk ? lsk._doc : {},
}

export const loginUser = createAsyncThunk(
  'auth/login',
 async (userObj:LoginAuthState, thunkAPI) => {
    try {
      return await login(userObj);
    } catch (error:any) {
      const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
      return thunkAPI.rejectWithValue(message);
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userObj:RegisterAuthState, thunkAPI) => {
    try {
      return await register(userObj);
    } catch (error:any) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
    return thunkAPI.rejectWithValue(message);
    
  }  
 }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
 async () => {
  return await logout();
 }
)

export const bookmarkPost = createAsyncThunk(
  'auth/bookmark',
 async ({id,token}:{id:string,token:string}, thunkAPI) => {
  try {
    return (await bookmark(id,token));
  } catch (error:any) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
    return thunkAPI.rejectWithValue(message);
  }
 }
)

export const verifyUser = createAsyncThunk(
  'auth/verify',
 async (token:string) => {
  return await verify(token);
 }
)

export const changePassword = createAsyncThunk(
  'auth/change/password',
 async ({oldpassword,newpassword,token}:{oldpassword:string,newpassword:string,token:string},thunkAPI) => {
  try {
    return (await passwordChange(oldpassword,newpassword,token));
  } catch (error:any) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
    return thunkAPI.rejectWithValue(message);
  }
 }
)

const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    notify: (state, action) => {
      const { type, message } = action.payload;
      return {
        ...state,
        notifications: {
          type,
          message
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        if(typeof action.payload.result === 'object') {
          const { token, _doc } = action.payload.result;
          return {
            ...state,
            token,
            user: _doc,
            notifications: {
              type: 'success',
              message: 'user logged in successfully'
            }
          }
        }
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<unknown, string>) => {
        localStorage.clear();
        if(typeof action.payload === 'string') {
          state.token = null;
          state.notifications.type = 'error';
          state.notifications.message = action.payload;
        } 
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      if(typeof action.payload.result === 'object') {
        const { token, _doc} = action.payload.result;
        state.token = token;
        state.user = _doc;
        state.notifications.type = 'success';
        state.notifications.message = 'user registered successfully';
      }
    })
    .addCase(registerUser.rejected, (state, action: PayloadAction<unknown, string>) => {
      localStorage.clear();
      if(typeof action.payload === 'string') {
        state.token = null;
        state.notifications.type = 'error';
          state.notifications.message = action.payload;
      }
    })
    .addCase(logoutUser.fulfilled, (() => {
      return {
        ...initialState
      }
    }))
    .addCase(verifyUser.fulfilled, ((state, action) => {
      if(typeof action.payload.result === 'object') {
        const { token, _doc } = action.payload.result;
        state.token = token 
        state.user = _doc
      }
    }))
    .addCase(verifyUser.rejected, (state,action) => {
      localStorage.clear();
      if(typeof action.payload === 'string') {
        state.token = null;
        state.notifications.type = 'error';
          state.notifications.message = action.payload;
      }
    })
    .addCase(bookmarkPost.fulfilled, (state,action) => {
        console.log(action.payload);
    })
    .addCase(bookmarkPost.rejected, (state, action) => {
      if(typeof action.payload === 'string') {
        state.notifications.type = 'error';
        state.notifications.message = action.payload;
      }
    })
    .addCase(changePassword.fulfilled, (state, action) => {
      if(typeof action.payload.result === 'object') {
        const { token, _doc} = action.payload.result;
        state.token = token;
        state.user = _doc;
        state.notifications.type = 'success';
        state.notifications.message = 'password changed successfully';
      }
    })
    .addCase(changePassword.rejected, (state, action) => {
      if(typeof action.payload === 'string') {
        state.notifications.type = 'error';
        state.notifications.message = action.payload;
      }
    })
  },
})

export const { notify } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.auth

export default authSlice.reducer