import { Head } from "@inertiajs/react";
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline/index.js";
//import ConversationItem from "@/Components/App/ConversationItem.jsx";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import MessageItem from "@/Components/App/MesageItem.jsx";
import React from "react";
import { useEventBus } from "@/EventBus";
import axios from "axios";
import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";

export default function Dashboard({
    selectedConversation = null,
    messages = null,
}) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const messagesCtrRef = useRef(null);
    const loadMoreIntersector = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const { on } = useEventBus();

    const messageCreated = (message) => {
        if (
            (selectedConversation &&
                selectedConversation.is_server &&
                selectedConversation.id == message.server_id)
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
        if (
            (selectedConversation &&
            selectedConversation.is_user &&
            selectedConversation.id === message.sender_id)  ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
    };

    const messageDeleted = ({message}) => {
        //console.log("message deleted", selectedConversation, message);
        if (
            (selectedConversation &&
                selectedConversation.is_server &&
                selectedConversation.id == message.server_id) ||
                selectedConversation.id == message.receiver_id
        ) {

            setLocalMessages((prev) => {
                return prev.filter((m) => m.id !== message.id);
            });
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            selectedConversation.id === message.sender_id
        ) {
            setLocalMessages((prev) => {
                return prev.filter((m) => m.id !== message.id);
            });
        }
    }

    const loadMoreMessages = useCallback(() => {
        //console.log("loadmoremessage")
        if (noMoreMessages) return;
        const messageId = localMessages[0].id;
        axios
            .get(route("message.load-older", messageId))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrpollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const useHeight = scrollHeight - scrpollTop - clientHeight;
                setScrollFromBottom(useHeight);

                setLocalMessages((prev) => {
                    let data2 = data.data.reverse();

                    //delete any element from data that exists in prev
                    data2.forEach((message) => {
                        if (prev.some((m) => m.id === message.id)) {
                            data2 = data2.filter((m) => m.id !== message.id);
                        }
                    })
                    return [...data2, ...prev];
                });


            });
    }, [localMessages, noMoreMessages]);



    const attachmentClick = (attachments, ind) => {
        //console.log("attachment click", ind);
        setPreviewAttachment({attachments, ind});
        setShowAttachmentPreview(true);
        console.log("attachment click", previewAttachment);
    }

    useEffect(() => {
        //console.log("messages change")
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        //console.log("new conversation selected / new message write")
        setTimeout(() => {
            if (messagesCtrRef.current) {
                messagesCtrRef.current.scrollTop =
                    messagesCtrRef.current.scrollHeight;
            }
        }, 10);
        setScrollFromBottom(0);
        setNoMoreMessages(false);
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        return () => {
            offCreated();
        };
    }, [selectedConversation]);



    useEffect(() => {
        //console.log("localMesssage scroll loadmoremessage")
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                scrollFromBottom -
                messagesCtrRef.current.offsetHeight;
        }

        if (noMoreMessages) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadMoreMessages();
                    }
                });
            },
            {
                rootMargin: "0px 0px 450px 0px",
            },
        );

        if (loadMoreIntersector.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersector.current);
            }, 100);
        }

        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    return (
        <>
            <Head title="Conversations" />
            <div></div>
            {!messages && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-35">
                    <div
                        className={
                            "text-2xl md:text-4xl p-5"
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
                        className="flex flex-1 p-5 overflow-y-auto"
                    >
                        {localMessages.length === 0 && (
                            <div className="flex flex-col items-center justify-center w-full">
                                <div className={"text-2xl md:text-4xl p-16 "}>
                                    No Messages Yet
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className={"flex flex-col flex-1"}>
                                {
                                    noMoreMessages && (
                                        <div className="text-center opacity-40 nowrap">
                                            Beginning of chat
                                        </div>
                                    )
                                }
                                <div ref={loadMoreIntersector}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        attachmentClick={attachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                    {
                        previewAttachment.attachments && (
                            <AttachmentPreviewModal
                                attachments={previewAttachment.attachments}
                                index={previewAttachment.ind}
                                show={showAttachmentPreview}
                                onClose={() => setShowAttachmentPreview(false)}
                                />
                        )
                    }
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
