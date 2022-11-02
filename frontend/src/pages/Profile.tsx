import { ChangeEvent, useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import Modal from '../components/Modal';
import Navbar from '../components/Navbar';
import Country from '../components/Country';
import UserImage from '../components/UserImage';

import { tabHandler } from '../utils/tabHandler';
import { emailValidator } from '../utils/emailValidator';
import { basicInfoChange, uploadProfile } from '../app/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/useReactRedux';
import { changeAccountInfo, changeEmail, changePassword, deleteAccount, notify } from '../app/features/auth/authSlice';

const Profile = () => {
    const { token, user } = useAppSelector(state => state.auth);

    const [name, setName] = useState<string | null>(user.fullname);
    const [uname, setUname] = useState<string | null>(user.username);
    const [mail, setMail] = useState<string | null>(user.email);
    const [newPassword, setNewPassword] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [country, setCountry] = useState<string>(user.country);
    const [website, setWebsite] = useState<string>(user.website);
    const [bio, setBio] = useState<string>(user.bio);
    const [activeTab, setActiveTab] = useState<string>('account');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();


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


    const handleBasicInfo = () => {
        if((bio || website || country) && token) {
            dispatch(basicInfoChange({bio,website,country,token}));
        }
    }

    const handleDeleteUser = () => {
        if(token) {
            dispatch(deleteAccount({token}));
        } else {
            dispatch(notify({type:'error',message:'delete user failed'}));
        }
    };

    const handleFileChange = (event:ChangeEvent<HTMLInputElement>) => {
        let filelist = event.target.files;
        if(token && filelist) {
            dispatch(uploadProfile({file:filelist[0],token}));
        }
    }

    const handleTabs = (event:MouseEvent<HTMLButtonElement>) => {
        tabHandler(event,'profile-tab-btn');
        if(event.currentTarget.dataset.id) {
            setActiveTab(event.currentTarget.dataset.id);
        }
    }

    
    useEffect(() => {
    
        document.querySelectorAll<HTMLElement>('.tabs').forEach(tabs => {
            if(tabs.getAttribute('id') === activeTab) tabs.style.display = 'flex'
            else tabs.style.display = 'none';
        });
    }, [activeTab])

    useEffect(() => {
        if(!token) navigate('/');
    },[token,navigate])
    return (
        <div className='bg-slate-100'>
            { isModalOpen && <Modal message={"Deleting User will lead to permanent removal of account. You won't be able to access anything afterwards."} handleExecute={handleDeleteUser} handleCancel={()=>setIsModalOpen(false)} /> }
            <Navbar />
            <main className='flex flex-col max-w-lg p-5 mx-auto bg-white gap-8'>
                <section className='flex flex-wrap items-center justify-center gap-2'>
                    <button className='profile-tab-btn active' onClick={handleTabs} data-id='account'>Account</button>
                    <button className='profile-tab-btn' onClick={handleTabs} data-id='basic'>Basic</button>
                    <button className='profile-tab-btn' onClick={handleTabs} data-id='security'>Security</button>
                </section>
                <section className='flex-col hidden gap-2 tabs' id='account'>

                    <p className='text-sm text-gray-500'>Your account summary is displayed here. You can change the account details as per your choice.</p>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Your Fullname</h2>
                        <input type="text" value={name || ''} onChange={e => setName(e.target.value)} className='px-2 py-1 text-sm border border-green-300 border-solid rounded outline-none' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Your Username</h2>
                        <input type="text" value={uname || ''} onChange={e => setUname(e.target.value)} className='px-2 py-1 text-sm border border-green-300 border-solid rounded outline-none' />
                    </div>
                    <button onClick={handleProfileChange} className='px-10 py-2 text-white bg-green-500 rounded-sm'>Save Changes</button>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Photo</h2>
                        <div className='flex flex-col gap-2'>
                            <UserImage profileImage={user.profileImage} fullname={user.fullname} width={50} height={50} />
                            <div className='relative'>
                                <input onChange={handleFileChange} type='file' name='photos' accept='image/*' />
                            </div>
                        </div>
                    </div>
                </section>
                <section className='flex-col hidden gap-2 tabs' id='basic'>
                    <p className='text-sm text-gray-500'>User basic information can be edited here.</p>
                    <div className='flex flex-col gap-1'>
                        <h2>Bio</h2>
                        <input type='text' className='p-1 py-3 border border-gray-300 border-solid' value={bio} onChange={e=>setBio(e.target.value)}/>
                    </div>
                    {token && <Country country={country} setCountry={setCountry}/>}
                    <div className='flex flex-col gap-1'>
                        <h2>Website</h2>
                        <input className='p-1 border border-gray-300 border-solid' type="text" value={website} onChange={e=>setWebsite(e.target.value)}/>
                    </div>
                    <div className='mt-3'>
                        <button className='w-[200px] block p-2 mx-auto text-white bg-green-500' onClick={handleBasicInfo}>Save Changes</button>
                    </div>
                </section>
                <section className='flex-col hidden gap-2 tabs' id='security'>
                    <p className='text-sm text-gray-500'>Security details are enlisted below. Unintentional and unwanted changes might risk to permanently lost of an account.</p>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Change Email</h2>
                        <p className='text-sm text-gray-500'>Change Your email here. Old Email will be removed and new email will be assosciated to you.</p>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="email">Enter Email</label>
                            <input value={mail || ''} onChange={e => setMail(e.target.value)} type="email" id="email" className='px-2 py-1 text-sm border border-green-300 border-solid rounded outline-none' />
                        </div>
                        
                        <button onClick={handleEmailChange} className='px-10 py-2 text-white bg-green-500 rounded-sm'>Save Changes</button>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>Change Password</h2>
                        <p className='text-sm text-gray-500'>Changing to new password is available here. New Password will be created for your account</p>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="oldpassword">Enter Old Password</label>
                            <input value={oldPassword} onChange={e => setOldPassword(e.target.value)} type="password" id="oldpassword" className='px-2 py-1 text-sm border border-green-300 border-solid rounded outline-none' />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label htmlFor="newpassword">Enter New Password</label>
                            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} type="password" id="newpassword" className='px-2 py-1 text-sm border border-green-300 border-solid rounded outline-none' />
                        </div>
                        <button className='px-10 py-2 text-white bg-green-500 rounded-sm' onClick={handlePasswordChange}>Save Changes</button>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-xl font-medium'>
                            Delete Your Account
                        </h2>
                        <p className='text-sm text-gray-500'>Your account will be permanently deleted along with all the blogs you have posted since you last created your account. You won't be able to recover your account back again once it's deleted. Do it on your own risk.</p>
                        <button onClick={()=>setIsModalOpen(true)} className='px-10 py-2 text-white bg-red-500 rounded-sm w-fit'>Delete</button>
                    </div>

                </section>
            </main>
        </div>
    )
}

export default Profile
