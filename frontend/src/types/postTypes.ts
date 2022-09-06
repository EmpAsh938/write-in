import { UserState } from '../app/features/auth/authSlice';


export type PostsType = {
    _id:string;
    title:string;
    markdown:string;
    author: UserState;
    createdAt: string;
    updatedAt: string;
}