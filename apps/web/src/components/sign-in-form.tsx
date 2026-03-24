"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";

import { authClient, loginSocial } from "@/lib/auth-client";

import AuthShell from "./auth-shell";
import Loader from "./loader";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.email("Informe um email valido"),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres"),
});

export default function SignInForm() {
  const router = useRouter();
  const { isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialAuth = async () => {
    setIsLoading(true);

    try {
      await loginSocial();
    } catch {
      toast.error("Erro ao autenticar com Google");
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            router.push("/dashboard");
            toast.success("Login realizado com sucesso");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: signInSchema,
    },
  });

  if (isPending) return <Loader />;

  return (
    <AuthShell
      badge="Login"
      title="Entrar"
      description="Acesse sua conta para continuar com seus agendamentos."
      footer={
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Ainda nao tem conta?
          </p>
          <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto px-0 text-sm font-semibold text-stone-950 no-underline hover:text-primary hover:no-underline dark:text-white"
            )}
          >
            Criar conta
            <ArrowRight className="size-4" />
          </button>
        </div>
      }
      form={
        <div className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            <div className="grid gap-5">
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
                  <div className="space-y-2.5">
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
                        autoComplete="current-password"
                        placeholder="Sua senha"
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
                  {state.isSubmitting ? "Entrando..." : "Entrar"}
                  {!state.isSubmitting && <ArrowRight className="size-4" />}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-black/8 dark:bg-white/10" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
              ou continue com
            </span>
            <div className="h-px flex-1 bg-black/8 dark:bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleSocialAuth}
            disabled={isLoading}
            className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 text-sm font-semibold text-stone-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/8"
          >
            <svg className="size-5" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isLoading ? "Conectando com Google..." : "Entrar com Google"}
          </button>
        </div>
      }
    />
  );
}
