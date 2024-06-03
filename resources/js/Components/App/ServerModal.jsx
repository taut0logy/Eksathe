import TextAreaInput from "../TextAreaInput";
import InputLabel from "../InputLabel";
import InputError from "../InputError";
import TextInput from "../TextInput";
import PrimaryButton from "../PrimaryButton";
import SecondaryButton from "../SecondaryButton";
import Modal from "../Modal";
import UserPicker from "./UserPicker";
import { useState, useEffect } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { useEventBus } from "@/EventBus";

export default function ServerModal({ show = false, onClose = () => {} }) {
    const page = usePage();
    const { on, emit } = useEventBus();
    const conversations = page.props.conversations;
    const [server, setServer] = useState({});
    const users = conversations.filter(
        (conversation) => !conversation.is_server,
    );

    const { data, setData, errors, post, processing, reset, put } = useForm({
        id: "",
        name: "",
        description: "",
        user_ids: [],
    });

    const createOrUpdateServer = (e) => {
        e.preventDefault();

        if (server.id) {
            put(route("server.update", server.id), {
                data,
                onSuccess: () => {
                    emit("toast.show", {
                        message: "Server updated successfully",
                        type: "success",
                    });
                    onCloseModal();
                },
            });
        } else {
            post(route("server.store"), {
                data,
                onSuccess: () => {
                    emit("toast.show", {
                        message: "Server created successfully",
                        type: "success",
                    });
                    onCloseModal();
                },
            });
        }
    };

    const onCloseModal = () => {
        reset();
        onClose();
        emit("ServerModal.close");
    };

    useEffect(() => {
        on("ServerModal.show", (server) => {
            //debugger;
            setServer(server);
            setData({
                id: server.id,
                name: server.name,
                description: server.description,
                user_ids: server.users
                    .filter((user) => server.owner_id !== user.id)
                    .map((user) => user.id),
            });
            setServer(server);
        });

        on("ServerModal.close", () => {
            setServer({});
        });
    }, [on]);

    return (
        <Modal show={show} onClose={onCloseModal}>
            <form
                onSubmit={createOrUpdateServer}
                className="overflow-y-auto p-6"
            >
                <h2 className="text-xl font-medium">
                    {server.id ? "Update Server" : "Create New Server"}
                </h2>
                <div className="mt-8">
                    <InputLabel value={"Name"} htmlFor="name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        placeholder="Enter server name"
                        value={data.name}
                        disabled={!!server.id}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                    />
                    <InputError className="mt-2">{errors.name}</InputError>
                </div>

                <div className="mt-4">
                    <InputLabel value={"Description"} htmlFor="description" />
                    <TextAreaInput
                        id="description"
                        rows="3"
                        className="mt-1 block w-full"
                        placeholder="Enter server description" 
                        value={data.description || ""}
                        onChange={(e) => setData("description", e.target.value)}
                    />
                    <InputError className="mt-2">{errors.description}</InputError>
                </div>

                <div className="mt-4">
                    <InputLabel value={"Select Members"} />
                    <UserPicker
                        options={users}
                        value={users.filter((user) =>
                            data.user_ids.includes(user.id) && server.owner_id !== user.id
                        )}
                        onSelect={(users) => {
                            setData("user_ids", users.map((user) => user.id));
                        }}
                        // onRemove={(user) => {
                        //     setData("user_ids", (prev) =>
                        //         prev.filter((id) => id !== user.id),
                        //     );
                        // }}
                    />
                    <InputError className="mt-2">{errors.user_ids}</InputError>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onCloseModal}>
                        Cancel
                    </SecondaryButton>
                    <PrimaryButton
                        className="ms-3"
                        type="submit"
                        disabled={processing}
                    >
                        {server.id ? "Update" : "Create"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
