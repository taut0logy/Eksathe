import ThemeToggler from "@/Components/App/ThemeToggler";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link, Head } from "@inertiajs/react";

export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    success,
    error,
}) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <div className="overflow-y-scroll ">
            <Head title="Welcome" />
            {success && (
                <div className="mb-4 text-sm font-medium text-success">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 text-sm font-medium text-error">
                    {error}
                </div>
            )}

            <div className="relative min-h-screen flex flex-col items-center justify-between selection:bg-[#FF2D20] selection:text-white">
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                    <header className="grid items-center grid-cols-2 gap-2 py-10 lg:grid-cols-3">
                        <div className="flex lg:justify-center lg:col-start-2">
                            <ApplicationLogo className="w-10 h-10 fill-current md:w-20 md:h-20" />
                        </div>
                        <nav className="flex justify-end flex-1 -mx-3">
                            <ThemeToggler />
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="px-3 py-2 transition rounded-md text-primary ring-1 ring-transparent hover:text-secondary focus:outline-none focus-visible:ring-secondary "
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="px-3 py-2 transition rounded-md text-primary ring-1 ring-transparent hover:text-secondary focus:outline-none focus-visible:ring-secondary"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="px-3 py-2 transition rounded-md text-primary ring-1 ring-transparent hover:text-secondary foxus:outline-none focus-visible:ring-secondary"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </header>

                    <main className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-6">
                        <div className="grid gap-6 lg:grid-cols-1 lg:gap-8 ">
                            <p className="w-full text-3xl">
                                Eksathe is a platform for collaborators to come
                                together and share ideas, messages and files in
                                style.
                            </p>
                            <div className="text-2xl bold">
                                Key features include:
                            </div>

                            <div className="py-4 text-lg rounded-lg px-auto">
                                <ul className="list-disc list-inside">
                                    <li>Real-time messaging</li>
                                    <li>Styling messages with markdown</li>
                                    <li>Syntax highlighted code snippets</li>
                                    <li>Private and group conversations</li>
                                    <li>Notifications</li>
                                    <li>File sharing</li>
                                    <li>Collaboration tools</li>
                                    <li>And much more...</li>
                                </ul>
                            </div>
                        </div>
                    </main>

                    <footer className="py-16 text-sm text-center text-secondary">
                        <p>&copy; 2024 Eksathe. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
