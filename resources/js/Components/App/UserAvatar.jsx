    import React from "react";
    import { useState, useEffect } from "react";
    import { useEventBus } from "@/EventBus";
    export default function UserAvatar({user, profile=false, className = ''}) {
        const { on } = useEventBus();
        const [isOnline, setIsOnline] = useState(null);
        const sizeClass = profile ? 'w-40 h-40' : 'w-8 h-8';
        //console.log(user);
        //let onlineClass = isOnline === true ? 'online' : isOnline === false ? 'offline' : '';
        // stayOn('online.users', (data) => {
        //     setIsOnline(data.includes(user.id.toString()));
        //     //console.log("online users", data,  isOnline, user.id);
        // });
        // useEffect(() => {
        //     stayOn('online.users', (data) => {
        //         setIsOnline(!!data.includes(user.id.toString()));
        //         console.log("online users", data,  isOnline, user.id);
        //     });
        // }, [stayOn]);
        useEffect(() => {
            on('online.users', (data) => {
                setIsOnline(data.includes(user.id.toString()));
                console.log("online users", data,  isOnline, user.id);
            });
        }, [on, user.id]);

        return (
            <>
                {user.profile_picture && (
                        <div className={`chat-image avatar ${isOnline == true ? 'online' : isOnline == false ? 'offline' : ''} '` + className}>
                            <div className={`rounded-full ${sizeClass}`}>
                                <img src={user.profile_picture} alt="" />
                            </div>
                        </div>
                    )}

                {!user.profile_picture && (
                        <div className={`chat-image avatar placeholder ${isOnline === true ? 'online' : isOnline === false ? 'offline' : ''} ` + className}>
                            <div className={`bg-primary text-gray-800 rounded-full ${sizeClass}`}>
                                <span className={`${profile ? "text-8xl" : "text-l"}`}>{user.name.substring(0,2)}</span>
                            </div>
                        </div>
                    )}
            </>
        )
    }
