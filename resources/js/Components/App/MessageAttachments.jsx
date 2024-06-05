import {
    PaperClipIcon,
    ArrowDownTrayIcon,
    PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { isAudio, isImage, isVideo, isPDF, isPreviewable } from "@/helpers";

export default function MessageAttachments({ attachments, attachmentClick }) {
    return (
        <>
            {attachments.length > 0 && (
                <div className="flex flex-wrap mt-2 justify-start gap-1">
                    {attachments.map((attachment, ind) => (
                        <div
                            key={attachment.id}
                            className={
                                "relative group flex-col flex justify-center items-center cursor-pointer rouned-md contain-content" +
                                (!!isAudio(attachment)
                                    ? "w-84"
                                    : "w-36 aspect-square")
                            }
                            onClick={(ev) => attachmentClick(attachments, ind)}
                        >
                            {!isAudio(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="z-10 opacity-100 group-hover:opacity-100 transition-all w-8 h-8 flex items-center
                                        justify-center text-gray-800 rounded absolute top-0 right-0 cursor-pointer hover:bg-secondary hover:text-secondary-content"
                                >
                                    <ArrowDownTrayIcon className="w-4 h-4" />
                                </a>
                            )}
                            {isImage(attachment) && (
                                <img
                                    src={attachment.url}
                                    className="aspect-square rounded-md w-36 h-36 object-cover border-2 border-gray-800"
                                />
                            )}
                            {isVideo(attachment) && (
                                <div className="relative flex justify-center items-center rounded-md w-36">
                                    <PlayCircleIcon className="z-20 w-16 h-16 absolute text-white opacity-70" />
                                    <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
                                    <video className="w-36 rounded-md" src={attachment.url}></video>
                                </div>
                            )}
                            {isAudio(attachment) && (
                                <div className="relative flex justify-center items-center">
                                    <audio className="rounded-md"
                                        src={attachment.url}
                                        controls
                                    ></audio>
                                </div>
                            )}
                            {isPDF(attachment) && (
                                <div className="relative flex justify-center items-center w-36 h-36 border-2 border-gray-800 rounded-md">
                                    <div className="absolute left-0 top-0 right-0 bottom-0"></div>
                                    <object
                                        data={attachment.url}
                                        type="application/pdf"
                                        width="100%"
                                        height="100%"
                                    >
                                        <p className="pt-10 text-center">
                                            <small>Your browser does not support PDFs.<br /><a href={attachment.url}>
                                                Download the PDF
                                            </a></small>
                                            .
                                        </p>
                                    </object>
                                    {/* <iframe src={attachment.url} className="w-full h-full" /> */}
                                </div>
                            )}
                            {!isPreviewable(attachment) && (
                                <a
                                    onClick={(ev) => ev.stopPropagation()}
                                    download
                                    href={attachment.url}
                                    className="flex flex-col items-center justify-center w-36 h-36"
                                >
                                    <PaperClipIcon className="w-10 h-10 pt-2" />
                                    <small className="text-center w-full ps-1 pr-1 line-clamp-2">
                                        {attachment.name}
                                    </small>
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}
