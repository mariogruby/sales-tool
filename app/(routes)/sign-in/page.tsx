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
import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { TriangleAlert } from "lucide-react";


const SignIn = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            // callbackUrl: "/"
        })

        if (res?.ok) {
            router.push("/dashboard")
            toast.success("Sesion iniciada")
        } else if (res?.status === 401) {
            setError("Credenciales invalidas")
            setLoading(false)
        } else {
            setError("Something went wrong")
        }
    }
    return (
        <div className="h-full flex items-center justify-center">
            <Card className="md:h-auto w-[80%] sm:w-[420] p-4 sm:p-8">
                <CardHeader>
                    <CardTitle className="text-center">
                        Iniciar Sesión
                    </CardTitle>
                    <CardDescription className="text-sm text-center text-accent-foreground">
                        Use un email o servicio para iniciar sesion
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
                            placeholder="Email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            required
                        />
                        <Input
                            type="password"
                            disabled={loading}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            required
                        />
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={loading}
                        >
                            Iniciar sesion
                        </Button>
                    </form>

                    <Separator />
                    <div className="flex my-2 justify-center mx-auto items-center">
                        <Button
                            disabled={loading}
                            onClick={() => { }}
                            variant="outline"
                            size="lg"
                            className="bg-slate-300 hover:bg-slate-400 hover:scale-100"
                        >
                            <FcGoogle className="size-8 top-2.5" />
                        </Button>
                    </div>
                    <p className="text-center text-sm mt-2 text-muted-foreground">
                        Aun no tienes un cuenta?
                        <Link className="text-sky-700 ml-2 hover:underline cursor-pointer" href="sign-up">Crear cuenta</Link>{' '}
                        aqui
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

export default SignIn;