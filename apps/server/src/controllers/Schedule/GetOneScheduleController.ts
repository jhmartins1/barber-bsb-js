import { GetOneScheduleService } from "@/services/Schedule/GetOneScheduleService";
import { t } from "elysia";

export const getOneScheduleParamsSchema = t.Object({
    id: t.String(),
});

export class GetOneScheduleController {
    async handle({ params, set }: any) {
        try {
            const service = new GetOneScheduleService();
            const appointment = await service.execute(params.id);

            set.status = 200;

            return {
                message: "Appointment fetched successfully",
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
