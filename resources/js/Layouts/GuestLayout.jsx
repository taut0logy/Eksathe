import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function Guest({ children, logo = true }) {
    return (
        <div className="flex flex-col items-center max-h-screen min-h-screen pt-6 overflow-y-auto sm:justify-center sm:pt-0">
            {logo && (
                <div>
                    <Link href="/">
                        <ApplicationLogo className="w-40 h-40 fill-current" />
                    </Link>
                </div>
            )}

            <div className="absolute top-0 left-0 flex items-center justify-center translate-x-3 translate-y-3">
                <Link href="/">
                    <ArrowLeftIcon className="w-6 h-6 text-primary hover:text-accent" />
                </Link>
            </div>

            <div className="w-full max-h-screen px-6 py-4 mt-6 shadow-md sm:max-w-md bg-neutral/80 text-neutral-content sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
