"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { toast } from "sonner"
import {
  TriangleAlert,
  GalleryVerticalEnd,
  Loader2Icon
} from "lucide-react"
import { FcGoogle } from "react-icons/fc"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react";

type LoginFormProps = React.ComponentProps<"div">

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { status } = useSession();

  const router = useRouter()
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })

    if (res?.ok) {
      toast.success("Sesión iniciada")
      router.push("/dashboard")
    } else if (res?.status === 401) {
      setError("Credenciales inválidas")
      setLoading(false)
    } else {
      setError("Algo salió mal")
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <h1 className="text-xl font-bold">Bienvenido</h1>
          <p className="text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Crear cuenta
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              disabled={loading}
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              "Iniciar sesión"
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
            disabled={loading}
            onClick={handleGoogleSignIn}
          >
            <FcGoogle className="size-5 mr-2" />
            Google
          </Button>
        </div>
      </form>

    </div>
  )
}
