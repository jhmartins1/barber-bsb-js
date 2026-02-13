import { prisma } from "@barberjs/db";

export class DeleteScheduleService {
    async execute(id: string) {
        if (!id) {
            throw new Error("Appointment id is required");
        }

        const appointmentExists = await prisma.appointment.findUnique({
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

        if (!appointmentExists) {
            throw new Error("Appointment not found");
        }

        await prisma.appointment.delete({
            where: { id },
        });

        return appointmentExists;
    }
}
