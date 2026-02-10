import { GetAllScheduleService } from "@/services/Schedule/GetAllScheduleService";

export class GetAllScheduleController {
    async handle({ set }: any) {
        try {
            const service = new GetAllScheduleService();
            const appointments = await service.execute();

            return appointments;
        } catch (error) {
            set.status = 500;

            return {
                message: (error as Error).message,
            };
        }
    }
}
