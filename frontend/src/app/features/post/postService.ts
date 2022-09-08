import axios from 'axios';


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
export const listPrivateAll = async (pages:number,rows:number,token:string) => {
    const response = await axios.get(`/post/me?pages=${pages}&rows=${rows}`,
        {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
}

// edit blog
export const editBlog = async (id:string,token:string) => {
    const response = await axios.put(`/post/edit/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}
// delete blog
export const deleteBlog = async (id:string,token:string|null) => {
    const response = await axios.delete(`/post/delete/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

// save blog
export const savePost =async (title:string,markdown:string,status:'published'|'draft',token:string|null) => {
    const response = await axios.post(`/post/save`, 
    {title,markdown,status},
    {
        headers: {
            Authorization: `Bearer ${token}`
        },
        
    })
    return response.data;
}
