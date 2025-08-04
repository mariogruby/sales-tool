/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    // const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage("")
        setError("")

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Algo salió mal")
            }

            setMessage("Revisa tu correo para restablecer la contraseña")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
            <h1 className="text-2xl font-semibold mb-4">¿Olvidaste tu contraseña?</h1>
            <p className="mb-4 text-muted-foreground">
                Introduce tu correo y te enviaremos un enlace para restablecer tu contraseña.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Enviar enlace"}
                </Button>
            </form>

            {message && (
                <Alert variant="default" className="mt-4">
                    <AlertTitle>¡Hecho!</AlertTitle>
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
