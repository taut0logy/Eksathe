import { useEffect, forwardRef } from "react";

const NewMessageInput = forwardRef(({ value, onChange, onSend }, ref) => {
    //const ref = useRef();
    const onInputKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
        }
    };
    const onChangeEvent = (e) => {
        setTimeout(() => {
            adjustHeight();
        }, 10);
        onChange(e);
    };
    const adjustHeight = () => {
        setTimeout(() => {
            ref.current.style.height = "auto";
            ref.current.style.height = ref.current.scrollHeight + 1 + "px";
        }, 100);
    };

    useEffect(() => {
        adjustHeight();
    });

    return (
        <textarea
            placeholder="Type a message..."
            rows="1"
            value={value}
            onChange={(e) => onChangeEvent(e)}
            onKeyDown={onInputKeyDown}
            ref={ref}
            className="w-full overflow-y-auto rounded-r-none resize-none textarea textarea-bordered max-h-40"
        ></textarea>
    );
});

NewMessageInput.displayName = "NewMessageInput";

export default NewMessageInput;
