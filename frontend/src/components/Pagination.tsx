type Props = {
    handleClick: () => void
}

const Pagination = ({handleClick}:Props) => {

  return (
    <section className='flex items-center justify-center mt-2 xs:mt-0'>
        <button onClick={handleClick} className='px-2 py-1 text-sm font-semibold text-green-800 bg-white border border-green-300 border-solid rounded-sm cursor-pointer'>
            Load More
        </button>
  </section>
  )
}

export default Pagination;
