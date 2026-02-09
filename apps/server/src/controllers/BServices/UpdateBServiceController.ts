import { UpdateBService } from "@/services/BServices/UpdateBService";

export class UpdateBServiceController {
    async handle({ params, body, set }: any) {
        try {
            const service = new UpdateBService();

            const updatedService = await service.execute({
                id: params.id,
                ...body,
            });

            return updatedService;
        } catch (error) {
            set.status = 404;

            return {
                message: (error as Error).message,
            };
        }
    }
}
