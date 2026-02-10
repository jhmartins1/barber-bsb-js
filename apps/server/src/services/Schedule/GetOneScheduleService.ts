import { prisma } from "@barberjs/db";

export class GetOneScheduleService {
    async execute(id: string) {
        if (!id) {
            throw new Error("Appointment id is required");
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            include: {
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

        if (!appointment) {
            throw new Error("Appointment not found");
        }

        return appointment;
    }
}
