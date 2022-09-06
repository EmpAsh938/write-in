import axios from 'axios';


// list all public blogs
export const listPublicAll = async (pages:number,rows:number) => {
    const response = await axios.get(`post/all?pages=${pages}&rows=${rows}`);
    return response.data;
}