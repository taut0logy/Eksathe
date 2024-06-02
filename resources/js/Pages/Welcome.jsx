import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document.getElementById('screenshot-container')?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document.getElementById('docs-card-content')?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="">

                <div className="relative min-h-screen flex flex-col items-center justify-between selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:justify-center lg:col-start-2">
                                <img className='w-20 h-20' src ="/img/logo.png" />
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-primary ring-1 ring-transparent transition hover:text-secondary focus:outline-none focus-visible:ring-secondary "
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-primary ring-1 ring-transparent transition hover:text-secondary focus:outline-none focus-visible:ring-secondary"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-primary ring-1 ring-transparent transition hover:text-secondary foxus:outline-none focus-visible:ring-secondary"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6 w-full flex flex-col justify-center items-center">
                            <div className="grid gap-6 lg:grid-cols-1 lg:gap-8 ">
                                <p className='text-center text-3xl w-full'>
                                    Eksathe is a platform for collaborators to come together and share ideas, messages and files in style.
                                </p>
                                <div className='text-2xl text-center bold'>Key features include:</div>

                                    <ul className='flex flex-col items-center list-disc'>
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
                        </main>

                        <footer className="py-16 text-center text-sm text-secondary">
                            <p>
                                &copy; 2024 Eksathe. All rights reserved.
                            </p>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
