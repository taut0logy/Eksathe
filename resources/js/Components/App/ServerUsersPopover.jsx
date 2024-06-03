import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { UserIcon } from "@heroicons/react/24/solid";
import UserAvatar from "@/Components/App/UserAvatar";
import { Link } from "@inertiajs/react";

export default function ServerUsersPopover({ users = [] }) {
    return (
        <Popover className={"relative"}>
            {({ open }) => (
                <>
                    <Popover.Button
                        className={`${open ? "text-secondary" : "text-primary"} hover:text-accent`}
                        data-tip="Users"
                    >
                        <UserIcon className="w-6 h-6" />
                    </Popover.Button>
                    <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <Popover.Panel className="absolute right-0 z-50 w-48 px-4 sm:px-0 mt-3">
                            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                <div className="bg-gray-800 p-2">
                                    {users.map((user) => (
                                        <Link key={user.id} href={route("chat.user", user.id)} className="flex items-center gap-2 py-2 px-3 hover:bg-black/30 rounded-md">
                                            <UserAvatar user={user} />
                                            <div className="text-xs">{user.name}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
