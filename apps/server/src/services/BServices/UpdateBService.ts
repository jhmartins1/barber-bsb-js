import { prisma } from "@barberjs/db";
import type { IService } from "@/utils/ServiceInterface";

export class UpdateBService {
    async execute({ id, name, price, duration, barberIds }: IService) {
        if (!id) {
            throw new Error("Service id is required");
        }

        const serviceExists = await prisma.service.findUnique({
            where: { id },
        });

        if (!serviceExists) {
            throw new Error("Service not found");
        }

        // valida barbeiros somente se enviados
        if (barberIds) {
            if (barberIds.length === 0) {
                throw new Error("Service must have at least one barber");
            }

            const barbers = await prisma.barber.findMany({
                where: { id: { in: barberIds } },
            });

            if (barbers.length !== barberIds.length) {
                throw new Error("One or more barbers not found");
            }
        }

        const service = await prisma.service.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(price !== undefined && { price }),
                ...(duration !== undefined && { duration }),
                ...(barberIds !== undefined && {
                    barbers: {
                        set: barberIds.map(id => ({ id })),
                    },
                }),
            },
            include: {
                barbers: true,
            },
        });

        return service;
    }
}
