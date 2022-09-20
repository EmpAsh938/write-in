import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Blog from './pages/Blog';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PageNotFound from './pages/PageNotFound';
import { notify, verifyUser } from './app/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './hooks/useReactRedux';
import SingleBlog from './pages/SingleBlog';
import { postNotification } from './app/features/post/postSlice';
import Search from './pages/Search';
import Bookmarks from './pages/Bookmarks';
import ErrorMessage from './components/ErrorMessage';


function App() {
  const { notifications: notificationAuth, token } = useAppSelector(state => state.auth);
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

  useEffect(() => {
    if(token) {
      dispatch(verifyUser(token));
    }
    
    // eslint-disable-next-line
  }, [])
  
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
            <Profile />} />
          <Route path="dashboard" element={
            <Dashboard/>} />
          <Route path="bookmark" element={
            <Bookmarks />} />
          <Route path="search" element={
            <Search />} />
          <Route path="new" element={
           <Blog />} />
          <Route path="edit/:id" element={
            <Blog/>} />
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