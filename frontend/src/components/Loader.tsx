const Loader = () => {
return (
        <div className='flex items-center justify-center py-5'>
            <div className='inline-block w-10 h-10 border-4 rounded-full border-t-green-800 spinner-border animate-spin'>
            </div>
            <span className='ml-2 text-lg font-medium'>Loading...</span>
        </div>
)
}


export default Loader;
