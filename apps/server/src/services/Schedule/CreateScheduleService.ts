import { prisma } from "@barberjs/db";
import type { ISchedule } from "@/utils/ScheduleInterface";

export class CreateScheduleService {
    async execute({
        userId,
        barberId,
        serviceId,
        date,
        time,
        status,
    }: ISchedule) {

        if (!userId) throw new Error("User is required");
        if (!barberId) throw new Error("Barber is required");
        if (!serviceId) throw new Error("Service is required");
        if (!date) throw new Error("Date is required");
        if (!time) throw new Error("Time is required");

        // usuário existe?
        const userExists = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!userExists) {
            throw new Error("User not found");
        }

        // barbeiro existe?
        const barberExists = await prisma.barber.findUnique({
            where: { id: barberId },
            include: { services: true },
        });

        if (!barberExists) {
            throw new Error("Barber not found");
        }

        // serviço existe?
        const serviceExists = await prisma.service.findUnique({
            where: { id: serviceId },
        });

        if (!serviceExists) {
            throw new Error("Service not found");
        }

        // barbeiro executa esse serviço?
        const barberCanDoService = barberExists.services.some(
            s => s.id === serviceId
        );

        if (!barberCanDoService) {
            throw new Error("This barber does not perform this service");
        }

        // verifica conflito de horário
        const appointmentConflict = await prisma.appointment.findFirst({
            where: {
                barberId,
                date,
                time,
            },
        });

        if (appointmentConflict) {
            throw new Error("This time is already booked");
        }

        const appointment = await prisma.appointment.create({
            data: {
                userId,
                barberId,
                serviceId,
                date,
                time,
                status: status ?? "AGENDADO",
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


        return appointment;
    }
}
