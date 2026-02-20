import { prisma } from "@barberjs/db";

export class GetOneBarberService {
    async execute(id: string) {
        if (!id) {
            throw new Error("Id is required");
        }

        const barber = await prisma.barber.findUnique({
            where: {
                id,
            },
            include: {
                services: true,
            },
        });

        if (!barber) {
            throw new Error("Barber not found");
        }

        return barber;
    }
}