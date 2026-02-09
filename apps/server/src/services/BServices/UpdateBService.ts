import { prisma } from "@barberjs/db";
import type { IService } from "@/utils/ServiceInterface";

export class UpdateBService {
    async execute({ id, name, price, duration, barberId }: IService) {
        if (!id) {
            throw new Error("Service id is required");
        }

        // verifica se existe
        const serviceExists = await prisma.service.findUnique({
            where: { id },
        });

        if (!serviceExists) {
            throw new Error("Service not found");
        }

        // só valida barbeiro se ele estiver sendo alterado
        if (barberId) {
            const barberExists = await prisma.barber.findUnique({
                where: { id: barberId },
            });

            if (!barberExists) {
                throw new Error("Barber not found");
            }
        }

        const service = await prisma.service.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(price !== undefined && { price }),
                ...(duration !== undefined && { duration }),
                ...(barberId !== undefined && {
                    barber: { connect: { id: barberId } },
                }),
            },
        });

        return service;
    }
}
