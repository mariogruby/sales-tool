import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";

export default function Gallery() {
  return (
    <section className="w-full py-16 md:py-24 bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3">
            Capturas
          </Badge>
          <h2 className="text-3xl font-bold sm:text-4xl">Mira la plataforma</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Interfaz limpia y pensada para trabajar rápido.
          </p>
        </div>

        <Carousel className="w-full">
          <CarouselContent>
            {[
              { src: "/dashboard-1.png", label: "Dashboard" },
              { src: "/products-1.png", label: "Productos" },
              { src: "/tables-1.png", label: "Mesas" },
              { src: "/calc-1.png", label: "Calculadora de cambio" },
              { src: "/calc-2.png", label: "Pago dividido" },
              { src: "/stats-1.png", label: "Estadísticas" },
              { src: "/history-1.png", label: "Historial" },
            ].map((item, i) => (
              <CarouselItem key={i}>
                <div className="relative">
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={800}
                    height={450}
                    className="rounded-xl w-full border shadow-sm"
                  />
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="text-xs">
                      {item.label}
                    </Badge>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 pt-6">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
