"use client";

import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
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
import { useMemo } from "react";
import { useBooking } from "../hooks/useBooking";
import { StepHeader } from "./steps/step-header";
import { ServiceStep } from "./steps/ServiceStep";
import { DateStep } from "./steps/DateStep";
import { BarberStep } from "./steps/BarberStep";
import { TimeStep } from "./steps/TimeStep";

type Barber = {
  id: string;
  name: string;
};

function formatTime(time: string) {
  return time.replace("T", "").replace(/(\d{2})(\d{2})/, "$1:$2");
}

export default function Dashboard({
  session,
}: {
  session: typeof authClient.$Infer.Session;
}) {
  const router = useRouter();
  const booking = useBooking(session);

  const selectedBarberName = useMemo(() => {
    return booking.availableBarbers.find(
      (b: Barber) => b.id === booking.barber
    )?.name;
  }, [booking.barber, booking.availableBarbers]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      <StepHeader step={booking.step} />

      <motion.div
        key={booking.step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="rounded-2xl shadow-sm border-muted-foreground/20">
          <CardContent className="p-4 space-y-6">

            {booking.step === 1 && (
              <ServiceStep
                selected={booking.service}
                onSelect={booking.setService}
                services={booking.services}
              />
            )}

            {booking.step === 2 && (
              <DateStep
                date={booking.date}
                onChange={booking.setDate}
                service={booking.selectedService?.name}
              />
            )}

            {booking.step === 3 && (
              <BarberStep
                selected={booking.barber}
                onSelect={booking.setBarber}
                barbers={booking.availableBarbers}
              />
            )}

            {booking.step === 4 && (
              <TimeStep
                selected={booking.time}
                onSelect={booking.setTime}
                busyTimes={booking.busyTimes}
              />
            )}

            <div className="flex justify-between gap-2 pt-2">
              <Button
                variant="outline"
                disabled={booking.step === 1}
                onClick={() =>
                  booking.setStep((s: number) => s - 1)
                }
              >
                Voltar
              </Button>

              {booking.step < 4 ? (
                <Button
                  disabled={
                    (booking.step === 1 && !booking.service) ||
                    (booking.step === 2 && !booking.date) ||
                    (booking.step === 3 && !booking.barber)
                  }
                  onClick={() =>
                    booking.setStep((s: number) => s + 1)
                  }
                >
                  Próximo
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button disabled={!booking.time}>
                        Confirmar agendamento
                      </Button>
                    }
                  />

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Revisar Agendamento
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        <div className="grid gap-3 text-sm border p-4 rounded-xl bg-muted/30 text-foreground">
                          <div className="flex items-center gap-2">
                            <Scissors className="w-4 h-4 text-primary" />
                            <span>
                              <strong>Serviço:</strong>{" "}
                              {booking.selectedService?.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <span>
                              <strong>Barbeiro:</strong>{" "}
                              {selectedBarberName}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <span>
                              <strong>Data:</strong>{" "}
                              {new Date(
                                booking.date + "T12:00:00"
                              ).toLocaleDateString("pt-BR")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>
                              <strong>Horário:</strong>{" "}
                              {booking.time
                                ? formatTime(booking.time)
                                : ""}
                            </span>
                          </div>
                        </div>

                        <p className="text-center text-xs text-muted-foreground">
                          Ao confirmar, seu horário será reservado imediatamente.
                        </p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel
                        render={
                          <Button variant="outline" className="rounded-xl">
                            Voltar
                          </Button>
                        }
                      />

                      <AlertDialogAction
                        onClick={() => booking.finish(router)}
                        render={
                          <Button className="rounded-xl">
                            Confirmar e Agendar
                          </Button>
                        }
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
