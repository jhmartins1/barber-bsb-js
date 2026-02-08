import { UpdateBarberService } from "@/services/Barber/UpdateBarberService";

export class UpdateBarberController {
    async handle({ params, body, set }: any) {
        try {
            const service = new UpdateBarberService();

            const barber = await service.execute({
                id: params.id,
                ...body,
            });

            return barber;
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}
