import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

export default function Guest({ children, logo = true }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 overflow-y-scroll">
            {logo && (
                <div>
                    <Link href="/">
                        <ApplicationLogo className="w-40 h-40 fill-current" />
                    </Link>
                </div>
            )}


                    <div className="absolute top-0 left-0 translate-x-3 translate-y-3 flex items-center justify-center">
                        <Link href="/">
                            <ArrowLeftIcon className="w-6 h-6 text-primary hover:text-accent" />
                        </Link>
                    </div>
                

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-neutral shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
