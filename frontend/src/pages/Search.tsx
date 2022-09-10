import HomeBlogs from '../components/HomeBlogs';
import Navbar from '../components/Navbar'
import { useAppSelector } from '../hooks/useReactRedux';

const Search = () => {
    const { searchPosts, query } = useAppSelector(state => state.post);
  return (
    <>
        <Navbar />
        <main className='max-w-4xl mx-auto p-5'>
            <section>
                <h3>Search for {query || "''"}</h3>
            </section>
            <section>
                {searchPosts.length > 0 ? (
                    searchPosts.map(item => {
                        return (
                            <HomeBlogs key={item._id} {...item} />
                        )
                    })
                ) : (
                    <p>no search results found.</p>
                )}
            </section>
        </main>
    </>
  )
}

export default Search