import { Head } from "@inertiajs/react";
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline/index.js";
//import ConversationItem from "@/Components/App/ConversationItem.jsx";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import MessageItem from "@/Components/App/MesageItem.jsx";
import React from "react";
import { useEventBus } from "@/EventBus";

export default function Dashboard({
    selectedConversation = null,
    messages = null,
}) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    const { on } = useEventBus();

    const messageCreated = (message) => {
        if (
            (selectedConversation &&
                selectedConversation.is_server &&
                selectedConversation.id == message.server_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            selectedConversation.id === message.sender_id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
    };

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);
    useEffect(() => {
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);

        const offCreated = on("message.created", messageCreated);
        return () => {
            offCreated();
        };
    }, [selectedConversation]);
    return (
        <>
            <Head title="Dashboard" />
            {!messages && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-35">
                    <div
                        className={
                            "text-2xl md:text-4xl p-16 text-slate-900 dark:text-slate-200"
                        }
                    >
                        Select a chat to see messages
                    </div>
                    <ChatBubbleLeftRightIcon
                        className={"w-32 h-32 inline-block"}
                    />
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 p-5 overflow-y-auto"
                    >
                        {localMessages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full">
                                <div className={"text-2xl md:text-4xl p-16 "}>
                                    No Messages Yet
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className={"flex flex-col flex-1"}>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
        </>
    );
}
Dashboard.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout>{page}</ChatLayout>
        </AuthenticatedLayout>
    );
};
