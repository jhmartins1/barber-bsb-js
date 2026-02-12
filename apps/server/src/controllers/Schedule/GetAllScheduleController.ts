import { GetAllScheduleService } from "@/services/Schedule/GetAllScheduleService";

export class GetAllScheduleController {
    async handle({ query, set }: any) {
        try {
            const { date, barberId } = query;

            const service = new GetAllScheduleService();
            const appointments = await service.execute({
                date: date as string,
                barberId: barberId as string
            });

            return appointments;
        } catch (error) {
            set.status = 500;

            return {
                message: (error as Error).message,
            };
        }
    }
}