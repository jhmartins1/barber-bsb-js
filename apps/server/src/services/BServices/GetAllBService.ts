import { prisma } from "@barberjs/db";

export class GetAllBService {
    async execute() {
        const services = await prisma.service.findMany();
        return services;
    }
}
