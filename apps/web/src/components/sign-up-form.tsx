"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { authClient } from "@/lib/auth-client";
import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { IMaskInput } from "react-imask";

const signUpSchema = z.object({
  name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^[0-9+\s()-]+$/, "Formato de telefone inválido"),
});

export default function SignUpForm() {
  const router = useRouter();
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phone: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          email: value.email,
          password: value.password,
          name: value.name,
          phone: value.phone,
        } as any,
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Conta criada com sucesso");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        }
      );
    },
    validators: {
      onSubmit: signUpSchema,
    },
  });

  if (isPending) return <Loader />;

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-background border rounded-2xl shadow-xl p-8 space-y-6">

        <h1 className="text-center text-4xl font-bold text-primary">
          Criar Conta
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* NOME */}
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Nome</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* TELEFONE */}
          <form.Field name="phone">
            {(field) => (
              <div className="space-y-2">
                <Label>Telefone</Label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={field.state.value}
                  onAccept={(value) =>
                    field.handleChange(value)
                  }
                  onBlur={field.handleBlur}
                  placeholder="(00) 00000-0000"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* EMAIL */}
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          {/* SENHA */}
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error?.message} className="text-sm text-red-500">
                    {error?.message}
                  </p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full h-11 text-lg"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting
                  ? "Criando conta..."
                  : "Cadastrar"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => router.push("/login")}
          >
            Já tem uma conta? Entrar
          </Button>
        </div>

      </div>
    </div>
  );
}
