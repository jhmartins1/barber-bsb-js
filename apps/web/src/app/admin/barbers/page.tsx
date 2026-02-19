import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import BarbersTable from "./barbers";

export default async function BarbersPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL!}/barber`, {
        cache: "no-store",
    });

    const result = await res.json();

    // 👇 GARANTA que está passando um ARRAY
    const barbers = result.data ?? result;

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
                Barbeiros
            </h1>

            <p className="text-lg mb-4">
                Bem-vindo(a), {session.user.name}
            </p>
            <BarbersTable barbers={barbers} />
        </div>
    );
}
