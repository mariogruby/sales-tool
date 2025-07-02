"use client"

import { useState } from "react"
import { useAccount } from "@/hooks/account/use-account"
import { ProfileData } from "./components/profile-data"
import { DeleteAccount } from "./components/delete-account-modal"
import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard"
import { usePathname } from "next/navigation"

const Page = () => {
    const { accountData, loading, error } = useAccount()
    const [openDelete, setOpenDelete] = useState(false)

    const pathname = usePathname()

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="flex flex-col  gap-6 p-4 items-center justify-center bg-background">
                <ProfileData
                    accountData={accountData}
                    loading={loading}
                    error={error}
                />
                {!accountData ? (
                    null
                ) : (
                    <DeleteAccount
                        open={openDelete}
                        setOpen={setOpenDelete}
                    />
                )}
            </div>
        </ProtectedRouteGuard>
    )
}

export default Page
