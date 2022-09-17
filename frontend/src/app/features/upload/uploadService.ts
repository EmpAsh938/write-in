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