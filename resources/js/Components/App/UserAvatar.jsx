import React from "react";
export default function UserAvatar({user, online=null, profile=false}) {
    let onlineClass = online === true ? 'online' : online === false ? 'offline' : 'offline';
    const sizeClass = profile ? 'w-40 h-40' : 'w-8 h-8';
    return (
        <>
            {user.profile_photo_path && (
                    <div className={`chat-image avatar ${onlineClass}`}>
                        <div className={`rounded-full ${sizeClass}`}>
                            <img src={user.profile_photo_path} alt="" />
                        </div>
                    </div>
                )}

            {!user.profile_photo_path && (
                    <div className={`chat-image avatar placeholder ${onlineClass}`}>
                        <div className={`bg-gray-400 text-gray-800 rounded-full ${sizeClass}`}>
                            <span className={'text-xl'}>{user.name.substring(0,1).toUpperCase()}</span>
                        </div>
                    </div>
                )}
        </>
    )
}
