import { prisma } from '@barberjs/db'
import type { IBarber } from "@/utils/BarberInterface";

export class UpdateBarberService {
    async execute({ id, name, phone, image }: IBarber) {
        if (!name) {
            throw new Error("Name is required");
        }

        if (phone) {
            const phoneExists = await prisma.barber.findFirst({
                where: {
                    phone,
                },
            });

            if (phoneExists && phoneExists.id !== id) {
                throw new Error("Phone already exists");
            }
        }

        const barber = await prisma.barber.update({
            where: {
                id,
            },
            data: {
                name,
                phone,
                image,
            },
        });

        return barber;
    }
}
