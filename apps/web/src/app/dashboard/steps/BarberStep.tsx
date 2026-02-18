export function BarberStep({ selected, onSelect, barbers }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Escolha o barbeiro</h2>

            <div className="grid gap-6">
                {barbers.map((barber: any) => (
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