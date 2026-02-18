import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DataTableSchedules } from "./datatable-schedules";

export default async function SchedulesPage() {
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
                Agendamentos
            </h1>

            <p className="text-lg mb-4">
                Bem-vindo(a), {session.user.name}
            </p>

            <DataTableSchedules />
        </div>
    );
}
