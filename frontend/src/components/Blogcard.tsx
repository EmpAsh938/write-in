import { FaTrash, FaEdit } from 'react-icons/fa';

const Blogcard = () => {
  return (
    <div className='flex justify-between items-center p-2 border border-solid border-green-200 rounded bg-white'>
      <h2 className='font-medium text-lg'>title</h2>
      <div className='flex gap-2 text-sm'>
        <button className='w-fit text-green-600'>
          <FaEdit />
        </button>
        <button className='w-fit text-red-600'>
          <FaTrash />
        </button>
      </div>
    </div>
  )
}

export default Blogcard