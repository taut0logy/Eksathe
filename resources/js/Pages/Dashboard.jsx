import { Head } from "@inertiajs/react";
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ChatBubbleLeftRightIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline/index.js";
import ConversationHeader from "@/Components/App/ConversationHeader.jsx";
import MessageInput from "@/Components/App/MessageInput.jsx";
import MessageItem from "@/Components/App/MesageItem";
import React from "react";
import { usePage } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";
import axios from "axios";
import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";
import AttachmentPreview from "@/Components/App/AttachmentPreview";
import MessageAttachments from "@/Components/App/MessageAttachments";

export default function Dashboard({
    selectedConversation = null,
    messages = null,
}) {
    const curUser = usePage().props.auth.user;
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const messagesCtrRef = useRef(null);
    const loadMoreIntersector = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const [replyMessage, setReplyMessage] = useState(null);
    const { on, currentUsers, setCurrentUsers } = useEventBus();

    useEffect(() => {
        Echo.join("online")
            .here((users) => {
                const onlineUsersMap = Object.fromEntries(
                    users.map((user) => [user.id, user])
                );
                setCurrentUsers((prev) => {
                    return { ...prev, ...onlineUsersMap };
                });
            })
            .joining((user) => {
                setCurrentUsers((prev) => {
                    const newOnlineUsers = { ...prev };
                    newOnlineUsers[user.id] = user;
                    return newOnlineUsers;
                });
            })
            .leaving((user) => {
                //console.log("leaving", user);
                setCurrentUsers((prev) => {
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

    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_server &&
            selectedConversation.id == message.server_id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
        if (
            (selectedConversation &&
                selectedConversation.is_user &&
                selectedConversation.id === message.sender_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prev) => [...prev, message]);
        }
    };

    const messageDeleted = ({ message }) => {
        if (
            (selectedConversation &&
                selectedConversation.is_server &&
                selectedConversation.id == message.server_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prev) => prev.filter((m) => m.id !== message.id));
        }
        if (
            selectedConversation &&
            selectedConversation.is_user &&
            selectedConversation.id === message.sender_id
        ) {
            setLocalMessages((prev) => prev.filter((m) => m.id !== message.id));
        }
    };

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages) return;
        const messageId = localMessages[0].id;
        axios
            .get(route("message.load-older", messageId))
            .then(({ data: response }) => {
                if (response.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }

                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrpollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const useHeight = scrollHeight - scrpollTop - clientHeight;
                setScrollFromBottom(useHeight);
                const data2 = response.data.reverse();
                setLocalMessages((prev) => {
                    return [...data2, ...prev];
                });
                // setLocalMessages((prev) => {
                //     console.log(data);
                //     let data2 = data.data.reverse();

                //     data2.forEach((message) => {
                //         if (prev.some((m) => m.id === message.id)) {
                //             data2 = data2.filter((m) => m.id !== message.id);
                //         }
                //     });
                //     return [...data2, ...prev];
                // });
            });
    }, [localMessages, noMoreMessages]);

    useEffect(() => {
        const offReply = on("message.reply", (message) => {
            setReplyMessage(message);
        });
        const offGoTo = on("message.goTo", (id) => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
                el.focus();
            }
        });
        const offMessageSent = on("message.sent",() => {
            setReplyMessage(null);
        })
        return () => {
            offReply();
            offGoTo();
            offMessageSent();
        };
    }, [on]);

    const attachmentClick = (attachments, ind) => {
        setPreviewAttachment({ attachments, ind });
        setShowAttachmentPreview(true);
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
        }, 100);
        setScrollFromBottom(0);
        setNoMoreMessages(false);
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("message.deleted", messageDeleted);
        return () => {
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);

    useEffect(() => {
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
            }
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
            {!messages && (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-35">
                    <div className={"text-2xl md:text-4xl p-5"}>
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
                        isOnline={
                            currentUsers[selectedConversation.id] ? true : false
                        }
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
                                {noMoreMessages && (
                                    <div className="text-center opacity-40 nowrap">
                                        Beginning of chat
                                    </div>
                                )}
                                {!noMoreMessages && (
                                    <div
                                        className={`flex items-center justify-center mt-3 cursor-pointer opacity-80`}
                                    >
                                        <span className="loading loading-dots loading-md"></span>
                                        <span className={"text-md ml-2"}>
                                            Loading older messages
                                        </span>
                                    </div>
                                )}
                                <div ref={loadMoreIntersector}></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={message.id}
                                        message={message}
                                        attachmentClick={attachmentClick}
                                        isOnline={
                                            currentUsers[message.sender_id]
                                                ? true
                                                : false
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    {replyMessage && (
                        <div
                            className={
                                "p-2 cursor-pointer opacity-80 border-t border-primary"
                            }
                        >
                            <button
                                className={
                                    "float-right rounded-full bg-slate-500 text-slate-900 hover:bg-primary hover:text-primary-content"
                                }
                            >
                                <XMarkIcon
                                    className="w-6 h-6"
                                    onClick={() => setReplyMessage(null)}
                                />
                            </button>
                            <div className="p-1 text-lg font-bold border-b border-primary w-fit">
                                Replying to{" "}
                                {replyMessage.sender_id === curUser.id
                                    ? "Yourself"
                                    : replyMessage.sender.name}
                                :
                            </div>
                            <div className="overflow-scroll max-h-60">
                                {replyMessage.body && (
                                    <div className="p-1 text-md">
                                        {replyMessage.body}
                                    </div>
                                )}
                                {replyMessage.attachments && (
                                    <MessageAttachments
                                        attachments={replyMessage.attachments}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    <MessageInput conversation={selectedConversation} />
                    {previewAttachment.attachments && (
                        <AttachmentPreviewModal
                            attachments={previewAttachment.attachments}
                            index={previewAttachment.ind}
                            show={showAttachmentPreview}
                            onClose={() => setShowAttachmentPreview(false)}
                        />
                    )}
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
