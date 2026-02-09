import { GetAllBService } from "@/services/BServices/GetAllBService";

export class GetAllBServiceController {
    async handle() {
        const service = new GetAllBService();
        const barberServices = await service.execute();

        return barberServices;
    }
}