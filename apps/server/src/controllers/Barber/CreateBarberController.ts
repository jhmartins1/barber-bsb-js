import { CreateBarberService } from "@/services/Barber/CreateBarberService";
import { t } from "elysia";

export const createBarberBodySchema = t.Object({
    name: t.String(),
    phone: t.Optional(t.String()),
    image: t.Optional(t.String()),
});

export class CreateBarberController {
    async handle({ body }: { body: typeof createBarberBodySchema.static }) {

        const createBarberService = new CreateBarberService();

        const barber = await createBarberService.execute(body);

        return barber
    }
}
