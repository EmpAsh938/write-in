import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import ErrorMessage from '../components/ErrorMessage';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { emailValidator } from '../utils/emailValidator';
import { changeAccountInfo, changeEmail, changePassword, deleteAccount, notify } from '../app/features/auth/authSlice';


const Profile = () => {
    const { token, notifications, user } = useAppSelector(state => state.auth);
    const [name, setName] = useState<string | null>(user.fullname);
    const [uname, setUname] = useState<string | null>(user.username);
    const [mail, setMail] = useState<string | null>(user.email);
    const [newPassword, setNewPassword] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handlePasswordChange = () => {
        if(oldPassword && newPassword && token) {
            dispatch(changePassword({oldpassword:oldPassword,newpassword:newPassword,token}));
            setOldPassword('');
        }
        setNewPassword('');
    }

    const handleEmailChange = () => {
        if(token && emailValidator(mail || '')) {
            dispatch(changeEmail({email:mail || '', token}));
        } else {
            dispatch(notify({type:'error',message:'email change failed'}));
        }
    }

    const handleProfileChange = () => {
        if(token && (name || uname)) {
            dispatch(changeAccountInfo({fullname:name || '',username:uname || '',bio:'',token}));
        } else {
            dispatch(notify({type:'error',message:'user profile update failed'}));
        }
    }

    const handleDeleteUser = () => {
        if(token) {
            dispatch(deleteAccount({token}));
        } else {
            dispatch(notify({type:'error',message:'delete user failed'}));
        }
    };

    useEffect(() => {
        if(!token) navigate('/login');

        // eslint-disable-next-line
    }, [token])
    return (
        <div className='bg-slate-100'>
            <Navbar />
            {notifications.type && <ErrorMessage {...notifications}/>}
            <main className='max-w-lg mx-auto p-5 flex flex-col gap-8 bg-white'>
                <section className='flex flex-col gap-2'>

                    <h1 className='text-2xl font-bold text-center'>Account</h1>
                    <p className='text-gray-500 text-sm'>Your account summary is displayed here. You can change the account details as per your choice.</p>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Your Fullname</h2>
                        <input type="text" value={name || ''} onChange={e => setName(e.target.value)} className='outline-none border border-solid border-green-300 rounded px-2 py-1 text-sm' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Your Username</h2>
                        <input type="text" value={uname || ''} onChange={e => setUname(e.target.value)} className='outline-none border border-solid border-green-300 rounded px-2 py-1 text-sm' />
                    </div>
                    <button onClick={handleProfileChange} className='bg-green-500 px-10 text-white py-2 rounded-sm'>Change</button>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Photo</h2>
                    </div>
                </section>
                <section className='flex flex-col gap-2'>
                    <h1 className='text-2xl font-bold text-center'>Security</h1>
                    <p className='text-gray-500 text-sm'>Security details are enlisted below. Unintentional and unwanted changes might risk to permanently lost of an account.</p>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Change Email</h2>
                        <p className='text-gray-500 text-sm'>Change Your email here. Old Email will be removed and new email will be assosciated to you.</p>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="email">Enter Email</label>
                            <input value={mail || ''} onChange={e => setMail(e.target.value)} type="email" id="email" className='outline-none border border-solid border-green-300 rounded px-2 py-1 text-sm' />
                        </div>
                        
                        <button onClick={handleEmailChange} className='bg-green-500 px-10 text-white py-2 rounded-sm'>Change</button>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Change Password</h2>
                        <p className='text-gray-500 text-sm'>Changing to new password is available here. New Password will be created for your account</p>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="oldpassword">Enter Old Password</label>
                            <input value={oldPassword} onChange={e => setOldPassword(e.target.value)} type="password" id="oldpassword" className='outline-none border border-solid border-green-300 rounded px-2 py-1 text-sm' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="newpassword">Enter New Password</label>
                            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" id="newpassword" className='outline-none border border-solid border-green-300 rounded px-2 py-1 text-sm' />
                        </div>
                        <button className='bg-green-500 px-10 text-white py-2 rounded-sm' onClick={handlePasswordChange}>Change</button>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>
                            Delete Your Account
                        </h2>
                        <p className='text-gray-500 text-sm'>Your account will be permanently deleted. You won't be able to recover your account back again once it's deleted. Do it on your own risk.</p>
                        <button onClick={handleDeleteUser} className='bg-red-500 w-fit px-10 text-white py-2 rounded-sm'>Delete</button>
                    </div>

                </section>
            </main>
        </div>
    )
}

export default Profile