import { prisma } from "@barberjs/db";

export class GetAllBarberService {
    async execute() {
        const barber = await prisma.barber.findMany();
        return barber;
    }
}