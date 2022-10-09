import {MouseEvent, useEffect, useState} from 'react'

import Navbar from '../components/Navbar'
import {PostsType} from '../types/postTypes'
import HomeBlogs from '../components/HomeBlogs'
import UserImage from '../components/UserImage'
import { UserState } from '../types/authTypes'
import { tabHandler } from '../utils/tabHandler'


const localstorage_key = JSON.parse(localStorage.getItem('user_db') || '{}');

const User = () => {
    const [userBlogs, setUserBlogs] = useState<PostsType[]>([]);
    const [userProfile, setUserProfile] = useState<UserState>({} as UserState);

    const handleBlogsTab = (event:MouseEvent<HTMLButtonElement>) => {
        tabHandler(event,'user-blog-tab');
    }

    const handleProfileTab = (event:MouseEvent<HTMLButtonElement>) => {
        tabHandler(event,'user-profile-tab');
    }
    const handleFollow = () => {
        if(userProfile.followers.includes(localstorage_key._id)) {
            // unfollow 
        } else {
            // follow
        }

    }
    useEffect(() => {
        
    }, [])
  return (
    <>
        <Navbar />
        <main className='flex flex-col max-w-xl m-auto gap-4'>
            <section className='flex items-center justify-start gap-2'>
                <div className='flex flex-col gap-2'>
                    <UserImage profileImage='' fullname='' width={300} height={300} />
                    <div>
                        <button onClick={handleFollow}>{(userProfile.followers.includes(localstorage_key._id)) ? 'Unfollow' : 'follow'}</button>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                   <div>
                        <button onClick={handleProfileTab} className='user-profile-tab'>Profile</button>
                        <button onClick={handleProfileTab} className='user-profile-tab'>About</button>
                   </div> 
                   <div></div> 
                </div>
            </section>
            <section>
                <div className='flex items-center justify-between border-solid border-bottom border-color-slate-400'>
                    <h2>his blogs</h2>
                    <div className='flex items-center justify-start gap-2'>
                        <button onClick={handleBlogsTab} className='user-blog-tab'>Most Recent</button>
                        <button onClick={handleBlogsTab} className='user-blog-tab'>Oldest</button>
                        <button onClick={handleBlogsTab} className='user-blog-tab'>Most Liked</button>
                    </div>
                </div>
                <div className='flex flex-col gap-2'>
                    {
                        userBlogs.length > 0 ? (
                            userBlogs.map(item => {
                                return <HomeBlogs key={item._id} {...item} />
                            })
                        ) : (
                            <p>no items to display</p>
                        )
                    }
                </div>
            </section>
        </main>
    </>
  )
}

export default User
