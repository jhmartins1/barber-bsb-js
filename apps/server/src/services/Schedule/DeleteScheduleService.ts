import { prisma } from "@barberjs/db";

export class DeleteScheduleService {
    async execute(id: string) {
        if (!id) {
            throw new Error("Appointment id is required");
        }

        const appointmentExists = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointmentExists) {
            throw new Error("Appointment not found");
        }

        await prisma.appointment.delete({
            where: { id },
        });

        return {
            message: "Appointment deleted successfully",
        };
    }
}
