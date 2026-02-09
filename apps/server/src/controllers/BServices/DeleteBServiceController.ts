import { DeleteBService } from "@/services/BServices/DeleteBService";
import { t } from "elysia";

export const deleteBServiceParamsSchema = t.Object({
    id: t.String(),
});

export class DeleteBServiceController {
    async handle({ params, set }: any) {
        try {
            const service = new DeleteBService();
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

