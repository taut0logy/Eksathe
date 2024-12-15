import { useEffect, useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { PencilIcon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Register({ status, success, info, error }) {
    const [avatar, setAvatar] = useState(null);

    const clearAvatar = () => {
        setAvatar(null);
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        profile_photo: null,
        username: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        _method: "POST",
    });

    // const [file, setFile] = useState(null);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <GuestLayout logo={false}>
            <Head title="Register" />

            <form onSubmit={submit} className="">
                {status && (
                    <div className="mb-4 text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
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
                {info && (
                    <div className="mb-4 text-sm font-medium text-info">
                        {info}
                    </div>
                )}
                <div>
                    <InputLabel
                        className="mb-3 text-center"
                        htmlFor="profile_photo"
                        value="Choose Profile Photo"
                    />
                    <div className="flex items-center justify-center w-full">
                        <div className="relative border-4 rounded-full border-accent">
                            {avatar && (
                                <div
                                    className={`chat-image avatar flex items-center justify-center`}
                                >
                                    <div className={`rounded-full w-40 h-40`}>
                                        <img src={avatar} alt="" />
                                    </div>
                                </div>
                            )}

                            {!avatar && (
                                <div
                                    className={`chat-image avatar flex items-center justify-center`}
                                >
                                    <div className={`rounded-full w-40 h-40`}>
                                        <img
                                            className="bg-white"
                                            src={"/img/avatar.png"}
                                            alt=""
                                        />
                                    </div>
                                </div>
                            )}
                            <input
                                required
                                type="file"
                                accept={"image/*"}
                                id="profile_photo"
                                name="profile_photo"
                                className="absolute top-0 left-0 w-40 h-40 overflow-hidden rounded-full shadow-lg opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    setAvatar(
                                        URL.createObjectURL(e.target.files[0])
                                    );
                                    setData("profile_photo", e.target.files[0]);
                                }}
                            />
                            <PencilIcon className="absolute bottom-0 right-0 w-10 h-10 p-2 rounded-full cursor-pointer text-accent-content bg-accent" />
                            {avatar && (
                                <XMarkIcon
                                    className="absolute top-0 right-0 w-8 h-8 p-2 -translate-x-1 translate-y-1 rounded-full cursor-pointer text-accent-content bg-accent"
                                    onClick={clearAvatar}
                                />
                            )}
                        </div>
                    </div>
                    <InputError
                        message={errors.profile_photo}
                        className="mt-2 text-center"
                    />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        type="text"
                        name="username"
                        value={data.username}
                        className="block w-full mt-1"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="block w-full mt-1"
                        autoComplete="name"
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full mt-1"
                        autoComplete="email"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="block w-full mt-1"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("login")}
                        className="text-sm underline rounded-md hover:text-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
