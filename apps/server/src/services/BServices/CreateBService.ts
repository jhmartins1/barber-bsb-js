import { prisma } from "@barberjs/db";
import type { IService } from "@/utils/ServiceInterface";

export class CreateBService {
    async execute({ name, price, duration, barberIds }: IService) {
        if (!name) throw new Error("Name is required");
        if (price == null) throw new Error("Price is required");
        if (duration == null) throw new Error("Duration is required");

        if (!barberIds || barberIds.length === 0) {
            throw new Error("At least one barber is required");
        }

        const barbers = await prisma.barber.findMany({
            where: { id: { in: barberIds } },
        });

        if (barbers.length !== barberIds.length) {
            throw new Error("One or more barbers not found");
        }

        const service = await prisma.service.create({
            data: {
                name,
                price,
                duration,
                barbers: {
                    connect: barberIds.map(id => ({ id })),
                },
            },
            include: {
                barbers: true,
            },
        });

        return service;
    }
}
