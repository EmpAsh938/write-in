export type LoginAuthState = {
    email: string;
    password: string;
}

export type RegisterAuthState = LoginAuthState & {
    username: string;
    fullname: string;
}

export type NotificationsType = {
    type: 'idle' | 'loading' | 'error' | 'success';
    message: string;
}

export type UserState = {
    _id: string;
    email: string;
    fullname: string;
    username:string;
    profileImage: string;
    followers: [string];
    bio: string;
    country: string;
    website: string;
    updatedAt: string;
}
