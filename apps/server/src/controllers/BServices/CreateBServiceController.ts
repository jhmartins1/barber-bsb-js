import { CreateBService } from "@/services/BServices/CreateBService";
import { t } from "elysia";

export const createServiceBodySchema = t.Object({
    name: t.String(),
    price: t.Number(),
    duration: t.Number(),
    barberIds: t.Array(t.String()),
});


export class CreateBServiceController {
    async handle({ body, set }: any) {
        try {
            const service = new CreateBService();
            const result = await service.execute(body);

            set.status = 201;

            return {
                message: "Service created",
                data: result,
            };
        } catch (error) {
            set.status = 400;

            return {
                message: (error as Error).message,
            };
        }
    }
}
