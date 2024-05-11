import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-secondary text-secondary focus:border-accent focus:text-accent'
                    : 'border-transparent text-secondary hover:text-accent hover:border-accent focus:text-primary focus:border-primary ') +
                className
            }
        >
            {children}
        </Link>
    );
}
