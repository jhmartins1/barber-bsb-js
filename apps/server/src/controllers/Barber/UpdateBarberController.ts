import { UpdateBarberService } from "@/services/Barber/UpdateBarberService";

export class UpdateBarberController {
    async handle({ params, body, set }: any) {
        try {
            const service = new UpdateBarberService();

            const barber = await service.execute({
                id: params.id,
                ...body,
            });

            set.status = 200;

            return {
                message: "Barber updated successfully",
                data: barber,
            };
        } catch (error) {
            set.status = 400;

            return {
                message: (error as Error).message,
            };
        }
    }
}