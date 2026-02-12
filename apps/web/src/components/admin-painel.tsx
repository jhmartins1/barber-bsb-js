"use client";

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
    ArrowUpDown,
    Trash2,
    Pencil,
    Calendar as CalendarIcon,
    Clock,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
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


// --- Tipagens ---
export type ScheduleStatus = "AGENDADO" | "CONFIRMADO" | "CANCELADO";

export type Schedule = {
    id: string;
    date: string;
    time: string;
    status: ScheduleStatus;
    barber: { id: string; name: string };
    service: { id: string; name: string; price: number };
    user: { id: string; name: string };
};

type OptionItem = { id: string; name: string };

// Tipagem da Session para o page.tsx
interface AdminPainelProps {
    session: any;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

// Lista de horários padrão para o Dropdown
const AVAILABLE_TIMES = [
    "08:00", "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const statusConfig = {
    AGENDADO: { label: "Agendado", variant: "outline" as const, className: "bg-yellow-500/10 text-yellow-600 border-yellow-200" },
    CONFIRMADO: { label: "Confirmado", variant: "default" as const, className: "bg-green-500/10 text-green-600 border-green-200" },
    CANCELADO: { label: "Cancelado", variant: "destructive" as const, className: "" },
};

export default function AdminPainel({ session }: AdminPainelProps) {
    const [data, setData] = React.useState<Schedule[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    // Estados de Edição
    const [isEditOpen, setIsEditOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [barbersList, setBarbersList] = React.useState<OptionItem[]>([]);
    const [servicesList, setServicesList] = React.useState<OptionItem[]>([]);

    const [deleteId, setDeleteId] = React.useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);


    const [editForm, setEditForm] = React.useState({
        barberId: "",
        serviceId: "",
        date: "",
        time: "",
        status: "AGENDADO" as ScheduleStatus
    });

    // --- Busca de Dados ---
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/schedule`);
            if (res.ok) {
                const json = await res.json();
                setData(Array.isArray(json) ? json : json.data || []);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const fetchAuxData = async () => {
        try {
            const [resBarber, resService] = await Promise.all([
                fetch(`${API_URL}/barber`),
                fetch(`${API_URL}/service`)
            ]);
            if (resBarber.ok) setBarbersList(await resBarber.json());
            if (resService.ok) setServicesList(await resService.json());
        } catch (e) { console.error(e); }
    };

    React.useEffect(() => {
        fetchData();
        fetchAuxData();
    }, []);

    // Formata T2000 para 20:00
    const formatTimeForSelect = (timeStr: string) => {
        const digits = timeStr.replace(/\D/g, "");
        if (digits.length === 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`;
        return timeStr;
    };

    const handleEditClick = (row: Schedule) => {
        setEditingId(row.id);

        // Converte data para formato do input HTML (yyyy-MM-dd)
        const dateObj = new Date(row.date);
        const dateStr = dateObj.toISOString().split('T')[0];

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
            const formattedTimeForEnum = `T${cleanTime}`;

            const payload = {
                id: editingId,
                barberId: editForm.barberId,
                serviceId: editForm.serviceId,
                date: new Date(editForm.date).toISOString(),
                time: formattedTimeForEnum,
                status: editForm.status
            };

            const res = await fetch(`${API_URL}/schedule/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsEditOpen(false);
                fetchData();
            } else {
                const err = await res.json();
                alert(`Erro: ${err.message}`);
            }
        } catch (e) { alert("Erro ao conectar com o servidor."); }
    };

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`${API_URL}/schedule/${deleteId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Agendamento excluído com sucesso.");

                fetchData();
            } else {
                toast.error("Erro ao excluir.");
            }
        } catch {
            toast.error("Erro de conexão.");
        }

        setIsDeleteOpen(false);
        setDeleteId(null);
    };


    const columns: ColumnDef<Schedule>[] = [
        {
            id: "clientName",
            accessorFn: (row) => row.user?.name,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Cliente <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.user?.name}
                </span>
            ),
        },
        {
            id: "barberName",
            accessorFn: (row) => row.barber?.name,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Barbeiro <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => <span>{row.original.barber?.name}</span>,
        },
        {
            id: "serviceName",
            accessorFn: (row) => row.service?.name,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Serviço <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <Badge variant="secondary">
                    {row.original.service?.name}
                </Badge>
            ),
        },
        {
            accessorKey: "date",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Data <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span>
                    {new Date(row.original.date).toLocaleDateString("pt-BR")}
                </span>
            ),
        },
        {
            accessorKey: "time",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Horário <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1 font-mono text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {formatTimeForSelect(row.original.time)}
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Status <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const config =
                    statusConfig[row.original.status] || {
                        label: row.original.status,
                        variant: "outline",
                        className: "",
                    };

                return (
                    <Badge
                        variant={config.variant}
                        className={config.className}
                    >
                        {config.label}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            enableSorting: false,
            header: () => <div className="text-right">Ações</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(row.original)}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                            setDeleteId(row.original.id);
                            setIsDeleteOpen(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];


    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: { sorting },
    });

    return (
        <div className="w-full max-w-6xl p-6 space-y-8">
            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md">
                <CardHeader><CardTitle className="flex items-center gap-2"><CalendarIcon className="w-6 h-6 text-primary" /> Painel Geral</CardTitle></CardHeader>
                <CardContent>
                    <div className="rounded-xl border bg-background/50 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                {table.getHeaderGroups().map(hg => (
                                    <TableRow key={hg.id}>{hg.headers.map(h => (
                                        <TableHead key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                                    ))}</TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {loading ? <TableRow><TableCell colSpan={7} className="h-32 text-center"><Loader2 className="animate-spin inline mr-2" /> Carregando...</TableCell></TableRow> :
                                    table.getRowModel().rows.map(row => (
                                        <TableRow key={row.id}>{row.getVisibleCells().map(cell => (
                                            <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                        ))}</TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Editar Agendamento</DialogTitle>
                        <DialogDescription>Altere as informações abaixo.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {/* Status */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Status</Label>
                            <Select value={editForm.status} onValueChange={(val) => val && setEditForm({ ...editForm, status: val as ScheduleStatus })}>
                                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="AGENDADO">Agendado</SelectItem>
                                    <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                                    <SelectItem value="CANCELADO">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Barbeiro - CORRIGIDO TIPAGEM */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Barbeiro</Label>
                            <Select
                                value={editForm.barberId}
                                onValueChange={(val) => { if (val) setEditForm({ ...editForm, barberId: val }) }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o barbeiro" />
                                </SelectTrigger>
                                <SelectContent>
                                    {barbersList.map(b => (
                                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Serviço - CORRIGIDO TIPAGEM */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Serviço</Label>
                            <Select
                                value={editForm.serviceId}
                                onValueChange={(val) => { if (val) setEditForm({ ...editForm, serviceId: val }) }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o serviço" />
                                </SelectTrigger>
                                <SelectContent>
                                    {servicesList.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Data */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Data</Label>
                            <Input
                                type="date"
                                className="col-span-3"
                                value={editForm.date}
                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            />
                        </div>

                        {/* Hora Dropdown */}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Hora</Label>
                            <Select value={editForm.time} onValueChange={(val) => val && setEditForm({ ...editForm, time: val })}>
                                <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {AVAILABLE_TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleUpdate}>Salvar Alterações</Button></DialogFooter>
                </DialogContent>
            </Dialog>

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