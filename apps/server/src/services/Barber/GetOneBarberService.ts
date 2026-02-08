import { prisma } from "@barberjs/db";

export class GetOneBarberService {
    async execute(id: string) {
        const barber = await prisma.barber.findUnique({
            where: {
                id,
            },
        });

        if (!barber) {
            throw new Error("Barber not found");
        }

        return barber;
    }
}