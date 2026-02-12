import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import AdminPainel from "@/components/admin-painel";

export default async function AdminPage() {
    const sessionResult = await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
            throw: false,
        },
    });

    const session = sessionResult.data;

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-4xl py-4 text-primary">
                Painel Admin
            </h1>

            <p className="text-lg mb-4">
                Bem-vindo(a), {session.user.name}
            </p>

            <AdminPainel session={session} />

        </div>
    );
}
