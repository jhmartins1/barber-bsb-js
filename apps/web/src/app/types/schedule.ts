export type ScheduleStatus =
    | "AGENDADO"
    | "CONFIRMADO"
    | "CANCELADO";

export interface Schedule {
    id: string;
    date: string;
    time: string;
    status: ScheduleStatus;

    barber?: {
        id: string;
        name: string;
    };

    service?: {
        id: string;
        name: string;
    };

    user?: {
        name: string;
    };

    userName?: string;
}
