export function TimeStep({ selected, onSelect, busyTimes }: any) {
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