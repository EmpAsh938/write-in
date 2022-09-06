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


function App() {
  const { notifications, token } = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {

    let timer = setTimeout(() => {
      if(notifications.message) {
        dispatch(notify({type:'error',message:''}));
      }
    }, 2000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [notifications])

  useEffect(() => {
    if(token) {
      dispatch(verifyUser(token));
    }
    
    // eslint-disable-next-line
  }, [])
  
  return (
    <BrowserRouter>
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
          <Route path="new" element={
           <Blog />} />
          <Route path="edit" element={
            <Blog/>} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;