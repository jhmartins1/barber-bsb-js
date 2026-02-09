import { prisma } from "@barberjs/db";

export class GetOneBService {
    async execute(id: string) {
        const barberServices = await prisma.service.findUnique({
            where: {
                id,
            },
            include: {
                barber: true,
            },
        });

        if (!barberServices) {
            throw new Error("Barber Services not found");
        }

        return barberServices;
    }
}