import { Head } from '@inertiajs/react';
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import {useEffect, useRef, useState} from "react";
import {ChatBubbleLeftRightIcon} from "@heroicons/react/24/outline/index.js";
import ConversationItem from "@/Components/App/ConversationItem.jsx";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import MessageItem from "@/Components/App/MesageItem.jsx";

export default function Dashboard({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    useEffect(() => {
        setLocalMessages(messages? messages.data.reverse():[]);
    }, [messages]);
    useEffect(() => {
        setTimeout(() => {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        },10)
    }, [selectedConversation]);
    return (
        <>
            <Head title="Dashboard" />
            {!messages && (
                <div className="flex flex-col justify-center items-center h-full text-center opacity-35">
                    <div className={"text-2xl md:text-4xl p-16 text-slate-900 dark:text-slate-200"}>
                        Select a chat to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className={"w-32 h-32 inline-block"} />
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {localMessages.length===0 && (
                            <div className="flex flex-col justify-center items-center h-full">
                                <div className={"text-2xl md:text-4xl p-16 "}>
                                    No Messages Yet
                                </div>
                            </div>
                        )}
                        {localMessages.length>0 && (
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
                    <MessageInput conversation={selectedConversation}/>
                </>
            )}
        </>
    );
}
Dashboard.layout = (page) => {
     return (
         <AuthenticatedLayout
         user={page.props.auth.user}>
             <ChatLayout children={page} />
         </AuthenticatedLayout>
     )
}
