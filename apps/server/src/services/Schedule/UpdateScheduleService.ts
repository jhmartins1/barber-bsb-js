import { prisma } from "@barberjs/db";
import type { ISchedule } from "@/utils/ScheduleInterface";

export class UpdateScheduleService {
    async execute({
        id,
        barberId,
        serviceId,
        date,
        time,
        status,
    }: ISchedule) {
        if (!id) {
            throw new Error("Appointment id is required");
        }

        const appointmentExists = await prisma.appointment.findUnique({
            where: { id },
            include: {
                barber: { include: { services: true } },
            },
        });

        if (!appointmentExists) {
            throw new Error("Appointment not found");
        }

        // barbeiro alterado?
        let barber = appointmentExists.barber;
        if (barberId && barberId !== appointmentExists.barberId) {
            const barberExists = await prisma.barber.findUnique({
                where: { id: barberId },
                include: { services: true },
            });

            if (!barberExists) {
                throw new Error("Barber not found");
            }

            barber = barberExists;
        }

        // serviço alterado?
        if (serviceId) {
            const serviceExists = await prisma.service.findUnique({
                where: { id: serviceId },
            });

            if (!serviceExists) {
                throw new Error("Service not found");
            }

            const barberCanDoService = barber.services.some(
                (s) => s.id === serviceId
            );

            if (!barberCanDoService) {
                throw new Error(
                    "This barber does not perform this service"
                );
            }
        }

        // valida conflito se mudar data, hora ou barbeiro
        const finalBarberId = barberId ?? appointmentExists.barberId;
        const finalDate = date ?? appointmentExists.date;
        const finalTime = time ?? appointmentExists.time;

        const conflict = await prisma.appointment.findFirst({
            where: {
                barberId: finalBarberId,
                date: finalDate,
                time: finalTime,
                NOT: { id },
            },
        });

        if (conflict) {
            throw new Error("This time is already booked");
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id },
            data: {
                ...(barberId && { barberId }),
                ...(serviceId && { serviceId }),
                ...(date && { date }),
                ...(time && { time }),
                ...(status && { status }),
            },
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

        return updatedAppointment;
    }
}
