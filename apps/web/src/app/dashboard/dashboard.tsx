"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CalendarDays, Clock, User, Scissors } from "lucide-react";

type Barber = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  barbers: Barber[];
};

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

const TIMES = [
  "T0800", "T0900", "T1000", "T1100",
  "T1400", "T1500", "T1600", "T1700",
  "T1800", "T1900", "T2000",
];

function formatTime(time: string) {
  return time.replace("T", "").replace(/(\d{2})(\d{2})/, "$1:$2");
}

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [busyTimes, setBusyTimes] = useState<string[]>([]);

  const [step, setStep] = useState(1);
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [barber, setBarber] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${API_URL}/service`);
        const result = await response.json();

        // aceita tanto array direto quanto { data: array }
        const servicesArray = Array.isArray(result)
          ? result
          : Array.isArray(result.data)
            ? result.data
            : [];

        setServices(servicesArray);
      } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        setServices([]);
      }
    }

    loadServices();
  }, []);



  // Busca horários ocupados filtrados
  useEffect(() => {
    if (!date || !barber) return;

    async function loadBusyTimes() {
      setBusyTimes([]);

      const response = await fetch(
        `${API_URL}/schedule?date=${date}&barberId=${barber}`
      );

      if (!response.ok) return;

      const result = await response.json();

      const schedulesArray = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : [];

      setBusyTimes(schedulesArray.map((s: any) => s.time));
    }

    loadBusyTimes();
  }, [date, barber]);


  const selectedService = useMemo(
    () => Array.isArray(services)
      ? services.find((s) => s.id === service)
      : undefined,
    [service, services]
  );


  const availableBarbers = useMemo(() => {
    if (!selectedService) return [];
    return selectedService.barbers ?? [];
  }, [selectedService]);

  const selectedBarberName = useMemo(() => {
    return availableBarbers.find((b) => b.id === barber)?.name;
  }, [barber, availableBarbers]);

  function reset() {
    setStep(1);
    setService(null);
    setDate("");
    setBarber(null);
    setTime(null);
    setBusyTimes([]);
  }

  async function handleFinish() {
    if (!service || !barber || !date || !time) return;

    const response = await fetch(`${API_URL}/schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: service,
        barberId: barber,
        userId: session.user.id,
        date,
        time,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message || "Erro ao criar agendamento");
      return;
    }

    toast.success("Agendamento confirmado com sucesso");
    reset();
    router.push("/");
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <StepHeader step={step} />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-2xl shadow-sm border-muted-foreground/20">
          <CardContent className="p-4 space-y-6">
            {step === 1 && (
              <ServiceStep selected={service} onSelect={setService} services={services} />
            )}

            {step === 2 && (
              <DateStep date={date} onChange={setDate} service={selectedService?.name} />
            )}

            {step === 3 && (
              <BarberStep selected={barber} onSelect={setBarber} barbers={availableBarbers} />
            )}

            {step === 4 && (
              <TimeStep selected={time} onSelect={setTime} busyTimes={busyTimes} />
            )}

            <div className="flex justify-between gap-2 pt-2">
              <Button
                variant="outline"
                disabled={step === 1}
                onClick={() => setStep((s) => s - 1)}
              >
                Voltar
              </Button>

              {step < 4 ? (
                <Button
                  disabled={
                    (step === 1 && !service) ||
                    (step === 2 && !date) ||
                    (step === 3 && !barber)
                  }
                  onClick={() => setStep((s) => s + 1)}
                >
                  Próximo
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button disabled={!time}>
                        Confirmar agendamento
                      </Button>
                    }
                  />
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revisar Agendamento</AlertDialogTitle>
                      <AlertDialogDescription>
                        <div className="grid gap-3 text-sm border p-4 rounded-xl bg-muted/30 text-foreground">
                          <div className="flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-primary" />
                            <span><strong>Serviço:</strong> {selectedService?.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <span><strong>Barbeiro:</strong> {selectedBarberName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <span><strong>Data:</strong> {new Date(date + "T12:00:00").toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span><strong>Horário:</strong> {time ? formatTime(time) : ""}</span>
                          </div>
                        </div>
                        <p className="text-center text-xs text-muted-foreground">
                          Ao confirmar, seu horário será reservado imediatamente.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        render={<Button variant="outline" className="rounded-xl">Voltar</Button>}
                      />
                      <AlertDialogAction
                        onClick={handleFinish}
                        render={<Button className="rounded-xl">Confirmar e Agendar</Button>}
                      />
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function StepHeader({ step }: { step: number }) {
  const steps = ["Serviço", "Data", "Barbeiro", "Horário"];

  return (
    <div className="grid grid-cols-4 gap-2">
      {steps.map((label, index) => {
        const number = index + 1;
        const active = number === step;
        const done = number < step;

        return (
          <div
            key={label}
            className={`p-3 rounded-xl text-center text-[10px] sm:text-sm font-medium border transition
              ${active
                ? "border-primary bg-primary/10 text-primary"
                : done
                  ? "border-green-500 bg-green-500/10 text-green-600"
                  : "border-muted text-muted-foreground"
              }`}
          >
            {number}. {label}
          </div>
        );
      })}
    </div>
  );
}

function ServiceStep({ selected, onSelect, services }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Escolha o serviço</h2>
      <div className="grid gap-6">
        {services.map((service: Service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`p-4 rounded-xl border text-left transition
              ${selected === service.id
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-muted hover:border-primary/50"
              }`}
          >
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-muted-foreground">
              {service.duration} min • R$ {service.price.toFixed(2)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function DateStep({ date, onChange, service }: any) {
  const today = new Date();

  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() + i + 1);

    return {
      label: d.toLocaleDateString("pt-BR", { weekday: "short" }),
      day: d.getDate(),
      value: d.toISOString().split("T")[0],
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Escolha a data</h2>
      {service && <p className="text-xs text-primary font-medium">Serviço: {service}</p>}
      <div className="grid grid-cols-4 gap-6">
        {days.map((d) => (
          <button
            key={d.value}
            onClick={() => onChange(d.value)}
            className={`p-3 rounded-xl border transition text-center
              ${date === d.value
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-muted hover:border-primary/50"
              }`}
          >
            <p className="text-[10px] uppercase font-bold opacity-70">{d.label}</p>
            <p className="text-lg font-bold">{d.day}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function BarberStep({ selected, onSelect, barbers }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Escolha o barbeiro</h2>
      <div className="grid gap-6">
        {barbers.map((barber: Barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber.id)}
            className={`p-4 rounded-xl border text-left transition
              ${selected === barber.id
                ? "border-primary bg-primary/10 ring-1 ring-primary"
                : "border-muted hover:border-primary/50"
              }`}
          >
            <p className="font-medium">{barber.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TimeStep({ selected, onSelect, busyTimes }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Escolha o horário</h2>
      <div className="grid grid-cols-3 gap-6">
        {TIMES.map((time: string) => {
          const busy = busyTimes?.includes(time);

          return (
            <button
              key={time}
              disabled={busy}
              onClick={() => !busy && onSelect(time)}
              className={`p-3 rounded-xl border transition text-sm font-medium
                ${busy
                  ? "bg-muted text-muted-foreground/40 border-muted cursor-not-allowed opacity-50"
                  : selected === time
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-muted hover:border-primary/50"
                }`}
            >
              {formatTime(time)}
            </button>
          );
        })}
      </div>
    </div>
  );
}