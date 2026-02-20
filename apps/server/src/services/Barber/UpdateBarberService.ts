import { prisma } from "@barberjs/db";
import type { IBarber } from "@/utils/BarberInterface";

export class UpdateBarberService {
    async execute({ id, name, phone, image, services }: IBarber) {
        if (!id) {
            throw new Error("Id is required");
        }

        if (!name) {
            throw new Error("Name is required");
        }

        const barberExists = await prisma.barber.findUnique({
            where: { id },
        });

        if (!barberExists) {
            throw new Error("Barber not found");
        }

        if (phone) {
            const phoneExists = await prisma.barber.findFirst({
                where: { phone },
            });

            if (phoneExists && phoneExists.id !== id) {
                throw new Error("Phone already exists");
            }
        }

        const barber = await prisma.barber.update({
            where: { id },
            data: {
                name,
                phone,
                image,

                ...(services && {
                    services: {
                        set: services.map((serviceId) => ({
                            id: serviceId,
                        })),
                    },
                }),
            },
            include: {
                services: true,
            },
        });

        return barber;
    }
}