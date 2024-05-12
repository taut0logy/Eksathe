import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PaperClipIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { formatBytes, isImage, isPDF, isPreviewable, isVideo, isAudio } from "@/helpers";

export default function AttachmentPreviewModal({attachments, index, show =  false, onClose=() => {}}) {
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
    }, [index]);

    return (
        <Transition show={show} as={Fragment} leave={"duration-200"}>
            <Dialog as="div" className="relative z-100" onClose={close} id={"modal"}>
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
            </Dialog>
        </Transition>
    )
}
