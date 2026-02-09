import { prisma } from "@barberjs/db";
import type { IService } from "@/utils/ServiceInterface";

export class CreateBService {
    async execute({ name, price, duration, barberId }: IService) {
        if (!name) {
            throw new Error("Name is required");
        }

        if (price === undefined || price === null) {
            throw new Error("Price is required");
        }

        if (duration === undefined || duration === null) {
            throw new Error("Duration is required");
        }

        if (!barberId) {
            throw new Error("BarberId is required");
        }

        const barberExists = await prisma.barber.findUnique({
            where: { id: barberId },
        });

        if (!barberExists) {
            throw new Error("Barber not found");
        }

        const service = await prisma.service.create({
            data: {
                name,
                price,
                duration,
                barber: {
                    connect: { id: barberId },
                },
            },
        });

        return service;
    }
}
