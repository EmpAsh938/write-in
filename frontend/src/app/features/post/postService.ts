import axios from 'axios';
import { PostsObjType } from '../../../types/postTypes';


// list all public blogs
export const listPublicAll = async (pages:number,rows:number) => {
    const response = await axios.get(`/post/all?pages=${pages}&rows=${rows}`);
    return response.data;
}

// list single blog
export const listSingle = async (id:string, token:string) => {
    const response = await axios.get(`/post/get/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
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
export const searchBlog =async ({query,pages,rows,sort}:{query:string,pages:number,rows:number,sort:number}) => {
    let prepareQuery = `/post/search?term=${query}&pages=${pages}&rows=${rows}`;
    if(sort === 1 || sort === -1) {
        prepareQuery = `${prepareQuery}&sort=${sort}`;
    }
    const response = await axios.get(prepareQuery);
    return response.data;
}

// like blog 
export const likePost =async ({id,token}:{id:string,token:string | null}) => {
    const response = await axios.get(`/post/like/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

// list bookmark
export const listBookmark =async (pages:number,rows:number,token:string) => {
    const response = await axios.get(`/auth/bookmark/list?pages=${pages}&rows=${rows}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

// list user blogs 
export const listUserBlogs = async (pages:number,rows:number,id:string,filter:string) => {
    const response = await axios.get(`/post/user/${id}?pages=${pages}&rows=${rows}&filter=${filter}`);
    return response.data;
}
