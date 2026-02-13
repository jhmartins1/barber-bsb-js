import { GetAllScheduleService } from "@/services/Schedule/GetAllScheduleService";

export class GetAllScheduleController {
    async handle({ query, set }: any) {
        try {
            const service = new GetAllScheduleService();

            const appointments = await service.execute({
                date: query?.date,
                barberId: query?.barberId,
            });

            set.status = 200;

            return {
                message: "Appointments fetched successfully",
                data: appointments,
            };
        } catch (error) {
            set.status = 500;

            return {
                message: (error as Error).message,
            };
        }
    }
}
