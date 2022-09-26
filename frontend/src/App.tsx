import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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

import { useUser } from './hooks/useUser';
import { notify } from './app/features/auth/authSlice';
import { ProtectedRoute } from './helper/routes-helper';
import { useAppDispatch, useAppSelector } from './hooks/useReactRedux';
import { postNotification } from './app/features/post/postSlice';


function App() {
  const isUser = useUser();
  const { notifications: notificationAuth } = useAppSelector(state => state.auth);
  const { notifications: notificationPost } = useAppSelector(state => state.post);

  const dispatch = useAppDispatch();

  useEffect(() => {

    let timer = setTimeout(() => {
      if(notificationAuth.type !=='idle' || notificationPost.type !== 'idle') {
        dispatch(notify({type:'idle',message:''}));
        dispatch(postNotification({type: 'idle', message:''}));
      }
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [notificationAuth.type, notificationPost.type])

  return (
    <BrowserRouter>
      {notificationAuth.type && <ErrorMessage {...notificationAuth} />}
      {notificationPost.type && <ErrorMessage {...notificationPost} />}
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="login" element={
            <Login />} />
          <Route path="register" element={
            <Register />} />
          <Route path="profile" element={
            <ProtectedRoute isUser={isUser} outlet={<Profile />} />
            } />
          <Route path="dashboard" element={
            <ProtectedRoute isUser={isUser} outlet={<Dashboard />} />
            } />
          <Route path="bookmark" element={
            <ProtectedRoute isUser={isUser} outlet={<Bookmarks />} />
          } />
          <Route path="search" element={
            <Search />} />
          <Route path="new" element={
           <ProtectedRoute isUser={isUser} outlet={<Blog />} />
          } />
          <Route path="edit/:id" element={
            <ProtectedRoute isUser={isUser} outlet={<Blog />} />
          } />
          <Route path=':id'element={
            <SingleBlog />
            } />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;