    import React from "react";
    import { useEventBus } from "@/EventBus";
import { LazyLoadImage } from "react-lazy-load-image-component";
    export default function UserAvatar({user, profile=false, isOnline = null, className = ''}) {
        const { on } = useEventBus();
        const sizeClass = profile ? 'w-40 h-40' : 'w-8 h-8';
        let onlineClass = isOnline === true ? 'online ' : isOnline === false ? 'offline ' : '';

        return (
            <>
                {user.profile_picture && (
                        <div className={`chat-image avatar ${onlineClass}'` + className}>
                            <div className={`rounded-full ${sizeClass}`}>
                                <LazyLoadImage src={user.profile_picture} alt={user.name}/>
                            </div>
                        </div>
                    )}

                {!user.profile_picture && (
                        <div className={`chat-image avatar placeholder ${onlineClass}` + className}>
                            <div className={`bg-primary text-gray-800 rounded-full ${sizeClass}`}>
                                <span className={`${profile ? "text-8xl" : "text-l"}`}>{user.name.substring(0,2)}</span>
                            </div>
                        </div>
                    )}
            </>
        )
    }
