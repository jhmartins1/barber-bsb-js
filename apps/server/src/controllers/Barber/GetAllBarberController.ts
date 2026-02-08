import { GetAllBarberService } from "@/services/Barber/GetAllBarberService";

export class GetAllBarberController {
    async handle() {
        const service = new GetAllBarberService();
        const barber = await service.execute();

        return barber;
    }
}