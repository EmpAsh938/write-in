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

const passwordChange = async (oldpassword:string,newpassword:string,token:string) => {
    const response = await axios.put('/auth/change/password',
    {oldpassword,newpassword},
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}

const removeAccount =async (token:string) => {
    const response = await axios.delete('/auth/change/account', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    localStorage.clear();
    return response.data;
}

const emailChange = async (email:string,token:string) => {
	const response = await axios.put('/auth/change/email', {email}, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
	return response.data;
}

const accountDetailsChange = async (fullname:string,username:string,bio:string,token:string) =>  {
	const response = await axios.put('/auth/change/account', {fullname,username,bio}, {
		headers: {
			Authorization: `Bearer ${token}`
		}
	})
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
	return response.data;
}
const toggleFollow = async (follow_id:string,token:string) =>  {
    const response = await axios.get(`/auth/follow?follow_id=${follow_id}`, {
        headers: {
			Authorization: `Bearer ${token}`
		}
	})
	return response.data;
}

const userDetails = async (id:string) => {
    const response = await axios.get(`/auth/user/${id}`);
    return response.data;
}

export { register, login, logout, bookmark, verify, passwordChange,removeAccount, emailChange, accountDetailsChange,toggleFollow, userDetails };
