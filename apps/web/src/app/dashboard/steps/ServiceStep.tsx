export function ServiceStep({ selected, onSelect, services }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Escolha o serviço</h2>

            <div className="grid gap-6">
                {services.map((service: any) => (
                    <button
                        key={service.id}
                        onClick={() => onSelect(service.id)}
                        className={`p-4 rounded-xl border text-left transition
              ${selected === service.id
                                ? "border-primary bg-primary/10 ring-1 ring-primary"
                                : "border-muted hover:border-primary/50"
                            }`}
                    >
                        <p className="font-medium">{service.name}</p>

                        <p className="text-sm text-muted-foreground">
                            {service.duration} min • R$ {service.price.toFixed(2)}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}