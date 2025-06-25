"use client"

import { useAccount } from "@/hooks/account/use-account"
import { ProfileData } from "./components/profile-data"

const Page = () => {
    const { accountData, loading, error } = useAccount()
    return (
        <div className="flex items-center justify-center bg-background">
            <ProfileData
                accountData={accountData}
                loading={loading}
                error={error}
            />
        </div>
    )
}

export default Page
