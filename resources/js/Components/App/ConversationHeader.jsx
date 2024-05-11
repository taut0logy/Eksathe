import {Link, usePage} from "@inertiajs/react";
import {ArrowLeftIcon} from "@heroicons/react/24/solid/index.js";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import ServerAvatar from "@/Components/App/ServerAvatar.jsx";

export default function ConversationHeader({selectedConversation}) {

    return (
        <>
            {selectedConversation && (
                <div className="flex items-center justify-between p-3 shadow-md shadow-grey-800 bg-primary/20">
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
                </div>
            )}
        </>
    )
}
