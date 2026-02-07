"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Fluxo de agendamento em 3 etapas:
 * 1. Serviço
 * 2. Data
 * 3. Barbeiro
 *
 * Componente independente para ser usado na página de dashboard
 * ou em uma rota /agendamento.
 */

const services = [
  { id: "haircut", label: "Corte de cabelo", duration: 30 },
  { id: "beard", label: "Barba", duration: 20 },
  { id: "combo", label: "Corte + Barba", duration: 50 },
];

const barbers = [
  { id: "1", name: "Carlos" },
  { id: "2", name: "João" },
  { id: "3", name: "Pedro" },
];

export default function BarberBookingStepFlow() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState<string>("");
  const [barber, setBarber] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((s) => s.id === service),
    [service]
  );

  const canGoNextStep1 = !!service;
  const canGoNextStep2 = !!date;
  const canFinish = !!barber;

  function reset() {
    setStep(1);
    setService(null);
    setDate("");
    setBarber(null);
  }

  function handleFinish() {
    alert(
      `Agendamento confirmado!\n\nServiço: ${selectedService?.label}\nData: ${date}\nBarbeiro: ${barbers.find((b) => b.id === barber)?.name}`
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
        transition={{ duration: 0.2 }}
      >
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-6">
            {step === 1 && (
              <ServiceStep
                selected={service}
                onSelect={setService}
              />
            )}

            {step === 2 && (
              <DateStep
                date={date}
                onChange={setDate}
                service={selectedService?.label}
              />
            )}

            {step === 3 && (
              <BarberStep
                selected={barber}
                onSelect={setBarber}
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

              {step === 1 && (
                <Button
                  disabled={!canGoNextStep1}
                  onClick={() => setStep(2)}
                >
                  Próximo
                </Button>
              )}

              {step === 2 && (
                <Button
                  disabled={!canGoNextStep2}
                  onClick={() => setStep(3)}
                >
                  Próximo
                </Button>
              )}

              {step === 3 && (
                <Button disabled={!canFinish} onClick={handleFinish}>
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
}: {
  selected: string | null;
  onSelect: (value: string) => void;
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
            <p className="font-medium">{service.label}</p>
            <p className="text-sm text-muted-foreground">
              Duração média: {service.duration} min
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
      <div>
        <h2 className="text-xl font-semibold">Escolha a data</h2>
        {service && (
          <p className="text-sm text-muted-foreground">
            Serviço selecionado: {service}
          </p>
        )}
      </div>

      <Input
        type="date"
        value={date}
        onChange={(e) => onChange(e.target.value)}
        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
      />
    </div>
  );
}

function BarberStep({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (v: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Escolha o barbeiro</h2>

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
