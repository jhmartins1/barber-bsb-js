import { GetAllBService } from "@/services/BServices/GetAllBService";

export class GetAllBServiceController {
    async handle() {
        const service = new GetAllBService();
        const services = await service.execute();

        return services;
    }
}
