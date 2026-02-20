import { CreateBarberService } from "@/services/Barber/CreateBarberService";

export class CreateBarberController {
    async handle({ body }: any) {
        let services: string[] | undefined = undefined;

        // ✅ parse seguro
        if (body.services) {
            try {
                services =
                    typeof body.services === "string"
                        ? JSON.parse(body.services)
                        : body.services;
            } catch {
                services = undefined;
            }
        }

        const service = new CreateBarberService();

        const barber = await service.execute({
            name: body.name,
            phone: body.phone,
            image: body.image, // já tratado no upload
            services,
        });

        return barber;
    }
}