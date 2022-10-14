import { MdDone } from "react-icons/md";
import { VscError } from "react-icons/vsc";

import { NotificationsType } from "../types/authTypes";

const ErrorMessage = (notifications: NotificationsType) => {
  const {type, message} = notifications;

  return (
    <div className={`${type === 'idle' ? 'hidden': 'z-50 fixed top-3 right-1 p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4'}`}>
      <div className={`${type === 'error' ? 'shrink-0 text-3xl text-red-700' : 'shrink-0 text-3xl text-green-600'}`}>
        {type === 'error' ? 
        (
          <VscError />
        ) :
        (
          <MdDone />
        )  
      }
      </div>
      <div>
        <div className={type === 'error' ? 'text-xl font-medium text-red-600 capitalize' : 'text-xl font-medium text-green-600 capitalize'}>{type}</div>
        <p className="text-slate-500">{message}</p>
      </div>
    </div>
  )
}

export default ErrorMessage
