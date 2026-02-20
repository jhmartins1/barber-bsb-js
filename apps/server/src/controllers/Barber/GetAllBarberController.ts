import { GetAllBarberService } from "@/services/Barber/GetAllBarberService";

export class GetAllBarberController {
    async handle({ set }: { set: any }) {
        try {
            const service = new GetAllBarberService();
            const barbers = await service.execute();

            set.status = 200;

            return {
                success: true,
                message: "Barbers fetched successfully",
                data: barbers,
            };
        } catch (error) {
            console.error("GetAllBarber error:", error);

            set.status = 500;

            return {
                success: false,
                message: "Internal server error",
            };
        }
    }
}