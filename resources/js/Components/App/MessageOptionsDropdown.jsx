import {Menu, Transition} from '@headlessui/react'
import {Fragment} from "react";
import {EllipsisVerticalIcon, TrashIcon, UserIcon} from "@heroicons/react/24/solid/index.js";
import { Emoji } from 'emoji-picker-react';

export default function MessageOptionsDropdown({message}) {

    const onMessageDelete = () => {
        console.log('onMessageDelete from' + message.id);
        axios.post(route('message.destroy', message))
            .then((response) => {
                emit('message.deleted', message);
                console.log("deleted");
            })
            .catch((error) => {
                console.log(error);
            })
    }



    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button
                        className="flex justify-center items-center w-8 h-8 rounded-full hover:bg-black/40">
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
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1 px-1">
                            <Menu.Item>
                                {({active}) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`${
                                            active ? 'bg-black/30 text-white' : 'text-gray-100'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        <span className={'text-red-500 flex'}>
                                                    <TrashIcon   className={'w-4 h-4 mr-2'} />
                                                    Delete Message</span>
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
