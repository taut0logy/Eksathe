import {Link, usePage} from "@inertiajs/react";
import {ArrowLeftIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/solid/index.js";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import ServerAvatar from "@/Components/App/ServerAvatar.jsx";
import ServerDetailPopover from "@/Components/App/ServerDetailPopover.jsx";
import ServerUsersPopover from "@/Components/App/ServerUsersPopover.jsx";
import UserPopover from "./UserPopover";
import {useEventBus} from "@/EventBus";
import { useEffect, useState } from "react";


export default function ConversationHeader({selectedConversation}) {

    const page = usePage();
    const user = page.props.auth.user;
    const { on, emit } = useEventBus();
//    const [isOnline, setIsOnline] = useState(false);

    // useEffect(() => {
    //     on('online.users', (data) => {
    //         setIsOnline(data.includes(selectedConversation.id.toString()));
    //         //console.log("online users", data,  isOnline);
    //     });

    //     on('server.updated', (server) => {
    //         //emit('toast.show', { message: "Server updated successfully", type: 'success' });
    //         console.log("server updated", server);
    //     });
    // }, [on]);



    const onServerDelete = () => {
        if(!window.confirm("Are you sure you want to delete this server?")){
            return;
        }

        axios.delete(route('server.destroy', selectedConversation.id))
            .then((response) => {
                //console.log("deleted", response.data);
                emit('toast.show', { message: response.data.message, type: 'info' });
                //emit('server.deleted', selectedConversation.id);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <>
            {selectedConversation && (
                <div className="flex items-center justify-between p-3 shadow-lg shadow-grey-800 bg-neutral/80 text-neutral-content z-20">
                    <div className={"flex items-center gap-3"}>
                        <Link
                            href={route("dashboard")}
                            className="text-primary hover:text-secondary"
                        >
                            <ArrowLeftIcon className="w-6"/>
                        </Link>
                        {selectedConversation.is_user && (
                            <UserAvatar user={selectedConversation} />
                        )}
                        {selectedConversation.is_server && (
                            <ServerAvatar />
                        )}
                        <div>
                            <h3>{selectedConversation.name}</h3>
                            {selectedConversation.is_server && (
                                <p className={"text-xs text-gray-500 dark:text-gray-400"}>
                                    {selectedConversation.users.length} members
                                </p>
                            )}
                        </div>
                    </div>
                    {selectedConversation.is_user && (
                        <UserPopover user={selectedConversation}/>
                    )}
                    {selectedConversation.is_server && (
                        <div className="flex gap-3">
                            <ServerDetailPopover server={selectedConversation}/>
                            <ServerUsersPopover users={selectedConversation.users}/>
                            {
                                selectedConversation.owner_id === user.id && (
                                    <>
                                    <div className="tooltip tooltip-left"
                                    data-tip="Edit Server">
                                        <button className="text-primary hover:text-accent"
                                        onClick={(e) => emit("ServerModal.show", selectedConversation)}
                                        >
                                            <PencilSquareIcon className=" w-6 h-6"/>
                                        </button>

                                    </div>
                                    <div className="tooltip tooltip-left"
                                    data-tip="Delete Server">
                                        <button className="text-primary hover:text-accent"
                                        onClick={(e) => onServerDelete()}
                                        >
                                            <TrashIcon className=" w-6 h-6"/>
                                        </button>
                                    </div>
                                    </>
                                )
                            }
                        </div>
                    )}
                </div>
            )}
        </>
    )
}
