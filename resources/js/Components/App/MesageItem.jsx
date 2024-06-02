import {Head} from "@inertiajs/react";
import {usePage} from "@inertiajs/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import {FormatMessageDateLong} from "@/helpers.jsx";
import {materialDark, solarizedlight} from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import EmojiPicker from "emoji-picker-react";
import MessageAttachments from "@/Components/App/MessageAttachments.jsx";
import MessageOptionsDropdown from "./MessageOptionsDropdown";

export default function MessageItem({message, attachmentClick}) {
    const curUser = usePage().props.auth.user;
    const isMe = (message.sender_id === curUser.id);
    //console.log(message.attachments);
    const convertLinksToMarkdown=(text) => {
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
    }


    const components = {
        code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter style={materialDark} language={match[1]} PreTag="div" children={String(children).replace(/\n$/, '')} {...props} />
            ) : (
                <code className={className} {...props} />
            );
        }
    };

    //console.log(curUser);
    return (
        <div className={"chat p-2 " + (
            isMe ? "chat-end ml-4" : "chat-start mr-4"
        )}>
            {<UserAvatar user={ message.sender} online={true} />}
            <div className={"chat-header"}>
                {!isMe ?message.sender.name : ""}
                <time className="ml-2 text-xs opacity-50">{FormatMessageDateLong(message.created_at)}</time>
            </div>
            <div className={"chat-bubble relative pb-4 " + (isMe ? "chat-bubble-primary dark:bg-opacity-70" : "chat-bubble-secondary dark:bg-opacity-70")}>
                {
                    message.sender_id === curUser.id && (
                        <MessageOptionsDropdown message={message} />
                    )
                }
                <div className={"chat-message"}>
                    <div className={"chat-message-content"} >
                        <ReactMarkdown components = {components}>
                            {message.body && convertLinksToMarkdown(message.body)}
                        </ReactMarkdown>
                        <MessageAttachments
                            attachments={message.attachments}
                            attachmentClick={attachmentClick}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
