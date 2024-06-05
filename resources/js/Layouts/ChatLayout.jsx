import { usePage, router } from "@inertiajs/react";
import { useEffect, useState, useRef } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid/index.js";
import TextInput from "@/Components/TextInput.jsx";
import ConversationItem from "@/Components/App/ConversationItem.jsx";
import React from "react";
import { useEventBus } from "@/EventBus";
import ServerModal from "@/Components/App/ServerModal";

export default function ChatLayout({ children }) {
    const page = usePage();
    const { on, emit } = useEventBus();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showServerModal, setShowServerModal] = useState(false);

    const selectedConversationRef = useRef(selectedConversation);

    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    const onSearch = (e) => {
        const value = e.target.value.toLowerCase();
        if (!value || value == "") {
            setLocalConversations(conversations);
        } else {
            setLocalConversations(
                conversations.filter((conversation) => {
                    return (
                        conversation.name.toLowerCase().includes(value) ||
                        (conversation.is_server && conversation.description.toLowerCase().includes(value)) ||
                        (conversation.is_user && conversation.username.toLowerCase().includes(value))
                    );
                })
            );
        }
    };

    const messageCreated = (message) => {
        setLocalConversations((old) => {
            return old.map((e) => {
                if (
                    message.receiver_id &&
                    !e.is_server &&
                    (e.id == message.receiver_id || e.id == message.sender_id)
                ) {
                    e.last_message_at = message.created_at;
                    e.last_message = message.body
                        ? message.body
                        : message.attachments.length > 1
                        ? "Sent Attachments"
                        : "Sent an Attachment";
                    return e;
                }
                if (message.server_id && e.is_server && e.id == message.server_id) {
                    e.last_message_at = message.created_at;
                    e.last_message = message.body
                        ? message.body
                        : message.attachments.length > 1
                        ? "Sent Attachments"
                        : "Sent an Attachment";
                    return e;
                }
                return e;
            });
        });
    };

    const messageDeleted = ({ prevMessage, message }) => {
        if (!prevMessage) {
            setLocalConversations((old) => {
                return old.map((e) => {
                    if (message.receiver_id && !e.is_server && (e.id == message.receiver_id || e.id == message.sender_id)) {
                        e.last_message_at = null;
                        e.last_message = null;
                        return e;
                    }
                    return e;
                });
            });
            return;
        }
        messageCreated(prevMessage);
        emit("toast.show", { message: "Message deleted", type: "success" });
    };

    useEffect(() => {
        const off = on("message.created", messageCreated);
        const off2 = on("message.deleted", messageDeleted);
        const off3 = on("ServerModal.show", (server) => {
            setShowServerModal(true);
        });
        const off4 = on("server.deleted", ({ id, name }) => {
            setLocalConversations((old) => {
                return old.filter((e) => e.id != id);
            });
            emit("toast.show", { message: `Server "${name}" was deleted.`, type: "error" });
            console.log("selectedConversation and id", selectedConversationRef.current, id);
            if (selectedConversationRef.current && selectedConversationRef.current.id == id) {
                console.log("selectedConversation deleted", selectedConversationRef.current);
                router.visit("/dashboard");
            }
        });
        return () => {
            off();
            off2();
            off3();
            off4();
        };
    }, [on]);

    useEffect(() => {
        setLocalConversations(conversations);
    }, [conversations]);

    useEffect(() => {
        setSortedConversations(
            localConversations
                .sort((a, b) => {
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
                })
                .reverse()
        );
    }, [localConversations]);

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersMap = Object.fromEntries(users.map((user) => [user.id, user]));
                setOnlineUsers((prev) => {
                    return { ...prev, ...onlineUsersMap };
                });
            })
            .joining((user) => {
                setOnlineUsers((prev) => {
                    const newOnlineUsers = { ...prev };
                    newOnlineUsers[user.id] = user;
                    return newOnlineUsers;
                });
                emit("online.users", Object.keys(onlineUsers));
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

    useEffect(() => {
        emit("online.users", Object.keys(onlineUsers));
    }, [onlineUsers]);

    return (
        <>
            <div className="flex flex-1 w-full overflow-hidden ">
                <div
                    className={`transition-all w-full sm:w-[250px] md:w-[320px] lg:w-[350px] xl:w-[400px]
                flex flex-col overflow-hidden ${selectedConversation ? "-ml-[100%] sm:ml-0" : ""}`}
                >
                    <div className="flex items-center justify-between px-3 py-2 mt-3 text-xl font-medium">
                        My Conversations
                        <div className="tooltip tooltip-left" data-tip="Create new Server">
                            <button className="text-primary hover:text-accent" onClick={() => setShowServerModal(true)}>
                                <PencilSquareIcon className="inline-block w-6 h-6 ml-2" />
                            </button>
                        </div>
                    </div>
                    <div className="p-3">
                        <TextInput onKeyUp={onSearch} placeholder="Filter users and servers" className="" />
                    </div>
                    <div className="flex-1 overflow-auto">
                        {sortedConversations &&
                            sortedConversations.map((conversation) => (
                                <ConversationItem
                                    key={`${conversation.is_server ? "server_" : "user_"}${conversation.id}`}
                                    conversation={conversation}
                                    selectedConversation={selectedConversation}
                                />
                            ))}
                    </div>
                </div>
                <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
            </div>
            <ServerModal show={showServerModal} onClose={() => setShowServerModal(false)} />
        </>
    );
}
