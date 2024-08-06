import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
    PaperClipIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
    formatBytes,
    isImage,
    isPDF,
    isPreviewable,
    isVideo,
    isAudio,
} from "@/helpers";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function AttachmentPreviewModal({
    attachments,
    index,
    show = false,
    onClose = () => {},
}) {
    //console.log(attachments, index);
    const [currentInd, setCurrentInd] = useState(0);

    const attachment = useMemo(() => {
        return attachments[currentInd];
    }, [currentInd, attachments]);

    const previewables = useMemo(() => {
        return attachments.filter((attachment) => isPreviewable(attachment));
    }, [attachments]);

    const close = () => {
        onClose();
    };

    const nextAttachment = () => {
        if (currentInd < attachments.length - 1) {
            setCurrentInd(currentInd + 1);
        }
    };

    const prevAttachment = () => {
        if (currentInd > 0) {
            setCurrentInd(currentInd - 1);
        }
    };

    useEffect(() => {
        setCurrentInd(index);
        // console.log("index", index);
    }, [index]);

    return (
        <Transition show={show} as={Fragment} leave={"duration-200"}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={close}
                id={"modal"}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    leave="ease-i duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30"></div>
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="w-screen h-screen">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="z-30 flex flex-col w-full h-full text-left align-middle transition-all transform shadow-xl overfolw-hidden bg-black/50">
                                <button
                                    className="absolute z-40 flex items-center justify-center w-10 h-10 text-gray-100 rounded-full right-3 top-3 hover:bg-primary bg-primary/70"
                                    onClick={close}
                                >
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                                
                                <div className="relative h-full group">
                                    {currentInd > 0 && (
                                        <div
                                            onClick={prevAttachment}
                                            className="absolute z-30 flex items-center justify-center w-16 h-16 text-gray-100 -translate-y-1/2 rounded-full opacity-100 cursor-pointer left-4 top-1/2 bg-primary/50 hover:bg-primary"
                                        >
                                            <ChevronLeftIcon className="w-12" />
                                        </div>
                                    )}
                                    {currentInd < previewables.length - 1 && (
                                        <div
                                            onClick={nextAttachment}
                                            className="absolute z-30 flex items-center justify-center w-16 h-16 text-gray-100 -translate-y-1/2 rounded-full opacity-100 cursor-pointer right-4 top-1/2 bg-primary/50 hover:bg-primary"
                                        >
                                            <ChevronRightIcon className="w-12" />
                                        </div>
                                    )}
                                    {attachment && (
                                        <div className="z-20 flex items-center justify-center w-full h-full p-3">
                                            {isImage(attachment) && (
                                                <LazyLoadImage
                                                    src={attachment.url}
                                                    className="max-w-full max-h-full"
                                                />
                                            )}
                                            {isVideo(attachment) && (
                                                <div className="flex items-center">
                                                    <video
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    ></video>
                                                </div>
                                            )}
                                            {isAudio(attachment) && (
                                                <div className="relative flex items-center justify-center">
                                                    <audio
                                                        src={attachment.url}
                                                        controls
                                                        autoPlay
                                                    ></audio>
                                                </div>
                                            )}
                                            {isPDF(attachment) && (
                                                <div className="flex flex-col items-center justify-center p-32 text-gray-100">
                                                    <iframe
                                                        src={attachment.url}
                                                        frameborder="0"
                                                        className="w-full h-full"
                                                    ></iframe>
                                                </div>
                                            )}
                                            {!isPreviewable(attachment) && (
                                                <div className="flex flex-col items-center justify-center p-32 text-gray-100">
                                                    <PaperClipIcon className="w-10 h-10 mb-3" />
                                                    <small>
                                                        {attachment.name}
                                                    </small>
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
    );
}
