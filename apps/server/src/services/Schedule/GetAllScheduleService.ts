import { prisma } from "@barberjs/db";

export class GetAllScheduleService {
    async execute() {
        const appointments = await prisma.appointment.findMany({
            orderBy: {
                date: "asc",
            },
            select: {
                id: true,
                date: true,
                time: true,
                status: true,

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
