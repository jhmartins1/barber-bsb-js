import { DeleteBarberService } from "@/services/Barber/DeleteBarberService";
import { t } from "elysia";

export const deleteBarberParamsSchema = t.Object({
    id: t.String(),
});

export class DeleteBarberController {
    async handle({ params, set }: any) {
        try {
            const service = new DeleteBarberService();
            const barber = await service.execute(params.id);

            return barber;
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}

