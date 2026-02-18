import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

export type ScheduleStatus =
    | "AGENDADO"
    | "CONFIRMADO"
    | "CANCELADO";

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

function formatTimeForSelect(timeStr: string) {
    const digits = timeStr.replace(/\D/g, "");

    if (digits.length === 4) {
        return `${digits.slice(0, 2)}:${digits.slice(2)}`;
    }

    return timeStr;
}

const statusConfig: Record<
    ScheduleStatus,
    { label: string; variant: any; className: string }
> = {
    AGENDADO: {
        label: "Agendado",
        variant: "outline",
        className:
            "bg-yellow-500/10 text-yellow-600 border-yellow-200",
    },
    CONFIRMADO: {
        label: "Confirmado",
        variant: "default",
        className:
            "bg-green-500/10 text-green-600 border-green-200",
    },
    CANCELADO: {
        label: "Cancelado",
        variant: "destructive",
        className: "",
    },
};

interface Props {
    handleEditClick: (row: Schedule) => void;
    setDeleteId: (id: string) => void;
    setIsDeleteOpen: (open: boolean) => void;
}

export function getScheduleColumns({
    handleEditClick,
    setDeleteId,
    setIsDeleteOpen,
}: Props): ColumnDef<Schedule>[] {
    return [
        {
            id: "clientName",
            accessorFn: row =>
                row.user?.name ?? row.userName,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Cliente
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="font-medium">
                    {row.original.user?.name ??
                        row.original.userName ??
                        "—"}
                </span>
            ),
        },
        {
            id: "barberName",
            accessorFn: row =>
                row.barber?.name,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Barbeiro
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span>
                    {row.original.barber?.name}
                </span>
            ),
        },
        {
            id: "serviceName",
            accessorFn: row =>
                row.service?.name,
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Serviço
                    <ArrowUpDown className="ml-2 h-4 w-4" />
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
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Data
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span>
                    {new Date(
                        row.original.date
                    ).toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                    })}
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
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Horário
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) =>
                formatTimeForSelect(row.original.time),
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    className="p-0"
                    onClick={() =>
                        column.toggleSorting(
                            column.getIsSorted() === "asc"
                        )
                    }
                >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => {
                const config =
                    statusConfig[row.original.status];

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
            header: () => (
                <div className="text-right">
                    Ações
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                            handleEditClick(
                                row.original
                            )
                        }
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                            setDeleteId(
                                row.original.id
                            );
                            setIsDeleteOpen(true);
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];
}
