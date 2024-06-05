import { Link, usePage } from "@inertiajs/react";
import UserAvatar from "./UserAvatar";
import ServerAvatar from "./ServerAvatar";
import UserOptionsDropdown from "./UserOptionsDropdown";
import { formatMessageDateShort } from "@/helpers.jsx";

export default function ConversationItem({
    conversation,
    selectedConversation = null,
    //online = null,
}) {
    const page = usePage();
    const user = page.props.auth.user;
    let classes = "border-transparent";
    //if(conversation.is_server) console.log(conversation);
    if (selectedConversation) {
        if (
            !selectedConversation.is_server &&
            !conversation.is_server &&
            selectedConversation.id === conversation.id
        ) {
            classes = "border-primary bg-primary/20";
        }
        if (
            selectedConversation.is_server &&
            conversation.is_server &&
            selectedConversation.id === conversation.id
        ) {
            classes = "border-primary bg-primary/20";
        }
    }
    return (
        <Link
            href={
                conversation.is_server
                    ? route("chat.server", conversation)
                    : route("chat.user", conversation)
            }
            preserveState
            className={`conversation-item flex items-center gap-2 p-2 text--gray-300 transition-all cursor-pointer border-l-4 hover:bg-black/30 ${classes} ${
                conversation.is_user && conversation.is_admin ? "pr-3" : "pr-4"
            }`}
        >
            {conversation.is_server && <ServerAvatar />}
            {conversation.is_user && (
                <UserAvatar user={conversation} />
            )}
            <div
                className={`flex-1 text-xs max-w-full overflow-hidden ${conversation.is_user && conversation.blocked_at ? "opacity-60" : ""}`}
            >
                <div className="flex items-center justify-between gap-1">
                    <h3
                        className={`text-sm font-semibold overflow-hidden text-nowrap text-ellipsis ${conversation.is_user && conversation.blocked_at ? "opacity-60" : ""}`}
                    >
                        {conversation.name}
                    </h3>
                    {conversation.last_message_at && (
                        <span className={"text-nowrap"}>
                            {formatMessageDateShort(
                                conversation.last_message_at,
                            )}
                        </span>
                    )}
                </div>
                {conversation.last_message && (
                    <p
                        className={`text-nowrap text-xs overflow-hidden text-ellipsis ${conversation.is_user && conversation.blocked_at ? "opacity-60" : ""}`}
                    >
                        {conversation.last_message && (conversation.last_message.sender_id === user.id ? "You: " : "") + (conversation.last_message===null ? "Attachment" : conversation.last_message)}
                    </p>
                )}
                {!conversation.last_message && (
                    <p
                        className={`text-nowrap text-xs overflow-hidden text-ellipsis ${conversation.is_user && conversation.blocked_at ? "opacity-60" : ""}`}
                    >
                        {"(No messages yet)"}
                    </p>
                )}
            </div>
            {!!user.is_admin && conversation.is_user ? (
                <UserOptionsDropdown conversation={conversation} />
            ) : null}
        </Link>
    );
}
