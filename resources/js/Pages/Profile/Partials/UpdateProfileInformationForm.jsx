import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;
    const [avatar, setAvatar] = useState(user.profile_picture);

    const clearAvatar = () => {
        setAvatar(null);
    };

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            profile_photo: null,
            name: user.name,
            email: user.email,
            _method: "PATCH",
        });

    const submit = (e) => {
        e.preventDefault();

        post(route("profile.update"));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-accent">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                <InputLabel className="text-center mb-3" htmlFor="profile_photo" value="Update Profile Photo" />
                <div className="w-full flex items-center justify-center">
                    <div className="relative rounded-full border-4 border-accent">
                        {avatar && (
                            <div className={`chat-image avatar flex items-center justify-center`}>
                                <div className={`rounded-full w-40 h-40`}>
                                    <img src={avatar} alt="" />
                                </div>
                            </div>
                        )}

                        {!avatar && (
                            <div className={`chat-image avatar placeholder `}>
                                <div
                                    className={`bg-primary text-gray-800 rounded-full w-40 h-40`}
                                >
                                    <span className="text-8xl">
                                        {user.name.substring(0, 2)}
                                    </span>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            id="profile_photo"
                            name="profile_photo"
                            className="w-40 h-40 absolute top-0 left-0 rounded-full opacity-0 overflow-hidden shadow-lg cursor-pointer"
                            onChange={(e) =>{
                                setAvatar(URL.createObjectURL(e.target.files[0]))
                                setData("profile_photo", e.target.files[0])
                            }
                            }
                        />
                        <PencilIcon className="w-10 h-10 absolute bottom-0 right-0 text-accent-content bg-accent rounded-full p-2 cursor-pointer" />
                        {avatar && (<XMarkIcon className="w-8 h-8 absolute top-0 right-0 -translate-x-1 translate-y-1 text-accent-content bg-accent rounded-full p-2 cursor-pointer" onClick={clearAvatar} />)}
                    </div>
                </div>
                <InputError message={errors.profile_photo} className="mt-2 text-center" />
                </div>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
