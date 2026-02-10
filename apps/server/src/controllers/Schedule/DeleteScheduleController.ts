import { DeleteScheduleService } from "@/services/Schedule/DeleteScheduleService";
import { t } from "elysia";

export const deleteScheduleParamsSchema = t.Object({
    id: t.String(),
});

export class DeleteScheduleController {
    async handle({ params, set }: any) {
        try {
            const service = new DeleteScheduleService();

            const result = await service.execute(params.id);

            return result;
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}
