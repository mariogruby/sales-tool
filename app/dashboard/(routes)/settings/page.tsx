"use client"

import { AccountForm } from "./components/settings-account";
import { useAccount } from "@/hooks/account/use-account";
import { useEditAccount } from "@/hooks/account/use-edit-account";

const Page = () => {
    const { accountData, loading: loadingData, error, fetchData } = useAccount();
    const { updateData, loading: loadingUpdate } = useEditAccount();

    const handleUpdate = async (data: {
        name: string;
        email: string;
        phoneNumber?: string;
        direction?: string;
    }) => {
        const success = await updateData(data);
        if (success) {
            fetchData();
        }
        return success;
    };

    return (
        <div className="flex justify-center items-center">
            <AccountForm
                accountData={accountData}
                loading={loadingUpdate}
                error={error}
                onSubmit={handleUpdate}
                loadingData={loadingData}
            />
        </div>
    );
}

export default Page
