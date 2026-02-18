import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export function useBooking(session: any) {
    const [services, setServices] = useState<any[]>([]);
    const [busyTimes, setBusyTimes] = useState<string[]>([]);

    const [step, setStep] = useState(1);
    const [service, setService] = useState<string | null>(null);
    const [date, setDate] = useState("");
    const [barber, setBarber] = useState<string | null>(null);
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        async function loadServices() {
            const res = await fetch(`${API_URL}/service`);
            const data = await res.json();

            const arr = Array.isArray(data)
                ? data
                : data.data ?? [];

            setServices(arr);
        }

        loadServices();
    }, []);

    useEffect(() => {
        if (!date || !barber) return;

        async function loadBusyTimes() {
            const res = await fetch(
                `${API_URL}/schedule?date=${date}&barberId=${barber}`
            );

            const data = await res.json();

            const arr = Array.isArray(data)
                ? data
                : data.data ?? [];

            setBusyTimes(arr.map((s: any) => s.time));
        }

        loadBusyTimes();
    }, [date, barber]);

    const selectedService = useMemo(
        () => services.find((s) => s.id === service),
        [services, service]
    );

    const availableBarbers =
        selectedService?.barbers ?? [];

    function reset() {
        setStep(1);
        setService(null);
        setDate("");
        setBarber(null);
        setTime(null);
        setBusyTimes([]);
    }

    async function finish(router: any) {
        if (!service || !barber || !date || !time) return;

        const res = await fetch(`${API_URL}/schedule`, {
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

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message);
            return;
        }

        toast.success("Agendamento confirmado");
        reset();
        router.push("/");
    }

    return {
        services,
        busyTimes,
        step,
        setStep,
        service,
        setService,
        date,
        setDate,
        barber,
        setBarber,
        time,
        setTime,
        availableBarbers,
        selectedService,
        finish,
    };
}
