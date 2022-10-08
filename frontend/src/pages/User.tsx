import {SyntheticEvent, useEffect, useState} from 'react'

import Navbar from '../components/Navbar'
import {PostsType} from '../types/postTypes'
import HomeBlogs from '../components/HomeBlogs'
import UserImage from '../components/UserImage'

const handleBlogsTab = (event:SyntheticEvent<HTMLButtonElement>) => {
    document.querySelectorAll('.blog-tab').forEach(tab => {
        tab.classList.remove('active');
    })
    (event.target as Element).classList.add('active');
}

const User = () => {
    const [userBlogs, setUserBlogs] = useState<PostsType[]>([]);
    useEffect(() => {
        
    }, [])
  return (
    <>
        <Navbar />
        <main className='flex flex-col max-w-xl m-auto gap-4'>
            <section className='flex items-center justify-start gap-2'>
                <div>
                    <UserImage profileImage='' fullname='' width={300} height={300} />
                </div>
                <div className='flex flex-col gap-2'>
                   <div>
                        <button>Profile</button>
                        <button>About</button>
                   </div> 
                   <div></div> 
                </div>
            </section>
            <section>
                <div className='flex items-center justify-between border-solid border-bottom border-color-slate-400'>
                    <h2>his blogs</h2>
                    <div className='flex items-center justify-start gap-2'>
                        <button>Most Recent</button>
                        <button>Oldest</button>
                        <button>Most Liked</button>
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
