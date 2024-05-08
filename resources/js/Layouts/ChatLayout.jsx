import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid/index.js";
import TextInput from "@/Components/TextInput.jsx";
import ConversationItem from "@/Components/App/ConversationItem.jsx";
//import Echo from "laravel-echo";
import React from "react";

// ChatLayout.propTypes = {
//     children: ReactNode,
// };

export default function ChatLayout({ children }) {
    const page = usePage();
    //const user = page.props.auth.user;
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const isOnline = (id) => !!onlineUsers[id];
    //console.log('conversations',conversations);

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
                    return -1;
                } else if (b.last_message_at) {
                    return 1;
                } else {
                    return 0;
                }
            }),
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

    const onSearch = (e) => {
        const value = e.target.value.toLowerCase();
        if (!value) {
            setLocalConversations(localConversations);
        } else {
            setLocalConversations(
                conversations.filter((conversation) => {
                    return (
                        conversation.name
                            .toLowerCase()
                            .includes(value.toLowerCase()) ||
                        conversation.username
                            .toLowerCase()
                            .includes(value.toLowerCase())
                    );
                }),
            );
        }
    };
    return (
        <>
            <div className="flex flex-1 w-full overflow-hidden text-gray-800 dark:text-gray-300">
                <div
                    className={`transition-all w-full sm:w-[250px] md:w-[320px] dark:bg-slate-800 bg-slate-200
                flex flex-col overflow-hidden ${
                    selectedConversation ? "-ml-[100%] sm:ml-0" : ""
                }`}
                >
                    <div className="flex items-center justify-between px-3 py-2 mt-3 text-xl font-medium ">
                        {" "}
                        {/*title*/}
                        My Conversations
                        <div
                            className="tooltip tooltip-left"
                            data-tip="Create new Server"
                        >
                            <button className="text-gray-400 hover:text-gray-200">
                                <PencilSquareIcon className="inline-block w-6 h-6 ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput
                            onKeyUp={onSearch}
                            placeholder="Filter users and servers"
                            className="w-full"
                        />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${conversation.is_server ? "server_" : "user_"}${conversation.id}`}
                                    conversation={conversation}
                                    online={!!isOnline(conversation.id)}
                                    selectedConversation={selectedConversation}
                                />
                            ))}
                    </div>
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </>
    );
}

