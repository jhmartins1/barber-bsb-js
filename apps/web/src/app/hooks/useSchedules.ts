import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useSchedules(API_URL: string) {
    const [data, setData] = useState([]);
    const [barbers, setBarbers] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    async function fetchData() {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/schedule`);
            const json = await res.json();
            setData(json.data ?? []);
        } catch {
            toast.error("Erro ao carregar agendamentos");
        } finally {
            setLoading(false);
        }
    }

    async function fetchAuxData() {
        const [b, s] = await Promise.all([
            fetch(`${API_URL}/barber`),
            fetch(`${API_URL}/service`),
        ]);

        if (b.ok) setBarbers((await b.json()).data ?? []);
        if (s.ok) setServices((await s.json()).data ?? []);
    }

    async function deleteSchedule(id: string) {
        if (isDeleting) return;

        setIsDeleting(true);

        try {
            const res = await fetch(`${API_URL}/schedule/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Agendamento excluído");
                fetchData();
            } else {
                toast.error("Erro ao excluir");
            }
        } catch {
            toast.error("Erro de conexão");
        } finally {
            setIsDeleting(false);
        }
    }

    useEffect(() => {
        fetchData();
        fetchAuxData();
    }, []);

    return {
        data,
        setData,
        barbers,
        services,
        loading,
        fetchData,
        deleteSchedule,
        isDeleting,
    };
}
