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
    BarChart,
    DownloadCloud,
    RefreshCcw,
    Menu
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
import { useSession } from "next-auth/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

export default function LandingPage() {
    const { status } = useSession();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="px-4 lg:px-6 h-14 flex items-center border-b">
                <Link className="flex items-center justify-center" href="#">
                    <Zap className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-bold">EasyPos</span>
                </Link>

                <div className="px-2">
                    <ModeToggle />
                </div>

                <nav className="hidden sm:flex ml-auto px-2 gap-4">
                    {status === "authenticated" ? (
                        <Button asChild size="lg" className="h-8 px-8">
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button asChild>
                                <Link href="/sign-up">Registrarse</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/sign-in">Iniciar sesión</Link>
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
                                        <Link href="/sign-up">Registrarse</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/sign-in">Iniciar sesión</Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
                    <div className="mx-auto max-w-6xl px-4 md:px-6 text-center">
                        <Badge variant="secondary" className="mb-4">
                            🎉 Ya disponible
                        </Badge>

                        <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
                            Administra tu negocio con <span className="text-primary">EasyPos</span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-xl">
                            Gestiona tu negocio con facilidad. Simplifica tu día a día con nuestra solución intuitiva.
                        </p>

                        <div className="mt-6 flex justify-center gap-4">
                            <Button size="lg" className="h-11 px-8">
                                <Link href="/sign-up">Empieza ahora</Link>
                            </Button>
                        </div>

                        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Check className="h-4 w-4 text-green-500" /> Gratis
                            </span>
                            <span className="flex items-center gap-1">
                                <Check className="h-4 w-4 text-green-500" /> Rápido
                            </span>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="mx-auto max-w-6xl px-4 md:px-6">
                        <div className="text-center">
                            <Badge variant="outline">Características</Badge>
                            <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
                                Todo lo que necesitas
                            </h2>
                            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-xl">
                                Gestiona ventas, mesas, estadísticas y más en un solo lugar.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {[
                                { icon: Clock, title: "Tiempo real", desc: "Control total en vivo." },
                                { icon: Smartphone, title: "Responsive", desc: "Funciona en cualquier dispositivo." },
                                { icon: RefreshCcw, title: "Actualizaciones", desc: "Siempre mejorando." },
                                { icon: Cloud, title: "Nube", desc: "Datos seguros siempre." },
                                { icon: BarChart, title: "Estadísticas", desc: "Analiza tu negocio." },
                                { icon: DownloadCloud, title: "Sin instalación", desc: "Todo desde el navegador." },
                            ].map((item, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <item.icon className="h-10 w-10 text-primary" />
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardDescription>{item.desc}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Gallery */}
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="mx-auto max-w-5xl px-4 md:px-6 text-center">
                        <Badge variant="outline">Galería</Badge>
                        <h2 className="mt-2 text-3xl font-bold sm:text-5xl">
                            Mira la plataforma
                        </h2>

                        <div className="mt-12">
                            <Carousel>
                                <CarouselContent>
                                    {[
                                        "/dashboard-1.png",
                                        "/products-1.png",
                                        "/tables-1.png",
                                        "/calc-1.png",
                                        "/calc-2.png",
                                        "/stats-1.png",
                                        "/history-1.png",
                                    ].map((src, i) => (
                                        <CarouselItem key={i}>
                                            <Image
                                                src={src}
                                                alt=""
                                                width={800}
                                                height={400}
                                                className="rounded-xl w-full"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                <div className="flex justify-center gap-4 pt-4">
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </div>
                            </Carousel>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-6">
                <div className="mx-auto max-w-6xl px-4 md:px-6 flex flex-col sm:flex-row items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2026 EasyPos
                    </p>

                    <nav className="sm:ml-auto flex gap-4 text-xs">
                        <Link href="/terms">Términos</Link>
                        <Link href="/privacy">Privacidad</Link>
                        <Link href="#">Soporte</Link>
                    </nav>
                </div>
            </footer>
        </div>
    )
}