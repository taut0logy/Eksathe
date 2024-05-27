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

export const isImage = (file) => {
    let type = file.mime || file.type;
    //console.log(type);
    return type.split('/')[0] === 'image';
    //return (file.mime || file.type).split('/')[0] === 'image';
}

export const isVideo = (file) => {
    let type = file.mime || file.type;
    //console.log(type);
    return type.split('/')[0] === 'video';
    //return (file.mime || file.type).split('/')[0] === 'video';
}

export const isAudio = (file) => {
    let type = file.mime || file.type;
    //console.log(type);
    return type.split('/')[0] === 'audio';
    //return (file.mime || file.type).split('/')[0] === 'audio';
}

export const isPDF = (file) => {
    let type = file.mime || file.type;
    return type === 'application/pdf';
    //return (file.mime || file.type) === 'application/pdf';
}

export const isPreviewable = (file) => {
    return isImage(file) || isVideo(file) || isAudio(file) || isPDF(file);
}

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
