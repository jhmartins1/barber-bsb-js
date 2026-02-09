import { prisma } from "@barberjs/db";

export class GetOneBService {
    async execute(id: string) {
        const service = await prisma.service.findUnique({
            where: {
                id,
            },
            include: {
                barbers: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        if (!service) {
            throw new Error("Service not found");
        }

        return service;
    }
}
