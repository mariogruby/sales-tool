// app/reset-password/page.tsx
import { Suspense } from "react"
import ResetPasswordForm from "@/components/reset-password"

export default function ResetPassword({ searchParams }: { searchParams: { token?: string } }) {
    return (
        <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Suspense fallback={<div>Cargando...</div>}>
                    <ResetPasswordForm token={searchParams.token} />
                </Suspense>
            </div>
        </div>
    )
}
