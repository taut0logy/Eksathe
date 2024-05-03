export const FormatMessageDateLong = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    if(isToday(messageDate)) {
        return messageDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if(isYesterday(messageDate)) {
        return "Yesterday" + messageDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if (messageDate.getFullYear() === now.getFullYear()) {
        return messageDate.toLocaleDateString([], {month: 'short', day: '2-digit'});
    } else {
        return messageDate.toLocaleDateString([], {month: 'short', day: '2-digit', year: 'numeric'});
    }
}

export const isToday = (date) => {
    const now = new Date();
    return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}

export const isYesterday = (date) => {
    const now = new Date();
    return (
        date.getDate() === now.getDate() - 1 &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
    );
}

export const formatMessageDateShort = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    if(isToday(messageDate)) {
        return messageDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if(isYesterday(messageDate)) {
        return "Yesterday";
    } else if (messageDate.getFullYear() === now.getFullYear()) {
        return messageDate.toLocaleDateString([], {month: 'short', day: '2-digit'});
    } else {
        return messageDate.toLocaleDateString([], {month: 'short', day: '2-digit', year: 'numeric'});
    }
}
