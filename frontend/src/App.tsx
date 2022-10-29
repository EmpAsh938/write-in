import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import User from './pages/User';
import Blog from './pages/Blog';
import Home from './pages/Home';
import Login from './pages/Login';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Bookmarks from './pages/Bookmarks';
import SingleBlog from './pages/SingleBlog';
import PageNotFound from './pages/PageNotFound';
import ErrorMessage from './components/ErrorMessage';

import { notify, verifyUser } from './app/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './hooks/useReactRedux';
import { postNotification, resetPages } from './app/features/post/postSlice';
import { resetNotification } from './app/features/upload/uploadSlice';



function App() {
  const { notifications: notificationAuth, token } = useAppSelector(state => state.auth);
  const { notifications: notificationPost } = useAppSelector(state => state.post);
  const { notifications: notificationUpload } = useAppSelector(state => state.post);

  const dispatch = useAppDispatch();

  useEffect(() => {
    let timer = setTimeout(() => {
      if(notificationAuth.type !=='idle' || notificationPost.type !== 'idle' || notificationUpload.type !== 'idle') {
        dispatch(notify({type:'idle',message:''}));
        dispatch(postNotification({type: 'idle', message:''}));
        dispatch(resetNotification({type: 'idle', message:''}));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, notificationAuth.type, notificationPost.type, notificationUpload.type])

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
      {notificationAuth.type && <ErrorMessage {...notificationAuth} />}
      {notificationPost.type && <ErrorMessage {...notificationPost} />}
      {notificationUpload.type && <ErrorMessage {...notificationUpload} />}
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
