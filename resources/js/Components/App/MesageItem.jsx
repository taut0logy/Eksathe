import {Head} from "@inertiajs/react";
import {usePage} from "@inertiajs/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import UserAvatar from "@/Components/App/UserAvatar.jsx";
import {FormatMessageDateLong} from "@/helpers.jsx";

export default function MessageItem({message, attachmentClick}) {
    const curUser = usePage().props.auth.user;
    const isMe = (message.sender_id === curUser.id);
    console.log(curUser);
    return (
        <div className={"chat " + (
            isMe ? "chat-end" : "chat-start"
        )}>
            {<UserAvatar user={ message.sender} />}
            <div className={"chat-header"}>
                {!isMe ?message.sender.name : ""}
                <time className="text-xs opacity-50 ml-2">{FormatMessageDateLong(message.created_at)}</time>
            </div>
            <div className={"chat-bubble relative " + (isMe ? "chat-bubble-info" : "")}>
                <div className={"chat-message"}>
                    <div className={"chat-message-content"}>
                        <ReactMarkdown>
                            {message.body}
                        </ReactMarkdown>
                    </div>
                </div>
            </div>
        </div>
    )
}
