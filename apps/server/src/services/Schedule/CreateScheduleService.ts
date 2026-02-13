import { prisma } from "@barberjs/db";
import type { ISchedule } from "@/utils/ScheduleInterface";

export class CreateScheduleService {
    async execute({
        userId,
        userName,
        userPhone,
        barberId,
        serviceId,
        date,
        time,
        status,
    }: ISchedule) {

        if (!barberId) throw new Error("Barber is required");
        if (!serviceId) throw new Error("Service is required");
        if (!date) throw new Error("Date is required");
        if (!time) throw new Error("Time is required");

        // deve existir OU userId OU nome+telefone
        if (!userId && (!userName || !userPhone)) {
            throw new Error("Client information required");
        }

        // se userId existir, valida usuário
        if (userId) {
            const userExists = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (!userExists) {
                throw new Error("User not found");
            }
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

        // barbeiro executa serviço?
        const barberCanDoService = barberExists.services.some(
            s => s.id === serviceId
        );

        if (!barberCanDoService) {
            throw new Error("Barber does not perform this service");
        }

        // conflito de horário
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
                userId: userId ?? null,
                userName: userName ?? null,
                userPhone: userPhone ?? null,
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

                userName: true,
                userPhone: true,
            },
        });

        return appointment;
    }
}
