import { Head } from '@inertiajs/react';
import ChatLayout from "@/Layouts/ChatLayout.jsx";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.jsx";

export default function Dashboard({ auth }) {
    return (
        <>
            <Head title="Dashboard" />
            Messages
        </>
    );
}
Dashboard.layout = (page) => {
     return (
         <AuthenticatedLayout
         user={page.props.auth.user}>
             <ChatLayout children={page} />
         </AuthenticatedLayout>
     )
}
