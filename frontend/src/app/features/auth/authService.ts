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

// verify
const verify = async (token:string) => {
    const response = await axios.get('/auth/verify', { 
        headers: {
        Authorization: `Bearer ${token}`
    } });
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}

export { register, login, logout, verify };