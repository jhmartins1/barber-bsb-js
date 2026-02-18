"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";

type OptionItem = {
    id: string;
    name: string;
};

export type ScheduleStatus = "AGENDADO" | "CONFIRMADO" | "CANCELADO";

interface Props {
    open: boolean;
    setOpen: (v: boolean) => void;

    form: {
        barberId: string;
        serviceId: string;
        date: string;
        time: string;
        status: ScheduleStatus;
    };

    setForm: React.Dispatch<React.SetStateAction<any>>;

    barbers: OptionItem[];
    services: OptionItem[];
    availableTimes: string[];

    onSave: () => void;
}

export function EditScheduleDialog({
    open,
    setOpen,
    form,
    setForm,
    barbers,
    services,
    availableTimes,
    onSave,
}: Props) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Editar Agendamento</DialogTitle>
                    <DialogDescription>
                        Altere as informações abaixo.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">

                    {/* Status */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(val) =>
                                val && setForm({ ...form, status: val })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="AGENDADO">Agendado</SelectItem>
                                <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                                <SelectItem value="CANCELADO">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Barbeiro */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Barbeiro</Label>

                        <Select
                            value={form.barberId}
                            onValueChange={(val) =>
                                val && setForm({ ...form, barberId: val })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o barbeiro" />
                            </SelectTrigger>

                            <SelectContent>
                                {barbers.map(b => (
                                    <SelectItem key={b.id} value={b.id}>
                                        {b.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Serviço */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Serviço</Label>

                        <Select
                            value={form.serviceId}
                            onValueChange={(val) =>
                                val && setForm({ ...form, serviceId: val })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o serviço" />
                            </SelectTrigger>

                            <SelectContent>
                                {services.map(s => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name}
                                    </SelectItem>
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
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                        />
                    </div>

                    {/* Hora */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Hora</Label>

                        <Select
                            value={form.time}
                            onValueChange={(val) =>
                                val && setForm({ ...form, time: val })
                            }
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                {availableTimes.map(t => (
                                    <SelectItem key={t} value={t}>
                                        {t}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onSave}>
                        Salvar Alterações
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
