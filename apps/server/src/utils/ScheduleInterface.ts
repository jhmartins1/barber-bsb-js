export interface ISchedule {
    id?: string;
    userId: string;
    barberId: string;
    serviceId: string;
    date: Date;
    time:
    | "T0800"
    | "T0900"
    | "T1000"
    | "T1100"
    | "T1400"
    | "T1500"
    | "T1600"
    | "T1700"
    | "T1800"
    | "T1900"
    | "T2000";
    status?: "AGENDADO" | "CONFIRMADO" | "CANCELADO";
}
