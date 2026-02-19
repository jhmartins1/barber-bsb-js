"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

type Barber = {
    id: string;
    name: string;
    email?: string;
    phone: string;
};

interface Props {
    barbers: Barber[];
}

export default function BarbersTable({ barbers }: Props) {
    return (
        <div className="p-8 md:p-10">
            <Card className="mx-auto w-full max-w-7xl rounded-2xl border shadow-sm">
                {/* 🔹 Header */}
                <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-xl"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>
                    </div>

                    <Button className="gap-2 rounded-xl shadow-sm">
                        <Plus className="w-4 h-4" />
                        Novo Barbeiro
                    </Button>
                </CardHeader>

                {/* 🔹 Table */}
                <CardContent className="px-10 pb-10">
                    <div className="overflow-hidden rounded-xl border">
                        <Table>
                            <TableHeader className="bg-muted/40">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[120px] text-sm font-semibold">

                                    </TableHead>
                                    <TableHead className="w-[260px] text-sm font-semibold">
                                        Nome
                                    </TableHead>
                                    <TableHead className="text-sm font-semibold">
                                        Telefone
                                    </TableHead>
                                    <TableHead className="text-right w-[200px] text-sm font-semibold">
                                        Ações
                                    </TableHead>
                                </TableRow>
                            </TableHeader>


                            <TableBody>
                                {barbers.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="text-center py-14 text-muted-foreground"
                                        >
                                            Nenhum barbeiro encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}

                                {barbers.map((barber, index) => (
                                    <TableRow
                                        key={barber.id ?? `barber-${index}`}
                                        className="hover:bg-muted/40 transition-colors"
                                    >
                                        {/* 👤 Avatar */}
                                        <TableCell className="py-4">
                                            <Avatar className="h-10 w-10 ring-1 ring-border">
                                                <AvatarFallback className="text-sm font-semibold">
                                                    {barber.name?.[0] ?? "B"}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>

                                        {/* 👤 Nome */}
                                        <TableCell className="font-medium">
                                            {barber.name}
                                        </TableCell>

                                        {/* 📱 Telefone */}
                                        <TableCell className="font-medium">
                                            {barber.phone || "—"}
                                        </TableCell>

                                        {/* ⚙️ Ações */}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-lg"
                                                >
                                                    Editar
                                                </Button>

                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="rounded-lg"
                                                >
                                                    Excluir
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

}
