type Props = {
    message: string;
    handleCancel : () => void;
    handleExecute : () => void;
}
const Modal = ({message, handleExecute, handleCancel}:Props) => {
    return (
        <div className="fixed z-[100] inset-0 w-full h-full bg-[rgba(0,0,0,.4)] grid place-items-center">
            <div className="bg-white p-2 rounded flex flex-col gap-3">
               <h2 className="text-xl font-medium">Are you sure you want to perform this action?</h2> 
               <div>
                    <p>{message}</p>
               </div> 
               <div>
                    <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800" onClick={handleExecute}>Execute</button>
                    <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900" onClick={handleCancel}>Cancel</button>
               </div> 
            </div>
        </div>
    )
}

export default Modal;
