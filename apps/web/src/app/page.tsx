"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="text-center mt-6 space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome to Barber BSB
      </h1>

      <div className="flex justify-center">
        <Image
          src="/barbershop.jpg"
          alt="Barbearia"
          width={900}
          height={500}
          className="rounded-xl object-cover"
        />
      </div>
    </div>
  );
}
