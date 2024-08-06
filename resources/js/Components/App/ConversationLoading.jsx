

export default function ConversationLoading({}) {
    return (
        <div className="flex items-center gap-2 p-2 m-2 transition-all cursor-pointer border-l-4 border-transparent">
            <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
            <div className="flex-1 text-xs max-w-full overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                    <div className="skeleton w-60 h-4"></div>
                    <div className="skeleton w-16 h-3"></div>
                </div>
                <div className="skeleton w-80 max-w-full h-3 mt-3"></div>
            </div>
        </div>
    )
}
