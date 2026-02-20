import { prisma } from "@barberjs/db";

export class GetAllBService {
    async execute() {
        const services = await prisma.service.findMany({
            include: {
                barbers: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return services ?? [];
    }
}