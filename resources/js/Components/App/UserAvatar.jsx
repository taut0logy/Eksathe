    import React from "react";
    import { useState, useEffect } from "react";
    import { useEventBus } from "@/EventBus";
    export default function UserAvatar({user, profile=false}) {
        const { stayOn } = useEventBus();
        const [isOnline, setIsOnline] = useState(null);
        const sizeClass = profile ? 'w-40 h-40' : 'w-8 h-8';
        //let onlineClass = isOnline === true ? 'online' : isOnline === false ? 'offline' : '';
        stayOn('online.users', (data) => {
            setIsOnline(data.includes(user.id.toString()));
            //console.log("online users", data,  isOnline, user.id);
        });
        // useEffect(() => {
        //     stayOn('online.users', (data) => {
        //         setIsOnline(!!data.includes(user.id.toString()));
        //         console.log("online users", data,  isOnline, user.id);
        //     });
        // }, [stayOn]);
        // useEffect(() => {
        //     on('online.users', (data) => {
        //         setIsOnline(data.includes(user.id.toString()));
        //         console.log("online users", data,  isOnline, user.id);
        //     });
        // }, [on, user.id]);

        return (
            <>
                {user.profile_photo_path && (
                        <div className={`chat-image avatar ${isOnline == true ? 'online' : isOnline == false ? 'offline' : ''}`}>
                            <div className={`rounded-full ${sizeClass}`}>
                                <img src={user.profile_photo_path} alt="" />
                            </div>
                        </div>
                    )}

                {!user.profile_photo_path && (
                        <div className={`chat-image avatar placeholder ${isOnline === true ? 'online' : isOnline === false ? 'offline' : ''}`}>
                            <div className={`bg-primary text-gray-800 rounded-full ${sizeClass}`}>
                                <span className={'text-l'}>{user.name.substring(0,2)}</span>
                            </div>
                        </div>
                    )}
            </>
        )
    }
