import axios from 'axios';

import { LoginAuthState, RegisterAuthState } from '../../../types/authTypes';


// Register user
const register =async (userData:RegisterAuthState) => {
    const response = await axios.post('/auth/register', userData);
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}

// Login user
const login =async (userData:LoginAuthState) => {
    const response = await axios.post('/auth/login', userData);
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}

// Logout
const logout = async () => {
    localStorage.clear();
}

// bookmark
const bookmark = async (id:string,token:string) => {
    const response = await axios.get(`/auth/bookmark/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

// verify
const verify = async (token:string) => {
    const response = await axios.get('/auth/verify', { 
        headers: {
        Authorization: `Bearer ${token}`
    } });
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}

// list bookmark
const listBookmark =async (rows:number,pages:number,token:string,sort:number) => {
    const response = await axios.get(`/auth/bookmark/list?pages=${pages}&rows=${rows}&sort=${sort}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

export { register, login, logout, bookmark, listBookmark, verify };