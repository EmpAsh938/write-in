import axios from 'axios';

export const upload = async (file:File,token:string) => {
    const formData = new FormData();
    formData.append('photos',file);
    const response = await axios.post('/upload/', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data;
}
export const profileUpload = async (file:File,token:string) => {
    const formData = new FormData();
    formData.append('photos',file);
    const response = await axios.post('/upload/profile', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    localStorage.setItem('user_db',JSON.stringify(response.data.result));
    return response.data;
}

export const removeUploads = async (images:string[],token:string) => {
    const response = await axios.post('/upload/cancel',{images}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
})
