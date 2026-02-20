import { prisma } from "@barberjs/db";

export class GetAllBarberService {
    async execute() {
        const barbers = await prisma.barber.findMany({
            include: {
                services: true,
            },
            orderBy: {
                name: "asc",
            },
        });

        return barbers;
    }
}