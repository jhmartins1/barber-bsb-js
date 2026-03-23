"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import EditServiceDialog from "./edit-service";
import type { IService } from "@/app/types/service";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

type Barber = {
    id: string;
    name: string;
};

interface Props {
    services: IService[];
}

export default function ServicesTable({ services }: Props) {
    const router = useRouter();

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [serviceToDelete, setServiceToDelete] =
        React.useState<IService | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    // form states
    const [name, setName] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [duration, setDuration] = React.useState("");

    // barbers
    const [barbers, setBarbers] = React.useState<Barber[]>([]);
    const [selectedBarbers, setSelectedBarbers] = React.useState<string[]>([]);
    const [loadingBarbers, setLoadingBarbers] = React.useState(false);

    const [editOpen, setEditOpen] = React.useState(false);
    const [serviceToEdit, setServiceToEdit] =
        React.useState<IService | null>(null);

    // ===============================
    // 🔥 FETCH BARBERS AO ABRIR MODAL
    // ===============================
    React.useEffect(() => {
        if (!open) return;

        const fetchBarbers = async () => {
            try {
                setLoadingBarbers(true);

                const res = await fetch(`${API_URL}/barber`);
                const result = await res.json();

                // ✅ CORREÇÃO CRÍTICA AQUI
                const barberArray = Array.isArray(result)
                    ? result
                    : result?.data ?? [];

                setBarbers(barberArray);

                // limpa seleção ao abrir
                setSelectedBarbers([]);
            } catch (err) {
                console.error(err);
                toast.error("Erro ao carregar barbeiros");
                setBarbers([]);
            } finally {
                setLoadingBarbers(false);
            }
        };

        fetchBarbers();
    }, [open]);

    // ===============================
    // ✅ MARCAR TODOS
    // ===============================
    const handleToggleAll = (checked: boolean) => {
        if (checked) {
            setSelectedBarbers(barbers.map((b) => b.id));
        } else {
            setSelectedBarbers([]);
        }
    };

    // ===============================
    // ✅ MARCAR INDIVIDUAL
    // ===============================
    const handleToggleBarber = (id: string, checked: boolean) => {
        if (checked) {
            setSelectedBarbers((prev) => [...prev, id]);
        } else {
            setSelectedBarbers((prev) => prev.filter((b) => b !== id));
        }
    };

    const allSelected =
        barbers.length > 0 && selectedBarbers.length === barbers.length;

    // ===============================
    // 🚀 CREATE SERVICE
    // ===============================
    const handleCreate = async () => {
        if (!name.trim()) {
            toast.error("Nome é obrigatório");
            return;
        }

        if (!price || isNaN(Number(price))) {
            toast.error("Preço inválido");
            return;
        }

        if (!duration || isNaN(Number(duration))) {
            toast.error("Duração inválida");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name,
                price: Number(price),
                duration: Number(duration),
                barberIds: selectedBarbers,
            };

            const res = await fetch(`${API_URL}/service`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error(text);
                throw new Error("Erro ao criar serviço");
            }

            toast.success("Serviço criado com sucesso");

            // reset
            setName("");
            setPrice("");
            setDuration("");
            setSelectedBarbers([]);
            setOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao criar serviço");
        } finally {
            setLoading(false);
        }
    };

    // ===============================
    // 🗑️ DELETE
    // ===============================
    const handleAskDelete = (service: IService) => {
        setServiceToDelete(service);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!serviceToDelete) return;

        try {
            setDeleting(true);

            const res = await fetch(
                `${API_URL}/service/${serviceToDelete.id}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error();

            toast.success("Serviço excluído com sucesso");
            setDeleteOpen(false);
            setServiceToDelete(null);
            router.refresh();
        } catch {
            toast.error("Erro ao excluir serviço");
        } finally {
            setDeleting(false);
        }
    };

    const handleAskEdit = (service: IService) => {
        setServiceToEdit(service);
        setEditOpen(true);
    };

    return (
        <>
            <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24">
                <Card className="w-full max-w-6xl mx-auto rounded-2xl border shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-6">
                        <Link href="/admin">
                            <Button variant="outline" size="icon" className="rounded-xl">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                        </Link>

                        <Button
                            className="gap-2 rounded-xl shadow-sm"
                            onClick={() => setOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Novo Serviço
                        </Button>
                    </CardHeader>

                    <CardContent className="px-6 md:px-10 pb-10">
                        <div className="overflow-hidden rounded-xl border">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Nome</TableHead>
                                        <TableHead className="text-right w-[200px]">
                                            Ações
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {services.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell className="font-medium">
                                                {service.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleAskEdit(service)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleAskDelete(service)}
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

            {/* MODAL CREATE */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Novo Serviço</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Preço *</Label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Duração (min) *</Label>
                            <Input
                                type="number"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />
                        </div>

                        {/* 🔥 CHECKBOX BARBEIROS */}
                        <div className="space-y-3">
                            <Label>Barbeiros que atendem</Label>

                            {loadingBarbers && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Carregando barbeiros...
                                </div>
                            )}

                            {!loadingBarbers && (
                                <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-3">

                                    {/* ✅ Marcar todos */}
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={(checked) => {
                                                const isChecked = checked === true;
                                                handleToggleAll(isChecked);
                                            }}
                                        />
                                        <span className="text-sm font-medium">
                                            Marcar todos
                                        </span>
                                    </div>

                                    {/* ✅ Lista de barbeiros */}
                                    {barbers.map((barber) => (
                                        <div
                                            key={barber.id}
                                            className="flex items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={selectedBarbers.includes(barber.id)}
                                                onCheckedChange={(checked) => {
                                                    const isChecked = checked === true;
                                                    handleToggleBarber(barber.id, isChecked);
                                                }}
                                            />
                                            <span className="text-sm">{barber.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>

                        <Button onClick={handleCreate} disabled={loading}>
                            {loading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Criar Serviço
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* MODAL DELETE */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Excluir Serviço</DialogTitle>
                    </DialogHeader>

                    <div className="py-2 text-sm text-muted-foreground">
                        Tem certeza que deseja excluir o serviço{" "}
                        <strong>{serviceToDelete?.name}</strong>?
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                        >
                            Cancelar
                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <EditServiceDialog
                open={editOpen}
                onOpenChange={(v) => {
                    setEditOpen(v);
                    if (!v) setServiceToEdit(null);
                }}
                service={serviceToEdit}
            />
        </>
    );
}