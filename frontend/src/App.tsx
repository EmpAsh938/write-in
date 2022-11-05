import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { User, Blog, Home, Login, Search, Profile, Register, Dashboard, Bookmarks, SingleBlog, PageNotFound } from './pages';
import { ErrorMessage } from './components';

import { notify, verifyUser } from './app/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './hooks/useReactRedux';
import { postNotification, resetPages } from './app/features/post/postSlice';
import { resetNotification } from './app/features/upload/uploadSlice';
import { commentNotification } from './app/features/comment/commentSlice';



function App() {
  const { notifications: notificationAuth, token } = useAppSelector(state => state.auth);
  const { notifications: notificationPost } = useAppSelector(state => state.post);
  const { notifications: notificationUpload } = useAppSelector(state => state.upload);
  const { notifications: notificationComment } = useAppSelector(state => state.comment);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let timer = setTimeout(() => {
      if(notificationAuth.type !=='idle' || notificationPost.type !== 'idle' || notificationUpload.type !== 'idle' || notificationComment.type !== 'idle') {
        dispatch(notify({type:'idle',message:''}));
        dispatch(postNotification({type: 'idle', message:''}));
        dispatch(resetNotification({type: 'idle', message:''}));
        dispatch(commentNotification());
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, notificationAuth.type, notificationPost.type, notificationUpload.type, notificationComment.type])

  useEffect(() => {
      dispatch(resetPages());     
      const tokenValidation = () => {
          if(token) {
              dispatch(verifyUser(token));
          }
      }
      tokenValidation();
      // eslint-disable-next-line
}, [dispatch])

  return (
    <BrowserRouter>
    <div className={`${(notificationAuth.type === 'idle' && notificationPost.type === 'idle' && notificationUpload.type === 'idle') ? 'hidden': 'z-50 fixed top-3 right-1 p-6 max-w-sm mx-auto bg-transparent flex flex-col gap-4'}`}>
      {notificationAuth.type !== 'idle' && <ErrorMessage {...notificationAuth} />}
      {notificationPost.type !== 'idle' && <ErrorMessage {...notificationPost} />}
      {notificationUpload.type !== 'idle' && <ErrorMessage {...notificationUpload} />}
      {notificationComment.type !== 'idle' && <ErrorMessage {...notificationComment} />}
    </div>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={
            <Login />} />
          <Route path="register" element={
            <Register />} />
          <Route path="profile" element={
              <Profile />} />
          <Route path="dashboard" element={
              <Dashboard />} />
          <Route path="bookmark" element={
              <Bookmarks />} />
          <Route path="search" element={
            <Search />} />
          <Route path="new" element={
              <Blog />} />
          <Route path="edit/:id" element={
              <Blog />} />
          <Route path="user/:id" element={
              <User />
          } />
          <Route path=":id" element={
            <SingleBlog />
            } />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
