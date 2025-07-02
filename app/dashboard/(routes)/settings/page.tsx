"use client"

import { ProtectedRouteGuard } from "@/app/security/protectedRouteGuard";
import { AccountForm } from "./components/settings-account";
import { useAccount } from "@/hooks/account/use-account";
import { useEditAccount } from "@/hooks/account/use-edit-account";
import { usePathname } from "next/navigation";

const Page = () => {
    const { accountData, loading: loadingData, error, fetchData } = useAccount();
    const { updateData, loading: loadingUpdate } = useEditAccount();
    const pathname = usePathname()


    const handleUpdate = async (data: {
        name: string;
        email: string;
        phoneNumber?: string;
        direction?: string;
        securityCode?: string;
        securityCodeEnabled: boolean;
        protectedRoutes: string[];
    }) => {
        const success = await updateData(data);
        if (success) {
            fetchData();
        }
        return success;
    };

    return (
        <ProtectedRouteGuard route={pathname}>
            <div className="flex gap-6 p-4 justify-center items-center">
                <AccountForm
                    accountData={accountData}
                    loading={loadingUpdate}
                    error={error}
                    onSubmit={handleUpdate}
                    loadingData={loadingData}
                />
            </div>
        </ProtectedRouteGuard>
    );
}

export default Page
