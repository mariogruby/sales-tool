"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Check,
    Zap,
    Smartphone,
    Clock,
    Cloud,
    BarChart3,
    ShieldCheck,
    RefreshCcw,
    Menu,
    ArrowRight,
    TableProperties,
    Receipt,
    TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { ModeToggle } from "./mode-toggle"
import { useSession } from "next-auth/react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

const FEATURES = [
    {
        icon: Receipt,
        title: "Punto de venta",
        desc: "Registra ventas en segundos. Elige entre efectivo, tarjeta o pago dividido con calculadora de cambio integrada.",
    },
    {
        icon: TableProperties,
        title: "Gestión de mesas",
        desc: "Asigna productos a mesas, actualiza pedidos en tiempo real y cobra directamente desde la vista de mesa.",
    },
    {
        icon: BarChart3,
        title: "Estadísticas",
        desc: "Visualiza ventas del día, mes y año con gráficos claros. Compara periodos y detecta tendencias de tu negocio.",
    },
    {
        icon: Clock,
        title: "Cierre diario",
        desc: "Cierra tu jornada con un clic. EasyPos calcula el resumen automáticamente y guarda el historial.",
    },
    {
        icon: Smartphone,
        title: "Diseño responsive",
        desc: "Funciona igual en móvil, tablet y ordenador. Sin aplicaciones que instalar, solo abre el navegador.",
    },
    {
        icon: Cloud,
        title: "Datos en la nube",
        desc: "Tu información siempre segura y accesible. Nunca pierdas datos aunque cambies de dispositivo.",
    },
]

const STEPS = [
    {
        step: "01",
        title: "Crea tu cuenta",
        desc: "Regístrate en menos de un minuto. Sin tarjeta de crédito, sin configuraciones complicadas.",
    },
    {
        step: "02",
        title: "Configura tu negocio",
        desc: "Añade tus productos, categorías y mesas. La interfaz es tan intuitiva que no necesitas formación.",
    },
    {
        step: "03",
        title: "Empieza a vender",
        desc: "Registra tu primera venta el mismo día. Consulta tus estadísticas en tiempo real desde cualquier lugar.",
    },
]

export default function LandingPage() {
    const { status } = useSession()

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
                <div className="mx-auto max-w-6xl px-4 lg:px-6 h-14 flex items-center">
                    <Link className="flex items-center gap-2" href="#">
                        <Zap className="h-5 w-5 text-primary" />
                        <span className="text-lg font-bold tracking-tight">EasyPos</span>
                    </Link>

                    <div className="ml-4">
                        <ModeToggle />
                    </div>

                    <nav className="hidden sm:flex ml-auto gap-3">
                        {status === "authenticated" ? (
                            <Button asChild size="sm">
                                <Link href="/dashboard">
                                    Ir al dashboard <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Button asChild variant="ghost" size="sm">
                                    <Link href="/sign-in">Iniciar sesión</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href="/sign-up">Registrarse gratis</Link>
                                </Button>
                            </>
                        )}
                    </nav>

                    <div className="sm:hidden ml-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {status === "authenticated" ? (
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">Dashboard</Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <>
                                        <DropdownMenuItem asChild>
                                            <Link href="/sign-in">Iniciar sesión</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/sign-up">Registrarse gratis</Link>
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero */}
                <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />

                    <div className="mx-auto max-w-4xl px-4 md:px-6 text-center">
                        <Badge variant="secondary" className="mb-6 gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                            </span>
                            Ya disponible
                        </Badge>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            La APP para{" "}
                            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                hostelería
                            </span>{" "}
                            que no complica
                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                            Gestiona ventas, mesas y estadísticas de tu restaurante o bar desde un único lugar.
                            Sin instalaciones, sin curva de aprendizaje.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                            <Button asChild size="lg" className="h-12 px-8 text-base">
                                <Link href="/sign-up">
                                    Empieza gratis <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                                <Link href="/sign-in">Ver demo</Link>
                            </Button>
                        </div>

                        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                            {[
                                "Sin tarjeta de crédito",
                                "Configuración en minutos",
                                "Soporte incluido",
                            ].map((item) => (
                                <span key={item} className="flex items-center gap-1.5">
                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="w-full py-16 md:py-24 bg-muted/30">
                    <div className="mx-auto max-w-6xl px-4 md:px-6">
                        <div className="text-center mb-12">
                            <Badge variant="outline" className="mb-3">Cómo funciona</Badge>
                            <h2 className="text-3xl font-bold sm:text-4xl">
                                En marcha en minutos
                            </h2>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {STEPS.map((s) => (
                                <div key={s.step} className="relative flex flex-col items-center text-center md:items-start md:text-left">
                                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-lg">
                                        {s.step}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="w-full py-16 md:py-24 lg:py-32">
                    <div className="mx-auto max-w-6xl px-4 md:px-6">
                        <div className="text-center mb-12">
                            <Badge variant="outline" className="mb-3">Características</Badge>
                            <h2 className="text-3xl font-bold sm:text-4xl">
                                Todo lo que necesita tu negocio
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
                                Diseñado para hostelería. Cada función resuelve un problema real del día a día.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {FEATURES.map((f) => (
                                <Card
                                    key={f.title}
                                    className="group transition-all hover:shadow-md hover:border-primary/30"
                                >
                                    <CardHeader>
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                                            <f.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <CardTitle className="text-base">{f.title}</CardTitle>
                                        <CardDescription className="leading-relaxed">{f.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <section className="w-full py-16 md:py-24 bg-muted/30">
                    <div className="mx-auto max-w-5xl px-4 md:px-6">
                        <div className="text-center mb-12">
                            <Badge variant="outline" className="mb-3">Capturas</Badge>
                            <h2 className="text-3xl font-bold sm:text-4xl">
                                Mira la plataforma
                            </h2>
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

                {/* CTA */}
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
                                Únete y empieza a gestionar tus ventas hoy mismo. Gratis, sin compromisos.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button asChild size="lg" className="h-12 px-10 text-base">
                                    <Link href="/sign-up">
                                        Crear cuenta gratis <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button asChild size="lg" variant="outline" className="h-12 px-10 text-base">
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
            </main>

            {/* Footer */}
            <footer className="border-t bg-muted/20">
                <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">EasyPos</span>
                        <span className="text-xs text-muted-foreground">© 2026</span>
                    </div>

                    <nav className="sm:ml-auto flex gap-5 text-xs text-muted-foreground">
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Términos
                        </Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacidad
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Soporte
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}
