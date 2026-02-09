import { prisma } from "@barberjs/db";

export class DeleteBService {
    async execute(id: string) {
        const service = await prisma.service.findUnique({
            where: { id },
        });

        if (!service) {
            throw new Error("Service not found");
        }

        await prisma.service.delete({
            where: { id },
        });

        return { message: "Service deleted" };
    }
}
