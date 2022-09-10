import axios from 'axios';
import { PostsObjType } from '../../../types/postTypes';


// list all public blogs
export const listPublicAll = async (pages:number,rows:number) => {
    const response = await axios.get(`/post/all?pages=${pages}&rows=${rows}`);
    return response.data;
}

// list single blog
export const listSingle = async (id:string) => {
    const response = await axios.get(`/post/get/${id}`);
    return response.data;
}

// list private all blogs
export const listPrivateAll = async (pages:number,rows:number,token:string | null) => {
    const response = await axios.get(`/post/me?pages=${pages}&rows=${rows}`,
        {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

// edit blog
export const editBlog = async ({id,token,title,status,markdown}:PostsObjType & {id:string,token:string | null}) => {
    const response = await axios.put(`/post/edit/${id}`,
    {title,status,markdown},
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
// delete blog
export const deleteBlog = async (id:string,token:string|null) => {
    const response = await axios.delete(`/post/me/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

// save blog
export const savePost =async ({title,status,markdown,token}:PostsObjType & {token:string | null}) => {
    const response = await axios.post(`/post/save`, 
    {title,markdown,status},
    {
        headers: {
            Authorization: `Bearer ${token}`
        },
        
    })
    return response.data;
}

// search blog
export const searchBlog =async ({query}:{query:string}) => {
    const response = await axios.get(`/post/search?term=${query}`);
    return response.data;
}