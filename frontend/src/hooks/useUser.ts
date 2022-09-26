import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from './useReactRedux';
import { verifyUser } from '../app/features/auth/authSlice';

export const useUser = () => {
    const { token, user } = useAppSelector(state => state.auth);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(verifyUser(token || ''));
        if(!token) {
            setIsAuthorized(false);
        } else {
            setIsAuthorized(true);
        }
    }, [dispatch,token,user._id])
    return isAuthorized;
}