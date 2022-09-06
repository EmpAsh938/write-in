import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <main className='min-h-screen bg-green-400'>
      <section>
        <div className='py-20 px-5 text-center flex flex-col gap-4'>
          <h1><span className='text-5xl font-bold mr-1'>404</span>Page not found</h1>
          <Link to='/' className='w-fit mx-auto bg-white rounded py-2 px-5'>Home</Link>
        </div>
      </section>
    </main>
  )
}

export default PageNotFound