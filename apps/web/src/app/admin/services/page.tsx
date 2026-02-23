import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import ServicesTable from "./services";

export default async function ServicesPage() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL!}/service`, {
        cache: "no-store",
    });

    const result = await res.json();

    // 👇 GARANTA que está passando um ARRAY
    const services = result.data ?? result;

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
                Serviços
            </h1>

            <p className="text-lg mb-4">
                Bem-vindo(a), {session.user.name}
            </p>

            <ServicesTable services={services} />
        </div>
    );
}
