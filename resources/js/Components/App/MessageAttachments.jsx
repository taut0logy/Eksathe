import { PaperClipIcon, ArrowDownTrayIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import { isAudio, isImage, isVideo, isPDF, isPreviewable } from "@/helpers";
export default function AttachmentPreview({attachments, attachmentClick}) {
    return (
        <>
            {attachments.length > 0 && (
                <div className="flex flex-wrap mt-2 justify-end gap-1">
                    {
                        attachments.map((attachment, index) => (
                            <div
                                key={attachment.id}
                                className={"relative group flex-col flex justify-center items-center cursor-pointer text-gray-500" + (!!isAudio(attachment)?"w-84":"w-32 aspect-square bg-blue-100")}
                                onClick={(ev) => attachmentClick(attachment, ind)}
                            >
                                    {!isAudio(attachment) && (
                                        <a onClick={(ev) => ev.stopPropagation()}
                                        download
                                        href={attachment.url}
                                        className="z-20 opacity-100 group-hover:opacity-100 transition-all *:w-8 h-8 flex items-center
                                        justify-center text-gray-800 bg-primary rounded absolute top-0 right-0 cursor-pointer hover:bg-primary/50"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                        </a>
                                    )}
                                    {
                                        isImage(attachment) && (
                                            <img src={attachment.url} className="object-contain aspect-square" />
                                        )
                                    }
                                    {
                                        isVideo(attachment) && (
                                            <div className="relative flex justify-center items-center">
                                                <PlayCircleIcon className="z-20 w-16 h-16 absolute text-white opacitu-70" />
                                                <div className="absolute top-0 left-0 w-full h-full z-10 bg-black/20">
                                                </div>
                                                <video src={attachment.url}></video>
                                            </div>
                                        )
                                    }
                                    {
                                        isAudio(attachment) && (
                                            <div className="relative flex justify-center items-center">
                                                <audio src={attachment.url} controls></audio>
                                            </div>
                                        )
                                    }
                                    {
                                        isPDF(attachment) && (
                                            <div className="relative flex justify-center items-center">
                                                <div className="absolute left-0 top-0 right-0 bottom-0">

                                                </div>
                                                <iframe src={attachment.url} className="w-full h-full" />
                                            </div>
                                        )
                                    }
                                    {
                                        !isPreviewable(attachment) && (
                                            <a onClick={(ev) => ev.stopPropagation()}
                                            download
                                            href={attachment.url}
                                            className="flex flex-col items-center justify-center"
                                            ><PaperClipIcon className="w-10 h-10 mb-3" />
                                            <small>{attachment.name}</small>
                                            </a>
                                        )
                                    }
                            </div>
                        ))
                    }
                </div>
            )}
        </>
    )
}
