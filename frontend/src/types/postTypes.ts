import { UserState } from '../app/features/auth/authSlice';


export type PostsType = {
    _id:string;
    title:string;
    markdown:string;
    status: 'draft' | 'published';
    author: UserState;
    createdAt: string;
    updatedAt: string;
}

export type PostsObjType = {
    title: string;
    markdown:string;
    status:'draft' | 'published';
}