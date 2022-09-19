import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import postReducer from './features/post/postSlice'
import uploadReducer from './features/upload/uploadSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
    upload: uploadReducer
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch