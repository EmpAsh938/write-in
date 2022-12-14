import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import { register, login, logout, verify, bookmark, passwordChange, removeAccount, accountDetailsChange, changeBasicInfo, emailChange, toggleFollow, userDetails } from './authService'
import { RegisterAuthState, LoginAuthState, NotificationsType, UserState } from '../../../types/authTypes'
import { profileUpload } from '../upload/uploadService';



// Define a type for the slice state
interface AuthState {
  token: string | null;
  notifications: NotificationsType;
  user: UserState;
  userProfile: UserState;
}

const lsk = JSON.parse(localStorage.getItem('user_db') || 'null');

// Define the initial state using that type
const initialState: AuthState = {
  notifications: {
    type:'idle',
    message: ''
  },
  token: lsk ? lsk.token : null,
  user: lsk ? lsk._doc : {},
  userProfile: {} as UserState 
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

export const deleteAccount = createAsyncThunk(
  'auth/account/delete',
 async ({token}:{token:string},thunkAPI) => {
  try {
    return (await removeAccount(token));
  } catch (error:any) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
    return thunkAPI.rejectWithValue(message);
  }
 }
)

export const basicInfoChange = createAsyncThunk(
    'auth/account/change/basic',
    async ({bio,website,country,token}:{bio:string,website:string,country:string,token:string},thunkAPI) => {
        try {
           return (await changeBasicInfo(bio,website,country,token));
        } catch (error:any) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    })

export const changeEmail = createAsyncThunk(
	'auth/account/change/email',
	async ({email,token}:{email:string,token:string},thunkAPI) => {
		try {
			return (await emailChange(email,token));
		} catch (error: any) {
			const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
			return thunkAPI.rejectWithValue(message);
		}
	}
)

export const changeAccountInfo = createAsyncThunk(
	'auth/account/change',
	async ({bio,fullname,username,token}:{bio:string,fullname:string,username:string,token:string},thunkAPI) => {
	try {
		return (await accountDetailsChange(bio,fullname,username,token));
	}
	catch (error:any) {
   	 const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
	return thunkAPI.rejectWithValue(message);
	}
	}
)
export const followUser = createAsyncThunk(
	'auth/account/follow',
	async ({follow_id,token}:{follow_id:string,token:string},thunkAPI) => {
	try {
		return (await toggleFollow(follow_id,token));
	}
	catch (error:any) {
   	 const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString() || '';
	  return thunkAPI.rejectWithValue(message);
	}
	}
)

export const uploadProfile = createAsyncThunk(
  'upload/profile/',
 async ({file,token}:{file:File,token:string},thunkAPI) => {
  try {
      return (await profileUpload(file,token));
  } catch (error:any) {
      return thunkAPI.rejectWithValue('');
  }
 }
)

export const getUserProfile = createAsyncThunk(
    'auth/user/profile',
    async ({id}:{id:string}, thunkAPI) => {
        try {
            return (await userDetails(id));
        } catch (error:any) {
            const message = (error.message && error.message.data && error.response.data.message) || error.message || error.toString() || '';
            return thunkAPI.rejectWithValue(message);
        }
    })

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
    .addCase(logoutUser.fulfilled, ((state) => {
	state.token = null;
	state.user = {} as UserState;
	state.notifications.type = 'success';
	state.notifications.message = 'logout successfull';
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
      if(typeof action.payload.result === 'object') {
        const { token, _doc} = action.payload.result;
        state.token = token;
        state.user = _doc;
        state.notifications.type = 'success';
        state.notifications.message = 'post bookmarked successfully';
      }
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
    .addCase(deleteAccount.fulfilled, (state) => {
 	state.token = null;
	state.user = {} as UserState;
	state.notifications.type = 'success';
	state.notifications.message = 'logout successfull';
   })
    .addCase(deleteAccount.rejected, (state,action) => {
      if(typeof action.payload === 'string') {
        state.notifications.type = 'error';
        state.notifications.message = action.payload;
      }
    })
    .addCase(changeEmail.fulfilled, (state,action) => {
      if(typeof action.payload.result === 'object') {
        const { token, _doc} = action.payload.result;
        state.token = token;
        state.user = _doc;
        state.notifications.type = 'success';
        state.notifications.message = 'user email changed successfully';
      }
    })
    .addCase(changeEmail.rejected, (state,action) => {
      if(typeof action.payload === 'string') {
        state.notifications.type = 'error';
        state.notifications.message = action.payload;
      }
    })
    .addCase(changeAccountInfo.fulfilled, (state,action) => {
      if(typeof action.payload.result === 'object') {
        const { token, _doc} = action.payload.result;
        state.token = token;
        state.user = _doc;
        state.notifications.type = 'success';
        state.notifications.message = 'user info updated successfully';
      }
    })
    .addCase(changeAccountInfo.rejected, (state,action) => {
      if(typeof action.payload === 'string') {
        state.notifications.type = 'error';
        state.notifications.message = action.payload;
      }
    })
    .addCase(followUser.fulfilled, (state,action) => {
        if(typeof action.payload.result === 'object') {
            state.userProfile = action.payload.result;
            state.notifications.type = 'success';
            state.notifications.message = action.payload.message;
      }
    })
    .addCase(followUser.rejected, (state,action) => {
      if(typeof action.payload === 'string') {
        state.notifications.type = 'error';
        state.notifications.message = action.payload;
      }
    })
    .addCase(uploadProfile.pending, (state) => {
      state.notifications.type = 'running';
      state.notifications.message = 'image uploading';
    })
    .addCase(uploadProfile.fulfilled, (state, action) => {
        state.notifications.type = 'success';
        state.notifications.message = 'image uploaded successfully';
        if(typeof action.payload.result === 'object') {
            const { token, _doc } = action.payload.result;
            state.token = token 
            state.user = _doc
          }
    })
    .addCase(uploadProfile.rejected, (state, action) => {
        if(typeof action.payload === 'string') {
            state.notifications.type = 'error';
            state.notifications.message = action.payload;
        }
    })
    .addCase(getUserProfile.pending, (state) => {
        state.notifications.type = 'loading';
        state.notifications.message = 'fetching user records';
    })
    .addCase(getUserProfile.fulfilled, (state,action) => {
       if(typeof action.payload.result === 'object') {
          state.userProfile = action.payload.result;
        }
    })
    .addCase(getUserProfile.rejected, (state,action) => {
        if(typeof action.payload === 'string') {
            state.notifications.type = 'error';
            state.notifications.message = action.payload;
        }
    })
    .addCase(basicInfoChange.fulfilled, (state, action) => {
        state.notifications.type = 'success';
        state.notifications.message = action.payload.message;
        if(typeof action.payload.result === 'object') {
            state.token = action.payload.result.token;
            state.user = action.payload.result._doc;
        }
    })
    .addCase(basicInfoChange.rejected, (state,action) => {
        if(typeof action.payload === 'string') {
            state.notifications.type = 'error';
            state.notifications.message = action.payload;
        }
    })
  }
})

export const { notify } = authSlice.actions

// Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.auth

export default authSlice.reducer
