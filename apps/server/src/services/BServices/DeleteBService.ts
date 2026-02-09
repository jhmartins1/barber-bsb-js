import { prisma } from "@barberjs/db";

export class DeleteBService {
    async execute(id: string) {
        if (!id) {
            throw new Error("Service id is required");
        }

        const service = await prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            throw new Error("Service not found");
        }

        const deletedService = await prisma.service.delete({
            where: { id },
        });

        return deletedService;
    }
}
