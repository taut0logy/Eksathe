import { useEventBus } from "@/EventBus"
import { useEffect, useState } from "react"
import {v4 as uuid} from 'uuid';


export default function  Toast({type = 'success'}) {
    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
        on('toast.show', (message) => {
            const id = uuid();
            setToasts((prev) => [...prev, {message, id}]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, 5000);
        });
    });

    return (
        <div className="toast toast-top toast-center min-w-[240px]">
            {toasts.map((toast, index) => (
                <div key={toast.id}
                className={`alert py-3 px-4 rounded-md ${
                    (type === 'success' && 'alert-success') ||
                    (type === 'error' && 'alert-error') ||
                    (type === 'info' && 'alert-info')
                }`}>
                    <span>{toast.message}</span>
                </div>
            ))}

        </div>
    )
    // return (
    //     <div className="fixed bottom-4 right-4 z-50">
    //         <div className="bg-black/80 text-white p-4 rounded-lg shadow-lg">
    //             {message}
    //         </div>
    //     </div>
    // )
}
