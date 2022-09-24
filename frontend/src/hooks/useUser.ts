import { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from './useReactRedux';
import { verifyUser } from '../app/features/auth/authSlice';

export const useUser = () => {
    const { token, user } = useAppSelector(state => state.auth);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if(token) {
            dispatch(verifyUser(token));
        } else {
            setIsAuthorized(false);
        }
        if(user) {
            setIsAuthorized(true);
        }
    }, [token, user])

    return isAuthorized;
}