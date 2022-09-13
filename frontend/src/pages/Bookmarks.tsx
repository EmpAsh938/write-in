import { FaRegBookmark } from 'react-icons/fa'
import HomeBlogs from '../components/HomeBlogs'
import Navbar from '../components/Navbar'

const Bookmarks = () => {

    const handleClick = (type:number) => {
        if(type === 0) {
            
        } else if (type === 1) {

        } else if (type === -1) {
            
        }

    }
  return (
   <>
    <Navbar />
    <main className='max-w-3xl mx-auto p-4'>
        <section>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center justify-start'>
                    <FaRegBookmark className='text-3xl' />
                    <h1 className='text-2xl text-gray-800 font-semibold'>Bookmarks</h1>
                </div>
                <div className='flex items-center justify-between pb-1 border-b border-solid border-green-300'>
                    <p className='text-lg'>Your reading list</p>
                    <div className='flex gap-1 text-sm'>
                        <button onClick={()=>handleClick(0)} className='active'>Relevant</button>
                        <button onClick={()=>handleClick(1)}>Oldest</button>
                        <button onClick={()=>handleClick(-1)}>Latest</button>
                    </div>
                </div>
            </div>
            <div>
                {/* <HomeBlogs /> */}
            </div>
        </section>
    </main>
   </>
  )
}

export default Bookmarks