import { Navigate } from 'react-router-dom';

type Props = {
    isUser: boolean;
    outlet: JSX.Element;
}

const ProtectedRoute = ({ outlet, isUser }:Props) => {
    if(!isUser) {
        return <Navigate to='/' />
    } 
    return outlet;
}

export { ProtectedRoute };