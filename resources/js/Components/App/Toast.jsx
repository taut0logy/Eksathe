import { useEventBus } from "@/EventBus"
export default function  Toast({message}) {
    const [toasts, setToasts] = useState([]);
    const {on} = useEventBus();


    return (
        <div className="toast">
            <div className="alert alert-success">
                <span>{message}</span>
            </div>
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
