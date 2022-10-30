type Props = {
    handleExecute : () => void;
    handleCancel : () => void;
}
const Modal = ({handleExecute, handleCancel}:Props) => {
    return (
        <div className="fixed inset-0 w-full h-full bg-[rgba(0,0,0,.4)] grid place-items-center">
            <div className="bg-white p-2 rounded flex flex-col gap-3">
               <div className="text-xl font-medium">Are you sure want to perform this action</div> 
               <div>You won't be able to undo the operation once it's done.</div> 
               <div>
                    <button onClick={handleExecute}>Execute</button>
                    <button onClick={handleCancel}>Cancel</button>
               </div> 
            </div>
        </div>
    )
}

export default Modal;
