import React from "react";
import {PaperClipIcon} from "@heroicons/react/24/solid/index.js";
import { formatBytes, isPDF, isPreviewable } from "@/helpers";

export default function AttachmentPreview({attachment}) {
    return (
        <div>
            <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md">
                {isPDF(attachment.file) && (
                    <img src="/img/pdf.png" alt="pdf file" className="w-8 bg-white rounded border border-neutral" />
                )}
                {!isPreviewable(attachment.file) && (
                    <div className="w-10 h-10 flex items-center justify-center text-gray-800 rounded bg-accent">
                        <PaperClipIcon className="w-8 h-8 text-primary" />
                    </div>
                )}
                <div className="flex-1 text-ellipsis text-wrap overflow-hidden">
                    <h3>{attachment.file.name}</h3>
                    <div className="text-xs">{formatBytes(attachment.file.size)}</div>
                </div>
            </div>

        </div>
    );
}
