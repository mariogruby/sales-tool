import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="relative rounded-2xl border bg-gradient-to-br from-primary/5 via-background to-primary/5 p-8 md:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,hsl(var(--primary)/0.08),transparent)]" />

          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
          </div>

          <h2 className="text-3xl font-bold sm:text-4xl mb-4">
            ¿Listo para simplificar tu negocio?
          </h2>
          <p className="text-muted-foreground md:text-lg mb-8 max-w-xl mx-auto">
            Únete y empieza a gestionar tus ventas hoy mismo. Gratis, sin
            compromisos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="h-12 px-10 text-base">
              <Link href="/sign-up">
                Crear cuenta gratis <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-10 text-base"
            >
              <Link href="/sign-in">Ya tengo cuenta</Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {[
              { icon: ShieldCheck, text: "Datos seguros" },
              { icon: RefreshCcw, text: "Siempre actualizado" },
              { icon: Smartphone, text: "Acceso desde cualquier dispositivo" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="flex items-center gap-1.5">
                <Icon className="h-4 w-4 text-primary/70" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
