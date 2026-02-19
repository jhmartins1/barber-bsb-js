"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { getScheduleColumns } from "@/app/admin/schedule-columns";
import { EditScheduleDialog } from "@/app/admin/edit-schedule-dialog";
import { useSchedules } from "@/app/hooks/useSchedules";
import * as React from "react";
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import type { SortingState } from "@tanstack/react-table";
import type { ScheduleStatus } from "@/app/types/schedule";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

type EditFormType = {
    barberId: string;
    serviceId: string;
    date: string;
    time: string;
    status: ScheduleStatus;
};

export function DataTableSchedules() {
    const router = useRouter();

    const {
        data,
        barbers,
        services,
        loading,
        fetchData,
        deleteSchedule,
    } = useSchedules(API_URL);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);

    const AVAILABLE_TIMES = [
        "08:00", "09:00", "10:00", "11:00",
        "14:00", "15:00", "16:00", "17:00",
        "18:00", "19:00", "20:00",
    ];

    const [editForm, setEditForm] = React.useState<EditFormType>({
        barberId: "",
        serviceId: "",
        date: "",
        time: "",
        status: "AGENDADO",
    });

    const formatTimeForSelect = (timeStr: string) => {
        const digits = timeStr.replace(/\D/g, "");
        if (digits.length === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
        return timeStr;
    };

    const handleEditClick = (row: any) => {
        setEditingId(row.id);

        setEditForm({
            barberId: row.barber?.id || "",
            serviceId: row.service?.id || "",
            date: row.date.slice(0, 10),
            time: formatTimeForSelect(row.time),
            status: row.status as ScheduleStatus,
        });

        setIsEditOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingId) return;

        try {
            const cleanTime = editForm.time.replace(":", "");
            const formattedTime = `T${cleanTime}`;

            const res = await fetch(`${API_URL}/schedule/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    barberId: editForm.barberId,
                    serviceId: editForm.serviceId,
                    date: new Date(editForm.date).toISOString(),
                    time: formattedTime,
                    status: editForm.status,
                }),
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

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteSchedule(deleteId);
        setIsDeleteOpen(false);
        setDeleteId(null);
    };

    const columns = React.useMemo(
        () =>
            getScheduleColumns({
                handleEditClick,
                setDeleteId,
                setIsDeleteOpen,
            }),
        []
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
        <>
            <div className="p-6 md:p-8">
                <Card className="mx-auto w-full max-w-7xl rounded-2xl shadow-sm border">

                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <Link href="/admin">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-xl"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>

                        <Button
                            className="gap-2 rounded-xl shadow-sm"
                            onClick={() => console.log("Novo agendamento")}
                        >
                            <Plus className="w-4 h-4" />
                            Novo Agendamento
                        </Button>
                    </CardHeader>


                    {/* TABELA */}
                    <CardContent className="px-8 pb-8">
                        <div className="rounded-xl border overflow-hidden">
                            <Table className="min-w-[960px]">

                                {/* HEADER */}
                                <TableHeader className="bg-muted/40">
                                    {table.getHeaderGroups().map(hg => (
                                        <TableRow key={hg.id} className="hover:bg-transparent">
                                            {hg.headers.map(h => (
                                                <TableHead
                                                    key={h.id}
                                                    className="font-semibold text-sm py-4"
                                                >
                                                    {flexRender(
                                                        h.column.columnDef.header,
                                                        h.getContext()
                                                    )}
                                                </TableHead>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableHeader>

                                {/* BODY */}
                                <TableBody className="text-sm">
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <div className="flex justify-center items-center py-14 text-muted-foreground">
                                                    <Loader2 className="animate-spin mr-2" />
                                                    Carregando agendamentos...
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : table.getRowModel().rows.length ? (
                                        table.getRowModel().rows.map((row, i) => (
                                            <TableRow
                                                key={row.id}
                                                className={`
                          transition-colors
                          hover:bg-muted/40
                          ${i % 2 === 0 ? "bg-background" : "bg-muted/10"}
                        `}
                                            >
                                                {row.getVisibleCells().map(cell => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="py-3 px-4 align-middle"
                                                    >
                                                        {flexRender(
                                                            cell.column.columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7}>
                                                <div className="text-center py-14 text-muted-foreground">
                                                    Nenhum agendamento encontrado.
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DIALOG EDIT */}
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

            {/* DIALOG DELETE */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-lg">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="rounded-lg"
                            onClick={handleDelete}
                        >
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
