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

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

type Barber = {
    id: string;
    name: string;
    phone: string;
    services?: { id: string }[];
};

type Service = {
    id: string;
    name: string;
};

interface Props {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    barber: Barber | null;
    services: Service[];
}

function formatPhone(value: string) {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7)
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(
        2,
        7
    )}-${numbers.slice(7)}`;
}

export default function EditBarberDialog({
    open,
    onOpenChange,
    barber,
    services,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const [form, setForm] = React.useState({
        name: "",
        phone: "",
        serviceIds: [] as string[],
    });

    // 🔥 popula quando abrir
    React.useEffect(() => {
        if (barber && open) {
            setForm({
                name: barber.name ?? "",
                phone: barber.phone ?? "",
                serviceIds: barber.services?.map((s) => s.id) ?? [],
            });
        }
    }, [barber, open]);

    const toggleService = (id: string) => {
        setForm((prev) => ({
            ...prev,
            serviceIds: prev.serviceIds.includes(id)
                ? prev.serviceIds.filter((s) => s !== id)
                : [...prev.serviceIds, id],
        }));
    };

    // 🚀 UPDATE
    const handleUpdate = async () => {
        if (!barber) return;

        if (!form.name || !form.phone) {
            toast.error("Nome e telefone são obrigatórios");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/barber/${barber.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: form.name,
                    phone: form.phone,
                    services: form.serviceIds,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error(text);
                throw new Error("Erro ao atualizar barbeiro");
            }

            toast.success("Barbeiro atualizado com sucesso");

            onOpenChange(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao atualizar barbeiro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg rounded-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Barbeiro</DialogTitle>
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
                            value={form.phone}
                            onChange={(e) =>
                                setForm((p) => ({
                                    ...p,
                                    phone: formatPhone(e.target.value),
                                }))
                            }
                        />
                    </div>

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