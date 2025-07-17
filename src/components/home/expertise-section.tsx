"use client";

import { expertises } from "@/data/expertise-data";
import { Card, CardContent } from "@/components/ui/card";

export default function ExpertisesSection() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto text-center">
      <div className="mb-12">
        <span className="bg-lime-500 text-sm font-semibold px-3 py-1 rounded-full text-muted-foreground">
          Notre expertise
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mt-4">
          Construction, Rénovation & Architecture en PACA : <br />
          <span className="text-primary">Votre projet, notre expertise</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Notre expertise technique et notre coordination des corps de métier garantissent la réussite de votre projet
        </p>
      </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {expertises.map((item, idx) => (
    <Card
      key={idx}
      className="text-left transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:shadow-xl"
    >
      <CardContent className="p-6">
        <div className="text-primary mb-4">
          <item.icon className="w-8 h-8" />
        </div>
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  ))}
</div>
    </section>
  );
}
