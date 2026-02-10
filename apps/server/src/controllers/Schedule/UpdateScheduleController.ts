import { UpdateScheduleService } from "@/services/Schedule/UpdateScheduleService";
import { t } from "elysia";

export const updateScheduleParamsSchema = t.Object({
    id: t.String(),
});

export const updateScheduleBodySchema = t.Object({
    barberId: t.Optional(t.String()),
    serviceId: t.Optional(t.String()),
    date: t.Optional(t.String()),
    time: t.Optional(t.String()),
    status: t.Optional(
        t.Union([
            t.Literal("AGENDADO"),
            t.Literal("CONFIRMADO"),
            t.Literal("CANCELADO"),
        ])
    ),
});

export class UpdateScheduleController {
    async handle({ params, body, set }: any) {
        try {
            const service = new UpdateScheduleService();

            const appointment = await service.execute({
                id: params.id,
                ...body,
                date: body.date ? new Date(body.date) : undefined,
            });

            return appointment;
        } catch (error) {
            set.status = 400;

            return {
                message: (error as Error).message,
            };
        }
    }
}
