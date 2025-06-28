"use client"

import { useState } from "react"
import { useAccount } from "@/hooks/account/use-account"
import { ProfileData } from "./components/profile-data"
import { DeleteAccount } from "./components/delete-account-modal"

const Page = () => {
    const { accountData, loading, error } = useAccount()
    const [openDelete, setOpenDelete] = useState(false)

    return (
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
    )
}

export default Page
