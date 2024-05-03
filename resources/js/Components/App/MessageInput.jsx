import {useState} from "react";
import {PaperClipIcon, PhotoIcon, FaceSmileIcon, HandThumbUpIcon, PaperAirplaneIcon} from "@heroicons/react/24/solid/index.js";
import NewMessageInput from "./NewMessageInput.jsx";

export default function MessageInput(conversation=null) {
    const [newMessage, setNewMessage] = useState("");
    const [inputError, setInputError] = useState("");
    const [messageSending, setMessageSending] = useState(false);

    return (
        <div className={"flex flex-wrap items-start border-t border-slate-200 dark:border-slate-700 py-3"}>
            <div className={"order-2 flex-1 xs:flex-none xs:order-1 p-2"}>
                <button className={"p-1 text-gray-400 hover:text-gray-300 relative"}>
                    <PaperClipIcon className={"w-6"}/>
                    <input
                        type={"file"}
                        multiple
                        className={"absolute left-0 top-0 right-0 bottom-0 opacity-0 z-20 cursor-pointer"}/>
                </button>
                <button className={"p-1 text-gray-400 hover:text-gray-300 relative"}>
                    <PhotoIcon className={"w-6"}/>
                    <input
                        type={"file"}
                        multiple
                        accept={"image/*"}
                        className={"absolute left-0 top-0 right-0 bottom-0 opacity-0 z-20 cursor-pointer"}/>
                </button>
            </div>
            <div className={"order-1 px-3 xs:p-0 min-w-[220px] basis-full xs:basis-0 xs:order-2 flex-1 relative"}>
                <div className={"flex"}>
                    <NewMessageInput
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        />
                    <button className={"btn btn-info rounded-l-none"}>
                        {
                            messageSending && (
                                <span className={"loading loading-spinner loading-xs"}></span>
                            )
                        }
                        <PaperAirplaneIcon className={"w-6"}/>
                        <span className={"hidden sm:inline"}>Send</span>
                    </button>
                </div>
                {inputError && (
                    <p className={"text-red-500 text-xs mt-1"}>{inputError}</p>
                )}
            </div>
            <div className={"flex order-3 xs:order-3 p-2"}>
                <button className={"p-1 text-gray-400 hover:text-gray-300"}>
                    <FaceSmileIcon className={"w-6"}/>
                </button>
                <button className={"p-1 text-gray-400 hover:text-gray-300"}>
                    <HandThumbUpIcon className={"w-6"}/>
                </button>
            </div>
        </div>
    )
}
