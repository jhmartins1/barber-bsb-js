"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

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

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const [services, setServices] = useState<Service[]>([]);
  const [step, setStep] = useState(1);
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [barber, setBarber] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch(`${API_URL}/service`);
        const data = await response.json();
        setServices(data);
      } catch (err) {
        console.error("Erro ao carregar serviços", err);
      }
    }

    loadServices();
  }, []);

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
  }

  function handleFinish() {
    alert(
      `Agendamento confirmado!\n\nServiço: ${selectedService?.name
      }\nData: ${date}\nBarbeiro: ${availableBarbers.find((b) => b.id === barber)?.name
      }`
    );

    reset();
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
      <StepHeader step={step} />

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-6">
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

            <div className="flex justify-between gap-2 pt-2">
              <Button
                variant="outline"
                disabled={step === 1}
                onClick={() => setStep((s) => s - 1)}
              >
                Voltar
              </Button>

              {step < 3 ? (
                <Button
                  disabled={
                    (step === 1 && !service) ||
                    (step === 2 && !date)
                  }
                  onClick={() => setStep((s) => s + 1)}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  disabled={!barber || availableBarbers.length === 0}
                  onClick={handleFinish}
                >
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
  const steps = ["Serviço", "Data", "Barbeiro"];

  return (
    <div className="grid grid-cols-3 gap-2">
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

function ServiceStep({
  selected,
  onSelect,
  services,
}: {
  selected: string | null;
  onSelect: (value: string) => void;
  services: Service[];
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Escolha o serviço</h2>

      <div className="grid gap-3">
        {services.map((service) => (
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

function DateStep({
  date,
  onChange,
  service,
}: {
  date: string;
  onChange: (v: string) => void;
  service?: string;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Escolha a data</h2>

      {service && (
        <p className="text-sm text-muted-foreground">
          Serviço selecionado: {service}
        </p>
      )}

      <Input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        min={new Date(Date.now() + 86400000)
          .toISOString()
          .split("T")[0]}
      />
    </div>
  );
}

function BarberStep({
  selected,
  onSelect,
  barbers,
}: {
  selected: string | null;
  onSelect: (v: string) => void;
  barbers: Barber[];
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Escolha o barbeiro</h2>

      {barbers.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Não há barbeiros disponíveis para este serviço.
        </p>
      )}

      <div className="grid gap-3">
        {barbers.map((barber) => (
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
