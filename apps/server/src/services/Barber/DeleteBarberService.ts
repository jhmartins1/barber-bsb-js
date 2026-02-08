import { prisma } from "@barberjs/db";

export class DeleteBarberService {
    async execute(id: string) {
        const barber = await prisma.barber.findUnique({
            where: { id },
        });

        if (!barber) {
            throw new Error("Barber not found");
        }

        await prisma.barber.delete({
            where: { id },
        });

        return { message: "Barber deleted" };
    }
}
