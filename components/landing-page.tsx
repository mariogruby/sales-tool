"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Check,
    Zap,
    Smartphone,
    Clock, Cloud,
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

            {/* Desktop buttons */}
            <nav className="hidden sm:flex ml-auto px-2 gap-4">
                {status === "authenticated" ? (
                    <Button asChild size="lg" className="h-8 px-8 cursor-pointer">
                        <Link href="/dashboard">Dashboard</Link>
                    </Button>
                ) : (
                    <>
                        <Button asChild className="cursor-pointer">
                            <Link href="/sign-up">Registrarse</Link>
                        </Button>
                        <Button asChild className="cursor-pointer">
                            <Link href="/sign-in">Iniciar sesión</Link>
                        </Button>
                    </>
                )}
            </nav>

            {/* Mobile Dropdown */}
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
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <Badge variant="secondary" className="mb-4">
                                    🎉 Ya disponible
                                </Badge>
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Administra tu negocio con <span className="text-primary">EasyPos</span>
                                </h1>
                                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                    Gestiona tu negocio con facilidad.
                                    Simplifica tu día a día con nuestra solución intuitiva para la hostelería pequeña y mediana.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button size="lg" className="h-11 px-8 cursor-pointer">
                                    <Link href="/sign-up">Empieza ahora</Link>
                                    {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
                                </Button>
                                {/* <Button variant="outline" size="lg" className="h-11 px-8 bg-transparent">
                                    View Demo
                                </Button> */}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Gratis</span>
                                <Check className="h-4 w-4 text-green-500" />
                                <span>Rapido</span>
                                {/* <Check className="h-4 w-4 text-green-500" />
                                <span>TypeScript ready</span> */}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <Badge variant="outline">Características</Badge>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Todo lo que necesitas para administrar tu negocio.
                                </h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Si estás empezando, esta herramienta es la indicada para gestionar las principales áreas de tu negocio de hostelería,
                                    como las ventas rápidas, las ventas en mesas (tanto en terrazas como en salón), gestión de empleados y horas de trabajo (proximamente),
                                    la contabilidad diaria, mensual, trimestral y anual, el promedio de ventas diarias y las estadísticas.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                            <Card>
                                <CardHeader>
                                    <Clock className="h-10 w-10 text-primary" />
                                    <CardTitle>Gestión en tiempo real</CardTitle>
                                    <CardDescription>
                                        Controla tus ventas, mesas y productos en tiempo real desde cualquier dispositivo.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Smartphone className="h-10 w-10 text-primary" />
                                    <CardTitle>Diseño adaptativo</CardTitle>
                                    <CardDescription>Principalmente para dispositivos tactiles pero tambien para cualquier dispositivo.</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <RefreshCcw className="h-10 w-10 text-primary" />
                                    <CardTitle>Actualizaciones constantes</CardTitle>
                                    <CardDescription>Mejoramos y añadimos nuevas funcionalidades frecuentemente</CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Cloud className="h-10 w-10 text-primary" />
                                    <CardTitle>Sincronización automática</CardTitle>
                                    <CardDescription>
                                        Todo lo que hagas se sincroniza automáticamente en la nube, sin preocuparte por perder datos.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <BarChart className="h-10 w-10 text-primary" />
                                    <CardTitle>Reportes y estadísticas</CardTitle>
                                    <CardDescription>
                                        Obtén reportes detallados de tus ventas, productos más vendidos y rendimiento del negocio.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <DownloadCloud className="h-10 w-10 text-primary" />
                                    <CardTitle>Sin instalación</CardTitle>
                                    <CardDescription>
                                        Accede desde tu navegador, sin necesidad de instalaciones complicadas.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Social Proof */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <Badge variant="outline">Galería</Badge>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                    Mira cómo luce la plataforma
                                </h2>
                            </div>
                        </div>

                        <div className="mx-auto max-w-4xl py-12">
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {[
                                        { src: "/dashboard-1.png", alt: "Vista del panel de ventas" },
                                        { src: "/products-1.png", alt: "Vista de productos" },
                                        { src: "/tables-1.png", alt: "Vista de mesas" },
                                        { src: "/calc-1.png", alt: "Calculadora de pagos" },
                                        { src: "/calc-2.png", alt: "División de pagos" },
                                        { src: "/stats-1.png", alt: "Estadísticas y reportes" },
                                        { src: "/history-1.png", alt: "Historial de ventas" },
                                    ].map((item, index) => (
                                        <CarouselItem key={index}>
                                            <Image
                                                src={item.src}
                                                alt={item.alt}
                                                width={800}
                                                height={400}
                                                className="rounded-xl object-cover w-full"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>

                                {/* Contenedor para los botones */}
                                <div className="flex w-full items-center justify-center gap-4 pt-4">
                                    <CarouselPrevious className="static" />
                                    <CarouselNext className="static" />
                                </div>

                                {/* Botones normales para pantallas medianas hacia arriba */}
                                
                            </Carousel>
                        </div>
                    </div>
                </section>



                {/* Testimonials */}
                {/* <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <Badge variant="outline">Testimonials</Badge>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What developers are saying</h2>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                            <Card>
                                <CardHeader>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <CardDescription>
                                        "The component library is fantastic! It saved us weeks of development time and the components are
                                        beautifully designed."
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src="/placeholder.svg?height=40&width=40"
                                            width="40"
                                            height="40"
                                            alt="Avatar"
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">Sarah Johnson</p>
                                            <p className="text-xs text-muted-foreground">Frontend Developer</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <CardDescription>
                                        "Excellent documentation and examples. The accessibility features are top-notch and the
                                        customization options are endless."
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src="/placeholder.svg?height=40&width=40"
                                            width="40"
                                            height="40"
                                            alt="Avatar"
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">Mike Chen</p>
                                            <p className="text-xs text-muted-foreground">UI/UX Designer</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <CardDescription>
                                        "This is exactly what we needed for our project. Clean, modern, and incredibly easy to integrate.
                                        Highly recommended!"
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center space-x-2">
                                        <Image
                                            src="/placeholder.svg?height=40&width=40"
                                            width="40"
                                            height="40"
                                            alt="Avatar"
                                            className="rounded-full"
                                        />
                                        <div>
                                            <p className="text-sm font-medium">Emily Rodriguez</p>
                                            <p className="text-xs text-muted-foreground">Product Manager</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section> */}

                {/* CTA Section */}
                {/* <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Listo para empezar?</h2>
                                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <form className="flex gap-2">
                                    <Input type="email" placeholder="Enter your email" className="flex-1" />
                                    <Button type="submit">Get Started</Button>
                                </form>
                                <p className="text-xs text-muted-foreground">
                                    Start building for free. No credit card required.{" "}
                                    <Link href="#" className="underline underline-offset-2 hover:text-primary">
                                        Terms & Conditions
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section> */}
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-muted-foreground">© 2025 EasyPos Web App. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4 hover:text-primary" href="/terms">
                        Terminos del servicio
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4 hover:text-primary" href="/privacy">
                        Política de privacidad
                    </Link>
                    {/* <Link className="text-xs hover:underline underline-offset-4 hover:text-primary" href="#">
                        Documentation
                    </Link> */}
                    <Link className="text-xs hover:underline underline-offset-4 hover:text-primary" href="#">
                        Soporte
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
