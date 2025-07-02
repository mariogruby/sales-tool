"use client";
import React, { createContext, useContext } from "react";
import { IRestaurant } from "@/types/restaurant";
import { useAccount } from "@/hooks/account/use-account";

interface AccountContextValue {
    restaurant: IRestaurant | null;
    loading: boolean;
    error: string | null;
}

const AccountContext = createContext<AccountContextValue>({
    restaurant: null,
    loading: false,
    error: null,
});

export const AccountContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { accountData, loading, error } = useAccount();

    const hasError = error?.toLowerCase().includes("unauthorized");

    if (hasError) {
        // 🔥 Si no hay sesión, no pasa el contexto
        return <>{children}</>;
    }

    return (
        <AccountContext.Provider value={{ restaurant: accountData, loading, error }}>
            {children}
        </AccountContext.Provider>
    );
};

export const useAccountContext = () => useContext(AccountContext);
