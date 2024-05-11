import { UsersIcon } from "@heroicons/react/24/solid";

export default function ServerAvatar({}) {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div className={`bg-secondary text-gray-800 rounded-full w-8 h-8`}>
                    <span className={`text-xl`}>
                        <UsersIcon className={`w-4`}/>
                    </span>
                </div>
            </div>
        </>
    )
}
