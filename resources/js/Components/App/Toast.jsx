import { useEventBus } from "@/EventBus"
import { useEffect, useState } from "react"
import {v4 as uuid} from 'uuid';


export default function  Toast() {
    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
        on('toast.show', ({message, type}) => {
            const id = uuid();
            //setToasts((prev) => [...prev, {message, id, type}]);
            let toast = {message, id, type};
            let newToasts =[...toasts, toast];
            let uniqueToasts = newToasts.filter((toast, index, self) =>
                index === self.findIndex((t) => (
                    t.message === toast.message && t.type === toast.type && t.id === toast.id
                ))
            );
            setToasts(uniqueToasts);
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, 5000);
        });
    });

    return (
        <div className="toast toast-top toast-center z-50 w-full xs:w-auto">
            {toasts.map((toast, index) => (
                <div key={toast.id}
                className={`alert py-3 px-4 rounded-md ${
                    (toast.type === 'success' && 'alert-success') ||
                    (toast.type === 'error' && 'alert-error') ||
                    (toast.type === 'info' && 'alert-info')
                }`}>
                    <span >{toast.message}</span>

                </div>
            ))}

        </div>
    )
}
