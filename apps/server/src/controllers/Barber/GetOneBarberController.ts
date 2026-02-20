import { GetOneBarberService } from "@/services/Barber/GetOneBarberService";
import { t } from "elysia";

export const getOneBarberParamsSchema = t.Object({
    id: t.String(),
});

export class GetOneBarberController {
    async handle({ params, set }: any) {
        try {
            const service = new GetOneBarberService();
            const barber = await service.execute(params.id);

            set.status = 200;

            return {
                message: "Barber fetched successfully",
                data: barber,
            };
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}