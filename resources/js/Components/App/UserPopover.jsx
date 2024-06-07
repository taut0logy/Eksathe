import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import { ExclamationCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import UserAvatar from './UserAvatar';


export default function UserPopover({ user }) {

    return (
        <Popover className={"relative"}>
            {({ open }) => (
                <>
                    <Popover.Button className={`${open ? "text-secondary" : "text-primary"} hover:text-accent`}>
                        <ExclamationCircleIcon className="w-6 h-6" />
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
                        <Popover.Panel className="absolute right-0 z-50 w-80 px-4 sm:px-0 mt-3">
                            <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5'>
                                <div className='bg-gray-800 p-4 flex flex-col justify-center items-center'>
                                    <div className='w-full mb-5 flex justify-center'>
                                        <UserAvatar user={user} profile = {true} />
                                    </div>
                                    <h2 className='text-lg font-semibold mb-2 mt-2 flex items-center'>
                                        {
                                            user.is_admin && (
                                                <ShieldCheckIcon className="w-6 h-6 mr-2 text-green-600" />
                                        )}
                                        {user.name}</h2>
                                    <h4 className='mb-2'>{user.email}</h4>
                                    <h4 className='mb-2 font-semibold text-sm italic'>@{user.username}</h4>
                                    {
                                        user.blocked_at && (
                                            <p className='text-xl font-bold text-red-500'>Banned</p>
                                        )
                                    }
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}
