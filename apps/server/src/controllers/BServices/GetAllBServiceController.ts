import { GetAllBService } from "@/services/BServices/GetAllBService";

export class GetAllBServiceController {
    async handle({ set }: { set: any }) {
        try {
            const service = new GetAllBService();
            const services = await service.execute();

            set.status = 200;

            return {
                success: true,
                message: "Services fetched successfully",
                data: services,
            };
        } catch (error) {
            console.error("GetAllBService error:", error);

            set.status = 500;

            return {
                success: false,
                message: "Internal server error",
                data: [],
            };
        }
    }
}