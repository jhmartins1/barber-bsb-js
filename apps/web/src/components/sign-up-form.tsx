"use client";

import { useForm } from "@tanstack/react-form";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { IMaskInput } from "react-imask";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import AuthShell from "./auth-shell";
import Loader from "./loader";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const signUpSchema = z.object({
  name: z.string().min(4, "Nome deve ter pelo menos 4 caracteres"),
  email: z.email("Informe um email valido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  phone: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 digitos")
    .regex(/^[0-9+\s()-]+$/, "Formato de telefone invalido"),
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
    <AuthShell
      badge="Cadastro"
      title="Criar conta"
      description="Preencha os dados abaixo para entrar na plataforma."
      footer={
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Ja possui conta?
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto px-0 text-sm font-semibold text-stone-950 no-underline hover:text-primary hover:no-underline dark:text-white"
            )}
          >
            Ir para login
            <ArrowRight className="size-4" />
          </button>
        </div>
      }
      form={
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <form.Field name="name">
              {(field) => (
                <div className="space-y-2.5 sm:col-span-2">
                  <Label
                    htmlFor={field.name}
                    className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400"
                  >
                    Nome completo
                  </Label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      id={field.name}
                      autoComplete="name"
                      placeholder="Seu nome"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-14 rounded-2xl border-stone-200/90 bg-white pl-11 pr-4 text-sm shadow-sm placeholder:text-stone-400 focus-visible:ring-2 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-sm text-red-500">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="phone">
              {(field) => (
                <div className="space-y-2.5">
                  <Label
                    htmlFor={field.name}
                    className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400"
                  >
                    Telefone
                  </Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <IMaskInput
                      id={field.name}
                      mask="(00) 00000-0000"
                      value={field.state.value}
                      onAccept={(value) => field.handleChange(String(value))}
                      onBlur={field.handleBlur}
                      placeholder="(00) 00000-0000"
                      className="flex h-14 w-full rounded-2xl border border-stone-200/90 bg-white pl-11 pr-4 text-sm shadow-sm outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-ring dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-sm text-red-500">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="email">
              {(field) => (
                <div className="space-y-2.5">
                  <Label
                    htmlFor={field.name}
                    className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      id={field.name}
                      type="email"
                      autoComplete="email"
                      placeholder="voce@barberbsb.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-14 rounded-2xl border-stone-200/90 bg-white pl-11 pr-4 text-sm shadow-sm placeholder:text-stone-400 focus-visible:ring-2 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-sm text-red-500">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div className="space-y-2.5 sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label
                      htmlFor={field.name}
                      className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400"
                    >
                      Senha
                    </Label>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
                    <Input
                      id={field.name}
                      type="password"
                      autoComplete="new-password"
                      placeholder="Crie sua senha"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-14 rounded-2xl border-stone-200/90 bg-white pl-11 pr-4 text-sm shadow-sm placeholder:text-stone-400 focus-visible:ring-2 dark:border-white/10 dark:bg-white/5"
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-sm text-red-500">
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="h-14 w-full rounded-2xl border border-stone-950 bg-stone-950 text-sm font-semibold text-white shadow-[0_18px_50px_-20px_rgba(0,0,0,0.45)] hover:bg-stone-800 dark:border-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-100"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Criando conta..." : "Cadastrar"}
                {!state.isSubmitting && <ArrowRight className="size-4" />}
              </Button>
            )}
          </form.Subscribe>
        </form>
      }
    />
  );
}
