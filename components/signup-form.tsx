/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { FcGoogle } from "react-icons/fc"
import { cn } from "@/lib/utils"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Loader2Icon,
    TriangleAlert,
    Zap
} from 'lucide-react';
import { signIn, useSession } from "next-auth/react";

type SignupFormProps = React.ComponentProps<"div">

export function SignupForm({ className, ...props }: SignupFormProps) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const { status } = useSession();

    const router = useRouter()
    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        const res = await fetch("/api/auth/signup", {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form)
        })

        const data = await res.json()

        if (res.ok) {
            toast.success(data.message)
            router.push("/sign-in")
        } else if (res.status === 400) {
            setError(data.message)
            setLoading(false)
        } else if (res.status === 500) {
            setError(data.message)
            setLoading(false)
        }
    }

    //   const handleGoogleSignIn = () => {
    //     signIn("google", { callbackUrl: "/dashboard" })
    //   }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col items-center gap-2">
                    <Link href="/" className="flex items-center justify-center rounded-md">
                        <Zap className="size-6" />
                    </Link>
                    <h1 className="text-xl font-bold">Bienvenido</h1>
                    <p className="text-center text-sm">
                        ¿Ya tienes una cuenta?{" "}
                        <Link href="/sign-in" className="underline underline-offset-4">
                            Iniciar sesión
                        </Link>
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Nombre del negocio</Label>
                        <Input
                            id="name"
                            type="text"
                            disabled={loading}
                            placeholder="Example"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            disabled={loading}
                            placeholder="m@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            disabled={loading}
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Confirmar contraseña</Label>
                        <Input
                            id="password"
                            type="password"
                            disabled={loading}
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                        />
                    </div>
                    {error && (
                        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                            <TriangleAlert className="size-4" />
                            <p>{error}</p>
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2Icon className="animate-spin" />
                            </>
                        ) : (
                            "Crear cuenta"
                        )}
                    </Button>
                </div>

                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="bg-background relative z-10 px-2 text-muted-foreground">
                        O continua con
                    </span>
                </div>

                <div className="grid gap-4">
                    <Button
                        variant="outline"
                        type="button"
                        className="w-full cursor-pointer"
                        disabled={true}
                    // onClick={handleGoogleSignIn}
                    >
                        <FcGoogle className="size-5 mr-2" />
                        Google
                    </Button>
                </div>
            </form>

            <p className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs *:[a]:underline *:[a]:underline-offset-4">
                Al continuar, aceptas nuestros{" "}
                <a href="#">Términos de servicio</a> y{" "}
                <a href="#">Política de privacidad</a>.
            </p>
        </div>
    )
}