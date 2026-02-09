import { GetOneBService } from "@/services/BServices/GetOneBService";
import { t } from "elysia";

export const getOneBServiceParamsSchema = t.Object({
    id: t.String(),
});

export class GetOneBServiceController {
    async handle({ params, set }: any) {
        try {
            const service = new GetOneBService();
            const barberService = await service.execute(params.id);

            return barberService;
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}
