import {Popover, Transition} from '@headlessui/react';
import {Fragment} from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';


export default function ServerDetailPopover({ server }) {

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
                        <Popover.Panel className="absolute right-0 z-50 w-72 px-4 sm:px-0 mt-3">
                            <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5'>
                                <div className='bg-gray-800 p-4'>
                                    <h2 className='text-lg font-semibold mb-3'>Description</h2>
                                    {
                                        server.description ? (
                                            <p className='text-xs'>{server.description}</p>
                                        ) : (
                                            <p className='text-gray-500 text-xs text-center py-4'>No description available.</p>
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
