"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-6 py-12 text-center space-y-8">
      {/* HERO */}
      <div className="space-y-3 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Barber BSB
        </h1>

        <p className="text-muted-foreground text-lg">
          Agende seu corte de forma rápida e moderna.
          Profissionais qualificados e experiência premium.
        </p>
      </div>

      {/* IMAGE */}
      <div className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-xl">
        <Image
          src="/barbershop.jpg"
          alt="Barbearia"
          width={1200}
          height={600}
          className="object-cover w-full h-[420px]"
          priority
        />
      </div>
    </main>
  );
}
