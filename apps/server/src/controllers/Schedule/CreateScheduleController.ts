import { CreateScheduleService } from "@/services/Schedule/CreateScheduleService";
import { t } from "elysia";

export const createScheduleBodySchema = t.Object({
    userId: t.Optional(t.String()),

    // cliente avulso
    userName: t.Optional(t.String()),
    userPhone: t.Optional(t.String()),

    barberId: t.String(),
    serviceId: t.String(),
    date: t.String(),

    time: t.Union([
        t.Literal("T0800"),
        t.Literal("T0900"),
        t.Literal("T1000"),
        t.Literal("T1100"),
        t.Literal("T1400"),
        t.Literal("T1500"),
        t.Literal("T1600"),
        t.Literal("T1700"),
        t.Literal("T1800"),
        t.Literal("T1900"),
        t.Literal("T2000"),
    ]),

    status: t.Optional(
        t.Union([
            t.Literal("AGENDADO"),
            t.Literal("CONFIRMADO"),
            t.Literal("CANCELADO"),
        ])
    ),
});

export class CreateScheduleController {
    async handle({ body, set }: any) {
        try {

            // valida manualmente: precisa ter cliente
            if (!body.userId && (!body.userName || !body.userPhone)) {
                set.status = 400;

                return {
                    message:
                        "You must provide userId OR userName and userPhone",
                };
            }

            const service = new CreateScheduleService();

            const result = await service.execute({
                ...body,
                date: new Date(body.date),
            });

            set.status = 201;

            return {
                message: "Appointment created",
                data: result,
            };
        } catch (error) {
            set.status = 400;

            return {
                message: (error as Error).message,
            };
        }
    }
}
