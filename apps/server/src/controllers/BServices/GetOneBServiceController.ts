import { GetOneBService } from "@/services/BServices/GetOneBService";
import { t } from "elysia";

export const getOneBServiceParamsSchema = t.Object({
    id: t.String(),
    barberId: t.String(),
});

export class GetOneBServiceController {
    async handle({ params, set }: any) {
        try {
            const service = new GetOneBService();
            const barberServices = await service.execute(params.id);

            return barberServices;
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}

