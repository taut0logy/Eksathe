
export default function  Toast({message}) {
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-black/80 text-white p-4 rounded-lg shadow-lg">
                {message}
            </div>
        </div>
    )
}
