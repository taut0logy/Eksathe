import { useEventBus } from "@/EventBus"
import { useEffect, useState } from "react"
import {v4 as uuid} from 'uuid';
import UserAvatar from "./UserAvatar";
import { Link } from "@inertiajs/react";


export default function  NewMessageNotification({}) {
    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();

    useEffect(() => {
        on('newMessageNotification', (user, server_id, message) => {
            const id = uuid();
            //console.log(user, server_id, message);
            let toast = {message, id, user, server_id};
            console.log(toast);

            let newToasts =[...toasts, toast];
            let uniqueToasts = newToasts.filter((toast, index, self) =>
                index === self.findIndex((t) => (
                    t.user.user === toast.user.user &&
                    t.user.server_id === toast.user.server_id
                ))
            );
            setToasts(uniqueToasts);

            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, 5000);
        });
    }, [on]);

    return (
        <div className="toast toast-top toast-center min-w-[240px]">
            {toasts.map((toast, index) => (
                <div key={toast.id}
                className="alert alert-success py-3 px-4 rounded-md">
                    <Link className="flex items-center gap-2"
                    href={
                        toast.user.server_id
                        ? route('chat.server', toast.user.server_id)
                        : route('chat.user', toast.user.user)
                    }
                    >
                    <UserAvatar user={toast.user.user} className="w-8 h-8 rounded-full" />
                    <span>{toast.user.message}</span>
                    </Link>
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
