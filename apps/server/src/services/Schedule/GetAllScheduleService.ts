import { prisma } from "@barberjs/db";

interface GetAllScheduleParams {
    date?: string;
    barberId?: string;
}

export class GetAllScheduleService {
    async execute({ date, barberId }: GetAllScheduleParams = {}) {
        const appointments = await prisma.appointment.findMany({
            where: {
                ...(barberId && { barberId }),
                ...(date && {
                    date: new Date(date),
                }),
            },
            orderBy: {
                date: "asc",
            },
            select: {
                id: true,
                date: true,
                time: true,
                status: true,

                // ✅ CLIENTE SEM CONTA
                userName: true,
                userPhone: true,

                barber: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                    },
                },

                service: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        duration: true,
                    },
                },

                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        return appointments;
    }
}
