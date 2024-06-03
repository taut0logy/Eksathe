import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid/index.js";
import TextInput from "@/Components/TextInput.jsx";
import ConversationItem from "@/Components/App/ConversationItem.jsx";
//import Echo from "laravel-echo";
import React from "react";
import { useEventBus } from "@/EventBus";
import ServerModal from "@/Components/App/ServerModal";

// ChatLayout.propTypes = {
//     children: ReactNode,
// };

export default function ChatLayout({ children }) {
    const page = usePage();
    //const user = page.props.auth.user;
    const { on } = useEventBus();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showServerModal, setShowServerModal] = useState(false);
    const isOnline = (id) => !!onlineUsers[id];

    const onSearch = (e) => {
        const value = e.target.value.toLowerCase();
        console.log("value", value);
        if (!value || value == "") {
            setLocalConversations(localConversations);
        } else {
            setLocalConversations(
                conversations.filter((conversation) => {
                    return (
                        conversation.name
                            .toLowerCase()
                            .includes(value) ||
                            (conversation.is_server && conversation.description.toLowerCase().includes(value)) ||
                            (conversation.is_user && conversation.username.toLowerCase().includes(value))
                    );
                }),
            );
        }
    };
    //console.log('conversations',conversations);
    const messageCreated = (message) => {
        setLocalConversations((old) => {
            return old.map((e) => {
                if (
                    message.receiver_id &&
                    !e.is_server &&
                    (e.id == message.receiver_id || e.id == message.sender_id)
                ) {
                    //console.log("message", message);
                    e.last_message_at = message.created_at;
                    e.last_message =  e.last_message = message.body ? message.body : (message.attachments.length > 1 ? "Sent Attachments" : "Sent an Attachment");
                    return e;
                }
                if (
                    message.server_id &&
                    e.is_server &&
                    e.id == message.sender_id
                ) {
                    //console.log("message", message);
                    e.last_message_at = message.created_at;
                    e.last_message = message.body ? message.body : (message.attachments.length > 1 ? "Sent Attachments" : "Sent an Attachment");
                    return e;
                }
                return e;
            });
        });
    };

    const messageDeleted = (prevMessage) => {
        console.log("prevMessage", prevMessage);
        if(!prevMessage.prevMessage) {
            setLocalConversations((old) => {
                return old.map((e) => {
                    if(
                        prevMessage.message.receiver_id && !e.is_server && (e.id == prevMessage.message.receiver_id || e.id == prevMessage.message.sender_id)
                    ) {
                        e.last_message_at = null;
                        e.last_message = null;
                        return e;
                    }
                    return e;
                });
            });
            return;
        }
        messageCreated(prevMessage.prevMessage);
    };

    useEffect(() => {
        const off = on("message.created", messageCreated);
        const off2 = on("message.deleted", messageDeleted);
        const off3 = on("ServerModal.show", (server) => {
            setShowServerModal(true);
        });
        return () => {
            off();
            off2();
            off3();
        };
    }, [on]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a, b) => {
                if (a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if (a.blocked_at) {
                    return 1;
                } else if (b.blocked_at) {
                    return -1;
                }
                if (a.last_message_at && b.last_message_at) {
                    const aDate = new Date(a.last_message_at);
                    const bDate = new Date(b.last_message_at);
                    return aDate > bDate ? 1 : -1;
                } else if (a.last_message_at) {
                    return 1;
                } else if (b.last_message_at) {
                    return -1;
                } else {
                    return 0;
                }
            }).reverse(),
        );
    }, [localConversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersMap = Object.fromEntries(
                    users.map((user) => [user.id, user]),
                );
                console.log("here", onlineUsersMap);
                setOnlineUsers((prev) => {
                    return { ...prev, ...onlineUsersMap };
                });
            })
            .joining((user) => {
                console.log("joining", user);
                setOnlineUsers((prev) => {
                    const newOnlineUsers = { ...prev };
                    newOnlineUsers[user.id] = user;
                    console.log("newOnlineUsers", newOnlineUsers);
                    return newOnlineUsers;
                });
            })
            .leaving((user) => {
                console.log("leaving", user);
                setOnlineUsers((prev) => {
                    const newOnlineUsers = { ...prev };
                    delete newOnlineUsers[user.id];
                    return newOnlineUsers;
                });
            })
            .error((err) => {
                console.log("ChatLayout error", err);
            });
        return () => {
            Echo.leave("online");
        };
    }, []);

    return (
        <>
            <div className="flex flex-1 w-full overflow-hidden ">
                <div
                    className={`transition-all w-full sm:w-[250px] md:w-[320px] lg:w-[350px] xl:w-[400px]
                flex flex-col overflow-hidden ${
                    selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                }`}
                >
                    <div className="flex items-center justify-between px-3 py-2 mt-3 text-xl font-medium">

                        My Conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Server"
                        >
                            <button className="text-primary hover:text-accent"
                                onClick={() => setShowServerModal(true)}
                            >
                                <PencilSquareIcon className="inline-block w-6 h-6 ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        {/* <label className="flex items-center gap-2 input input-bordered">
                            <input type="text" className="grow" placeholder="Search users and servers" onKeyUp={onSearch} />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" /></svg>
                        </label> */}
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and servers"
                            className=""
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${conversation.is_server ? "server_" : "user_"}${conversation.id}`}
                                    conversation={conversation}
                                    online={ !!isOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                />
                            ))}
                    </div>
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
            <ServerModal show = {showServerModal} onClose = {() => setShowServerModal(false)} />
        </>
    );
}
