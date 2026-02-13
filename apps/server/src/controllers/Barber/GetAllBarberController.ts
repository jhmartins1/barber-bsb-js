import { GetAllBarberService } from "@/services/Barber/GetAllBarberService";

export class GetAllBarberController {
    async handle({ set }: any) {
        try {
            const service = new GetAllBarberService();
            const barbers = await service.execute();

            set.status = 200;

            return {
                message: "Barbers fetched successfully",
                data: barbers,
            };
        } catch (error) {
            set.status = 500;

            return {
                message: (error as Error).message,
            };
        }
    }
}
