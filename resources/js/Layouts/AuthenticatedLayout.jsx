import React from "react";
import { useEffect, useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
//import Echo from 'laravel-echo';
import { useEventBus } from "@/EventBus";
import Toast from "@/Components/App/Toast";
import NewMessageNotification from "@/Components/App/NewMessageNotification";
import ThemeToggler from "@/Components/App/ThemeToggler";

export default function Authenticated({
    header,
    children,
    success,
    error,
    info,
}) {
    const page = usePage();
    const user = page.props.auth.user;
    const conversations = page.props.conversations;
    const { emit } = useEventBus();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    useEffect(() => {
        conversations.forEach((element) => {
            let channel = `message.server.${element.id}`;
            if (element.is_user) {
                channel = `message.user.${[
                    parseInt(user.id),
                    parseInt(element.id),
                ]
                    .sort((a, b) => a - b)
                    .join("-")}`;
            }
            Echo.private(channel)
                .error((error) => {
                    console.log(channel, error);
                })
                .listen("SocketMessage", (e) => {
                    //console.log('SocketMessage',e);
                    const message = e.message;
                    emit("message.created", message);
                    if (message.sender_id === user.id) {
                        return;
                    }
                    emit("newMessageNotification", {
                        user: message.sender,
                        server_id: message.server_id,
                        message:
                            message.body ||
                            `Shared ${
                                message.attachments.length === 1
                                    ? "an attachment"
                                    : "attachments"
                            }`,
                    });
                });

            if (element.is_server) {
                //console.log(`server.deleted.${element.id}`);
                Echo.private(`server.deleted.${element.id}`)
                    .error((error) => {
                        //debugger;
                        console.error(`server.deleted.${element.id}`, error);
                    })
                    .listen("ServerDeleted", (e) => {
                        //console.log('ServerDeleted',e);
                        //debugger;
                        emit("server.deleted", { id: e.id, name: e.name });
                    });
            }
        });

        if (success) {
            emit("toast.show", { type: "success", message: success });
        }

        if (error) {
            emit("toast.show", { type: "error", message: error });
        }

        if (info) {
            emit("toast.show", { type: "info", message: info });
        }

        return () => {
            conversations.forEach((element) => {
                let channel = `message.server.${element.id}`;
                if (element.is_user) {
                    channel = `message.user.${[
                        parseInt(user.id),
                        parseInt(element.id),
                    ]
                        .sort((a, b) => a - b)
                        .join("-")}`;
                }
                Echo.leave(channel);

                if (element.is_server) {
                    //console.log(`server.deleted.${element.id}`);
                    Echo.leave(`server.deleted.${element.id}`);
                }
            });
        };
    }, [conversations]);

    return (
        <>
            <div className="flex flex-col h-screen min-h-screen">
                <nav className="border-b border-primary/50">
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex items-center shrink-0">
                                    <Link href="/">
                                        <ApplicationLogo className="block w-auto text-gray-800 fill-current h-9 dark:text-gray-200" />
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route("dashboard")}
                                        active={route().current("dashboard")}
                                    >
                                        Conversations
                                    </NavLink>
                                </div>
                            </div>

                            <div className="flex">

                                <ThemeToggler />

                                <div className="hidden sm:flex sm:items-center ">
                                    <div className="relative">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out border border-transparent rounded-md text-primary hover:text-accent focus:outline-none"
                                                    >
                                                        {user.name}

                                                        <svg
                                                            className="ms-2 -me-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content contentClasses="bg-primary text-primary-content">
                                                <Dropdown.Link
                                                    className="rounded-md hover:bg-secondary hover:text-secondary-content"
                                                    href={route("profile.edit")}
                                                >
                                                    Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    className="rounded-md hover:bg-secondary hover:text-secondary-content"
                                                    href={route("logout")}
                                                    as="button"
                                                >
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                <div className="flex items-center -me-2 sm:hidden">
                                    <button
                                        onClick={() =>
                                            setShowingNavigationDropdown(
                                                (previousState) =>
                                                    !previousState,
                                            )
                                        }
                                        className="inline-flex items-center justify-center p-2 transition duration-150 ease-in-out rounded-md hover:text-accent-content hover:bg-accent focus:outline-none focus:bg-neutral/80 focus:text-accent"
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                className={
                                                    !showingNavigationDropdown
                                                        ? "inline-flex"
                                                        : "hidden"
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                className={
                                                    showingNavigationDropdown
                                                        ? "inline-flex"
                                                        : "hidden"
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>


                            </div>
                        </div>
                    </div>

                    <div
                        className={
                            (showingNavigationDropdown ? "block" : "hidden") +
                            " sm:hidden"
                        }
                    >
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Conversations
                            </ResponsiveNavLink>
                        </div>

                        <div className="pt-4 pb-1 border-t border-primary">
                            <div className="px-4">
                                <div className="text-base font-medium text-primary">
                                    {user.name}
                                </div>
                                <div className="text-sm font-medium">
                                    {user.email}
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Profile
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                >
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="shadow bg-accent/80 ">
                        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {children}
            </div>
            <Toast />
            <NewMessageNotification />
        </>
    );
}
