"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const stats = [
  { value: "1200+", label: "agendamentos realizados com fluidez" },
  { value: "4.9/5", label: "avaliacao media dos clientes" },
  { value: "15 min", label: "para confirmar seu proximo horario" },
];

const highlights = [
  {
    icon: Scissors,
    title: "Acabamento premium",
    description:
      "Cortes, barba e finalizacao com uma experiencia visual mais sofisticada do inicio ao fim.",
  },
  {
    icon: CalendarDays,
    title: "Agenda simples",
    description:
      "Escolha servico, barbeiro, data e horario em um fluxo direto e facil de usar.",
  },
  {
    icon: ShieldCheck,
    title: "Confianca no atendimento",
    description:
      "Uma interface que passa organizacao, cuidado com o detalhe e sensacao de servico profissional.",
  },
];

const steps = [
  {
    index: "01",
    title: "Escolha o servico",
    description: "Defina o estilo que voce quer e compare opcoes com mais clareza.",
  },
  {
    index: "02",
    title: "Selecione o barbeiro",
    description: "Veja quem esta disponivel e monte um atendimento mais personalizado.",
  },
  {
    index: "03",
    title: "Confirme seu horario",
    description: "Finalize o agendamento em poucos cliques e chegue sabendo que esta tudo certo.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-[calc(100svh-73px)] overflow-x-hidden bg-[linear-gradient(180deg,rgba(247,243,233,0.95)_0%,rgba(255,255,255,1)_38%,rgba(244,239,229,0.85)_100%)] text-foreground dark:bg-[linear-gradient(180deg,rgba(12,10,7,1)_0%,rgba(18,16,13,1)_40%,rgba(10,9,8,1)_100%)]">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(176,132,67,0.28),transparent_30%),radial-gradient(circle_at_78%_18%,rgba(22,163,74,0.16),transparent_26%),radial-gradient(circle_at_bottom,rgba(15,23,42,0.12),transparent_35%)]"
      />

      <div
        aria-hidden="true"
        className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/30 blur-3xl dark:bg-amber-500/10"
      />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 py-12 md:px-10 md:py-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-700/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-amber-900 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-amber-200">
              <Sparkles className="size-3.5" />
              Experiencia premium para sua barbearia
            </div>

            <div className="space-y-5">
              <h1 className="max-w-xl text-5xl font-semibold leading-none tracking-[-0.05em] text-balance sm:text-6xl lg:text-7xl">
                A Home da sua barbearia com presenca, estilo e conversao.
              </h1>

              <p className="max-w-xl text-base leading-7 text-stone-700 sm:text-lg dark:text-stone-300">
                Uma vitrine digital com cara de marca forte: imagem impactante,
                informacoes objetivas e um caminho claro para o cliente sair da
                primeira impressao direto para o agendamento.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full border border-amber-950/80 bg-stone-950 px-6 text-sm font-semibold text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)] hover:bg-stone-800 dark:border-amber-200/20 dark:bg-amber-100 dark:text-stone-950 dark:hover:bg-white"
                )}
              >
                Agendar agora
                <ArrowRight className="size-4" />
              </Link>

              <Link
                href="/login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-full border-white/60 bg-white/70 px-6 text-sm font-semibold text-stone-900 shadow-sm backdrop-blur hover:bg-white dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                )}
              >
                Entrar na plataforma
              </Link>
            </div>

            <div className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.35)] backdrop-blur xl:grid-cols-3 dark:border-white/10 dark:bg-white/5">
              {stats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-stone-950 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm leading-6 text-stone-600 dark:text-stone-300">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-10 hidden rounded-3xl border border-white/50 bg-white/80 p-4 shadow-xl backdrop-blur md:block dark:border-white/10 dark:bg-stone-950/70">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-300/15 dark:text-amber-200">
                  <Star className="size-4 fill-current" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Atendimento memoravel</p>
                  <p className="text-xs text-muted-foreground">
                    Visual mais forte e mais credibilidade na primeira dobra
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 bottom-8 hidden rounded-3xl border border-emerald-900/10 bg-stone-950 p-4 text-white shadow-2xl md:block dark:border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <Clock3 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Fluxo rapido</p>
                  <p className="text-xs text-white/70">
                    Menos friccao para o cliente confirmar o horario
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-stone-950 p-3 shadow-[0_35px_100px_-35px_rgba(15,23,42,0.65)] dark:border-white/10">
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05)_0%,rgba(0,0,0,0.45)_100%)]" />

              <Image
                src="/barbershop.jpg"
                alt="Interior elegante de uma barbearia"
                width={1200}
                height={900}
                priority
                className="h-[560px] w-full rounded-[1.4rem] object-cover"
              />

              <div className="absolute inset-x-8 bottom-8 rounded-[1.75rem] border border-white/15 bg-black/45 p-6 text-white backdrop-blur-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">
                      Barber BSB
                    </p>
                    <p className="max-w-sm text-2xl font-semibold leading-tight">
                      Um visual de marca que valoriza o corte antes mesmo da visita.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-amber-200" />
                      Interface pensada para inspirar confianca
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group rounded-[1.75rem] border border-stone-200/80 bg-white/75 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-stone-950 text-amber-200 shadow-lg dark:bg-amber-100 dark:text-stone-950">
                <item.icon className="size-5" />
              </div>

              <h2 className="mb-3 text-2xl font-semibold tracking-[-0.04em]">
                {item.title}
              </h2>

              <p className="text-sm leading-7 text-stone-600 dark:text-stone-300">
                {item.description}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-[2.25rem] border border-stone-200/70 bg-stone-950 px-6 py-8 text-white shadow-[0_35px_120px_-45px_rgba(15,23,42,0.75)] md:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center dark:border-white/10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/70">
              Jornada pensada para conversao
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
              Beleza visual com uma navegacao que realmente ajuda a vender.
            </h2>
            <p className="max-w-lg text-sm leading-7 text-white/70 sm:text-base">
              A nova Home destaca valor, cria percepcao de qualidade e conduz o
              visitante com naturalidade. O resultado e uma pagina muito mais
              viva, moderna e coerente com um servico premium.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.index}
                className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-amber-200/80">
                  {step.index}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-white/70">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[2.25rem] border border-amber-200/60 bg-[linear-gradient(135deg,rgba(255,251,235,0.98),rgba(245,158,11,0.16))] p-8 shadow-[0_20px_80px_-45px_rgba(180,83,9,0.5)] dark:border-amber-200/15 dark:bg-[linear-gradient(135deg,rgba(41,37,36,0.9),rgba(120,53,15,0.35))]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-900/70 dark:text-amber-200/70">
                Pronto para causar impacto
              </p>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] text-stone-950 dark:text-white sm:text-4xl">
                Uma Home muito mais bonita, com personalidade e clima de marca.
              </h2>
              <p className="text-sm leading-7 text-stone-700 dark:text-stone-300 sm:text-base">
                Seu cliente chega, entende o valor do atendimento em segundos e
                encontra um caminho claro para reservar o horario.
              </p>
            </div>

            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 rounded-full border border-stone-950 bg-stone-950 px-6 text-sm font-semibold text-white hover:bg-stone-800 dark:border-white dark:bg-white dark:text-stone-950 dark:hover:bg-amber-50"
              )}
            >
              Ver agendamento
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
