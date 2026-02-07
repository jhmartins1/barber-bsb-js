import { prisma } from "@barberjs/db";
import type { IBarber } from "@/utils/BarberInterface";

export class CreateBarberService {
    async execute({ name, phone, image }: IBarber) {
        if (!name) {
            throw new Error("Name is required");
        }

        const phoneExists = await prisma.barber.findFirst({
            where: {
                phone,
            },
        });

        if (phoneExists) {
            throw new Error("Phone already exists");
        }

        const barber = await prisma.barber.create({
            data: {
                name,
                phone,
                image,
            },
        });

        return barber;
    }
}
