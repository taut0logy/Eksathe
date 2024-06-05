import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PaperClipIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { formatBytes, isImage, isPDF, isPreviewable, isVideo, isAudio } from "@/helpers";

export default function AttachmentPreviewModal({attachments, index, show =  false, onClose=() => {}}) {
    //console.log(attachments, index);
    const [currentInd, setCurrentInd] = useState(0);

    const attachment = useMemo(() => {
        return attachments[currentInd];
    }
    ,[currentInd, attachments]);

    const previewables = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }
    ,[attachments]);

    const close = () => {
        onClose();
    }

    const nextAttachment = () => {
        if (currentInd < attachments.length - 1) {
            setCurrentInd(currentInd + 1);
        }
    }

    const prevAttachment = () => {
        if (currentInd > 0) {
            setCurrentInd(currentInd - 1);
        }
    }

    useEffect(() => {
        setCurrentInd(index);
       // console.log("index", index);
    }, [index]);

    return (
        <Transition show={show} as={Fragment} leave={"duration-200"}>
            <Dialog as="div" className="relative z-50" onClose={close} id={"modal"}>
                <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                leave="ease-i duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/30"></div>
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="h-screen w-screen">
                        <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="flex flex-col w-full h-full transform overfolw-hidden bg-black/50 text-left align-middle shadow-xl transition-all z-30">
                                <button
                                className="absolute right-3 top-3 w-10 h-10 rounded-full flex items-center justify-center z-40 text-gray-100 hover:bg-primary bg-primary/70"
                                onClick={close}>
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                <div className="h-full relative group">
                                    {currentInd>0 && (
                                        <div onClick={prevAttachment}
                                        className="absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 left-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/50 hover:bg-primary z-30">
                                            <ChevronLeftIcon className="w-12" />
                                        </div>
                                    )}
                                    {currentInd < previewables.length-1 && (
                                        <div onClick={nextAttachment}
                                        className="absolute opacity-100 text-gray-100 cursor-pointer flex items-center justify-center w-16 h-16 right-4 top-1/2 -translate-y-1/2 rounded-full bg-primary/50 hover:bg-primary z-30"
                                        >
                                            <ChevronRightIcon className="w-12" />
                                        </div>
                                    )}
                                    {attachment && (
                                        <div className="flex items-center justify-center p-3 w-full h-full z-20">
                                            {isImage(attachment) && (
                                                <img src={attachment.url} className="max-w-full max-h-full" />
                                            )}
                                            {isVideo(attachment) && (
                                                <div className="flex items-center">
                                                    <video src={attachment.url} controls autoPlay></video>
                                                </div>
                                            )}
                                            {isAudio(attachment) && (
                                                <div className="relative flex items-center justify-center">
                                                    <audio src={attachment.url} controls autoPlay></audio>
                                                </div>
                                            )}
                                            {isPDF(attachment) && (
                                                <div className="p-32 flex flex-col items-center justify-center text-gray-100">
                                                    <iframe src={attachment.url} frameborder="0" className="w-full h-full"></iframe>
                                                </div>
                                            )}
                                            {!isPreviewable(attachment) && (
                                                <div className="p-32 flex flex-col justify-center items-center text-gray-100">
                                                    <PaperClipIcon className="w-10 h-10 mb-3"/>
                                                    <small>{attachment.name}</small>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
