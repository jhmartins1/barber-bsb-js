"use client";

import { getScheduleColumns } from "@/app/admin/schedule-columns";
import { useSchedules } from "@/app/hooks/useSchedules";
import { EditScheduleDialog } from "@/app/admin/edit-schedule-dialog";
import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import type {
    ColumnDef,
    SortingState
} from "@tanstack/react-table";

import {
    Calendar as CalendarIcon,
    Loader2
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";

export type ScheduleStatus = "AGENDADO" | "CONFIRMADO" | "CANCELADO";

export type Schedule = {
    id: string;
    date: string;
    time: string;
    status: ScheduleStatus;
    barber: { id: string; name: string };
    service: { id: string; name: string; price: number };
    user?: { id: string; name: string } | null;
    userName?: string | null;
    userPhone?: string | null;
};

interface AdminPainelProps {
    session: any;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

const AVAILABLE_TIMES = [
    "08:00", "09:00", "10:00", "11:00",
    "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00"
];

export default function AdminPainel({ session }: AdminPainelProps) {
    const { data, setData, barbers, services, loading, fetchData, deleteSchedule, isDeleting } = useSchedules(API_URL);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const [editForm, setEditForm] = React.useState({
        barberId: "",
        serviceId: "",
        date: "",
        time: "",
        status: "AGENDADO" as ScheduleStatus
    });

    // ---------------- UTILS ----------------

    const formatTimeForSelect = (timeStr: string) => {
        const digits = timeStr.replace(/\D/g, "");
        if (digits.length === 4)
            return `${digits.slice(0, 2)}:${digits.slice(2)}`;
        return timeStr;
    };

    // ---------------- EDIT ----------------

    const handleEditClick = (row: Schedule) => {
        setEditingId(row.id);

        const dateStr = row.date.slice(0, 10);

        setEditForm({
            barberId: row.barber?.id || "",
            serviceId: row.service?.id || "",
            date: dateStr,
            time: formatTimeForSelect(row.time),
            status: row.status
        });

        setIsEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingId) return;

        try {
            const cleanTime = editForm.time.replace(":", "");
            const formattedTime = `T${cleanTime}`;

            const payload = {
                barberId: editForm.barberId,
                serviceId: editForm.serviceId,
                date: new Date(editForm.date).toISOString(),
                time: formattedTime,
                status: editForm.status
            };

            const res = await fetch(`${API_URL}/schedule/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success("Agendamento atualizado");
                setIsEditOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.message || "Erro ao atualizar");
            }
        } catch {
            toast.error("Erro de conexão");
        }
    };

    // ---------------- DELETE ----------------

    const handleDelete = async () => {
        if (!deleteId) return;

        await deleteSchedule(deleteId);

        setIsDeleteOpen(false);
        setDeleteId(null);
    };


    // ---------------- TABLE ----------------

    const columns = React.useMemo(
        () =>
            getScheduleColumns({
                handleEditClick,
                setDeleteId,
                setIsDeleteOpen,
            }),
        [handleEditClick]
    );


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
        onSortingChange: setSorting,
    });

    return (
        <div className="w-full max-w-6xl p-6 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Painel Geral</CardTitle>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map(hg => (
                                <TableRow key={hg.id}>
                                    {hg.headers.map(h => (
                                        <TableHead key={h.id}>
                                            {flexRender(h.column.columnDef.header, h.getContext())}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        <Loader2 className="animate-spin inline mr-2" />
                                        Carregando...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <EditScheduleDialog
                open={isEditOpen}
                setOpen={setIsEditOpen}
                form={editForm}
                setForm={setEditForm}
                barbers={barbers}
                services={services}
                availableTimes={AVAILABLE_TIMES}
                onSave={handleUpdate}
            />

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Confirmar exclusão
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. O agendamento será removido permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
