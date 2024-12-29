import { usePage } from "@inertiajs/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import { FormatMessageDateLong } from "@/helpers.jsx";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import MessageAttachments from "@/Components/App/MessageAttachments.jsx";
import MessageOptionsDropdown from "./MessageOptionsDropdown";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/solid";
import { useEventBus } from "@/EventBus";

export default function MessageItem({ message, attachmentClick, isOnline }) {
    const curUser = usePage().props.auth.user;
    const isMe = message.sender_id === curUser.id;
    const { emit } = useEventBus();

    const replyTo = message.reply_to;
    //console.log(replyTo);
    const convertLinksToMarkdown = (text) => {
        const hasMarkdownLinks = /\[.*?\]\(.*?\)/.test(text);
        if (hasMarkdownLinks) {
            return text;
        }

        const linkRegex = /(?:https?|ftp):\/\/[^\s]+|[\w.-]+@[^\s]+\.[^\s]+/gi;
        const textWithLinks = text.replace(linkRegex, (match) => {
            if (match.startsWith("http") || match.startsWith("ftp")) {
                return `[${match}](${match})`;
            } else {
                return `[${match}](mailto:${match})`;
            }
        });
        return textWithLinks;
    };

    const components = {
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
                <SyntaxHighlighter
                    className="rounded-md"
                    style={materialDark}
                    language={match[1]}
                    PreTag="div"
                    children={String(children).replace(/\n$/, "")}
                    {...props}
                />
            ) : (
                <code className={className + "rounded-md"} {...props} />
            );
        },
    };

    const replyToClick = (message) => {
        emit("message.reply", message);
    };

    const goToMesage = (message) => {
        emit("message.goTo", message.id);
    };

    return (
        <div
            className={
                "chat p-2 " + (isMe ? "chat-end ml-4" : "chat-start mr-4")
            }
            id={message.id}
        >
            {!isMe && (
                <UserAvatar
                    user={message.sender}
                    isOnline={isOnline}
                    className=""
                />
            )}
            <div className={"chat-header"}>
                {!isMe ? message.sender.name : ""}
                <time className="ml-2 text-xs opacity-50">
                    {FormatMessageDateLong(message.created_at)}
                </time>
            </div>
            {replyTo && (
                <div className="p-2 overflow-hidden opacity-60 rounded-lg max-h-64 translate-y-[20px] bg-neutral pb-[20px] relative">
                    <div
                        className="absolute top-0 bottom-0 left-0 right-0 z-50 cursor-pointer"
                        onClick={() => goToMesage(replyTo)}
                    ></div>

                    <div>
                        <span className="text-sm font-bold">
                            {replyTo.sender.name} on{" "}
                            {FormatMessageDateLong(replyTo.created_at)}:
                        </span>
                        <ReactMarkdown
                            components={components}
                            className="rounded-md"
                        >
                            {replyTo.body &&
                                convertLinksToMarkdown(replyTo.body)}
                        </ReactMarkdown>
                        <MessageAttachments
                            attachments={replyTo.attachments}
                            attachmentClick={() => {}}
                        />
                    </div>
                </div>
            )}
            <div
                className={
                    "chat-bubble lg:max-w-lg relative pb-4 " +
                    (isMe
                        ? "chat-bubble-neutral "
                        : "bg-info/70 text-info-content")
                }
            >
                {isMe && <MessageOptionsDropdown message={message} />}
                <button
                    onClick={() => replyToClick(message)}
                    className={`absolute z-10 flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 -translate-y-1/2 ${
                        isMe ? "right-full" : "left-full"
                    } rounded-full  top-1/2 text-secondary hover:bg-black/40`}
                >
                    <ArrowUturnLeftIcon className="w-5 h-5" />
                </button>
                <div className={"chat-message"}>
                    <div className={"chat-message-content"}>
                        <ReactMarkdown
                            components={components}
                            className="rounded-md"
                        >
                            {message.body &&
                                convertLinksToMarkdown(message.body)}
                        </ReactMarkdown>
                        <MessageAttachments
                            attachments={message.attachments}
                            attachmentClick={attachmentClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
