import {Menu, Transition} from '@headlessui/react'
import {Fragment} from "react";
import axios from "axios";
import { useEventBus } from '@/EventBus';
import {EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserIcon} from "@heroicons/react/24/solid/index.js";

export default function UserOptionsDropdown({conversation}) {
    const { emit } = useEventBus();
    const changeUserRole = () => {
         console.log('changeUserRole from ' + conversation.id);
         if(conversation.is_user) {
             axios.post(route('user.change-role', conversation))
                 .then((response) => {
                     console.log(response.data);
                     emit('toast.show', {
                            message: response.data.message,
                            type: 'success'
                        });
                 })
                 .catch((error) => {
                     console.log(error);
                     emit('toast.show', {
                        message: error.data.message,
                        type: 'error'
                    });
                 })
         }
    }

    const onBlockUser=() => {
        //console.log('onBlockUser from ' + conversation.id);
        if(!conversation.is_user) {
            return;
        }
        axios.post(route('user.ban-unban', conversation))
            .then((response) => {
                //console.log(response.data);
                emit('toast.show', {
                    message: response.data.message,
                    type: 'success'
                });
            })
            .catch((error) => {
                console.log(error);
                emit('toast.show', {
                    message: error.data.message,
                    type: 'error'
                });
            })
    }

    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button
                        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/40">
                        <EllipsisVerticalIcon className="w-5 h-5"/>
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className="absolute right-0 z-10 w-48 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({active}) => (
                                    <button
                                        onClick={onBlockUser}
                                        className={`${
                                            active ? 'bg-black/30 text-white' : 'text-gray-100'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {conversation.blocked_at && (
                                                <span className={'text-green-500 flex'}>
                                                    <LockOpenIcon className={'w-4 h-4 mr-2'} />
                                                    Unban</span>
                                            )}
                                        {!conversation.blocked_at && (
                                            <span className={'text-red-500 flex'}>
                                                    <LockClosedIcon   className={'w-4 h-4 mr-2'} />
                                                    Ban</span>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                {({active}) => (
                                    <button
                                        onClick={changeUserRole}
                                        className={`${
                                            active ? 'bg-black/30 text-white' : 'text-gray-100'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        {!conversation.is_admin && (
                                            <span className={'text-green-500 flex' }>
                                                    <ShieldCheckIcon   className={'w-4 h-4 mr-2'} />
                                                    Make Admin </span>
                                        )}
                                        {conversation.is_admin && (
                                            <span className={'text-red-500 flex'}>
                                                    <UserIcon   className={'w-4 h-4 mr-2'} />
                                                    Remove Admin Status </span>
                                        )}
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
)
}
