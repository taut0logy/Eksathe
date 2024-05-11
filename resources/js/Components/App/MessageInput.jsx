import React from "react";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
} from "@heroicons/react/24/solid/index.js";
import NewMessageInput from "./NewMessageInput.jsx";
import axios from "axios";

export default function MessageInput(conversation = null) {
    const c = conversation.conversation;
    //console.log(conversation);
    const [newMessage, setNewMessage] = useState("");
    const [inputError, setInputError] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const onSendMessage = () => {
        if (messageSending) return;
        if (newMessage.trim() === "") {
            setInputError("Please provide a message or attachment");
            setTimeout(() => {
                setInputError("");
            }, 3000);
        }
        const formData = new FormData();
        formData.append("body", newMessage.trim());
        //formData.append("sender_id", user.id);
        if (c.is_user) {
            formData.append("receiver_id", c.id);
        }
        if (c.is_server) {
            formData.append("server_id", c.id);
        }
        //console.log("formData", formData);
        setMessageSending(true);
        axios
            .post(route("message.store"), formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    console.log(percentCompleted);
                },
            })
            .then((response) => {
                //console.log(response.data);
                setNewMessage("");
                setMessageSending(false);
            })
            .catch((error) => {
                console.log('message input post error', error);
                setMessageSending(false);
                setInputError(error.response.data.message);
                setTimeout(() => {
                    setInputError("");
                }, 5000);
            });
    };
    return (
        <div
            className={
                "flex flex-wrap items-start border-t py-3 border-primary/50"
            }
        >
            <div className={"order-2 flex-1 xs:flex-none xs:order-1 p-2"}>
                <button
                    className={"p-1 btn-ghost relative hover:text-primary"}
                >
                    <PaperClipIcon className={"w-6"} />
                    <input
                        type={"file"}
                        multiple
                        className={
                            "absolute left-0 top-0 right-0 bottom-0 opacity-0 z-20 cursor-pointer"
                        }
                    />
                </button>
                <button
                    className={"p-1 btn-ghost relative hover:text-primary"}
                >
                    <PhotoIcon className={"w-6"} />
                    <input
                        type={"file"}
                        multiple
                        accept={"image/*"}
                        className={
                            "absolute left-0 top-0 right-0 bottom-0 opacity-0 z-20 cursor-pointer"
                        }
                    />
                </button>
            </div>
            <div
                className={
                    "order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative"
                }
            >
                <div className={"flex"}>
                    <NewMessageInput
                        value={newMessage}
                        onSend={onSendMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        className={"btn btn-primary rounded-l-none"}
                        onClick={onSendMessage}
                        disabled={messageSending}
                    >
                        {messageSending && (
                            <span
                                className={"loading loading-spinner loading-xs"}
                            ></span>
                        )}
                        <PaperAirplaneIcon className={"w-6"} />
                        <span className={"hidden sm:inline"}>Send</span>
                    </button>
                </div>
                {inputError && (
                    <p className={"text-red-500 text-xs mt-1"}>{inputError}</p>
                )}
            </div>
            <div className={"flex order-3 xs:order-3 p-2"}>
                <button className={"p-1 btn-ghost hover:text-primary"}>
                    <FaceSmileIcon className={"w-6"} />
                </button>
                <button className={"p-1 btn-ghost hover:text-primary"}>
                    <HandThumbUpIcon className={"w-6"} />
                </button>
            </div>
        </div>
    );
}
