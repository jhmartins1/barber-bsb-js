"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
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
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

type Barber = {
    id: string;
    name: string;
    phone: string;
    image?: string;
};

type Service = {
    id: string;
    name: string;
};

interface Props {
    barbers: Barber[];
}

function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(
            2,
            7
        )}-${numbers.slice(7)}`;

    return value;
}

export default function BarbersTable({ barbers }: Props) {
    const router = useRouter();
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [barberToDelete, setBarberToDelete] = React.useState<Barber | null>(null);
    const [deleting, setDeleting] = React.useState(false);
    const [preview, setPreview] = React.useState<string | null>(null);
    const [file, setFile] = React.useState<File | null>(null);
    const [dragActive, setDragActive] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [services, setServices] = React.useState<Service[]>([]);

    const [form, setForm] = React.useState({
        name: "",
        phone: "",
        serviceIds: [] as string[],
    });

    // ===============================
    // 🔥 FETCH SERVICES (ROBUSTO)
    // ===============================
    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_URL}/service`);

            if (!res.ok) throw new Error("Falha ao buscar serviços");

            const json = await res.json();
            const data = Array.isArray(json) ? json : json?.data;

            setServices(data ?? []);
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar serviços");
            setServices([]);
        }
    };

    React.useEffect(() => {
        fetchServices();
    }, []);

    // ===============================
    // 🔥 CLEANUP PREVIEW (IMPORTANTE)
    // ===============================
    React.useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // ===============================
    // 🔥 FILE HANDLING
    // ===============================
    const handleFile = (selected: File) => {
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const dropped = e.dataTransfer.files?.[0];
        if (dropped) handleFile(dropped);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    // ===============================
    // 🔥 TOGGLE SERVICE
    // ===============================
    const toggleService = (id: string) => {
        setForm((prev) => ({
            ...prev,
            serviceIds: prev.serviceIds.includes(id)
                ? prev.serviceIds.filter((s) => s !== id)
                : [...prev.serviceIds, id],
        }));
    };

    // ===============================
    // 🚀 CREATE BARBER
    // ===============================
    const handleCreate = async () => {
        if (!form.name || !form.phone) {
            toast.error("Nome e telefone são obrigatórios");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("services", JSON.stringify(form.serviceIds));

            if (file) {
                formData.append("image", file);
            }

            const res = await fetch(`${API_URL}/barber`, {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                console.error(text);
                throw new Error("Erro ao criar barbeiro");
            }

            toast.success("Barbeiro criado com sucesso");

            // reset seguro
            setPreview(null);
            setFile(null);
            setForm({
                name: "",
                phone: "",
                serviceIds: [],
            });

            setOpen(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao criar barbeiro");
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path?: string) => {
        if (!path) return undefined;
        return `${API_URL}${path}`;
    };

    const handleAskDelete = (barber: Barber) => {
        setBarberToDelete(barber);
        setDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!barberToDelete) return;

        try {
            setDeleting(true);

            const res = await fetch(
                `${API_URL}/barber/${barberToDelete.id}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) {
                const text = await res.text();
                console.error(text);
                throw new Error("Erro ao excluir barbeiro");
            }

            toast.success("Barbeiro excluído com sucesso");

            setDeleteOpen(false);
            setBarberToDelete(null);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir barbeiro");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <div className="p-8 md:p-10">
                <Card className="mx-auto w-full max-w-7xl rounded-2xl border shadow-sm">
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
                            Novo Barbeiro
                        </Button>
                    </CardHeader>

                    <CardContent className="px-10 pb-10">
                        <div className="overflow-hidden rounded-xl border">
                            <Table>
                                <TableHeader className="bg-muted/40">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[120px]" />
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

                                    {barbers.map((barber) => (
                                        <TableRow key={barber.id}>
                                            <TableCell className="py-4">
                                                <Avatar className="h-10 w-10 ring-1 ring-border">
                                                    <AvatarImage
                                                        src={getImageUrl(barber.image)}
                                                        alt={barber.name}
                                                    />
                                                    <AvatarFallback>
                                                        {barber.name?.[0] ?? "B"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {barber.name}
                                            </TableCell>

                                            <TableCell className="font-medium">
                                                {barber.phone || "—"}
                                            </TableCell>

                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="outline" size="sm">
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleAskDelete(barber)}
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

            {/* MODAL */}
            <Dialog
                open={open}
                onOpenChange={(v) => {
                    setOpen(v);
                    if (!v) {
                        setPreview(null);
                        setFile(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Novo Barbeiro</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>Nome *</Label>
                            <Input
                                value={form.name}
                                onChange={(e) =>
                                    setForm((p) => ({ ...p, name: e.target.value }))
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Telefone *</Label>
                            <Input
                                placeholder="(00) 00000-0000"
                                value={form.phone}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        phone: formatPhone(e.target.value),
                                    }))
                                }
                            />
                        </div>

                        {/* IMAGE */}
                        <div className="space-y-2">
                            <Label>Imagem (opcional)</Label>

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 cursor-pointer transition
                ${dragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:bg-muted/40"
                                    }`}
                            >
                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="h-24 w-24 rounded-full object-cover"
                                    />
                                ) : (
                                    <>
                                        <span className="text-sm font-medium">
                                            Arraste uma imagem ou clique
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            PNG, JPG até 5MB
                                        </span>
                                    </>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) handleFile(f);
                                    }}
                                />
                            </div>
                        </div>

                        {/* SERVICES */}
                        <div className="space-y-3">
                            <Label>Serviços</Label>

                            <div className="max-h-40 overflow-y-auto space-y-2 rounded-lg border p-3">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            checked={form.serviceIds.includes(service.id)}
                                            onCheckedChange={() => toggleService(service.id)}
                                        />
                                        <span className="text-sm">{service.name}</span>
                                    </div>
                                ))}
                            </div>
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
                            Criar Barbeiro
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* MODAL DELETE */}
            <Dialog
                open={deleteOpen}
                onOpenChange={(v) => {
                    setDeleteOpen(v);
                    if (!v) setBarberToDelete(null);
                }}
            >
                <DialogContent className="sm:max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Confirmar exclusão</DialogTitle>
                    </DialogHeader>

                    <div className="py-2 text-sm text-muted-foreground">
                        Tem certeza que deseja excluir{" "}
                        <span className="font-semibold text-foreground">
                            {barberToDelete?.name}
                        </span>
                        ?
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteOpen(false)}
                            disabled={deleting}
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
                            Sim, excluir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}