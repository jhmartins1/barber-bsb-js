"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { IService } from "@/app/types/service";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

type Barber = {
    id: string;
    name: string;
};

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    service: IService | null;
}

export default function EditServiceDialog({
    open,
    onOpenChange,
    service,
}: Props) {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);
    const [loadingBarbers, setLoadingBarbers] = React.useState(false);

    const [barbers, setBarbers] = React.useState<Barber[]>([]);

    const [form, setForm] = React.useState({
        name: "",
        price: "",
        duration: "",
        barberIds: [] as string[],
    });

    // ===============================
    // 🔥 carregar barbeiros quando abrir
    // ===============================
    React.useEffect(() => {
        if (!open) return;

        const fetchBarbers = async () => {
            try {
                setLoadingBarbers(true);

                const res = await fetch(`${API_URL}/barber`);
                const result = await res.json();

                const barberArray = Array.isArray(result)
                    ? result
                    : result?.data ?? [];

                setBarbers(barberArray);
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
    // 🔥 popular form ao abrir
    // ===============================
    React.useEffect(() => {
        if (!service || !open) return;

        setForm({
            name: service.name ?? "",
            price: service.price?.toString() ?? "",
            duration: service.duration?.toString() ?? "",
            barberIds: (service as any).barbers?.map((b: Barber) => b.id) ?? [],
        });
    }, [service, open]);

    // ===============================
    // ✅ toggle barber
    // ===============================
    const toggleBarber = (id: string, checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            barberIds: checked
                ? [...prev.barberIds, id]
                : prev.barberIds.filter((b) => b !== id),
        }));
    };

    const allSelected =
        barbers.length > 0 && form.barberIds.length === barbers.length;

    const toggleAll = (checked: boolean) => {
        setForm((prev) => ({
            ...prev,
            barberIds: checked ? barbers.map((b) => b.id) : [],
        }));
    };

    // ===============================
    // 🚀 UPDATE SERVICE
    // ===============================
    const handleUpdate = async () => {
        if (!service) return;

        if (!form.name.trim()) {
            toast.error("Nome é obrigatório");
            return;
        }

        if (!form.price || isNaN(Number(form.price))) {
            toast.error("Preço inválido");
            return;
        }

        if (!form.duration || isNaN(Number(form.duration))) {
            toast.error("Duração inválida");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: form.name,
                price: Number(form.price),
                duration: Number(form.duration),
                barberIds: form.barberIds,
            };

            const res = await fetch(`${API_URL}/service/${service.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error(text);
                throw new Error("Erro ao atualizar serviço");
            }

            toast.success("Serviço atualizado com sucesso");

            onOpenChange(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar serviço");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Serviço</DialogTitle>
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
                        <Label>Preço *</Label>
                        <Input
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, price: e.target.value }))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Duração (min) *</Label>
                        <Input
                            type="number"
                            value={form.duration}
                            onChange={(e) =>
                                setForm((p) => ({ ...p, duration: e.target.value }))
                            }
                        />
                    </div>

                    {/* BARBEIROS */}
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
                                        checked={
                                            barbers.length > 0 &&
                                            form.barberIds.length === barbers.length
                                        }
                                        onCheckedChange={(checked) => {
                                            setForm((prev) => ({
                                                ...prev,
                                                barberIds: checked
                                                    ? barbers.map((b) => b.id)
                                                    : [],
                                            }));
                                        }}
                                    />
                                    <span className="text-sm font-medium">Marcar todos</span>
                                </div>

                                {/* ✅ Lista de barbeiros */}
                                {barbers.map((barber) => (
                                    <div key={barber.id} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={form.barberIds.includes(barber.id)}
                                            onCheckedChange={(checked) => {
                                                setForm((prev) => ({
                                                    ...prev,
                                                    barberIds: checked
                                                        ? [...prev.barberIds, barber.id]
                                                        : prev.barberIds.filter((id) => id !== barber.id),
                                                }));
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
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancelar
                    </Button>

                    <Button onClick={handleUpdate} disabled={loading}>
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Salvar alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}