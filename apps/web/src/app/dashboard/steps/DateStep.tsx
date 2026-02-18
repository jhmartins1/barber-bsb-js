export function DateStep({ date, onChange, service }: any) {
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

            {service && (
                <p className="text-xs text-primary font-medium">
                    Serviço: {service}
                </p>
            )}

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
                        <p className="text-[10px] uppercase font-bold opacity-70">
                            {d.label}
                        </p>

                        <p className="text-lg font-bold">{d.day}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}