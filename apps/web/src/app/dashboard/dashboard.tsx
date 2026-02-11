"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

const API_URL = "http://127.0.0.1:3333";

const TIMES = [
  "T0800",
  "T0900",
  "T1000",
  "T1100",
  "T1400",
  "T1500",
  "T1600",
  "T1700",
  "T1800",
  "T1900",
  "T2000",
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
      const response = await fetch(`${API_URL}/service`);
      const data = await response.json();
      setServices(data);
    }

    loadServices();
  }, []);

  // Busca horários ocupados
  useEffect(() => {
    if (!date || !barber) return;

    async function loadBusyTimes() {
      const response = await fetch(
        `${API_URL}/schedule?date=${date}&barberId=${barber}`
      );

      if (!response.ok) return;

      const schedules = await response.json();
      setBusyTimes(schedules.map((s: any) => s.time));
    }

    loadBusyTimes();
  }, [date, barber]);

  const selectedService = useMemo(
    () => services.find((s) => s.id === service),
    [service, services]
  );

  const availableBarbers = useMemo(() => {
    if (!selectedService) return [];
    return selectedService.barbers ?? [];
  }, [selectedService]);

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
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className="w-full max-w-2xl mx-auto p-2 space-y-4">
      <StepHeader step={step} />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4 space-y-4">
            {step === 1 && (
              <ServiceStep
                selected={service}
                onSelect={setService}
                services={services}
              />
            )}

            {step === 2 && (
              <DateStep
                date={date}
                onChange={setDate}
                service={selectedService?.name}
              />
            )}

            {step === 3 && (
              <BarberStep
                selected={barber}
                onSelect={setBarber}
                barbers={availableBarbers}
              />
            )}

            {step === 4 && (
              <TimeStep
                selected={time}
                onSelect={setTime}
                busyTimes={busyTimes}
              />
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
                <Button disabled={!time} onClick={handleFinish}>
                  Confirmar agendamento
                </Button>
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
            className={`p-3 rounded-xl text-center text-sm font-medium border transition
              ${active
                ? "border-primary bg-primary/10"
                : done
                  ? "border-green-500 bg-green-500/10"
                  : "border-muted"
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
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Escolha o serviço</h2>

      <div className="grid gap-3">
        {services.map((service: Service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service.id)}
            className={`p-4 rounded-xl border text-left transition
              ${selected === service.id
                ? "border-primary bg-primary/10"
                : "border-muted hover:border-primary"
              }`}
          >
            <p className="font-medium">{service.name}</p>
            <p className="text-sm text-muted-foreground">
              {service.duration} min • R$ {service.price}
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
      label: d.toLocaleDateString("pt-BR", {
        weekday: "short",
      }),
      day: d.getDate(),
      value: d.toISOString().split("T")[0],
    };
  });

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Escolha a data</h2>

      {service && (
        <p className="text-sm text-muted-foreground">
          Serviço selecionado: {service}
        </p>
      )}

      <div className="grid grid-cols-4 gap-3">
        {days.map((d) => (
          <button
            key={d.value}
            onClick={() => onChange(d.value)}
            className={`p-3 rounded-xl border transition text-center
              ${date === d.value
                ? "border-primary bg-primary/10"
                : "border-muted hover:border-primary"
              }`}
          >
            <p className="text-xs uppercase">{d.label}</p>
            <p className="text-lg font-semibold">{d.day}</p>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Disponível apenas para as próximas duas semanas.
      </p>
    </div>
  );
}



function BarberStep({ selected, onSelect, barbers }: any) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Escolha o barbeiro</h2>

      <div className="grid gap-3">
        {barbers.map((barber: Barber) => (
          <button
            key={barber.id}
            onClick={() => onSelect(barber.id)}
            className={`p-4 rounded-xl border text-left transition
              ${selected === barber.id
                ? "border-primary bg-primary/10"
                : "border-muted hover:border-primary"
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
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Escolha o horário</h2>

      <div className="grid grid-cols-3 gap-3">
        {TIMES.map((time: string) => {
          const busy = busyTimes?.includes(time);

          return (
            <button
              key={time}
              disabled={busy}
              onClick={() => !busy && onSelect(time)}
              className={`p-3 rounded-xl border transition
                ${busy
                  ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                  : selected === time
                    ? "border-primary bg-primary/10"
                    : "border-muted hover:border-primary"
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
