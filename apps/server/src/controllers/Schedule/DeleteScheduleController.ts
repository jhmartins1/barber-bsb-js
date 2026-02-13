import { DeleteScheduleService } from "@/services/Schedule/DeleteScheduleService";
import { t } from "elysia";

export const deleteScheduleParamsSchema = t.Object({
    id: t.String(),
});

export class DeleteScheduleController {
    async handle({ params, set }: any) {
        try {
            const service = new DeleteScheduleService();

            const appointment = await service.execute(params.id);

            set.status = 200;

            return {
                message: "Appointment deleted successfully",
                data: appointment,
            };
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}
