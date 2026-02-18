"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    CalendarDays,
    Scissors,
    User,
    Clock,
} from "lucide-react";

interface AdminPainelProps {
    session: any;
}

export default function AdminPainel({ session }: AdminPainelProps) {
    const router = useRouter();

    return (
        <div className="w-full max-w-7xl p-6 space-y-6">
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                    Painel Administrativo
                </h2>

                <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                >
                    ← Voltar ao site
                </Button>
            </div>

            {/* MENU PRINCIPAL */}
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
                <AdminCard
                    icon={<CalendarDays className="w-6 h-6" />}
                    title="Consultar Agendamentos"
                    description="Visualizar e gerenciar horários"
                    route="/admin/schedules"
                />

                <AdminCard
                    icon={<User className="w-6 h-6" />}
                    title="Administrar Barbeiros"
                    description="Adicionar, editar e remover"
                    route="/admin/barbers"
                />

                <AdminCard
                    icon={<Scissors className="w-6 h-6" />}
                    title="Administrar Serviços"
                    description="Gerenciar serviços e preços"
                    route="/admin/services"
                />

                <AdminCard
                    icon={<Clock className="w-6 h-6" />}
                    title="Datas e Horários"
                    description="Controlar disponibilidade"
                    route="/admin/availability"
                />
            </div>
        </div>
    );
}

/* ---------- CARD DO MENU ---------- */

interface AdminCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    route: Route;
}

function AdminCard({
    icon,
    title,
    description,
    route,
}: AdminCardProps) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.push(route)}
            className="text-left"
        >
            <Card className="h-full hover:shadow-md transition border-muted hover:border-primary/40">
                <CardContent className="p-6 flex flex-col gap-4">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {icon}
                    </div>

                    <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-muted-foreground">
                            {description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </button>
    );
}
