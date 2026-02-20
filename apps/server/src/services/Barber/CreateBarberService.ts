import { prisma } from "@barberjs/db";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";

interface CreateBarberDTO {
    name: string;
    phone: string;
    image?: File;
    services?: string[];
}

export class CreateBarberService {
    async execute({ name, phone, image, services }: CreateBarberDTO) {
        let imagePath: string | null = null;

        // ✅ se veio imagem
        if (image && typeof image === "object" && "arrayBuffer" in image) {
            const buffer = Buffer.from(await image.arrayBuffer());

            const fileName = `${randomUUID()}-${image.name}`;

            // 🔥 CAMINHO DA PASTA
            const uploadDir = join(process.cwd(), "uploads");

            if (!existsSync(uploadDir)) {
                mkdirSync(uploadDir, { recursive: true });
            }

            const uploadPath = join(uploadDir, fileName);

            await writeFile(uploadPath, buffer);

            imagePath = `/uploads/${fileName}`;
        }

        const barber = await prisma.barber.create({
            data: {
                name,
                phone,
                image: imagePath,
                services: services?.length
                    ? {
                        connect: services.map((id) => ({ id })),
                    }
                    : undefined,
            },
            include: {
                services: true,
            },
        });

        return barber;
    }
}