import { GetAllBService } from "@/services/BServices/GetAllBService";

export class GetAllBServiceController {
    async handle({ set }: any) {
        try {
            const service = new GetAllBService();
            const services = await service.execute();

            set.status = 200;

            return {
                message: "Services fetched successfully",
                data: services,
            };
        } catch (error) {
            set.status = 500;

            return {
                message: (error as Error).message,
            };
        }
    }
}
