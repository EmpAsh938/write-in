import { UserState } from "./authTypes";



export type PostsType = {
    _id:string;
    title:string;
    markdown:string;
    status: 'draft' | 'published';
    author: UserState;
    likes: [string];
    createdAt: string;
    updatedAt: string;
    images: [string];
}

export type PostsObjType = {
    title: string;
    markdown:string;
    status:'draft' | 'published';
}
