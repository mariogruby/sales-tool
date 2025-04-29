"use client"

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardDescription,
    CardContent,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc"
import { useState } from "react"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from 'lucide-react';

const SignUp = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter();

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
            setLoading(false)
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
    return (
        <div className="h-full flex items-center justify-center">
            <Card className="md:h-auto w-[80%] sm:w-[420] p-4 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-center">
                        Registro
                    </CardTitle>
                    <CardDescription className="text-sm text-center text-accent-foreground">
                        Use un email o servicio para continuar
                    </CardDescription>
                </CardHeader>
                {!!error && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items center gap-x-2 text-sm text-destructive mb-6">
                        <TriangleAlert />
                        <p>{error}</p>
                    </div>
                )}
                <CardContent className="px-2 sm:px-6">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            type="text"
                            disabled={loading}
                            placeholder="Nombre de Restaurant"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            type="text"
                            disabled={loading}
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                        <Input
                            type="password"
                            disabled={loading}
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                        <Input
                            type="password"
                            disabled={loading}
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                            required
                        />
                        <Button
                            className="w-full cursor-pointer"
                            size="lg"
                            disabled={false}
                        >
                            Continuar
                        </Button>
                    </form>

                    <Separator />
                    <div className="flex my-2 justify-center mx-auto items-center">
                        <Button
                            disabled={false}
                            onClick={() => { }}
                            variant="outline"
                            size="lg"
                            className="bg-slate-300 hover:bg-slate-400 hover:scale-100"
                        >
                            <FcGoogle className="size-8 top-2.5" />
                        </Button>
                    </div>
                    <p className="text-center text-sm mt-2 text-muted-foreground">
                        Ya tienes un cuenta?
                        <Link className="text-sky-700 ml-2 hover:underline cursor-pointer" href="sign-in">Inicia sesion</Link>{' '}
                        aqui
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignUp;