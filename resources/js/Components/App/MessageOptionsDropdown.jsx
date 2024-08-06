import {Menu, Transition} from '@headlessui/react'
import {Fragment} from "react";
import {EllipsisVerticalIcon, TrashIcon, UserIcon} from "@heroicons/react/24/solid/index.js";
import axios from "axios";
import { useEventBus } from '@/EventBus';


export default function MessageOptionsDropdown({message}) {
    const {emit} = useEventBus();
    const onMessageDelete = () => {
        //console.log('onMessageDelete from ' + message.id);
        axios.delete(route('message.destroy', message))
            .then((response) => {
                //console.log("deleted", response.data);
                emit('message.deleted', {message: message, prevMessage: response.data.message});
            })
            .catch((error) => {
                console.log(error);
            })
    }



    return (
        <div className="absolute z-10 -translate-y-1/2 top-1/2 right-full text-secondary ">
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
                        className="absolute left-0 z-50 mt-2 origin-top-right bg-gray-800 rounded-md shadow-lg -top-12 w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="">
                            <Menu.Item>
                                {({active}) => (
                                    <button
                                        onClick={onMessageDelete}
                                        className={`${
                                            active ? 'bg-black/30 text-white' : 'text-gray-100'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                    >
                                        <span className={'text-red-500 flex items-center justify-center'}>
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
