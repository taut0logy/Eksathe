import React from "react";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import {
    PaperClipIcon,
    PhotoIcon,
    FaceSmileIcon,
    HandThumbUpIcon,
    PaperAirplaneIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid/index.js";
import NewMessageInput from "./NewMessageInput.jsx";
import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import { Popover, Transition } from '@headlessui/react'
import { Fragment } from 'react'


export default function MessageInput(conversation = null) {
    const c = conversation.conversation;
    //console.log(conversation);
    const [newMessage, setNewMessage] = useState("");
    const [inputError, setInputError] = useState("");
    const [messageSending, setMessageSending] = useState(false);
    const [chosenFiles, setChosenFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);

    //setChosenFiles((prev) => {return [...prev, ...newFile]});

    const onFileChange = (e) => {
        const newFiles = Array.from(e.target.files).map((file) => {
            return {file: file, url: URL.createObjectURL(file)};
        });
        setChosenFiles((prev) => {
            return [...prev, ...newFiles];
        });
    };

    const onSendMessage = () => {
        if (messageSending) return;
        if (newMessage.trim() === "") {
            setInputError("Please provide a message or attachment");
            setTimeout(() => {
                setInputError("");
            }, 3000);
        }
        const formData = new FormData();
        chosenFiles.forEach((file) => {
            formData.append("attachments[]", file.file);
        });
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
                    setUploadProgress(percentCompleted);
                },
            })
            .then((response) => {
                //console.log(response.data);
                setNewMessage("");
                setMessageSending(false);
                setChosenFiles([]);
                setUploadProgress(0);
            })
            .catch((error) => {
                setMessageSending(false);
                setChosenFiles([]);
                console.log('message input post error', error);
                setMessageSending(false);
                const errMessage= error?.response?.data?.message;
                setInputError(errMessage || "An error occurred while sending the message");
                setTimeout(() => {
                    setInputError("");
                }, 5000);
            });
    };

    const onLikeClick = () => {
        if(messageSending) return;
        const formData = new FormData();
        formData.append("body", "# 👍");
        if (c.is_user) {
            formData.append("receiver_id", c.id);
        }
        if (c.is_server) {
            formData.append("server_id", c.id);
        }
        axios.post(route("message.store"), formData);

    }

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
                        onChange={onFileChange}
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
                        onChange={onFileChange}
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
                {!!uploadProgress && (
                    <progress
                        className="w-full progress progress-info">
                        value={uploadProgress}
                        max="100"
                    </progress>
                )}
                {inputError && (
                    <p className={"text-red-500 text-xs mt-1"}>{inputError}</p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                    {
                        chosenFiles.map((file, index) => {
                            <div
                            className={"relative flex justify-between cursor-pointer" + (!!isImage(file.file)?"w-[240px]":"")}
                            key={file.file.name}
                            >
                                {
                                    isImage(file.file) && (
                                        <img src="file.url" alt={index} className="object-cover w-16 h-16"  />
                                    )
                                }
                                {
                                    idAudio(file.file) && (
                                        <CustomAudioPlayer file={file.file} showVolume={false} />
                                    )
                                }
                                {
                                    !isAudio(file.file) && !isImage(file.file) && (
                                        <AttachmentPreview attachment={file} />
                                    )
                                }
                                <button
                                onClick={() => {
                                    setChosenFiles((prev) => {
                                        return prev.filter((f) => f.file.name !== file.file.name);
                                    });
                                }}
                                className="absolute w-6 h-6 text-gray-200 bg-gray-800 rounded-full hover:text-gray=800 hover:bg-gray-300 z-10">
                                <XCircleIcon className="w-6"/>
                                </button>
                            </div>
                        })
                    }
                </div>
            </div>
            <div className={"flex order-3 xs:order-3 p-2"}>
                <Popover className={"relative"}>
                    <Popover.Button className="p-1 btn-ghost hover:text-primary">
                        <FaceSmileIcon className={"w-6"} />
                    </Popover.Button>
                    <Popover.Panel className={"absolute z-10 right-0 bottom-full"}>
                        <EmojiPicker theme="dark" onEmojiClick={(ev) => (setNewMessage(newMessage + ev.emoji))}></EmojiPicker>
                    </Popover.Panel>
                </Popover>
                <button className={"p-1 btn-ghost hover:text-primary"} onClick={onLikeClick}>
                    <HandThumbUpIcon className={"w-6"} />
                </button>
            </div>
        </div>
    );
}
