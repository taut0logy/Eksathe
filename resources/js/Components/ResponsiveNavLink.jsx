import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
                active
                    ? 'border-accent text-accent bg-neutral focus:text-accent-content focus:bg-accent focus:border-secondary'
                    : 'border-transparent hover:text-accent hover:bg-neutral hover:border-accent focus:text-accent-content focus:bg-accent focus:border-secondary'
            } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}
