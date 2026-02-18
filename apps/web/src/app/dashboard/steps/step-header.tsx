export function StepHeader({ step }: { step: number }) {
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
                        className={`p-3 rounded-xl text-center text-xs font-medium border
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
