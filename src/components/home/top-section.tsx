"use client";

import { ArrowDown } from "lucide-react";
import Image from "next/image";

export default function TopSection() {
  return (
    <section className="relative h-12/12 w-full flex items-center justify-start overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/home-bg-top.jpg"
          alt="Architecture background"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
      </div>

      <div className="max-w-4xl pl-10 md:pl-20 text-white z-10">
        <p className="text-sm md:text-base text-gray-300 mb-2">
          Architecte & Maître d'œuvre PACA
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
          Maître d'œuvre & Architecte à Marseille, <br />
          Cannes, Saint-Tropez, Fréjus <br />
          Spécialiste Construction et Rénovation
        </h1>
        <p className="text-md md:text-lg text-gray-200 max-w-xl">
          Cabinet d'architecture et constructeur-maître d'œuvre spécialisé en conception et
          réalisation de maisons individuelles. Expertise technique et coordination complète
          pour vos projets à Marseille.
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center">
        <span className="animate-pulse text-sm md:text-base">découvrir</span>
        <ArrowDown className="mt-1 animate-bounce" />
      </div>
    </section>
  );
}
