import {useEffect, useRef} from "react";


export default function NewMessageInput({value, onChange, onSend}) {
    const input=useRef();
    const onInputKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };
    const onChangeEvent = (e) => {
        setTimeout(() => {
            adjustHeight();
        },10)
        onChange(e);
    }
    const adjustHeight = () => {
        setTimeout(() => {
            input.current.style.height = "auto";
            input.current.style.height = input.current.scrollHeight + 1 + "px";
        },100);
    }

    useEffect(() => {
        adjustHeight();
    });
    return (
        <textarea placeholder="Type a message..."
                  rows="1"
                  value={value}
                  onChange={(e) => onChangeEvent(e)}
                  onKeyDown={onInputKeyDown} ref={input}
                  className="w-full resize-none input input-bordered rounded-r-none overflow-y-auto max-h-40"></textarea>
    )
}
